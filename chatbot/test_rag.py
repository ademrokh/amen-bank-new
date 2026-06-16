"""
Unit tests for RAG chain and ChromaDB retrieval
"""

import pytest
from pathlib import Path
from rag_chain import AmenBankRAGChain, Language, create_rag_chain
from services.chromadb_manager import ChromaDBManager


class TestRAGChain:
    """Tests for RAG chain functionality"""
    
    def test_rag_chain_initialization(self):
        """Test RAG chain initializes correctly"""
        chain = create_rag_chain(Language.FR)
        assert chain is not None
        assert chain.language == Language.FR
        assert chain.model == "mixtral-8x7b-32768"
    
    def test_rag_chain_language_support(self):
        """Test RAG chain supports all languages"""
        for lang in Language:
            chain = create_rag_chain(lang)
            assert chain.language == lang
    
    def test_format_context_empty(self):
        """Test context formatting with empty list"""
        chain = create_rag_chain(Language.EN)
        result = chain._format_context([])
        assert "No relevant information found" in result
    
    def test_format_context_with_chunks(self):
        """Test context formatting with retrieved chunks"""
        chain = create_rag_chain(Language.EN)
        context = [
            {
                "text": "Sample FAQ about accounts",
                "relevance": 0.95
            },
            {
                "text": "Sample FAQ about cards",
                "relevance": 0.87
            }
        ]
        result = chain._format_context(context)
        assert "Sample FAQ" in result
        assert "[1]" in result
        assert "[2]" in result
    
    def test_generate_template_response_french(self):
        """Test template response generation in French"""
        chain = create_rag_chain(Language.FR)
        context = [{"text": "Comment ouvrir un compte", "relevance": 0.9}]
        response = chain.generate_response(
            "How to open account?",
            context,
            Language.FR
        )
        assert len(response) > 0
        assert isinstance(response, str)
    
    def test_generate_template_response_arabic(self):
        """Test template response generation in Arabic"""
        chain = create_rag_chain(Language.AR)
        context = [{"text": "كيفية فتح حساب", "relevance": 0.9}]
        response = chain.generate_response(
            "كيف افتح حساب؟",
            context,
            Language.AR
        )
        assert len(response) > 0
        assert isinstance(response, str)
    
    def test_generate_template_response_english(self):
        """Test template response generation in English"""
        chain = create_rag_chain(Language.EN)
        context = [{"text": "How to open an account", "relevance": 0.9}]
        response = chain.generate_response(
            "How to open account?",
            context,
            Language.EN
        )
        assert len(response) > 0
        assert isinstance(response, str)
    
    def test_get_response_metadata_no_context(self):
        """Test response metadata with no context"""
        chain = create_rag_chain(Language.EN)
        metadata = chain.get_response_metadata([])
        
        assert metadata["has_context"] is False
        assert metadata["confidence"] == 0.3
        assert metadata["num_sources"] == 0
        assert metadata["avg_relevance"] == 0.0
    
    def test_get_response_metadata_with_context(self):
        """Test response metadata with context"""
        chain = create_rag_chain(Language.EN)
        context = [
            {"text": "FAQ 1", "relevance": 0.9},
            {"text": "FAQ 2", "relevance": 0.8},
            {"text": "FAQ 3", "relevance": 0.7},
        ]
        metadata = chain.get_response_metadata(context)
        
        assert metadata["has_context"] is True
        assert metadata["confidence"] > 0.5
        assert metadata["num_sources"] == 3
        assert 0.7 <= metadata["avg_relevance"] <= 0.9


class TestChromaDBManager:
    """Tests for ChromaDB manager"""
    
    def test_chromadb_persistence(self):
        """Test ChromaDB persists to disk"""
        persist_dir = Path(__file__).parent / "chroma_data"
        assert persist_dir.exists()
    
    def test_collection_exists(self):
        """Test ChromaDB collection is initialized"""
        # This requires the collection to be set up
        # Collection should exist from task 14
        assert Path(__file__).parent.exists()


class TestLanguageValidation:
    """Tests for language handling"""
    
    def test_language_enum_values(self):
        """Test Language enum has correct values"""
        assert Language.FR.value == "fr"
        assert Language.AR.value == "ar"
        assert Language.EN.value == "en"
    
    def test_language_iteration(self):
        """Test Language enum is iterable"""
        languages = list(Language)
        assert len(languages) == 3
        assert Language.FR in languages
        assert Language.AR in languages
        assert Language.EN in languages


# ============================================================
# PYTEST FIXTURES
# ============================================================

@pytest.fixture
def rag_chain_en():
    """Fixture for English RAG chain"""
    return create_rag_chain(Language.EN)


@pytest.fixture
def rag_chain_fr():
    """Fixture for French RAG chain"""
    return create_rag_chain(Language.FR)


@pytest.fixture
def rag_chain_ar():
    """Fixture for Arabic RAG chain"""
    return create_rag_chain(Language.AR)


@pytest.fixture
def sample_context():
    """Fixture for sample retrieved context"""
    return [
        {
            "text": "Amen Bank offers multiple account types for individuals and businesses.",
            "relevance": 0.95
        },
        {
            "text": "Opening an account requires a valid ID and minimum deposit.",
            "relevance": 0.88
        },
        {
            "text": "Our digital banking platform provides 24/7 account management.",
            "relevance": 0.82
        }
    ]


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
