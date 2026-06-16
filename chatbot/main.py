"""
Amen Bank AI Chatbot Backend
FastAPI server with RAG pipeline, multilingual support (FR/AR/EN)
"""

import os
import json
from enum import Enum
from typing import List, Dict, Any, Optional
from datetime import datetime
from pathlib import Path

from fastapi import FastAPI, HTTPException, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
import uvicorn
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Local imports
from services.chromadb_manager import ChromaDBManager, ChromaDBSetup
from ingest_faqs import FAQIngestionManager
from rag_chain import AmenBankRAGChain, Language as RAGLanguage, create_rag_chain


# ============================================================
# ENUMS & CONSTANTS
# ============================================================

class Language(str, Enum):
    """Supported languages"""
    FR = "fr"
    AR = "ar"
    EN = "en"


# ============================================================
# PYDANTIC MODELS (Request/Response schemas)
# ============================================================

class ChatRequest(BaseModel):
    """Chat endpoint request"""
    message: str = Field(..., min_length=1, max_length=1000)
    language: Language = Language.FR
    user_id: Optional[str] = None
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    """Chat endpoint response"""
    status: str
    message: str
    language: str
    sources: List[Dict[str, Any]] = []
    confidence: float = Field(0.0, ge=0.0, le=1.0)
    timestamp: str


class ContactRequest(BaseModel):
    """Contact form submission"""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=8, max_length=20)
    subject: str = Field(..., min_length=5, max_length=200)
    message: str = Field(..., min_length=10, max_length=5000)
    language: Language = Language.FR


class ContactResponse(BaseModel):
    """Contact form response"""
    status: str
    message: str
    ticket_id: str
    timestamp: str


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    version: str
    database: str
    language_support: List[str]
    timestamp: str


class IngestResponse(BaseModel):
    """FAQ ingestion response"""
    status: str
    message: str
    chunks_processed: int
    languages: List[str]
    timestamp: str


# ============================================================
# FASTAPI APP SETUP
# ============================================================

app = FastAPI(
    title="Amen Bank AI Chatbot API",
    description="RAG-powered multilingual banking chatbot",
    version="1.0.0",
)

# Rate limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, lambda req, exc: HTTPException(
    status_code=429,
    detail="Too many requests. Please try again later."
))

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "https://amen-bank.tn"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global state
chromadb_manager: Optional[ChromaDBManager] = None
rag_chain: Optional[AmenBankRAGChain] = None


# ============================================================
# STARTUP & SHUTDOWN
# ============================================================

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    global chromadb_manager, rag_chain
    
    chatbot_dir = Path(__file__).parent
    persist_dir = chatbot_dir / "chroma_data"
    ingestion_state_path = chatbot_dir / "faq_ingestion_state.json"
    
    try:
        print("🚀 Initializing Amen Bank AI Chatbot...")
        
        # Initialize ChromaDB
        if ingestion_state_path.exists():
            print("  ✓ Loading existing ChromaDB collection...")
            chromadb_manager = ChromaDBSetup.setup_from_ingestion_state(
                str(ingestion_state_path),
                persist_dir=str(persist_dir),
            )
        else:
            print("  ⚠ No ingestion state found. Run FAQ ingestion first.")
            chromadb_manager = None
        
        # Initialize RAG chain
        print("  ✓ Initializing RAG chain with Groq...")
        rag_chain = create_rag_chain(language=RAGLanguage.FR)
            
        print("✅ Chatbot initialization complete")
    except Exception as e:
        print(f"❌ Startup error: {e}")
        chromadb_manager = None
        rag_chain = None


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    global chromadb_manager
    if chromadb_manager:
        chromadb_manager.persist()
        print("✓ ChromaDB persisted to disk")


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def get_retrieval_context(query: str, language: Language, top_k: int = 3) -> List[Dict[str, Any]]:
    """
    Retrieve relevant FAQ chunks from ChromaDB
    
    Args:
        query: User question
        language: Language code
        top_k: Number of top results
        
    Returns:
        List of relevant chunks with metadata
    """
    if chromadb_manager is None:
        return []
    
    try:
        # Embed query using same mock method
        query_embedding = chromadb_manager._generate_mock_embedding(query)
        
        # Query collection with language filter
        results = chromadb_manager.collection.query(
            query_embeddings=[query_embedding],
            where={"language": language.value},
            n_results=top_k,
            include=["documents", "metadatas", "distances"]
        )
        
        # Format results
        context = []
        if results and results["documents"] and len(results["documents"]) > 0:
            for i, doc in enumerate(results["documents"][0]):
                context.append({
                    "text": doc,
                    "distance": float(results["distances"][0][i]) if results["distances"] else 0.0,
                    "metadata": results["metadatas"][0][i] if results["metadatas"] else {}
                })
        
        return context
    except Exception as e:
        print(f"Retrieval error: {e}")
        return []



# ============================================================
# API ENDPOINTS
# ============================================================

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        database="chromadb" if chromadb_manager else "unavailable",
        language_support=["fr", "ar", "en"],
        timestamp=datetime.now().isoformat(),
    )


@app.post("/ingest", response_model=IngestResponse)
async def ingest_faqs(background_tasks: BackgroundTasks):
    """
    Ingest FAQ knowledge base into ChromaDB
    
    This endpoint:
    1. Runs FAQ ingestion script
    2. Initializes ChromaDB collection
    3. Populates with multilingual chunks
    """
    global chromadb_manager
    
    chatbot_dir = Path(__file__).parent
    ingestion_state_path = chatbot_dir / "faq_ingestion_state.json"
    persist_dir = chatbot_dir / "chroma_data"
    
    try:
        # If ingestion state doesn't exist, create it first
        if not ingestion_state_path.exists():
            manager = FAQIngestionManager()
            kb = manager.load_knowledge_base()
            records = manager.transform_to_rag_format(kb)
            chunks = manager.create_document_chunks(records)
            manager.save_ingestion_state(records, chunks)
            chunks_processed = len(chunks)
        else:
            # Load existing state
            with open(ingestion_state_path, "r", encoding="utf-8") as f:
                state = json.load(f)
            chunks_processed = len(state.get("chunks", {}).get("fr", []) + 
                                  state.get("chunks", {}).get("ar", []) +
                                  state.get("chunks", {}).get("en", []))
        
        # Initialize ChromaDB if not already done
        if chromadb_manager is None:
            chromadb_manager = ChromaDBSetup.setup_from_ingestion_state(
                str(ingestion_state_path),
                persist_dir=str(persist_dir),
            )
        
        return IngestResponse(
            status="success",
            message="FAQ ingestion complete",
            chunks_processed=chunks_processed,
            languages=["fr", "ar", "en"],
            timestamp=datetime.now().isoformat(),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion error: {str(e)}")


@app.post("/chat", response_model=ChatResponse)
@limiter.limit("10/minute")
async def chat(request: Request, chat_request: ChatRequest):
    """
    Main chat endpoint with RAG pipeline
    
    Args:
        request: FastAPI Request (for rate limiting)
        chat_request: ChatRequest with message, language, user_id
        
    Returns:
        ChatResponse with AI-generated response and sources
    """
    try:
        # Validate language
        language = Language(chat_request.language) if isinstance(chat_request.language, str) else chat_request.language
        rag_language = RAGLanguage(language.value)
        
        # Retrieve context from ChromaDB
        context = get_retrieval_context(chat_request.message, language, top_k=3)
        
        # Generate response using RAG chain
        if rag_chain is None:
            response_text = "Chatbot not initialized. Please contact support."
            confidence = 0.0
            sources = []
        else:
            # Convert context to RAG format
            rag_context = [
                {
                    "text": c["text"],
                    "relevance": 1.0 - c["distance"] if c["distance"] else 0.8,
                }
                for c in context[:3]
            ]
            
            # Generate response
            response_text = rag_chain.generate_response(
                chat_request.message,
                rag_context,
                language=rag_language,
            )
            
            # Get metadata
            metadata = rag_chain.get_response_metadata(rag_context)
            confidence = metadata.get("confidence", 0.5)
            sources = metadata.get("sources", [])
        
        return ChatResponse(
            status="success",
            message=response_text,
            language=language.value,
            sources=sources,
            confidence=confidence,
            timestamp=datetime.now().isoformat(),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


@app.post("/contact", response_model=ContactResponse)
async def submit_contact(request: ContactRequest):
    """
    Contact form submission endpoint
    
    Args:
        request: ContactRequest with name, email, phone, subject, message
        
    Returns:
        ContactResponse with ticket ID
    """
    try:
        # Generate ticket ID
        ticket_id = f"TKT-{datetime.now().strftime('%Y%m%d%H%M%S')}-{hash(request.email) % 10000:04d}"
        
        # Log contact submission (in production: save to database)
        contact_log = {
            "ticket_id": ticket_id,
            "name": request.name,
            "email": request.email,
            "phone": request.phone,
            "subject": request.subject,
            "language": request.language.value,
            "timestamp": datetime.now().isoformat(),
        }
        
        # Log to file
        log_file = Path(__file__).parent / "contact_submissions.jsonl"
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(contact_log, ensure_ascii=False) + "\n")
        
        return ContactResponse(
            status="success",
            message="Contact submission received",
            ticket_id=ticket_id,
            timestamp=datetime.now().isoformat(),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Contact error: {str(e)}")


@app.get("/faq", response_model=Dict[str, Any])
async def get_faqs(language: Language = Language.FR, category: Optional[str] = None):
    """
    Get FAQs by language and optional category
    
    Args:
        language: Language code (fr/ar/en)
        category: Optional category filter
        
    Returns:
        List of FAQs
    """
    try:
        # Load FAQ knowledge base
        kb_file = Path(__file__).parent.parent / "faq_knowledge_base.json"
        
        with open(kb_file, "r", encoding="utf-8") as f:
            kb_data = json.load(f)
        
        # Filter by category if provided
        faqs = kb_data.get("faqs", [])
        if category:
            faqs = [faq for faq in faqs if faq.get("category", "").lower() == category.lower()]
        
        return {
            "status": "success",
            "language": language.value,
            "total": len(faqs),
            "faqs": faqs,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"FAQ retrieval error: {str(e)}")


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "status": "ok",
        "service": "Amen Bank AI Chatbot",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "chat": "/chat",
            "contact": "/contact",
            "faqs": "/faq",
            "ingest": "/ingest",
        }
    }


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":
    # Configuration
    host = os.getenv("CHATBOT_HOST", "0.0.0.0")
    port = int(os.getenv("CHATBOT_PORT", 8000))
    reload = os.getenv("ENV", "development") == "development"
    
    # Run server
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info",
    )
