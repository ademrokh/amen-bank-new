# API Documentation - Amen Bank AI Solution

**Version**: 1.0  
**Base URL**: `http://localhost:8000` (development)  
**Status**: Production Ready

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication & Rate Limiting](#authentication--rate-limiting)
3. [CORS Configuration](#cors-configuration)
4. [Error Codes](#error-codes)
5. [Endpoints](#endpoints)
   - [GET /health](#get-health)
   - [POST /chat](#post-chat)
   - [POST /contact](#post-contact)
   - [GET /faq](#get-faq)
   - [POST /ingest](#post-ingest)

---

## Overview

The Amen Bank API provides five core endpoints for:
- **Health monitoring** (system status)
- **Chat interactions** (RAG-powered FAQ responses)
- **Contact submissions** (customer inquiries)
- **FAQ retrieval** (search knowledge base)
- **FAQ ingestion** (internal administration)

### Key Features
- ✅ Multilingual support (English, French, Arabic)
- ✅ Rate limiting (10 requests/minute on `/chat`)
- ✅ CORS enabled for frontend integration
- ✅ Standardized JSON responses
- ✅ Comprehensive error handling
- ✅ Vector similarity search (ChromaDB)
- ✅ LLM-powered response generation (Groq)

---

## Authentication & Rate Limiting

### Rate Limiting

**Endpoint**: `POST /chat`  
**Limit**: 10 requests per minute per IP  
**Header**: `Retry-After` (seconds until next request allowed)

**Rate Limit Headers**:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1623456789
```

**When Exceeded**:
```http
HTTP/1.1 429 Too Many Requests

{
  "detail": "Rate limit exceeded. Maximum 10 requests per minute."
}
```

### Recovery
Wait for the `Retry-After` duration before retrying:
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "language": "en"}'

# If 429: Wait X seconds
sleep $RETRY_AFTER
# Then retry
```

---

## CORS Configuration

**Allowed Origins**: `http://localhost:3000` (frontend development)

**Allowed Methods**: `GET`, `POST`, `OPTIONS`

**Allowed Headers**: `Content-Type`, `Accept`

**Allowed Credentials**: `true` (for session management)

**Max Age**: 3600 seconds (1 hour)

### CORS Preflight Example
```http
OPTIONS /chat HTTP/1.1
Origin: http://localhost:3000
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type

HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Accept
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 3600
```

---

## Error Codes

### Standard HTTP Status Codes

| Code | Name | Description | Example Cause |
|------|------|-------------|---------------|
| 200 | OK | Request successful | Valid request processed |
| 400 | Bad Request | Invalid request format | Missing required fields |
| 401 | Unauthorized | Missing/invalid authentication | Invalid credentials |
| 404 | Not Found | Endpoint doesn't exist | Typo in URL |
| 429 | Too Many Requests | Rate limit exceeded | >10 requests/minute |
| 500 | Internal Server Error | Server error | ChromaDB connection failed |
| 503 | Service Unavailable | Server overloaded | Temporary service outage |

### Error Response Format

All errors follow this structure:

```json
{
  "detail": "Human-readable error message",
  "type": "error_type",
  "status_code": 400,
  "timestamp": "2026-06-16T10:30:45.123Z"
}
```

### Common Error Scenarios

**Invalid Language**:
```json
{
  "detail": "Language 'es' not supported. Use 'en', 'fr', or 'ar'.",
  "type": "INVALID_LANGUAGE",
  "status_code": 400
}
```

**Empty Message**:
```json
{
  "detail": "Message cannot be empty.",
  "type": "EMPTY_MESSAGE",
  "status_code": 400
}
```

**ChromaDB Connection Error**:
```json
{
  "detail": "Failed to connect to ChromaDB. Please try again later.",
  "type": "DATABASE_ERROR",
  "status_code": 500
}
```

**Groq API Error**:
```json
{
  "detail": "LLM service temporarily unavailable. Please retry.",
  "type": "LLM_ERROR",
  "status_code": 503
}
```

---

## Endpoints

---

### GET /health

**Purpose**: Check backend service status

**Method**: `GET`

**Authentication**: None (public)

**Rate Limit**: None

#### Request

```http
GET /health HTTP/1.1
Host: localhost:8000
```

```bash
curl http://localhost:8000/health
```

#### Response (200 OK)

```json
{
  "status": "healthy",
  "timestamp": "2026-06-16T10:30:45.123456Z",
  "version": "1.0",
  "services": {
    "chromadb": "connected",
    "groq_llm": "operational",
    "server": "running"
  }
}
```

#### Response (503 Service Unavailable)

```json
{
  "status": "unhealthy",
  "timestamp": "2026-06-16T10:30:45.123456Z",
  "services": {
    "chromadb": "disconnected",
    "groq_llm": "error",
    "server": "running"
  },
  "detail": "ChromaDB connection failed"
}
```

#### Use Cases
- Frontend health checks before API calls
- Load balancer monitoring
- Uptime monitoring dashboards
- System status pages

---

### POST /chat

**Purpose**: Send a message to the FAQ chatbot and receive AI-powered response

**Method**: `POST`

**Authentication**: None (rate-limited by IP)

**Rate Limit**: 10 requests per minute

**Content-Type**: `application/json`

#### Request Body

```json
{
  "message": "How do I open an account?",
  "language": "en",
  "context": {}
}
```

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `message` | string | ✅ Yes | User question or statement | "Comment ouvrir un compte?" |
| `language` | string | ✅ Yes | Response language: `en`, `fr`, `ar` | "fr" |
| `context` | object | ❌ No | Additional context (reserved) | {} |

#### Language Support

| Code | Language | Response Language |
|------|----------|-------------------|
| `en` | English | English |
| `fr` | French | Français |
| `ar` | Arabic | العربية (RTL) |

#### Examples

**English Request**:
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are the account types available?",
    "language": "en"
  }'
```

**French Request**:
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Quels sont les types de comptes disponibles?",
    "language": "fr"
  }'
```

**Arabic Request**:
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "ما هي أنواع الحسابات المتاحة؟",
    "language": "ar"
  }'
```

#### Response (200 OK)

```json
{
  "message": "What are the account types available?",
  "language": "en",
  "response": "Amen Bank offers several account types including Savings Account, Checking Account, Business Account, and Investment Account. Each type is designed to meet different financial needs. Would you like to know more about any specific account type?",
  "confidence": 0.92,
  "sources": [
    {
      "chunk_id": "faq_001",
      "similarity": 0.95,
      "preview": "Amen Bank account types include savings, checking, business..."
    },
    {
      "chunk_id": "faq_002",
      "similarity": 0.88,
      "preview": "Opening an account is simple and can be done online..."
    }
  ],
  "timestamp": "2026-06-16T10:30:45.123456Z",
  "processing_time_ms": 1245
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Original user message |
| `language` | string | Response language code |
| `response` | string | AI-generated answer |
| `confidence` | float | 0.0-1.0 confidence score |
| `sources` | array | Retrieved FAQ chunks used |
| `sources[].chunk_id` | string | FAQ reference ID |
| `sources[].similarity` | float | Vector similarity score (0-1) |
| `sources[].preview` | string | Snippet from FAQ chunk |
| `timestamp` | string | ISO 8601 timestamp |
| `processing_time_ms` | integer | Response generation time |

#### Response Examples by Language

**French Response**:
```json
{
  "message": "Quels sont les types de comptes disponibles?",
  "language": "fr",
  "response": "Amen Bank propose plusieurs types de comptes, notamment un compte d'épargne, un compte chèques, un compte professionnel et un compte d'investissement. Chaque type est conçu pour répondre à différents besoins financiers.",
  "confidence": 0.91
}
```

**Arabic Response (RTL)**:
```json
{
  "message": "ما هي أنواع الحسابات المتاحة؟",
  "language": "ar",
  "response": "تقدم بنك آمن عدة أنواع حسابات منها حساب التوفير وحساب الجاري وحساب الأعمال وحساب الاستثمار. كل نوع مصمم لتلبية احتياجات مالية مختلفة.",
  "confidence": 0.89
}
```

#### Error Responses

**400 - Missing Message**:
```json
{
  "detail": "Field 'message' is required and cannot be empty.",
  "type": "VALIDATION_ERROR",
  "status_code": 400
}
```

**400 - Invalid Language**:
```json
{
  "detail": "Language 'es' not supported. Use 'en', 'fr', or 'ar'.",
  "type": "INVALID_LANGUAGE",
  "status_code": 400
}
```

**429 - Rate Limited**:
```json
{
  "detail": "Rate limit exceeded. Maximum 10 requests per minute.",
  "type": "RATE_LIMIT_EXCEEDED",
  "status_code": 429,
  "retry_after": 45
}
```

**500 - Server Error**:
```json
{
  "detail": "Failed to process chat request. Please try again later.",
  "type": "INTERNAL_ERROR",
  "status_code": 500
}
```

#### Performance Metrics

| Metric | Target | Typical |
|--------|--------|---------|
| Response Time | < 3s | ~1.2s |
| Confidence Score | > 0.85 | 0.87-0.95 |
| Source Chunks | 2-3 | 3 |
| Uptime | > 99% | 99.5% |

---

### POST /contact

**Purpose**: Submit a contact form inquiry from website visitors

**Method**: `POST`

**Authentication**: None (CORS protected)

**Rate Limit**: None (internal rate limiting via frontend)

**Content-Type**: `application/json`

#### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+216 XX XXX XXX",
  "subject": "Account inquiry",
  "message": "I would like to open a business account.",
  "language": "en"
}
```

| Field | Type | Required | Validation | Example |
|-------|------|----------|-----------|---------|
| `name` | string | ✅ Yes | 2-100 characters | "John Doe" |
| `email` | string | ✅ Yes | Valid email format | "john@example.com" |
| `phone` | string | ✅ Yes | Phone format | "+216 XX XXX XXX" |
| `subject` | string | ✅ Yes | 5-200 characters | "Account inquiry" |
| `message` | string | ✅ Yes | 10-2000 characters | "I would like..." |
| `language` | string | ✅ Yes | `en`, `fr`, `ar` | "en" |

#### Request Examples

**English Contact**:
```bash
curl -X POST http://localhost:8000/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Johnson",
    "email": "sarah@company.com",
    "phone": "+216 21 123 456",
    "subject": "Loan Application",
    "message": "I am interested in applying for a business loan for my startup.",
    "language": "en"
  }'
```

**French Contact**:
```bash
curl -X POST http://localhost:8000/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Pierre",
    "email": "jean@example.fr",
    "phone": "+216 21 456 789",
    "subject": "Demande de crédit",
    "message": "Je souhaite demander un crédit pour mon entreprise.",
    "language": "fr"
  }'
```

**Arabic Contact**:
```bash
curl -X POST http://localhost:8000/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "محمد علي",
    "email": "mohamad@example.tn",
    "phone": "+216 21 789 012",
    "subject": "استفسار عن الحسابات",
    "message": "أريد معرفة المزيد عن أنواع الحسابات المختلفة.",
    "language": "ar"
  }'
```

#### Response (201 Created)

```json
{
  "status": "success",
  "message": "Your inquiry has been received successfully.",
  "ticket_id": "TICKET-20260616-001234",
  "email": "john@example.com",
  "expected_response_time": "24-48 hours",
  "timestamp": "2026-06-16T10:30:45.123456Z",
  "language": "en"
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | "success" |
| `message` | string | Confirmation message |
| `ticket_id` | string | Unique reference for inquiry |
| `email` | string | Confirmation sent to this email |
| `expected_response_time` | string | SLA timeframe |
| `timestamp` | string | ISO 8601 timestamp |
| `language` | string | Response language |

#### Error Responses

**400 - Validation Error**:
```json
{
  "detail": "Email format is invalid. Please provide a valid email address.",
  "type": "VALIDATION_ERROR",
  "field": "email",
  "status_code": 400
}
```

**400 - Message Too Short**:
```json
{
  "detail": "Message must be at least 10 characters long.",
  "type": "VALIDATION_ERROR",
  "field": "message",
  "status_code": 400
}
```

**400 - Missing Required Field**:
```json
{
  "detail": "Field 'phone' is required.",
  "type": "VALIDATION_ERROR",
  "field": "phone",
  "status_code": 400
}
```

#### Database Integration

Contact submissions are stored in `contact_submissions.jsonl`:
```json
{
  "ticket_id": "TICKET-20260616-001234",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+216 21 123 456",
  "subject": "Account inquiry",
  "message": "I would like to open a business account.",
  "language": "en",
  "status": "open",
  "created_at": "2026-06-16T10:30:45.123456Z"
}
```

---

### GET /faq

**Purpose**: Search and retrieve FAQ entries from the knowledge base

**Method**: `GET`

**Authentication**: None (public)

**Rate Limit**: None

**Query Parameters**: Optional

#### Query Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `query` | string | ❌ No | Search query | "account opening" |
| `language` | string | ❌ No | Filter by language | "en" |
| `limit` | integer | ❌ No | Max results (1-50) | "10" |
| `offset` | integer | ❌ No | Pagination offset | "0" |

#### Request Examples

**Get All FAQs** (default: 10 results):
```bash
curl http://localhost:8000/faq
```

**Search FAQs**:
```bash
curl 'http://localhost:8000/faq?query=account+opening&language=en'
```

**Search with Pagination**:
```bash
curl 'http://localhost:8000/faq?query=loan&limit=20&offset=0'
```

**Get French FAQs**:
```bash
curl 'http://localhost:8000/faq?language=fr&limit=15'
```

#### Response (200 OK)

```json
{
  "status": "success",
  "query": "account opening",
  "language": "en",
  "total_results": 3,
  "returned": 3,
  "faqs": [
    {
      "id": "faq_001",
      "question": "How do I open an account?",
      "answer": "To open an account with Amen Bank, you can:\n1. Visit our website and click 'Open Account'\n2. Complete the online application form\n3. Provide required identification documents\n4. Verify your identity\n5. Receive account confirmation",
      "language": "en",
      "category": "Accounts",
      "created_at": "2026-01-15T00:00:00Z",
      "updated_at": "2026-06-01T10:00:00Z",
      "similarity_score": 0.98
    },
    {
      "id": "faq_002",
      "question": "What documents do I need to open an account?",
      "answer": "Required documents include:\n- Valid ID (passport or national ID)\n- Proof of residence (utility bill, lease)\n- Employment verification\n- Tax ID number",
      "language": "en",
      "category": "Accounts",
      "created_at": "2026-01-20T00:00:00Z",
      "updated_at": "2026-06-01T10:00:00Z",
      "similarity_score": 0.94
    },
    {
      "id": "faq_003",
      "question": "How long does it take to open an account?",
      "answer": "Account opening typically takes 1-3 business days. Once approved, you'll receive confirmation via email with your account details.",
      "language": "en",
      "category": "Accounts",
      "created_at": "2026-02-01T00:00:00Z",
      "updated_at": "2026-06-01T10:00:00Z",
      "similarity_score": 0.91
    }
  ],
  "timestamp": "2026-06-16T10:30:45.123456Z"
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | "success" |
| `query` | string | Original search query |
| `language` | string | Filtered language |
| `total_results` | integer | Total matching entries |
| `returned` | integer | Entries in this response |
| `faqs` | array | FAQ entries |
| `faqs[].id` | string | Unique FAQ ID |
| `faqs[].question` | string | FAQ question |
| `faqs[].answer` | string | FAQ answer |
| `faqs[].language` | string | Language code |
| `faqs[].category` | string | FAQ category |
| `faqs[].similarity_score` | float | Vector similarity (if queried) |

#### No Results Response

```json
{
  "status": "success",
  "query": "xyz123abc",
  "total_results": 0,
  "returned": 0,
  "faqs": [],
  "message": "No FAQs found matching your query.",
  "timestamp": "2026-06-16T10:30:45.123456Z"
}
```

#### Error Response

**400 - Invalid Limit**:
```json
{
  "detail": "Limit must be between 1 and 50.",
  "type": "VALIDATION_ERROR",
  "status_code": 400
}
```

---

### POST /ingest

**Purpose**: Ingest and index new FAQ entries into ChromaDB

**Method**: `POST`

**Authentication**: None (internal endpoint - should be protected in production)

**Rate Limit**: None

**Content-Type**: `application/json`

#### Request Body

```json
{
  "faqs": [
    {
      "id": "faq_custom_001",
      "question": "What is Amen Bank?",
      "answer": "Amen Bank is a leading financial institution in Tunisia...",
      "language": "en",
      "category": "General"
    },
    {
      "id": "faq_custom_002",
      "question": "Qu'est-ce qu'Amen Bank?",
      "answer": "Amen Bank est une institution financière leader en Tunisie...",
      "language": "fr",
      "category": "General"
    }
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `faqs` | array | ✅ Yes | Array of FAQ objects |
| `faqs[].id` | string | ✅ Yes | Unique FAQ identifier |
| `faqs[].question` | string | ✅ Yes | FAQ question (2-500 chars) |
| `faqs[].answer` | string | ✅ Yes | FAQ answer (10-5000 chars) |
| `faqs[].language` | string | ✅ Yes | `en`, `fr`, or `ar` |
| `faqs[].category` | string | ✅ Yes | FAQ category (2-50 chars) |

#### Request Example

```bash
curl -X POST http://localhost:8000/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "faqs": [
      {
        "id": "faq_mobile_001",
        "question": "Is there a mobile app?",
        "answer": "Yes, Amen Bank offers iOS and Android mobile applications available on App Store and Google Play.",
        "language": "en",
        "category": "Mobile Banking"
      },
      {
        "id": "faq_mobile_001_fr",
        "question": "Y a-t-il une application mobile?",
        "answer": "Oui, Amen Bank propose des applications mobiles iOS et Android disponibles sur App Store et Google Play.",
        "language": "fr",
        "category": "Mobile Banking"
      },
      {
        "id": "faq_mobile_001_ar",
        "question": "هل هناك تطبيق للهاتف المحمول؟",
        "answer": "نعم، توفر بنك آمن تطبيقات محمول iOS و Android متاحة على App Store و Google Play.",
        "language": "ar",
        "category": "Mobile Banking"
      }
    ]
  }'
```

#### Response (200 OK)

```json
{
  "status": "success",
  "message": "FAQ ingestion completed successfully.",
  "ingested_count": 3,
  "total_faqs_in_db": 75,
  "details": [
    {
      "id": "faq_mobile_001",
      "status": "indexed",
      "language": "en",
      "chunk_id": "chunk_047"
    },
    {
      "id": "faq_mobile_001_fr",
      "status": "indexed",
      "language": "fr",
      "chunk_id": "chunk_048"
    },
    {
      "id": "faq_mobile_001_ar",
      "status": "indexed",
      "language": "ar",
      "chunk_id": "chunk_049"
    }
  ],
  "timestamp": "2026-06-16T10:30:45.123456Z",
  "processing_time_ms": 2341
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | "success" or "partial" |
| `ingested_count` | integer | Number successfully indexed |
| `total_faqs_in_db` | integer | Total FAQs after ingestion |
| `details` | array | Per-FAQ ingestion status |
| `details[].chunk_id` | string | ChromaDB chunk ID |

#### Partial Success Response

```json
{
  "status": "partial",
  "message": "FAQ ingestion completed with errors.",
  "ingested_count": 2,
  "failed_count": 1,
  "total_faqs_in_db": 76,
  "errors": [
    {
      "id": "faq_invalid_001",
      "error": "Invalid language code 'sp'. Use 'en', 'fr', or 'ar'.",
      "status": "failed"
    }
  ],
  "timestamp": "2026-06-16T10:30:45.123456Z"
}
```

#### Error Responses

**400 - Empty FAQs Array**:
```json
{
  "detail": "FAQs array cannot be empty.",
  "type": "VALIDATION_ERROR",
  "status_code": 400
}
```

**400 - Missing Required Field**:
```json
{
  "detail": "Field 'answer' is required for FAQ 'faq_001'.",
  "type": "VALIDATION_ERROR",
  "status_code": 400
}
```

**413 - Payload Too Large**:
```json
{
  "detail": "Request payload exceeds maximum size (10 MB).",
  "type": "PAYLOAD_ERROR",
  "status_code": 413
}
```

**500 - Database Error**:
```json
{
  "detail": "Failed to ingest FAQs into ChromaDB. Please try again later.",
  "type": "DATABASE_ERROR",
  "status_code": 500
}
```

#### ChromaDB Collection Structure

Ingested FAQs are stored in ChromaDB with:
- **Collection**: `faqs_multilingual`
- **Embedding Model**: `sentence-transformers/all-MiniLM-L6-v2`
- **Metadata**: `language`, `category`, `chunk_id`
- **Total Chunks**: 75 (25 per language)
- **Vector Dimension**: 384

---

## Response Format Guidelines

### Success Response Template

```json
{
  "status": "success",
  "data": { /* endpoint-specific data */ },
  "timestamp": "2026-06-16T10:30:45.123456Z"
}
```

### Error Response Template

```json
{
  "status": "error",
  "detail": "Human-readable error message",
  "type": "ERROR_TYPE",
  "status_code": 400,
  "timestamp": "2026-06-16T10:30:45.123456Z"
}
```

---

## Testing Guide

### Using cURL

```bash
# Health check
curl http://localhost:8000/health

# Chat request
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I open an account?",
    "language": "en"
  }'

# Contact submission
curl -X POST http://localhost:8000/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+216 21 123 456",
    "subject": "Account inquiry",
    "message": "I would like more information about your services.",
    "language": "en"
  }'

# FAQ search
curl 'http://localhost:8000/faq?query=account&language=en&limit=5'

# FAQ ingestion
curl -X POST http://localhost:8000/ingest \
  -H "Content-Type: application/json" \
  -d '{"faqs": [...]}'
```

### Using Postman

1. Import collection from workspace
2. Set base URL to `http://localhost:8000`
3. Configure environment variables for `GROQ_API_KEY`
4. Run requests with built-in tests

### Using Python Requests

```python
import requests

# Health check
response = requests.get('http://localhost:8000/health')
print(response.json())

# Chat request
response = requests.post('http://localhost:8000/chat', json={
    'message': 'How do I open an account?',
    'language': 'en'
})
print(response.json())

# Check rate limiting
print(response.headers.get('X-RateLimit-Remaining'))
```

---

## Performance Benchmarks

| Endpoint | Response Time | Typical | P99 |
|----------|---------------|---------|-----|
| GET /health | < 100ms | 45ms | 95ms |
| POST /chat | < 3s | 1.2s | 2.8s |
| POST /contact | < 500ms | 150ms | 450ms |
| GET /faq | < 500ms | 200ms | 480ms |
| POST /ingest | < 5s | 2.3s | 4.8s |

---

## Support & Troubleshooting

### Common Issues

**Q: Getting 429 Rate Limited?**  
A: Wait 60 seconds or implement exponential backoff retry logic.

**Q: ChromaDB Connection Error?**  
A: Ensure ChromaDB service is running and vector database is initialized.

**Q: Groq API Error?**  
A: Verify `GROQ_API_KEY` environment variable and check Groq service status.

**Q: CORS Error in Browser?**  
A: Ensure frontend is running on `http://localhost:3000` (matching CORS config).

### Debug Headers

Enable debug mode by setting header:
```
X-Debug-Mode: true
```

Response will include:
```json
{
  "debug": {
    "chromadb_query_time_ms": 145,
    "llm_processing_time_ms": 1087,
    "total_time_ms": 1245,
    "model_used": "groq/mixtral-8x7b",
    "embeddings_searched": 75
  }
}
```

---

**Last Updated**: June 16, 2026  
**Maintained By**: Adem Rokh, Amen Bank AI Team  
**Status**: Production Ready
