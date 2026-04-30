from fastapi import FastAPI, HTTPException, Query, Depends, Header
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from supabase import create_client, Client
from dotenv import load_dotenv
import os
import hashlib
import hmac
import jwt
import razorpay
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
        "https://www.spotnere.com",
        "https://spotnere.com",
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

# Initialize Razorpay client
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))


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

class CreateBookingRequest(BaseModel):
    place_id: str
    booking_date_time: str
    number_of_guests: int = 1


@app.post("/api/bookings")
async def create_booking(body: CreateBookingRequest, user=Depends(get_current_user)):
    """Create a Razorpay order for the booking. No DB row yet — that happens after payment."""
    import uuid

    try:
        place_resp = (
            supabase.table("places")
            .select("id, avg_price, name")
            .eq("id", body.place_id)
            .single()
            .execute()
        )
        if not place_resp.data:
            raise HTTPException(status_code=404, detail="Place not found")

        avg_price = float(place_resp.data.get("avg_price") or 0)
        amount = round(avg_price * body.number_of_guests, 2)
        amount_paise = int(amount * 100)

        booking_ref = f"SPT-{uuid.uuid4().hex[:8].upper()}"

        razorpay_order = razorpay_client.order.create({
            "amount": amount_paise,
            "currency": "INR",
            "receipt": booking_ref,
            "notes": {
                "place_id": body.place_id,
                "user_id": user["id"],
                "guests": body.number_of_guests,
            },
        })

        return {
            "success": True,
            "razorpay_order_id": razorpay_order["id"],
            "razorpay_key_id": RAZORPAY_KEY_ID,
            "amount": amount_paise,
            "amount_paid": amount,
            "booking_ref": booking_ref,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Booking failed: {str(e)}")


class VerifyPaymentRequest(BaseModel):
    place_id: str
    booking_date_time: str
    number_of_guests: int
    booking_ref: str
    amount_paid: float
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


@app.post("/api/bookings/verify")
async def verify_booking_payment(body: VerifyPaymentRequest, user=Depends(get_current_user)):
    """Verify Razorpay signature, then insert the booking row on success."""
    try:
        generated_signature = hmac.new(
            RAZORPAY_KEY_SECRET.encode("utf-8"),
            f"{body.razorpay_order_id}|{body.razorpay_payment_id}".encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()

        if not hmac.compare_digest(generated_signature, body.razorpay_signature):
            raise HTTPException(status_code=400, detail="Invalid payment signature")

        row = {
            "user_id": user["id"],
            "place_id": body.place_id,
            "booking_date_time": body.booking_date_time,
            "booking_ref_number": body.booking_ref,
            "amount_paid": body.amount_paid,
            "currency_paid": "INR",
            "razorpay_order_id": body.razorpay_order_id,
            "razorpay_payment_id": body.razorpay_payment_id,
            "razorpay_signature": body.razorpay_signature,
            "transaction_id": body.razorpay_payment_id,
            "payment_status": "SUCCESS",
            "payment_method": "razorpay",
            "paid_at": datetime.now(timezone.utc).isoformat(),
            "booking_status": "CONFIRMED",
            "number_of_guests": body.number_of_guests,
        }

        response = supabase.table("bookings").insert(row).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create booking")

        return {"success": True, "data": response.data[0]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Payment verification failed: {str(e)}")


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

# ── OpenGraph HTML for social crawlers ────────────────────────────────────────

@app.get("/og/place/{place_id}", include_in_schema=False)
async def og_place(place_id: str):
    """Return a minimal HTML page with OpenGraph meta tags for a place.
    This is served to social media crawlers via Vercel conditional rewrites."""
    site_url = os.getenv("SITE_BASE_URL", "https://www.spotnere.com")

    try:
        response = (
            supabase.table("places")
            .select("id, name, description, banner_image_link, city, state, country, category, rating, avg_price")
            .eq("id", place_id)
            .eq("visible", True)
            .single()
            .execute()
        )
        place = response.data
    except Exception:
        place = None

    if not place:
        title = "Place not found — Spotnere"
        description = "Discover amazing places near you with Spotnere."
        image = f"{site_url}/logo.png"
        url = site_url
    else:
        title = f"{place['name']} — Spotnere"

        info_parts = []
        if place.get("rating"):
            info_parts.append(f"⭐ {place['rating']}")
        if place.get("avg_price"):
            info_parts.append(f"💰 ₹{place['avg_price']}")
        location_parts = [place.get("city"), place.get("state")]
        location = ", ".join(p for p in location_parts if p)
        if location:
            info_parts.append(f"📍 {location}")
        info_line = " | ".join(info_parts)

        desc_text = place.get("description") or ""
        if not desc_text:
            parts = [place.get("category"), place.get("city"), place.get("country")]
            desc_text = "Discover " + ", ".join(p for p in parts if p) + " on Spotnere."

        description = f"{info_line}\n{desc_text}" if info_line else desc_text
        if len(description) > 200:
            description = description[:197] + "..."

        image = place.get("banner_image_link") or f"{site_url}/logo.png"
        url = f"{site_url}/place/{place['id']}"

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>{title}</title>
    <meta name="description" content="{description}" />

    <meta property="og:type" content="website" />
    <meta property="og:title" content="{title}" />
    <meta property="og:description" content="{description}" />
    <meta property="og:image" content="{image}" />
    <meta property="og:url" content="{url}" />
    <meta property="og:site_name" content="Spotnere" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@spotnere" />
    <meta name="twitter:title" content="{title}" />
    <meta name="twitter:description" content="{description}" />
    <meta name="twitter:image" content="{image}" />

    <link rel="canonical" href="{url}" />
</head>
<body>
    <p>{title}</p>
</body>
</html>"""

    return Response(content=html, media_type="text/html")


# ── Sitemap & Robots.txt ─────────────────────────────────────────────────────

SITE_BASE_URL = os.getenv("SITE_BASE_URL", "https://www.spotnere.com")
_sitemap_cache: dict = {"xml": None, "generated_at": None}
SITEMAP_CACHE_TTL_SECONDS = 3600


def _build_sitemap_xml() -> str:
    """Generate sitemap XML with static pages and all visible place pages."""
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    static_pages = [
        {"loc": "/", "changefreq": "daily", "priority": "1.0"},
        {"loc": "/about", "changefreq": "monthly", "priority": "0.5"},
        {"loc": "/contact", "changefreq": "monthly", "priority": "0.5"},
    ]

    urls = []
    for page in static_pages:
        urls.append(
            f"  <url>\n"
            f"    <loc>{SITE_BASE_URL}{page['loc']}</loc>\n"
            f"    <lastmod>{now}</lastmod>\n"
            f"    <changefreq>{page['changefreq']}</changefreq>\n"
            f"    <priority>{page['priority']}</priority>\n"
            f"  </url>"
        )

    try:
        response = (
            supabase.table("places")
            .select("id, updated_at")
            .eq("visible", True)
            .execute()
        )
        places = response.data or []
    except Exception:
        places = []

    for place in places:
        lastmod = now
        if place.get("updated_at"):
            try:
                lastmod = place["updated_at"][:10]
            except (TypeError, IndexError):
                pass
        urls.append(
            f"  <url>\n"
            f"    <loc>{SITE_BASE_URL}/place/{place['id']}</loc>\n"
            f"    <lastmod>{lastmod}</lastmod>\n"
            f"    <changefreq>weekly</changefreq>\n"
            f"    <priority>0.8</priority>\n"
            f"  </url>"
        )

    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(urls) + "\n"
        "</urlset>\n"
    )
    return xml


@app.get("/sitemap.xml", include_in_schema=False)
async def sitemap():
    """Serve a dynamic XML sitemap. Cached for 1 hour."""
    now = datetime.now(timezone.utc)
    if (
        _sitemap_cache["xml"] is None
        or _sitemap_cache["generated_at"] is None
        or (now - _sitemap_cache["generated_at"]).total_seconds() > SITEMAP_CACHE_TTL_SECONDS
    ):
        _sitemap_cache["xml"] = _build_sitemap_xml()
        _sitemap_cache["generated_at"] = now

    return Response(
        content=_sitemap_cache["xml"],
        media_type="application/xml",
        headers={"Cache-Control": "public, max-age=3600"},
    )


@app.get("/robots.txt", include_in_schema=False)
async def robots_txt():
    """Serve robots.txt with sitemap reference."""
    content = (
        "User-agent: *\n"
        "Allow: /\n"
        "Disallow: /favorites\n"
        "Disallow: /bookings\n"
        "Disallow: /profile\n"
        "Disallow: /login\n"
        "\n"
        f"Sitemap: {SITE_BASE_URL}/sitemap.xml\n"
    )
    return Response(content=content, media_type="text/plain")


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
