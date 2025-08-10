from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:3000", "http://127.0.0.1:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.get("/test")
def test_endpoint():
    return {"status": "Backend is working!"}

if __name__ == "__main__":
    import uvicorn
    print("Starting server on port 8001...")
    uvicorn.run(app, host="127.0.0.1", port=8001) 