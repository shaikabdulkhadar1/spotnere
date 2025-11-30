from fastapi import FastAPI, HTTPException, Query
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
        "https://spotnere.vercel.app",
        "http://localhost:5173",
        "http://localhost:8080",
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
async def get_places(
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    category: str | None = None,
    city: str | None = None,
    country: str | None = None,
):
    """
    Get places from the `places` table in Supabase.

    Supports optional filters used by the frontend:
    - limit, offset
    - category, city, country (case-insensitive)
    """
    try:
        # Base query: only visible places
        query = (
            supabase.table("places")
            .select("*", count="exact")
            .eq("visible", True)
        )

        if category:
            query = query.ilike("category", f"%{category}%")
        if city:
            query = query.ilike("city", f"%{city}%")
        if country:
            query = query.ilike("country", f"%{country}%")

        # Apply pagination using range (Supabase is inclusive on the end index)
        start = offset
        end = offset + limit - 1
        query = query.range(start, end)

        response = query.execute()
        data = response.data or []
        count = getattr(response, "count", None) or len(data)

        return {
            "success": True,
            "data": data,
            "count": count,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching places from Supabase: {str(e)}",
        )


@app.get("/api/places/{place_id}")
async def get_place_by_id(place_id: str):
    """
    Get a single place by ID.
    Used by the Place Details page to show full information for a specific place.
    """
    try:
        response = (
            supabase.table("places")
            .select("*")
            .eq("id", place_id)
            .eq("visible", True)
            .single()
            .execute()
        )

        if not response.data:
            raise HTTPException(status_code=404, detail="Place not found")

        return {
            "success": True,
            "data": response.data,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching place: {str(e)}",
        )


@app.get("/api/places/{place_id}/gallery")
async def get_place_gallery(place_id: str):
    """
    Get all gallery images for a place from the gallery_images table.
    Returns gallery_image_url from Supabase storage.
    """
    try:
        response = (
            supabase.table("gallery_images")
            .select("gallery_image_url")
            .eq("place_id", place_id)
            .execute()
        )

        gallery_images = response.data or []
        # Extract just the URLs
        image_urls = [img.get("gallery_image_url") for img in gallery_images if img.get("gallery_image_url")]

        return {
            "success": True,
            "data": image_urls,
            "count": len(image_urls),
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching gallery images: {str(e)}",
        )


@app.get("/api/places/featured")
async def get_featured_places(limit: int = Query(10, ge=1, le=50)):
    """
    Get a list of featured places.

    If you have an `is_featured` column, this will prefer those rows.
    Otherwise, it falls back to highest-rated visible places.
    """
    try:
        table = supabase.table("places")

        # Try to use is_featured flag if it exists; if not, this will simply
        # behave like a normal query and we order by rating.
        query = (
            table.select("*")
            .eq("visible", True)
            .order("rating", desc=True)
            .limit(limit)
        )

        response = query.execute()
        data = response.data or []

        return {
            "success": True,
            "data": data,
            "count": len(data),
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching featured places: {str(e)}",
        )


@app.get("/api/places/search")
async def search_places(
    q: str = Query(..., min_length=1),
    limit: int = Query(20, ge=1, le=100),
):
    """
    Full-text style search across name, city, state, and country.
    Used by the frontend search API.
    """
    try:
        pattern = f"%{q}%"

        query = (
            supabase.table("places")
            .select("*", count="exact")
            .eq("visible", True)
            .or_(
                "name.ilike.{pattern},"
                "city.ilike.{pattern},"
                "state.ilike.{pattern},"
                "country.ilike.{pattern}".format(pattern=pattern)
            )
            .limit(limit)
        )

        response = query.execute()
        data = response.data or []
        count = getattr(response, "count", None) or len(data)

        return {
            "success": True,
            "data": data,
            "count": count,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error searching places: {str(e)}",
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
