![Amen Bank Logo](https://b2b.tn/files/2020/12/amen-bank.jpg)
# Amen Bank AI Digital Solution - Technical README

**Version**: 1.0  
**Last Updated**: June 2026  
**Status**: Production Ready (Post-UAT)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Prerequisites](#prerequisites)
5. [Setup Instructions](#setup-instructions)
6. [Running Locally](#running-locally)
7. [Running Tests](#running-tests)
8. [Project Structure](#project-structure)
9. [API Reference](#api-reference)
10. [Troubleshooting](#troubleshooting)
11. [Contributing](#contributing)

---

## Project Overview

**Amen Bank AI Digital Solution** is a modern, multilingual banking website with an AI-powered chatbot built on a Retrieval-Augmented Generation (RAG) architecture.

### Key Features

- ✅ **Multilingual Support**: English, French, Arabic (with RTL support)
- ✅ **AI-Powered Chatbot**: RAG-based system using Groq LLM
- ✅ **7 Production Routes**: Homepage, Agencies, Contact, FAQ, + language variants
- ✅ **Form Validation**: Contact submissions with ticket generation
- ✅ **Accessibility**: WCAG 2.1 AA compliant
- ✅ **Performance**: <3s load time, optimized for mobile
- ✅ **Comprehensive Testing**: 135+ tests (unit, integration, E2E)
- ✅ **RAG Pipeline**: ChromaDB vector search + LangChain integration

---

## Tech Stack

### Frontend
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Next.js | 16.2.9 |
| Runtime | React | 19.2.4 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Build | Turbopack | Built-in |
| Testing | Playwright | 1.40.0 |
| Icons | Lucide React | 1.18.0 |

**Status**: Development/Local only

### Backend
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | FastAPI | 0.104.1 |
| Server | Uvicorn | 0.24.0 |
| Language | Python | 3.14+ |
| Validation | Pydantic | 2.5.0 |
| Vector DB | ChromaDB | 1.5.9 |
| Embeddings | Sentence Transformers | 2.2.2 |
| LLM | Groq | 0.4.2 |
| RAG | LangChain | 0.1.10 |
| Rate Limiting | SlowAPI | 0.1.10 |
| CORS | FastAPI CORS | Built-in |

**Status**: Development/Local only

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────┐
│           FRONTEND (Next.js 16.2.9)                │
│  ┌─────────────────────────────────────────────┐   │
│  │ Routes: /, /fr, /ar, /agencies, /contact, /faq │
│  │ Components: 11 React components + chatbot    │   │
│  │ Testing: 94+ Playwright E2E tests            │   │
│  └─────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP/REST
                       ▼
┌─────────────────────────────────────────────────────┐
│         BACKEND (FastAPI 0.104.1)                  │
│  ┌──────────────────────────────────────────────┐  │
│  │ 5 Production Endpoints:                      │  │
│  │ • POST /chat       (RAG chatbot)             │  │
│  │ • GET /health      (Status check)            │  │
│  │ • POST /contact    (Form submissions)        │  │
│  │ • GET /faq         (FAQ retrieval)           │  │
│  │ • POST /ingest     (FAQ indexing)            │  │
│  │                                              │  │
│  │ Middleware: CORS, Rate Limiting, Auth       │  │
│  └──────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   ┌────────┐   ┌─────────────┐  ┌────────┐
   │ChromaDB│   │LangChain +  │  │File DB │
   │Vector  │   │Groq LLM     │  │(JSONL) │
   │Search  │   │             │  │        │
   └────────┘   └─────────────┘  └────────┘
```

### Data Flow: Chat Request

```
1. User Query (Frontend)
         ▼
2. POST /chat endpoint (Backend)
         ▼
3. Query Embedding (Sentence Transformers)
         ▼
4. ChromaDB Vector Similarity Search
         ▼
5. Retrieve Top-K FAQ Chunks (k=3)
         ▼
6. Format Context with Metadata
         ▼
7. LangChain RAG Chain (Groq LLM)
         ▼
8. Generate Response + Metadata
         ▼
9. Return to Frontend
         ▼
10. Display in Chatbot Widget
```

---

## Prerequisites

### System Requirements
- **OS**: Windows, macOS, Linux
- **RAM**: 4GB minimum (8GB recommended)
- **Disk**: 5GB free space

### Required Software

#### Frontend
```bash
Node.js >= 18.0
npm >= 9.0
```

#### Backend
```bash
Python >= 3.14
pip >= 23.0
```

### API Keys
- **Groq API Key**: Free from https://console.groq.com
  - Set as environment variable: `GROQ_API_KEY`

---

## Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/amen-bank/amen-bank-new.git
cd amen-bank-new
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local (optional, if needed)
# No env variables required for basic setup

# Verify setup
npm run build  # Should complete without errors
```

### 3. Backend Setup

```bash
cd chatbot

# Create Python virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set Groq API key (optional for testing)
export GROQ_API_KEY="your-key-here"  # Linux/Mac
set GROQ_API_KEY=your-key-here       # Windows

# Verify setup
python -c "import fastapi; print(fastapi.__version__)"  # Should print 0.104.1
```

---

## Running Locally

### Terminal 1: Start Backend

```bash
cd chatbot

# Activate virtual environment
source .venv/bin/activate  # or .venv\Scripts\activate on Windows

# Start FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Expected output:
# Uvicorn running on http://127.0.0.1:8000
# Press CTRL+C to quit
```

**Backend is now running on**: `http://localhost:8000`

Available endpoints:
- `GET http://localhost:8000/` - Root endpoint
- `GET http://localhost:8000/health` - Health check
- `POST http://localhost:8000/chat` - Chatbot
- `GET http://localhost:8000/faq` - FAQ list
- `POST http://localhost:8000/contact` - Contact form
- `POST http://localhost:8000/ingest` - FAQ ingestion

### Terminal 2: Start Frontend

```bash
cd frontend

# Start Next.js dev server
npm run dev

# Expected output:
# ▲ Next.js 16.2.9
# - Local: http://localhost:3000
# ✓ Ready in 2.5s
```

**Frontend is now running on**: `http://localhost:3000`

### Access Application

Open browser to: **http://localhost:3000**

---

## Running Tests

### Backend Tests

```bash
cd chatbot

# Activate virtual environment
source .venv/bin/activate

# Run unit tests (RAG chain)
pytest test_rag.py -v

# Run integration tests (endpoints)
pytest test_integration.py -v

# Run all backend tests
pytest test_*.py -v

# Generate coverage report
pytest --cov=. test_*.py
```

**Expected**: 41 tests passing (13 unit + 28 integration)

### Frontend Tests

```bash
cd frontend

# Install Playwright browsers (first time only)
npx playwright install

# Run all E2E tests
npm run test:e2e

# Run with UI mode (visual inspection)
npm run test:e2e:ui

# Run specific test file
npx playwright test tests/e2e/homepage.spec.ts

# Run with debug mode
npm run test:e2e:debug

# View test results
npx playwright show-report
```

**Expected**: 94+ tests passing across all routes and languages

---

## Project Structure

```
amen-bank-new/
├── frontend/                          # Next.js frontend
│   ├── app/                          # Next.js app directory
│   │   ├── page.tsx                  # Homepage
│   │   ├── layout.tsx                # Root layout
│   │   ├── globals.css               # Global styles
│   │   ├── agencies/page.tsx          # Agency Locator page
│   │   ├── contact/page.tsx           # Contact form page
│   │   └── faq/page.tsx               # FAQ page
│   │
│   ├── components/                    # Reusable React components
│   │   ├── AgencyLocator/             # Agency locator component
│   │   ├── Chatbot/                   # Chatbot widget
│   │   ├── Contact/                   # Contact form
│   │   ├── FAQ/                       # FAQ accordion
│   │   ├── Homepage/                  # Hero + Products
│   │   ├── Layout/                    # Header + Footer
│   │   └── Map/                       # Map component
│   │
│   ├── lib/                           # Utilities
│   ├── tests/e2e/                    # Playwright E2E tests (94+ tests)
│   │   ├── homepage.spec.ts          # 11 tests
│   │   ├── agencies.spec.ts          # 7 tests
│   │   ├── contact.spec.ts           # 14 tests
│   │   ├── faq.spec.ts               # 13 tests
│   │   ├── navigation.spec.ts        # 15 tests
│   │   ├── chatbot.spec.ts           # 17 tests
│   │   ├── accessibility.spec.ts     # 17 tests
│   │   └── README.md                 # Test documentation
│   │
│   ├── package.json                  # Frontend dependencies
│   ├── playwright.config.ts          # Playwright configuration
│   ├── tsconfig.json                 # TypeScript configuration
│   └── README.md                     # Frontend README
│
├── chatbot/                           # FastAPI backend
│   ├── main.py                       # FastAPI application (440+ lines)
│   │   ├── Language enum
│   │   ├── Pydantic models
│   │   ├── 5 endpoints
│   │   ├── Middleware (CORS, rate limiting)
│   │   └── Startup event
│   │
│   ├── rag_chain.py                  # LangChain RAG implementation (320+ lines)
│   │   ├── AmenBankRAGChain class
│   │   ├── SYSTEM_PROMPTS (3 languages)
│   │   ├── create_rag_chain() factory
│   │   └── Response generation
│   │
│   ├── services/
│   │   ├── chromadb_manager.py       # ChromaDB integration (410+ lines)
│   │   │   ├── ChromaDBManager class
│   │   │   ├── ChromaDBSetup utility
│   │   │   ├── Collection operations
│   │   │   └── Query functionality
│   │   └── __init__.py
│   │
│   ├── ingest_faqs.py                # FAQ ingestion pipeline
│   │   └── Transforms 25 FAQs → 75 chunks (FR/AR/EN)
│   │
│   ├── test_rag.py                   # Unit tests (13 tests)
│   │   ├── TestRAGChain
│   │   ├── TestChromaDBManager
│   │   └── TestLanguageValidation
│   │
│   ├── test_integration.py           # Integration tests (28 tests)
│   │   ├── TestHealthEndpoint
│   │   ├── TestChatEndpoint
│   │   ├── TestContactEndpoint
│   │   ├── TestFAQEndpoint
│   │   ├── TestIngestEndpoint
│   │   ├── TestRootEndpoint
│   │   └── TestErrorHandling
│   │
│   ├── chroma_data/                  # Vector database storage
│   │   └── chroma.sqlite3
│   │
│   ├── faq_ingestion_state.json      # Serialized FAQ chunks
│   ├── contact_submissions.jsonl     # Contact form submissions log
│   ├── requirements.txt              # Python dependencies
│   └── .venv/                        # Virtual environment
│
├── faq_knowledge_base.json           # Master FAQ data (25 FAQs)
├── UAT_PLAN.md                       # User Acceptance Testing plan
├── UAT_CHECKLIST.md                  # Quick UAT reference
├── UAT_COMMUNICATION.md              # UAT email templates
├── BUG_REPORT_TEMPLATE.md            # Bug reporting guide
├── TASK_28_UAT_GUIDE.md              # UAT implementation guide
└── README.md                         # Project overview
```

---

## API Reference

### Base URL
```
http://localhost:8000
```

### Endpoints

#### 1. GET /health
**Status Check**

```bash
curl http://localhost:8000/health
```

**Response** (200 OK):
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "database": "chromadb",
  "language_support": ["fr", "ar", "en"],
  "timestamp": "2026-06-16T10:30:00Z"
}
```

---

#### 2. POST /chat
**RAG-Powered Chatbot** (Rate limited: 10/minute)

**Request**:
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d {
    "message": "How do I open an account?",
    "language": "en"
  }
```

**Response** (200 OK):
```json
{
  "status": "success",
  "message": "To open an account, you can visit any of our 6 branches...",
  "language": "en",
  "sources": [
    {"title": "Account Opening", "relevance": 0.95},
    {"title": "Document Requirements", "relevance": 0.87}
  ],
  "confidence": 0.89,
  "timestamp": "2026-06-16T10:30:00Z"
}
```

**Languages**: `en`, `fr`, `ar`

---

#### 3. POST /contact
**Contact Form Submission**

**Request**:
```bash
curl -X POST http://localhost:8000/contact \
  -H "Content-Type: application/json" \
  -d {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+216123456789",
    "subject": "Account Inquiry",
    "message": "I have a question about...",
    "language": "en"
  }
```

**Response** (200 OK):
```json
{
  "status": "success",
  "message": "Thank you for contacting us. Your ticket has been created.",
  "ticket_id": "TKT-1623484200000-a7f8b2c",
  "timestamp": "2026-06-16T10:30:00Z"
}
```

---

#### 4. GET /faq
**FAQ Retrieval**

**Request**:
```bash
curl "http://localhost:8000/faq?language=en&category=particuliers"
```

**Response** (200 OK):
```json
{
  "status": "success",
  "language": "en",
  "total": 25,
  "faqs": [
    {
      "id": "faq-001",
      "question": "How do I open a bank account?",
      "answer": "You can open an account by...",
      "category": "particuliers",
      "tags": ["accounts", "documents"]
    },
    ...
  ],
  "timestamp": "2026-06-16T10:30:00Z"
}
```

---

#### 5. POST /ingest
**FAQ Ingestion/Indexing**

**Request**:
```bash
curl -X POST http://localhost:8000/ingest
```

**Response** (200 OK):
```json
{
  "status": "success",
  "message": "FAQ ingestion completed successfully",
  "chunks_processed": 75,
  "languages": ["fr", "ar", "en"],
  "timestamp": "2026-06-16T10:30:00Z"
}
```

---



## Troubleshooting

### Frontend Issues

#### Issue: "Port 3000 already in use"
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

#### Issue: Chatbot widget not showing
- Check that backend is running (`http://localhost:8000/health`)
- Check browser console for CORS errors
- Verify `baseURL` in `playwright.config.ts` is correct

#### Issue: Tests fail with "Browser not found"
```bash
cd frontend
npx playwright install chromium firefox
npm run test:e2e
```

---

### Backend Issues

#### Issue: "ModuleNotFoundError: No module named 'fastapi'"
```bash
# Activate virtual environment first
source .venv/bin/activate  # or .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

#### Issue: "ChromaDB error: database locked"
- Close any other connections to `chroma_data/chroma.sqlite3`
- Delete `chroma_data/` and restart to rebuild:
```bash
rm -rf chatbot/chroma_data/
python main.py  # Will recreate on startup
```

#### Issue: Groq API not working
```bash
# Verify API key is set
echo $GROQ_API_KEY  # Should print your key

# If not set:
export GROQ_API_KEY="your-key-from-console.groq.com"

# Restart backend
uvicorn main:app --reload
```

#### Issue: Rate limiting (429 Too Many Requests)
- /chat endpoint limited to 10 requests/minute per IP
- Wait 1 minute or use a different IP

---

### Database Issues

#### Rebuild ChromaDB Collection
```bash
cd chatbot

# Delete existing database
rm -rf chroma_data/

# Reingest FAQs
python -c "from main import app; app.state.rag_chain"

# Or via API
curl -X POST http://localhost:8000/ingest
```

#### View Ingestion State
```bash
python -c "import json; print(json.dumps(json.load(open('faq_ingestion_state.json')), indent=2))"
```

---

## Contributing

### Code Style
- **Frontend**: TypeScript strict mode
- **Backend**: PEP 8 (use `black` formatter)

### Before Committing
```bash
# Frontend
cd frontend
npm run lint
npm run build

# Backend
cd chatbot
black *.py
pytest test_*.py -v
```

### Adding New Features
1. Create feature branch: `git checkout -b feature/description`
2. Write tests first (TDD)
3. Implement feature
4. Run full test suite
5. Submit pull request

---

## Support & Documentation

### Key Documents
- [UAT_PLAN.md](UAT_PLAN.md) - User Acceptance Testing strategy
- [UAT_CHECKLIST.md](UAT_CHECKLIST.md) - Quick testing reference
- [BUG_REPORT_TEMPLATE.md](BUG_REPORT_TEMPLATE.md) - How to report bugs
- [TASK_28_UAT_GUIDE.md](TASK_28_UAT_GUIDE.md) - UAT execution guide

### Contact
- **Technical Issues**: technical-support@amen-bank.tn
- **Project Lead**: project-lead@amen-bank.tn
- **Emergencies**: [Emergency hotline]

---

## License

Proprietary - Amen Bank 2026

---

**Last Updated**: June 2026  
**Maintained By**: Amen Bank Engineering Team  
**Status**: ✅ Production Ready
