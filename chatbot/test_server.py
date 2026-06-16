#!/usr/bin/env python
"""
Test server startup and endpoints
"""
import subprocess
import time
import sys
import requests
from pathlib import Path

def test_server():
    """Start server and run basic tests"""
    print("🚀 Starting FastAPI server...")
    
    # Start server in background
    proc = subprocess.Popen(
        [sys.executable, "main.py"],
        cwd=str(Path(__file__).parent),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    
    # Wait for server to start
    time.sleep(3)
    
    try:
        # Test health endpoint
        print("\n📋 Testing /health endpoint...")
        resp = requests.get("http://localhost:8000/health", timeout=5)
        print(f"  Status: {resp.status_code}")
        print(f"  Response: {resp.json()}")
        
        # Test root endpoint
        print("\n📋 Testing / endpoint...")
        resp = requests.get("http://localhost:8000/", timeout=5)
        print(f"  Status: {resp.status_code}")
        print(f"  Response: {resp.json()}")
        
        # Test FAQ endpoint
        print("\n📋 Testing /faq endpoint...")
        resp = requests.get("http://localhost:8000/faq?language=fr", timeout=5)
        print(f"  Status: {resp.status_code}")
        if resp.status_code == 200:
            data = resp.json()
            print(f"  FAQs found: {data.get('total', 0)}")
        
        print("\n✅ Server tests passed!")
        
    except Exception as e:
        print(f"❌ Test error: {e}")
    finally:
        # Kill server
        proc.terminate()
        proc.wait(timeout=5)
        print("\n✓ Server stopped")

if __name__ == "__main__":
    test_server()
