"""
ChromaDB Collection Manager for Amen Bank FAQ RAG System

Sets up and manages ChromaDB collection for multilingual FAQ retrieval.
Handles collection initialization, document insertion, and retrieval.

Usage:
    from chromadb_manager import ChromaDBManager
    
    manager = ChromaDBManager(persist_dir="./chroma_data")
    manager.initialize_collection()
    manager.insert_documents(faq_chunks)
    results = manager.query(question="How to open account?", language="en")
"""

import json
import os
from pathlib import Path
from typing import List, Dict, Any, Optional
import hashlib

# ChromaDB imports
try:
    import chromadb
except ImportError:
    raise ImportError(
        "ChromaDB not installed. Install with: pip install chromadb"
    )


class ChromaDBManager:
    """Manages ChromaDB collections for FAQ retrieval"""

    def __init__(
        self,
        collection_name: str = "amen_bank_faqs",
        persist_dir: str = None,
        host: str = None,
        port: int = None,
    ):
        """
        Initialize ChromaDB manager

        Args:
            collection_name: Name of the collection
            persist_dir: Local directory for persistent storage
            host: Remote Chroma server host (optional)
            port: Remote Chroma server port (optional)
        """
        self.collection_name = collection_name
        self.persist_dir = persist_dir or "./chroma_data"
        self.host = host
        self.port = port
        self.client = None
        self.collection = None

    def initialize_client(self):
        """Initialize ChromaDB client with appropriate backend"""
        if self.host and self.port:
            # Connect to remote Chroma server
            print(f"Connecting to remote ChromaDB at {self.host}:{self.port}...")
            self.client = chromadb.HttpClient(host=self.host, port=self.port)
        else:
            # Use local persistent storage with modern API
            print(f"Initializing local ChromaDB at {self.persist_dir}...")
            Path(self.persist_dir).mkdir(parents=True, exist_ok=True)
            
            # Use modern Chroma API
            self.client = chromadb.PersistentClient(path=self.persist_dir)

    def initialize_collection(self, metadata: Dict[str, Any] = None) -> bool:
        """
        Initialize or get existing collection

        Args:
            metadata: Collection metadata

        Returns:
            True if successful
        """
        if self.client is None:
            self.initialize_client()

        collection_metadata = metadata or {
            "description": "Amen Bank FAQ multilingual collection",
            "languages": "fr,ar,en",  # String instead of list
            "embedding_model": "multilingual-e5-base",
        }

        try:
            # Get or create collection
            self.collection = self.client.get_or_create_collection(
                name=self.collection_name,
                metadata=collection_metadata,
            )
            print(f"✓ Collection '{self.collection_name}' ready")
            print(f"  Metadata: {collection_metadata}")
            return True
        except Exception as e:
            print(f"✗ Failed to initialize collection: {e}")
            return False

    def insert_documents(
        self,
        chunks_by_language: Dict[str, List[Dict[str, Any]]],
        batch_size: int = 100,
    ) -> bool:
        """
        Insert document chunks into collection

        Args:
            chunks_by_language: Processed FAQ chunks organized by language
            batch_size: Number of documents to insert per batch

        Returns:
            True if all inserts successful
        """
        if self.collection is None:
            print("✗ Collection not initialized. Call initialize_collection() first.")
            return False

        total_inserted = 0
        failed_inserts = []

        for language, chunks in chunks_by_language.items():
            print(f"\nInserting {len(chunks)} chunks for language: {language.upper()}")

            # Process in batches
            for i in range(0, len(chunks), batch_size):
                batch = chunks[i : i + batch_size]

                try:
                    # Prepare batch data
                    ids = [chunk["id"] for chunk in batch]
                    embeddings = [chunk["embedding"] for chunk in batch]
                    documents = [chunk["text"] for chunk in batch]
                    metadatas = [chunk["metadata"] for chunk in batch]

                    # Insert batch
                    self.collection.add(
                        ids=ids,
                        embeddings=embeddings,
                        documents=documents,
                        metadatas=metadatas,
                    )

                    batch_num = i // batch_size + 1
                    print(f"  ✓ Batch {batch_num}: {len(batch)} documents inserted")
                    total_inserted += len(batch)

                except Exception as e:
                    print(f"  ✗ Batch {batch_num} failed: {e}")
                    failed_inserts.extend(ids)

        if failed_inserts:
            print(f"\n⚠ {len(failed_inserts)} documents failed to insert")
            return False

        print(f"\n✓ Successfully inserted {total_inserted} documents")
        return True

    def query(
        self,
        query_text: str,
        language: str,
        n_results: int = 5,
    ) -> List[Dict[str, Any]]:
        """
        Query the collection for similar documents

        Args:
            query_text: Query text
            language: Language code (fr, ar, en)
            n_results: Number of results to return

        Returns:
            List of matching documents with scores
        """
        if self.collection is None:
            print("✗ Collection not initialized")
            return []

        # In production, would use sentence-transformers to generate embedding
        # For now, use mock embedding based on text hash
        query_embedding = self._generate_mock_embedding(query_text)

        try:
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=n_results,
                where={"language": language},  # Filter by language
            )

            # Transform results to readable format
            documents = []
            if results and results["ids"] and len(results["ids"]) > 0:
                for i, doc_id in enumerate(results["ids"][0]):
                    documents.append({
                        "id": doc_id,
                        "text": results["documents"][0][i],
                        "metadata": results["metadatas"][0][i],
                        "distance": results["distances"][0][i] if results["distances"] else None,
                    })

            print(f"✓ Query returned {len(documents)} results")
            return documents

        except Exception as e:
            print(f"✗ Query failed: {e}")
            return []

    def _generate_mock_embedding(self, text: str) -> List[float]:
        """
        Generate mock embedding based on text hash

        In production, use sentence-transformers:
            from sentence_transformers import SentenceTransformer
            model = SentenceTransformer("intfloat/multilingual-e5-base")
            return model.encode(text).tolist()

        Args:
            text: Text to embed

        Returns:
            384-dimensional mock embedding vector
        """
        text_hash = int(hashlib.md5(text.encode()).hexdigest(), 16)
        return [
            float((text_hash + i) % 256) / 256.0 
            for i in range(384)  # Match multilingual-e5-base dimension
        ]

    def delete_collection(self) -> bool:
        """
        Delete the collection

        Args:
            Returns: True if successful
        """
        if self.client is None:
            print("✗ Client not initialized")
            return False

        try:
            self.client.delete_collection(name=self.collection_name)
            print(f"✓ Collection '{self.collection_name}' deleted")
            self.collection = None
            return True
        except Exception as e:
            print(f"✗ Failed to delete collection: {e}")
            return False

    def get_collection_stats(self) -> Dict[str, Any]:
        """
        Get collection statistics

        Returns:
            Dictionary with collection stats
        """
        if self.collection is None:
            return {"error": "Collection not initialized"}

        try:
            # Get total document count
            count = self.collection.count()

            # Get metadata
            metadata = self.collection.metadata or {}

            stats = {
                "name": self.collection_name,
                "total_documents": count,
                "metadata": metadata,
                "persist_directory": self.persist_dir,
            }
            return stats
        except Exception as e:
            return {"error": str(e)}

    def persist(self) -> bool:
        """
        Persist collection to disk

        Returns:
            True if successful
        """
        try:
            if hasattr(self.client, "persist"):
                self.client.persist()
            print("✓ Collection persisted to disk")
            return True
        except Exception as e:
            print(f"⚠ Persist operation not available or failed: {e}")
            return False


class ChromaDBSetup:
    """Setup utility for initializing ChromaDB with FAQ data"""

    @staticmethod
    def setup_from_ingestion_state(
        ingestion_state_path: str,
        persist_dir: str = None,
    ) -> ChromaDBManager:
        """
        Setup ChromaDB from FAQ ingestion state

        Args:
            ingestion_state_path: Path to faq_ingestion_state.json
            persist_dir: Directory for ChromaDB persistence

        Returns:
            Initialized ChromaDBManager
        """
        print("\n🚀 Starting ChromaDB Collection Setup")
        print("-" * 60)

        # Load ingestion state
        print(f"Loading ingestion state from {ingestion_state_path}...")
        with open(ingestion_state_path, 'r', encoding='utf-8') as f:
            ingestion_state = json.load(f)

        # Initialize manager
        manager = ChromaDBManager(persist_dir=persist_dir)
        manager.initialize_client()
        manager.initialize_collection()

        # Extract chunks by language
        chunks_by_language = ingestion_state.get("chunks", {})

        # Insert documents
        success = manager.insert_documents(chunks_by_language)

        if success:
            # Get and display stats
            stats = manager.get_collection_stats()
            print("\n" + "=" * 60)
            print("CHROMADB COLLECTION STATS")
            print("=" * 60)
            print(f"Collection: {stats['name']}")
            print(f"Total documents: {stats['total_documents']}")
            print(f"Storage location: {stats['persist_directory']}")
            print("=" * 60 + "\n")

            # Persist to disk
            manager.persist()

        return manager


def main():
    """Main entry point"""
    import sys

    # Default paths - use absolute repo root
    current_dir = Path(__file__).parent  # services directory
    chatbot_dir = current_dir.parent  # chatbot directory
    repo_root = chatbot_dir.parent  # root directory
    
    ingestion_state_path = chatbot_dir / "faq_ingestion_state.json"
    persist_dir = str(chatbot_dir / "chroma_data")

    print(f"Chatbot directory: {chatbot_dir}")
    print(f"Ingestion state path: {ingestion_state_path}")
    print(f"ChromaDB persist dir: {persist_dir}")

    if not ingestion_state_path.exists():
        print(f"\n❌ Error: Ingestion state not found at {ingestion_state_path}")
        print("Run 'python ingest_faqs.py' first")
        sys.exit(1)

    try:
        # Setup ChromaDB
        manager = ChromaDBSetup.setup_from_ingestion_state(
            str(ingestion_state_path),
            persist_dir=persist_dir,
        )

        # Test query
        print("\n🧪 Testing Collection Query")
        print("-" * 60)
        test_query = "How to open an account?"
        print(f"Query: {test_query}")
        results = manager.query(test_query, language="en", n_results=3)
        
        if results:
            print(f"\nFound {len(results)} results:")
            for i, result in enumerate(results, 1):
                print(f"\n{i}. {result['id']}")
                print(f"   Text: {result['text'][:100]}...")
                if result['distance']:
                    print(f"   Distance: {result['distance']:.4f}")
        else:
            print("No results found")

        print("\n✅ ChromaDB Collection Setup Complete!")
        print("Ready for RAG integration (Task 18)")

    except Exception as e:
        print(f"\n❌ Setup Error: {e}")
        raise


if __name__ == "__main__":
    main()
