from typing import List, Optional, Dict, Any
from supabase import Client
from models import Place, Coordinates, Hours
from supabase_client import get_supabase


class PlaceService:
    def __init__(self, supabase_client: Optional[Client] = None):
        self.supabase = supabase_client or get_supabase()

    def _map_db_to_place(self, db_row: Dict[str, Any]) -> Place:
        """Map database row to Place model"""
        # Handle coordinates - could be JSONB or separate columns
        coordinates = None
        if isinstance(db_row.get("coordinates"), dict):
            coords = db_row["coordinates"]
            coordinates = Coordinates(lat=coords.get("lat"), lng=coords.get("lng"))
        elif "latitude" in db_row and "longitude" in db_row:
            coordinates = Coordinates(
                lat=db_row["latitude"], lng=db_row["longitude"]
            )

        # Handle hours - could be JSONB array
        hours = None
        if db_row.get("hours"):
            if isinstance(db_row["hours"], list):
                hours = [Hours(**h) for h in db_row["hours"]]

        # Handle banner_image_link
        banner_image_link = db_row.get("banner_image_link")
        # Fallback to images array if banner_image_link doesn't exist (for backward compatibility)
        if not banner_image_link and db_row.get("images"):
            images_data = db_row.get("images", [])
            if isinstance(images_data, str):
                banner_image_link = images_data
            elif isinstance(images_data, list) and len(images_data) > 0:
                banner_image_link = images_data[0]

        amenities = db_row.get("amenities", [])
        if isinstance(amenities, str):
            amenities = [amenities] if amenities else []

        tags = db_row.get("tags", [])
        if isinstance(tags, str):
            tags = [tags] if tags else []

        return Place(
            id=str(db_row.get("id", "")),
            name=db_row.get("name") or "",
            category=db_row.get("category") or "Other",
            description=db_row.get("description") or "",
            banner_image_link=banner_image_link,
            rating=float(db_row.get("rating") or 0) if db_row.get("rating") is not None else 0.0,
            price_level=db_row.get("price_level"),
            coordinates=coordinates or Coordinates(lat=0, lng=0),
            address=db_row.get("address") or "",
            city=db_row.get("city") or "",
            state=db_row.get("state") or "",
            country=db_row.get("country") or "",
            distance_km=db_row.get("distance_km"),
            hours=hours,
            open_now=db_row.get("open_now"),
            amenities=amenities,
            tags=tags,
            website=db_row.get("website"),
            phone=db_row.get("phone"),
            reviews_count=db_row.get("reviews_count"),
            last_updated=db_row.get("last_updated") or "",
        )

    def get_all_places(
        self,
        limit: Optional[int] = None,
        offset: Optional[int] = None,
        category: Optional[str] = None,
        city: Optional[str] = None,
        country: Optional[str] = None,
    ) -> List[Place]:
        """Get all places from Supabase places table with optional filters"""
        try:
            query = self.supabase.table("places").select("*")

            # Apply filters
            if category:
                query = query.eq("category", category)
            if city:
                query = query.eq("city", city)
            if country:
                query = query.eq("country", country)

            # Apply pagination
            if limit:
                query = query.limit(limit)
            if offset:
                query = query.offset(offset)

            # Order by rating (descending)
            query = query.order("rating", desc=True)

            # Execute query
            response = query.execute()
            
            # Check if response has data
            if not response.data:
                return []
            
            # Map database rows to Place models
            return [self._map_db_to_place(row) for row in response.data]
        except Exception as e:
            raise Exception(f"Failed to fetch places from Supabase: {str(e)}")

    def get_place_by_id(self, place_id: str) -> Optional[Place]:
        """Get a single place by ID"""
        response = (
            self.supabase.table("places").select("*").eq("id", place_id).execute()
        )

        if not response.data:
            return None

        return self._map_db_to_place(response.data[0])

    def get_featured_places(self, limit: int = 10) -> List[Place]:
        """Get featured places (e.g., with guest_favorite tag or high rating)"""
        query = (
            self.supabase.table("places")
            .select("*")
            .gte("rating", 4.5)
            .limit(limit)
            .order("rating", desc=True)
        )

        response = query.execute()
        return [self._map_db_to_place(row) for row in response.data]

    def search_places(
        self,
        search_query: str,
        limit: Optional[int] = None,
    ) -> List[Place]:
        """Search places by name, description, or city"""
        # Supabase text search - using ilike for case-insensitive search
        search_pattern = f"%{search_query}%"
        
        # Search in name first (most common search field)
        query = (
            self.supabase.table("places")
            .select("*")
            .ilike("name", search_pattern)
        )

        if limit:
            query = query.limit(limit)

        query = query.order("rating", desc=True)

        response = query.execute()
        results = [self._map_db_to_place(row) for row in response.data]
        existing_ids = {r.id for r in results}
        
        # If we have room, also search in description and city
        remaining_limit = (limit - len(results)) if limit else None
        if remaining_limit is None or remaining_limit > 0:
            # Search in description
            query2 = (
                self.supabase.table("places")
                .select("*")
                .ilike("description", search_pattern)
                .order("rating", desc=True)
            )
            if remaining_limit:
                query2 = query2.limit(remaining_limit)
            
            response2 = query2.execute()
            for row in response2.data:
                place = self._map_db_to_place(row)
                if place.id not in existing_ids:
                    results.append(place)
                    existing_ids.add(place.id)
                    if limit and len(results) >= limit:
                        break
            
            # Search in city if still have room
            remaining_limit = (limit - len(results)) if limit else None
            if remaining_limit is None or remaining_limit > 0:
                query3 = (
                    self.supabase.table("places")
                    .select("*")
                    .ilike("city", search_pattern)
                    .order("rating", desc=True)
                )
                if remaining_limit:
                    query3 = query3.limit(remaining_limit)
                
                response3 = query3.execute()
                for row in response3.data:
                    place = self._map_db_to_place(row)
                    if place.id not in existing_ids:
                        results.append(place)
                        existing_ids.add(place.id)
                        if limit and len(results) >= limit:
                            break
        
        return results

    def get_places_by_category(
        self, category: str, limit: Optional[int] = None
    ) -> List[Place]:
        """Get places filtered by category"""
        query = (
            self.supabase.table("places")
            .select("*")
            .eq("category", category)
            .order("rating", desc=True)
        )

        if limit:
            query = query.limit(limit)

        response = query.execute()
        return [self._map_db_to_place(row) for row in response.data]

