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
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, Field
import uvicorn
try:
    from slowapi import Limiter
    from slowapi.util import get_remote_address
    from slowapi.errors import RateLimitExceeded
except ImportError:
    Limiter = None
    get_remote_address = None
    RateLimitExceeded = None

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
if Limiter is not None and get_remote_address is not None:
    limiter = Limiter(key_func=get_remote_address)
    app.state.limiter = limiter

    async def rate_limit_handler(req: Request, exc: Exception) -> JSONResponse:
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests. Please try again later."}
        )

    app.add_exception_handler(RateLimitExceeded, rate_limit_handler)
else:
    limiter = None

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


def initialize_services() -> None:
    """Initialize ChromaDB and the RAG chain once for the app lifecycle."""
    global chromadb_manager, rag_chain

    if chromadb_manager is not None and rag_chain is not None:
        return

    chatbot_dir = Path(__file__).parent
    persist_dir = chatbot_dir / "chroma_data"
    ingestion_state_path = chatbot_dir / "faq_ingestion_state.json"

    try:
        print("🚀 Initializing Amen Bank AI Chatbot...")

        if ingestion_state_path.exists():
            print("  ✓ Loading existing ChromaDB collection...")
            chromadb_manager = ChromaDBSetup.setup_from_ingestion_state(
                str(ingestion_state_path),
                persist_dir=str(persist_dir),
            )
        else:
            print("  ⚠ No ingestion state found. Run FAQ ingestion first.")
            chromadb_manager = None

        print("  ✓ Initializing RAG chain with local fallback...")
        rag_chain = create_rag_chain(language=RAGLanguage.FR)

        print("✅ Chatbot initialization complete")
    except Exception as e:
        print(f"❌ Startup error: {e}")
        chromadb_manager = None
        rag_chain = None


# ============================================================
# STARTUP & SHUTDOWN
# ============================================================

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup."""
    initialize_services()


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    global chromadb_manager
    if chromadb_manager:
        chromadb_manager.persist()
        print("✓ ChromaDB persisted to disk")


initialize_services()


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
    # FIX: guard against both chromadb_manager and collection being None
    if chromadb_manager is None or chromadb_manager.collection is None:
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


_SPACY_NLP_CACHE: Dict[str, Any] = {}


def extract_keyword(text: str, language: Language) -> Optional[str]:
    """
    Improved keyword extractor using spaCy when available.

    Strategy:
    - Try to load a language-specific spaCy model (lazy cached).
    - Extract entities, noun-chunks and candidate tokens (NOUN/PROPN/ADJ).
    - Prefer multi-word noun chunks or named entities, fall back to single tokens.
    - If spaCy is not available or model load fails, fall back to a simple regex-based extractor.
    """
    if not text:
        return None

    # Try spaCy-based extraction (lazy load models)
    try:
        import spacy  # type: ignore

        model_map = {
            'fr': 'fr_core_news_sm',
            'en': 'en_core_web_sm',
            'ar': 'xx_sent_ud_sm',
        }

        lang_code = language.value if isinstance(language, Language) else str(language)
        model_name = model_map.get(lang_code, 'xx_sent_ud_sm')

        nlp = None
        if model_name in _SPACY_NLP_CACHE:
            nlp = _SPACY_NLP_CACHE[model_name]
        else:
            try:
                nlp = spacy.load(model_name)
            except Exception:
                # Try the universal small model as a last resort
                try:
                    nlp = spacy.load('xx_sent_ud_sm')
                    model_name = 'xx_sent_ud_sm'
                except Exception:
                    nlp = None
            if nlp is not None:
                _SPACY_NLP_CACHE[model_name] = nlp


            # Named entities (prefer longer entities)
            for ent in getattr(doc, 'ents', []):
                ent_text = ent.text.strip()
                if len(ent_text) > 2:
                    candidates.append(ent_text)

            # Noun chunks (multi-word phrases)
            for nc in getattr(doc, 'noun_chunks', []):
                nc_text = nc.text.strip()
                if len(nc_text) > 2:
                    candidates.append(nc_text)

            # POS-based tokens (NOUN/PROPN/ADJ)
            for tok in doc:
                if tok.pos_ in ('NOUN', 'PROPN', 'ADJ'):
                    t = tok.text.strip()
                    if len(t) > 2:
                        candidates.append(t)

            # De-duplicate while preserving order
            seen = set()
            candidates = [c for c in candidates if not (c.lower() in seen or seen.add(c.lower()))]

            if candidates:
                query_embedding = _get_text_embedding(text)
                best_candidate = None
                best_score = -1.0

                if query_embedding is not None:
                    for candidate in candidates:
                        candidate_embedding = _get_text_embedding(candidate)
                        if candidate_embedding is None:
                            continue
                        score = _cosine_similarity(query_embedding, candidate_embedding)
                        if score > best_score:
                            best_score = score
                            best_candidate = candidate

                if best_candidate is not None:
                    return best_candidate.lower()

                # Fallback: choose the longest candidate when embeddings are unavailable
                candidates.sort(key=lambda s: -len(s))
                return candidates[0].lower()
    except Exception:
        # spaCy not available or failed — fall back
        pass

    # Fallback: previous simple regex-based extraction
    import re

    token_list = re.findall(r"[\wÀ-ÿ']+", text.lower())
    # Basic stopwords per language (small set)
    stopwords = {
        'fr': {
            'est', 'le', 'la', 'les', 'de', 'des', 'du', 'un', 'une', 'et', 'à', 'a', 'au', 'aux',
            'pour', 'que', 'qui', 'dans', 'sur'
        },
        'en': {'the', 'is', 'a', 'an', 'and', 'or', 'to', 'of', 'in', 'for', 'on', 'what', 'how', 'where'},
        'ar': set(),
    }

    sw = stopwords.get(language.value, set())

    for tok in token_list:
        # skip short tokens and stopwords
        if len(tok) <= 3:
            continue
        if tok in sw:
            continue
        # return first candidate
        return tok

    return None


def _get_text_embedding(text: str) -> Optional[List[float]]:
    """Generate an embedding for a piece of text using ChromaDB manager."""
    if chromadb_manager is None or chromadb_manager.collection is None:
        return None

    try:
        return chromadb_manager._generate_mock_embedding(text)
    except Exception:
        return None


def _cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    """Compute cosine similarity between two vectors."""
    if not vec_a or not vec_b or len(vec_a) != len(vec_b):
        return 0.0

    dot = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = sum(a * a for a in vec_a) ** 0.5
    norm_b = sum(b * b for b in vec_b) ** 0.5
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


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
        if not ingestion_state_path.exists():
            # FIX: correct pipeline + correct args to save_ingestion_state
            manager = FAQIngestionManager()
            kb = manager.load_knowledge_base()
            records = manager.transform_to_rag_format(kb)
            manager.faqs = records  # required for save_ingestion_state serialization
            chunks_by_language = manager.create_document_chunks(records)
            chunks_by_language = manager.generate_mock_embeddings(chunks_by_language)
            manager.save_ingestion_state(chunks_by_language, str(ingestion_state_path))
            chunks_processed = sum(len(c) for c in chunks_by_language.values())
        else:
            # Load existing state
            with open(ingestion_state_path, "r", encoding="utf-8") as f:
                state = json.load(f)
            chunks = state.get("chunks", {})
            chunks_processed = len(
                chunks.get("fr", []) +
                chunks.get("ar", []) +
                chunks.get("en", [])
            )

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

        # Extract a keyword from the user's message; if none, decline immediately
        keyword = extract_keyword(chat_request.message, language)

        if not keyword:
            # Language-specific decline templates
            decline_templates = {
                Language.FR: "Je n'ai pas identifié de mot-clé dans votre question. Veuillez contacter notre support client par téléphone au +216 71 833 517 ou par email à amenbank@amenbank.com.tn.",
                Language.AR: "لم أتمكن من تحديد كلمة مفتاحية في سؤالك. يرجى التواصل مع خدمة العملاء عبر الهاتف +216 71 833 517 أو عبر البريد الإلكتروني amenbank@amenbank.com.tn.",
                Language.EN: "I couldn't identify a keyword in your question. Please contact our support by phone at +216 71 833 517 or by email at amenbank@amenbank.com.tn.",
            }
            return ChatResponse(
                status="success",
                message=decline_templates.get(language, decline_templates[Language.EN]),
                language=language.value,
                sources=[],
                confidence=0.0,
                timestamp=datetime.now().isoformat(),
            )

        # Retrieve context from ChromaDB using the extracted keyword
        context = get_retrieval_context(keyword, language, top_k=1)

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
                for c in context[:1]
            ]

            # If no relevant chunk found, decline with contact suggestion
            if not rag_context:
                decline_templates = {
                    Language.FR: "Je n'ai pas trouvé d'information pertinente dans la FAQ. Veuillez contacter notre support client par téléphone au +216 71 833 517 ou par email à amenbank@amenbank.com.tn.",
                    Language.AR: "لم أجد معلومات ذات صلة في الأسئلة المتكررة. يرجى التواصل مع خدمة العملاء عبر الهاتف +216 71 833 517 أو عبر البريد الإلكتروني amenbank@amenbank.com.tn.",
                    Language.EN: "I couldn't find relevant information in the FAQ. Please contact our support by phone at +216 71 833 517 or by email at amenbank@amenbank.com.tn.",
                }
                return ChatResponse(
                    status="success",
                    message=decline_templates.get(language, decline_templates[Language.EN]),
                    language=language.value,
                    sources=[],
                    confidence=0.0,
                    timestamp=datetime.now().isoformat(),
                )

            response_text = rag_chain.generate_response(
                chat_request.message,
                rag_context,
                language=rag_language,
            )

            metadata = rag_chain.get_response_metadata(rag_context)
            confidence = metadata.get("confidence", 0.5)
            sources = metadata.get("sources", [])
            confidence = max(0.0, min(1.0, float(confidence)))

            if not rag_context and not sources:
                response_text = (
                    "I could not find enough information in the FAQ to answer with confidence. "
                    "Please contact an Amen Bank branch or support team for a precise answer."
                )
                confidence = 0.3

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
        kb_file = Path(__file__).parent.parent / "faq_knowledge_base.json"

        with open(kb_file, "r", encoding="utf-8") as f:
            kb_data = json.load(f)

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
    host = os.getenv("CHATBOT_HOST", "0.0.0.0")
    port = int(os.getenv("CHATBOT_PORT", 8000))
    reload = os.getenv("ENV", "development") == "development"

    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info",
    )