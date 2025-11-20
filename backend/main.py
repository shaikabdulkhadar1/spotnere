from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Spotnere API",
    description="API for Spotnere place discovery platform",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:8080",
        "https://spotnere.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase connection
def get_supabase_client() -> Client:
    """Create and return a Supabase client instance"""
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    
    if not supabase_url:
        raise ValueError("SUPABASE_URL environment variable is not set")
    if not supabase_key:
        raise ValueError("SUPABASE_KEY environment variable is not set")
    
    return create_client(supabase_url, supabase_key)

# Initialize Supabase client
supabase: Client = get_supabase_client()

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Spotnere API",
        "version": "1.0.0",
        "status": "running",
        "supabase_connected": supabase is not None,
    }

@app.get("/api/places")
async def get_all_places():
    """Get all places from the places table in Supabase"""
    try:
        # Fetch all visible places from Supabase
        response = supabase.table("places").select("*").eq("visible", True).execute()
        
        if not response.data:
            return {
                "success": True,
                "data": [],
                "count": 0,
            }
        
        return {
            "success": True,
            "data": response.data,
            "count": len(response.data),
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching places from Supabase: {str(e)}",
        )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test Supabase connection by making a simple query
        result = supabase.table("places").select("id").limit(1).execute()
        return {
            "status": "healthy",
            "service": "spotnere-api",
            "supabase": "connected",
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "spotnere-api",
            "supabase": "disconnected",
            "error": str(e),
        }

if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,
    )
