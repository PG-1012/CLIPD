import uvicorn
from main import app

if __name__ == "__main__":
    print("🚀 Starting FastAPI server on http://localhost:8000")
    print("📰 API endpoint: http://localhost:8000/api/headlines?source=bbc")
    print("Press Ctrl+C to stop the server")
    
    uvicorn.run(
        app, 
        host="127.0.0.1", 
        port=8000, 
        log_level="info"
    ) 