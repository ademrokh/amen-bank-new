"""
FAQ Ingestion Script for Amen Bank RAG System

This script loads FAQ data from the knowledge base and prepares it for
ChromaDB ingestion with multilingual support (FR, AR, EN).

Usage:
    python ingest_faqs.py --reset  # Reset and reingest all FAQs
    python ingest_faqs.py            # Add new FAQs only
"""

import json
import uuid
from pathlib import Path
from typing import List, Dict, Any
from dataclasses import dataclass, asdict
from enum import Enum

# Optional: Import for embeddings (will be integrated with ChromaDB)
# from sentence_transformers import SentenceTransformer


class Language(str, Enum):
    """Supported languages"""
    FR = "fr"
    AR = "ar"
    EN = "en"


@dataclass
class FAQContent:
    """Single language version of an FAQ"""
    language: Language
    category: str
    question: str
    answer: str
    question_embeddings: List[float] = None  # Will be generated later


@dataclass
class FAQRecord:
    """Complete FAQ record with all language versions"""
    id: str
    content: Dict[Language, FAQContent]
    metadata: Dict[str, Any]

    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            "id": self.id,
            "content": {
                lang.value: asdict(content) 
                for lang, content in self.content.items()
            },
            "metadata": self.metadata
        }


class FAQIngestionManager:
    """Manages FAQ data ingestion and preparation for RAG"""

    def __init__(self, knowledge_base_path: str = None):
        """
        Initialize the FAQ ingestion manager

        Args:
            knowledge_base_path: Path to faq_knowledge_base.json
        """
        if knowledge_base_path is None:
            # Default path relative to chatbot directory
            knowledge_base_path = Path(__file__).parent.parent / "faq_knowledge_base.json"
        
        self.knowledge_base_path = Path(knowledge_base_path)
        self.faqs: List[FAQRecord] = []

    def load_knowledge_base(self) -> List[Dict[str, Any]]:
        """
        Load FAQ knowledge base from JSON file

        Returns:
            List of FAQ dictionaries
        """
        if not self.knowledge_base_path.exists():
            raise FileNotFoundError(
                f"Knowledge base not found: {self.knowledge_base_path}"
            )

        with open(self.knowledge_base_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Extract FAQs from wrapper if needed
        if isinstance(data, dict) and "faqs" in data:
            faqs = data["faqs"]
        elif isinstance(data, list):
            faqs = data
        else:
            raise ValueError("Unexpected knowledge base format")
        
        print(f"✓ Loaded knowledge base: {len(faqs)} FAQ entries")
        return faqs

    def transform_to_rag_format(self, raw_faqs: List[Dict[str, Any]]) -> List[FAQRecord]:
        """
        Transform raw FAQ data into RAG-optimized format

        Args:
            raw_faqs: List of FAQ dictionaries from knowledge base

        Returns:
            List of FAQRecord objects
        """
        faq_records = []

        for faq in raw_faqs:
            record_id = faq.get("id", str(uuid.uuid4()))

            # Extract multilingual content
            content = {}
            for lang in Language:
                lang_suffix = f"_{lang.value}"
                
                content[lang] = FAQContent(
                    language=lang,
                    category=faq.get(f"category{lang_suffix}", faq.get("category", "")),
                    question=faq.get(f"question{lang_suffix}", faq.get("question", "")),
                    answer=faq.get(f"answer{lang_suffix}", faq.get("answer", "")),
                )

            # Create metadata
            metadata = {
                "source": "faq_knowledge_base",
                "languages": ",".join([lang.value for lang in Language]),  # Convert to comma-separated string
                "tags": ",".join(faq.get("tags", [])),  # Convert to comma-separated string
            }

            record = FAQRecord(id=record_id, content=content, metadata=metadata)
            faq_records.append(record)

        print(f"✓ Transformed {len(faq_records)} FAQ records")
        return faq_records

    def create_document_chunks(self, faq_records: List[FAQRecord]) -> Dict[Language, List[Dict[str, Any]]]:
        """
        Create document chunks for RAG retrieval

        Each chunk contains the question-answer pair in a specific language
        to enable language-specific retrieval.

        Args:
            faq_records: List of FAQ records

        Returns:
            Dictionary mapping language to list of document chunks
        """
        chunks_by_language = {lang: [] for lang in Language}

        for record in faq_records:
            for lang, content in record.content.items():
                chunk = {
                    "id": f"{record.id}_{lang.value}",
                    "faq_id": record.id,
                    "language": lang.value,
                    "category": content.category,
                    "question": content.question,
                    "answer": content.answer,
                    # Combined text for embedding generation
                    "text": f"{content.category}. {content.question}\n{content.answer}",
                    "metadata": {
                        **record.metadata,
                        "language": lang.value,
                        "chunk_type": "faq"
                    }
                }
                chunks_by_language[lang].append(chunk)

        total_chunks = sum(len(chunks) for chunks in chunks_by_language.values())
        print(f"✓ Created {total_chunks} document chunks ({len(chunks_by_language)} languages)")

        return chunks_by_language

    def generate_mock_embeddings(self, chunks_by_language: Dict[Language, List[Dict[str, Any]]]) -> Dict[Language, List[Dict[str, Any]]]:
        """
        Generate mock embeddings for testing

        In production, use sentence-transformers multilingual-e5-base model.
        
        Args:
            chunks_by_language: Document chunks organized by language

        Returns:
            Chunks with embeddings added
        """
        # For production, uncomment and use:
        # model = SentenceTransformer("intfloat/multilingual-e5-base")
        
        for lang, chunks in chunks_by_language.items():
            for chunk in chunks:
                # Mock embedding: hash-based deterministic vector
                # In production: chunk["embedding"] = model.encode(chunk["text"])
                text_hash = hash(chunk["text"])
                # Generate 384-dimensional mock embedding
                chunk["embedding"] = [
                    float((text_hash + i) % 256) / 256.0 
                    for i in range(384)  # multilingual-e5-base output dimension
                ]

        print(f"✓ Generated embeddings for all chunks")
        return chunks_by_language

    def validate_chunks(self, chunks_by_language: Dict[Language, List[Dict[str, Any]]]) -> bool:
        """
        Validate document chunks

        Args:
            chunks_by_language: Document chunks to validate

        Returns:
            True if valid, False otherwise
        """
        issues = []

        for lang, chunks in chunks_by_language.items():
            if not chunks:
                issues.append(f"No chunks for language: {lang.value}")
                continue

            for chunk in chunks:
                # Check required fields
                required_fields = ["id", "text", "embedding"]
                for field in required_fields:
                    if field not in chunk or not chunk[field]:
                        issues.append(f"Missing {field} in {lang.value} chunk {chunk.get('id')}")

                # Check embedding dimension
                if "embedding" in chunk and len(chunk["embedding"]) != 384:
                    issues.append(
                        f"Embedding dimension mismatch in {lang.value} chunk {chunk.get('id')}: "
                        f"expected 384, got {len(chunk['embedding'])}"
                    )

        if issues:
            print("✗ Validation issues found:")
            for issue in issues:
                print(f"  - {issue}")
            return False

        print(f"✓ Validation passed for all chunks")
        return True

    def generate_ingest_report(self, chunks_by_language: Dict[Language, List[Dict[str, Any]]]) -> Dict[str, Any]:
        """
        Generate ingestion report with statistics

        Args:
            chunks_by_language: Document chunks

        Returns:
            Report dictionary
        """
        report = {
            "status": "ready_for_ingestion",
            "timestamp": str(Path(__file__).stat().st_mtime),
            "languages": {
                lang.value: {
                    "chunk_count": len(chunks),
                    "total_chars": sum(len(chunk["text"]) for chunk in chunks),
                    "avg_chunk_size": sum(len(chunk["text"]) for chunk in chunks) / len(chunks) if chunks else 0,
                }
                for lang, chunks in chunks_by_language.items()
            },
            "total_chunks": sum(len(chunks) for chunks in chunks_by_language.values()),
            "next_step": "chromadb_collection_creation",
        }

        print("\n" + "="*60)
        print("INGESTION REPORT")
        print("="*60)
        print(f"Status: {report['status']}")
        for lang, stats in report["languages"].items():
            print(f"\nLanguage: {lang.upper()}")
            print(f"  Chunks: {stats['chunk_count']}")
            print(f"  Total characters: {stats['total_chars']}")
            print(f"  Average chunk size: {stats['avg_chunk_size']:.0f} chars")
        print(f"\nTotal chunks (all languages): {report['total_chunks']}")
        print(f"Next step: {report['next_step']}")
        print("="*60 + "\n")

        return report

    def ingest(self, reset: bool = False) -> Dict[Language, List[Dict[str, Any]]]:
        """
        Execute complete FAQ ingestion pipeline

        Args:
            reset: If True, reload all FAQs from source

        Returns:
            Processed chunks ready for ChromaDB insertion
        """
        print("\n🚀 Starting FAQ Ingestion Pipeline")
        print("-" * 60)

        # Step 1: Load knowledge base
        raw_faqs = self.load_knowledge_base()  # Returns list

        # Step 2: Transform to RAG format
        faq_records = self.transform_to_rag_format(raw_faqs)
        self.faqs = faq_records

        # Step 3: Create document chunks
        chunks_by_language = self.create_document_chunks(faq_records)

        # Step 4: Generate embeddings
        chunks_with_embeddings = self.generate_mock_embeddings(chunks_by_language)

        # Step 5: Validate chunks
        is_valid = self.validate_chunks(chunks_with_embeddings)
        if not is_valid:
            raise ValueError("Chunk validation failed")

        # Step 6: Generate report
        self.generate_ingest_report(chunks_with_embeddings)

        return chunks_with_embeddings

    def save_ingestion_state(self, chunks_by_language: Dict[Language, List[Dict[str, Any]]], output_path: str = None):
        """
        Save ingestion state to JSON file

        Args:
            chunks_by_language: Processed chunks
            output_path: Path to save ingestion state
        """
        if output_path is None:
            output_path = Path(__file__).parent / "faq_ingestion_state.json"

        ingestion_state = {
            "faqs": [faq.to_dict() for faq in self.faqs],
            "chunks": {
                lang.value: chunks 
                for lang, chunks in chunks_by_language.items()
            },
            "metadata": {
                "total_records": len(self.faqs),
                "total_chunks": sum(len(chunks) for chunks in chunks_by_language.values()),
                "languages": list(Language.__members__.keys()),
            }
        }

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(ingestion_state, f, indent=2, ensure_ascii=False)

        print(f"✓ Saved ingestion state to: {output_path}")


def main():
    """Main entry point"""
    import sys

    # Parse command line arguments
    reset = "--reset" in sys.argv

    try:
        # Initialize ingestion manager
        manager = FAQIngestionManager()

        # Execute ingestion pipeline
        chunks_by_language = manager.ingest(reset=reset)

        # Save ingestion state
        manager.save_ingestion_state(chunks_by_language)

        print("\n✅ FAQ Ingestion Complete!")
        print("Ready for ChromaDB collection creation (Task 14)")

    except Exception as e:
        print(f"\n❌ Ingestion Error: {e}")
        raise


if __name__ == "__main__":
    main()
