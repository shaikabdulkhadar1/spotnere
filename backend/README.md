# Spotnere Backend API

FastAPI backend for the Spotnere place discovery platform with Supabase integration.

## Setup

1. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment variables:**

   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials:
     ```
     SUPABASE_URL=your_supabase_project_url
     SUPABASE_KEY=your_supabase_anon_key
     ```

3. **Run the server:**

   ```bash
   python main.py
   ```

   Or with uvicorn directly:

   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## Supabase Database Schema

The API expects a `places` table in Supabase with the following structure:

```sql
CREATE TABLE places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  banner_image_link VARCHAR(500),
  rating DECIMAL(3,2) DEFAULT 0,
  price_level INTEGER CHECK (price_level IN (1, 2, 3)),
  coordinates JSONB DEFAULT '{"lat": 0, "lng": 0}'::jsonb,
  address VARCHAR(255),
  city VARCHAR(100),
  country VARCHAR(100),
  distance_km DECIMAL(10,2),
  hours JSONB DEFAULT '[]'::jsonb,
  open_now BOOLEAN,
  amenities JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  website VARCHAR(255),
  phone VARCHAR(50),
  reviews_count INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX idx_places_category ON places(category);
CREATE INDEX idx_places_city ON places(city);
CREATE INDEX idx_places_rating ON places(rating DESC);
```

## API Endpoints

### Base URL

```
http://localhost:8000
```

### Endpoints

#### 1. Get All Places

```
GET /api/places
```

**Query Parameters:**

- `limit` (optional): Number of places to return (1-100)
- `offset` (optional): Number of places to skip
- `category` (optional): Filter by category
- `city` (optional): Filter by city

**Example:**

```bash
curl http://localhost:8000/api/places?limit=10&category=Cafe
```

#### 2. Get Featured Places

```
GET /api/places/featured
```

**Query Parameters:**

- `limit` (optional): Number of featured places (1-50, default: 10)

**Example:**

```bash
curl http://localhost:8000/api/places/featured?limit=8
```

#### 3. Get Place by ID

```
GET /api/places/{place_id}
```

**Path Parameters:**

- `place_id` (required): Unique identifier (UUID) of the place

**Response:**
Returns a single place object with all details including:

- Basic information (name, category, description, banner_image_link)
- Location (address, city, state, country, coordinates)
- Ratings and reviews (rating, reviews_count)
- Pricing (price_level)
- Hours of operation (hours, open_now)
- Amenities and tags
- Contact information (phone, website)

**Example:**

```bash
curl http://localhost:8000/api/places/123e4567-e89b-12d3-a456-426614174000
```

**Response Example:**

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Central Park",
    "category": "Park",
    "description": "A large public park in Manhattan...",
    "banner_image_link": "https://example.com/image.jpg",
    "rating": 4.8,
    "price_level": null,
    "coordinates": {"lat": 40.7851, "lng": -73.9683},
    "address": "Central Park, New York",
    "city": "New York",
    "state": "New York",
    "country": "USA",
    "hours": [...],
    "amenities": [...],
    "tags": [...],
    "phone": "+1-212-310-6600",
    "website": "https://www.centralparknyc.org"
  }
}
```

#### 4. Search Places

```
GET /api/places/search?q={query}
```

**Query Parameters:**

- `q` (required): Search query
- `limit` (optional): Maximum number of results (1-100)

**Example:**

```bash
curl http://localhost:8000/api/places/search?q=coffee&limit=20
```

#### 5. Get Places by Category

```
GET /api/places/category/{category}
```

**Query Parameters:**

- `limit` (optional): Maximum number of results (1-100)

**Example:**

```bash
curl http://localhost:8000/api/places/category/Restaurant?limit=15
```

#### 6. Health Check

```
GET /health
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": [...],
  "count": 10
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error type",
  "message": "Error message"
}
```

## Development

The server runs with auto-reload enabled by default. Changes to the code will automatically restart the server.

## Environment Variables

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase anon/public key
- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 8000)
- `CORS_ORIGINS`: Comma-separated list of allowed CORS origins
