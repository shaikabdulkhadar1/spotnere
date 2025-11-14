from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from models import PlaceResponse, PlaceDetailResponse, ErrorResponse
from services.place_service import PlaceService
from config import settings

# Initialize FastAPI app
app = FastAPI(
    title="Spotnere API",
    description="API for Spotnere place discovery platform",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize service
place_service = PlaceService()


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Spotnere API",
        "version": "1.0.0",
        "status": "running",
    }


@app.get("/api/places", response_model=PlaceResponse)
async def get_places(
    limit: Optional[int] = Query(None, ge=1, le=100, description="Number of places to return"),
    offset: Optional[int] = Query(None, ge=0, description="Number of places to skip"),
    category: Optional[str] = Query(None, description="Filter by category"),
    city: Optional[str] = Query(None, description="Filter by city"),
    country: Optional[str] = Query(None, description="Filter by country"),
):
    """
    Get all places from the places table in Supabase with optional filters
    
    - **limit**: Maximum number of places to return (1-100)
    - **offset**: Number of places to skip (for pagination)
    - **category**: Filter by category (Cafe, Restaurant, Park, etc.)
    - **city**: Filter by city name
    - **country**: Filter by country name
    
    Example: GET /api/places?limit=10&category=Cafe&country=USA
    """
    try:
        places = place_service.get_all_places(
            limit=limit,
            offset=offset,
            category=category,
            city=city,
            country=country,
        )
        return PlaceResponse(success=True, data=places, count=len(places))
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid request: {str(e)}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching places from Supabase: {str(e)}",
        )


@app.get("/api/places/featured", response_model=PlaceResponse)
async def get_featured_places(
    limit: int = Query(10, ge=1, le=50, description="Number of featured places to return"),
):
    """
    Get featured places (high-rated places)
    
    - **limit**: Maximum number of featured places to return (1-50)
    """
    try:
        places = place_service.get_featured_places(limit=limit)
        return PlaceResponse(success=True, data=places, count=len(places))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching featured places: {str(e)}",
        )


@app.get("/api/places/{place_id}", response_model=PlaceDetailResponse)
async def get_place_by_id(place_id: str):
    """
    Get a single place by ID from the places table in Supabase
    
    - **place_id**: Unique identifier (UUID) of the place
    
    Returns the complete place details including:
    - Basic information (name, category, description)
    - Location (address, city, state, country, coordinates)
    - Ratings and reviews
    - Hours of operation
    - Amenities and tags
    - Contact information (phone, website)
    
    Example: GET /api/places/123e4567-e89b-12d3-a456-426614174000
    """
    try:
        if not place_id or not place_id.strip():
            raise HTTPException(
                status_code=400,
                detail="Place ID is required"
            )
        
        place = place_service.get_place_by_id(place_id.strip())
        
        if not place:
            raise HTTPException(
                status_code=404,
                detail=f"Place with ID '{place_id}' not found"
            )
        
        return PlaceDetailResponse(success=True, data=place)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching place from Supabase: {str(e)}",
        )


@app.get("/api/places/search", response_model=PlaceResponse)
async def search_places(
    q: str = Query(..., min_length=1, description="Search query"),
    limit: Optional[int] = Query(None, ge=1, le=100, description="Maximum number of results"),
):
    """
    Search places by name, description, or city
    
    - **q**: Search query string
    - **limit**: Maximum number of results to return (1-100)
    """
    try:
        places = place_service.search_places(search_query=q, limit=limit)
        return PlaceResponse(success=True, data=places, count=len(places))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error searching places: {str(e)}",
        )


@app.get("/api/places/category/{category}", response_model=PlaceResponse)
async def get_places_by_category(
    category: str,
    limit: Optional[int] = Query(None, ge=1, le=100, description="Maximum number of results"),
):
    """
    Get places filtered by category
    
    - **category**: Category name (Cafe, Restaurant, Park, Museum, Nightlife, Event, Other)
    - **limit**: Maximum number of results to return (1-100)
    """
    try:
        places = place_service.get_places_by_category(category=category, limit=limit)
        return PlaceResponse(success=True, data=places, count=len(places))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching places by category: {str(e)}",
        )


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "spotnere-api"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
    )

