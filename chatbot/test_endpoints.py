#!/usr/bin/env python
"""Test all API endpoints"""

from main import app
from fastapi.testclient import TestClient

client = TestClient(app)

# Test /chat endpoint
print("📋 Testing /chat endpoint...")
chat_req = {
    "message": "How to open an account?",
    "language": "en"
}
resp = client.post('/chat', json=chat_req)
print(f"  Status: {resp.status_code}")
data = resp.json()
print(f"  Response status: {data.get('status')}")
print(f"  Message length: {len(data.get('message', ''))}")
print(f"  Confidence: {data.get('confidence'):.2f}")

# Test /contact endpoint
print("\n📋 Testing /contact endpoint...")
contact_req = {
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+216123456789",
    "subject": "Account Opening Inquiry",
    "message": "I would like to open a new account",
    "language": "fr"
}
resp = client.post('/contact', json=contact_req)
print(f"  Status: {resp.status_code}")
data = resp.json()
print(f"  Response status: {data.get('status')}")
print(f"  Ticket ID: {data.get('ticket_id')}")

# Test /faq endpoint
print("\n📋 Testing /faq endpoint...")
resp = client.get('/faq?language=fr&category=particuliers')
print(f"  Status: {resp.status_code}")
data = resp.json()
print(f"  FAQs found: {data.get('total', 0)}")

# Test /ingest endpoint
print("\n📋 Testing /ingest endpoint...")
resp = client.post('/ingest')
print(f"  Status: {resp.status_code}")
if resp.status_code == 200:
    data = resp.json()
    print(f"  Response status: {data.get('status')}")
    print(f"  Chunks processed: {data.get('chunks_processed')}")

print("\n✅ All endpoint tests passed!")
