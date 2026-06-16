"""
Integration tests for FastAPI endpoints
"""

import pytest
import json
from fastapi.testclient import TestClient
from main import app, Language


@pytest.fixture
def client():
    """FastAPI test client"""
    return TestClient(app)


class TestHealthEndpoint:
    """Tests for /health endpoint"""
    
    def test_health_check_status_200(self, client):
        """Test health endpoint returns 200"""
        response = client.get("/health")
        assert response.status_code == 200
    
    def test_health_check_response_structure(self, client):
        """Test health check response has required fields"""
        response = client.get("/health")
        data = response.json()
        
        assert "status" in data
        assert "version" in data
        assert "database" in data
        assert "language_support" in data
        assert "timestamp" in data
    
    def test_health_check_status_value(self, client):
        """Test health status is healthy"""
        response = client.get("/health")
        data = response.json()
        assert data["status"] == "healthy"
    
    def test_health_check_languages(self, client):
        """Test language support in health response"""
        response = client.get("/health")
        data = response.json()
        assert "fr" in data["language_support"]
        assert "ar" in data["language_support"]
        assert "en" in data["language_support"]


class TestChatEndpoint:
    """Tests for /chat endpoint"""
    
    def test_chat_basic_request_200(self, client):
        """Test chat endpoint returns 200 for valid request"""
        request_data = {
            "message": "How to open an account?",
            "language": "en"
        }
        response = client.post("/chat", json=request_data)
        assert response.status_code == 200
    
    def test_chat_response_structure(self, client):
        """Test chat response has required fields"""
        request_data = {
            "message": "What are your services?",
            "language": "fr"
        }
        response = client.post("/chat", json=request_data)
        data = response.json()
        
        assert "status" in data
        assert "message" in data
        assert "language" in data
        assert "sources" in data
        assert "confidence" in data
        assert "timestamp" in data
    
    def test_chat_response_status_success(self, client):
        """Test chat returns success status"""
        request_data = {
            "message": "Tell me about credit cards",
            "language": "en"
        }
        response = client.post("/chat", json=request_data)
        data = response.json()
        assert data["status"] == "success"
    
    def test_chat_multilingual_french(self, client):
        """Test chat with French language"""
        request_data = {
            "message": "Comment ouvrir un compte?",
            "language": "fr"
        }
        response = client.post("/chat", json=request_data)
        data = response.json()
        assert data["language"] == "fr"
    
    def test_chat_multilingual_arabic(self, client):
        """Test chat with Arabic language"""
        request_data = {
            "message": "كيف افتح حساب؟",
            "language": "ar"
        }
        response = client.post("/chat", json=request_data)
        data = response.json()
        assert data["language"] == "ar"
    
    def test_chat_multilingual_english(self, client):
        """Test chat with English language"""
        request_data = {
            "message": "What are your fees?",
            "language": "en"
        }
        response = client.post("/chat", json=request_data)
        data = response.json()
        assert data["language"] == "en"
    
    def test_chat_missing_message(self, client):
        """Test chat with missing message"""
        request_data = {
            "language": "en"
        }
        response = client.post("/chat", json=request_data)
        assert response.status_code == 422  # Validation error
    
    def test_chat_message_too_long(self, client):
        """Test chat with message exceeding length limit"""
        request_data = {
            "message": "x" * 1001,  # Max is 1000
            "language": "en"
        }
        response = client.post("/chat", json=request_data)
        assert response.status_code == 422


class TestContactEndpoint:
    """Tests for /contact endpoint"""
    
    def test_contact_valid_submission_200(self, client):
        """Test contact form submission returns 200"""
        request_data = {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "+216123456789",
            "subject": "Account Inquiry",
            "message": "I would like to open a new account",
            "language": "fr"
        }
        response = client.post("/contact", json=request_data)
        assert response.status_code == 200
    
    def test_contact_response_structure(self, client):
        """Test contact response has required fields"""
        request_data = {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "phone": "+216987654321",
            "subject": "Loan Request",
            "message": "I am interested in a personal loan",
            "language": "en"
        }
        response = client.post("/contact", json=request_data)
        data = response.json()
        
        assert "status" in data
        assert "message" in data
        assert "ticket_id" in data
        assert "timestamp" in data
    
    def test_contact_ticket_generation(self, client):
        """Test contact form generates ticket ID"""
        request_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+216555555555",
            "subject": "General Inquiry",
            "message": "Test message for contact form",
            "language": "fr"
        }
        response = client.post("/contact", json=request_data)
        data = response.json()
        
        assert data["ticket_id"].startswith("TKT-")
        assert len(data["ticket_id"]) > 10
    
    def test_contact_invalid_email(self, client):
        """Test contact with invalid email"""
        request_data = {
            "name": "Test User",
            "email": "invalid-email",
            "phone": "+216123456789",
            "subject": "Test",
            "message": "Test message",
            "language": "en"
        }
        response = client.post("/contact", json=request_data)
        assert response.status_code == 422


class TestFAQEndpoint:
    """Tests for /faq endpoint"""
    
    def test_faq_returns_200(self, client):
        """Test FAQ endpoint returns 200"""
        response = client.get("/faq")
        assert response.status_code == 200
    
    def test_faq_response_structure(self, client):
        """Test FAQ response has required fields"""
        response = client.get("/faq?language=fr")
        data = response.json()
        
        assert "status" in data
        assert "language" in data
        assert "total" in data
        assert "faqs" in data
    
    def test_faq_with_language_filter(self, client):
        """Test FAQ with language filter"""
        response = client.get("/faq?language=en")
        data = response.json()
        assert data["language"] == "en"
    
    def test_faq_with_category_filter(self, client):
        """Test FAQ with category filter"""
        response = client.get("/faq?language=fr&category=particuliers")
        data = response.json()
        assert data["status"] == "success"


class TestIngestEndpoint:
    """Tests for /ingest endpoint"""
    
    def test_ingest_returns_200(self, client):
        """Test ingest endpoint returns 200"""
        response = client.post("/ingest")
        assert response.status_code == 200
    
    def test_ingest_response_structure(self, client):
        """Test ingest response has required fields"""
        response = client.post("/ingest")
        data = response.json()
        
        assert "status" in data
        assert "message" in data
        assert "chunks_processed" in data
        assert "languages" in data
        assert "timestamp" in data
    
    def test_ingest_chunks_processed(self, client):
        """Test ingest processes correct number of chunks"""
        response = client.post("/ingest")
        data = response.json()
        
        # Should have 75 chunks (25 FAQs × 3 languages)
        assert data["chunks_processed"] == 75
    
    def test_ingest_languages(self, client):
        """Test ingest includes all languages"""
        response = client.post("/ingest")
        data = response.json()
        
        assert "fr" in data["languages"]
        assert "ar" in data["languages"]
        assert "en" in data["languages"]


class TestRootEndpoint:
    """Tests for / endpoint"""
    
    def test_root_returns_200(self, client):
        """Test root endpoint returns 200"""
        response = client.get("/")
        assert response.status_code == 200
    
    def test_root_response_structure(self, client):
        """Test root response has required fields"""
        response = client.get("/")
        data = response.json()
        
        assert "status" in data
        assert "service" in data
        assert "version" in data
        assert "endpoints" in data


class TestErrorHandling:
    """Tests for error handling"""
    
    def test_invalid_endpoint_404(self, client):
        """Test invalid endpoint returns 404"""
        response = client.get("/invalid-endpoint")
        assert response.status_code == 404
    
    def test_invalid_http_method(self, client):
        """Test invalid HTTP method returns 405"""
        response = client.get("/chat")  # POST only
        assert response.status_code == 405


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
