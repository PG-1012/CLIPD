import requests
import json

def test_backend():
    try:
        print("Testing backend connection...")
        
        # Test basic connectivity
        response = requests.get("http://localhost:8000/api/headlines?source=bbc", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Backend is working!")
            print(f"Response: {json.dumps(data, indent=2)}")
        else:
            print(f"❌ Backend returned status code: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Cannot connect to backend on localhost:8000")
        print("Make sure the backend server is running!")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_backend() 