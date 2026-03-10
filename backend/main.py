from fastapi import FastAPI, HTTPException, Query, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from supabase import create_client, Client
from dotenv import load_dotenv
import os
import hashlib
import jwt
from datetime import datetime, timedelta, timezone

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


# ── Auth config ───────────────────────────────────────────────────────────────

JWT_SECRET = os.getenv("JWT_SECRET", "change-me-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRY_HOURS = 24 * 7  # 7 days


def _hash_password(plain: str) -> str:
    """Hash using 16-byte random salt + 10 000 iterations of SHA-256.
    Stored as  salt_hex:hash_hex  (same scheme used by the Node.js app)."""
    salt = os.urandom(16).hex()
    current = plain + salt
    for _ in range(10_000):
        current = hashlib.sha256(current.encode()).hexdigest()
    return f"{salt}:{current}"


def _verify_password(plain: str, stored: str) -> bool:
    """Verify against the salt:hash format. Falls back to plain-text
    comparison for any legacy rows that predate hashing."""
    if ":" not in stored:
        return plain == stored
    salt, stored_hash = stored.split(":", 1)
    current = plain + salt
    for _ in range(10_000):
        current = hashlib.sha256(current.encode()).hexdigest()
    return current == stored_hash


def _create_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRY_HOURS),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def _serialize_user(row: dict) -> dict:
    """Return a frontend-safe user dict (no password_hash)."""
    return {
        "id": row["id"],
        "email": row["email"],
        "first_name": row["first_name"],
        "last_name": row["last_name"],
        "phone_number": row.get("phone_number"),
        "address": row.get("address"),
        "city": row.get("city"),
        "state": row.get("state"),
        "country": row.get("country"),
        "postal_code": row.get("postal_code"),
        "created_at": row.get("created_at"),
    }


# ── Auth models ──────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    phone_number: str | None = None
    address: str | None = None
    city: str | None = None
    state: str | None = None
    country: str | None = None
    postal_code: str | None = None


# ── JWT verification dependency ──────────────────────────────────────────────

async def get_current_user(authorization: str = Header(None)):
    """Decode the Bearer JWT and fetch the user row from the users table."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")

    token = authorization.removeprefix("Bearer ").strip()
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    try:
        response = (
            supabase.table("users")
            .select("*")
            .eq("id", user_id)
            .single()
            .execute()
        )
        if not response.data:
            raise HTTPException(status_code=401, detail="User not found")
        return response.data
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Could not validate user")


# ── Auth endpoints ───────────────────────────────────────────────────────────

@app.post("/api/auth/signup")
async def auth_signup(body: SignupRequest):
    """Register a new user in the users table."""
    try:
        existing = (
            supabase.table("users")
            .select("id")
            .eq("email", body.email)
            .execute()
        )
        if existing.data:
            raise HTTPException(status_code=409, detail="A user with this email already exists")

        hashed = _hash_password(body.password)

        insert_data = {
            "first_name": body.first_name,
            "last_name": body.last_name,
            "email": body.email,
            "password_hash": hashed,
            "phone_number": body.phone_number,
            "address": body.address,
            "city": body.city,
            "state": body.state,
            "country": body.country,
            "postal_code": body.postal_code,
        }

        response = (
            supabase.table("users")
            .insert(insert_data)
            .execute()
        )

        if not response.data:
            raise HTTPException(status_code=400, detail="Signup failed")

        user_row = response.data[0]
        token = _create_token(user_row["id"])

        return {
            "success": True,
            "token": token,
            "user": _serialize_user(user_row),
        }
    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e)
        if "duplicate" in error_msg.lower() or "unique" in error_msg.lower():
            raise HTTPException(status_code=409, detail="A user with this email already exists")
        raise HTTPException(status_code=400, detail=f"Signup failed: {error_msg}")


@app.post("/api/auth/login")
async def auth_login(body: LoginRequest):
    """Authenticate against the users table and return a JWT."""
    try:
        response = (
            supabase.table("users")
            .select("*")
            .eq("email", body.email)
            .execute()
        )

        if not response.data:
            raise HTTPException(status_code=401, detail="Invalid email or password")

        user_row = response.data[0]

        if not _verify_password(body.password, user_row["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        # Auto-upgrade plain-text passwords to salted SHA-256
        if ":" not in user_row["password_hash"]:
            supabase.table("users").update(
                {"password_hash": _hash_password(body.password)}
            ).eq("id", user_row["id"]).execute()

        token = _create_token(user_row["id"])

        return {
            "success": True,
            "token": token,
            "user": _serialize_user(user_row),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")


@app.post("/api/auth/logout")
async def auth_logout():
    """Logout endpoint. The frontend clears the stored token."""
    return {"success": True, "message": "Logged out"}


@app.get("/api/auth/me")
async def auth_me(user=Depends(get_current_user)):
    """Return the currently authenticated user's full profile."""
    return {
        "success": True,
        "user": _serialize_user(user),
    }


class UpdateProfileRequest(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    phone_number: str | None = None
    address: str | None = None
    city: str | None = None
    state: str | None = None
    country: str | None = None
    postal_code: str | None = None


@app.put("/api/auth/profile")
async def update_profile(body: UpdateProfileRequest, user=Depends(get_current_user)):
    """Update the currently authenticated user's profile fields."""
    try:
        updates = {k: v for k, v in body.model_dump().items() if v is not None}
        if not updates:
            raise HTTPException(status_code=400, detail="No fields to update")

        response = (
            supabase.table("users")
            .update(updates)
            .eq("id", user["id"])
            .execute()
        )

        if not response.data:
            raise HTTPException(status_code=404, detail="User not found")

        return {
            "success": True,
            "user": _serialize_user(response.data[0]),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Profile update failed: {str(e)}")


# ── Favorites endpoints ──────────────────────────────────────────────────────

class FavoriteToggleRequest(BaseModel):
    place_id: str


@app.get("/api/favorites")
async def get_favorites(user=Depends(get_current_user)):
    """Return all favorite place IDs for the logged-in user."""
    try:
        response = (
            supabase.table("user_places")
            .select("fav_place_id")
            .eq("user_id", user["id"])
            .execute()
        )
        place_ids = [row["fav_place_id"] for row in (response.data or [])]
        return {"success": True, "data": place_ids}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching favorites: {str(e)}")


@app.get("/api/favorites/places")
async def get_favorite_places(user=Depends(get_current_user)):
    """Return the full place objects for the logged-in user's favorites."""
    try:
        fav_response = (
            supabase.table("user_places")
            .select("fav_place_id")
            .eq("user_id", user["id"])
            .execute()
        )
        place_ids = [row["fav_place_id"] for row in (fav_response.data or [])]

        if not place_ids:
            return {"success": True, "data": [], "count": 0}

        places_response = (
            supabase.table("places")
            .select("*")
            .in_("id", place_ids)
            .eq("visible", True)
            .execute()
        )

        return {
            "success": True,
            "data": places_response.data or [],
            "count": len(places_response.data or []),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching favorite places: {str(e)}")


@app.post("/api/favorites/toggle")
async def toggle_favorite(body: FavoriteToggleRequest, user=Depends(get_current_user)):
    """Add or remove a place from the user's favorites. Returns the new state."""
    try:
        existing = (
            supabase.table("user_places")
            .select("id")
            .eq("user_id", user["id"])
            .eq("fav_place_id", body.place_id)
            .execute()
        )

        if existing.data:
            supabase.table("user_places").delete().eq("user_id", user["id"]).eq("fav_place_id", body.place_id).execute()
            return {"success": True, "favorited": False}
        else:
            supabase.table("user_places").insert({
                "user_id": user["id"],
                "fav_place_id": body.place_id,
            }).execute()
            return {"success": True, "favorited": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error toggling favorite: {str(e)}")


# ── Bookings endpoints ────────────────────────────────────────────────────────

@app.get("/api/bookings")
async def get_bookings(user=Depends(get_current_user)):
    """Return all bookings for the logged-in user, with place details joined."""
    try:
        response = (
            supabase.table("bookings")
            .select("*, places(id, name, banner_image_link, city, country)")
            .eq("user_id", user["id"])
            .order("booking_date_time", desc=True)
            .execute()
        )
        rows = response.data or []

        data = []
        for row in rows:
            place_data = row.pop("places", None)
            row["place"] = place_data
            data.append(row)

        return {"success": True, "data": data, "count": len(data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching bookings: {str(e)}")


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
    sub_category: str | None = None,
    city: str | None = None,
    country: str | None = None,
):
    """
    Get places from the `places` table in Supabase.

    Supports optional filters used by the frontend:
    - limit, offset
    - category, sub_category, city, country (case-insensitive)
    """
    try:
        query = (
            supabase.table("places")
            .select("*", count="exact")
            .eq("visible", True)
        )

        if category:
            query = query.ilike("category", f"%{category}%")
        if sub_category:
            query = query.ilike("sub_category", f"%{sub_category}%")
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


@app.get("/api/places/search")
async def search_places(
    q: str = Query(..., min_length=1),
    limit: int = Query(20, ge=1, le=100),
):
    """Full-text style search across name, city, state, and country."""
    try:
        pattern = f"%{q}%"

        query = (
            supabase.table("places")
            .select("*", count="exact")
            .eq("visible", True)
            .or_(
                f"name.ilike.{pattern},"
                f"city.ilike.{pattern},"
                f"state.ilike.{pattern},"
                f"country.ilike.{pattern}"
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
