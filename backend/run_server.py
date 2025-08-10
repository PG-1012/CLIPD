import uvicorn
from main import app

if __name__ == "__main__":
    print("Starting FastAPI server on http://localhost:8000")
    print("Press Ctrl+C to stop the server")
    uvicorn.run(
        app, 
        host="127.0.0.1", 
        port=8000, 
        reload=True,
        log_level="info"
    ) 