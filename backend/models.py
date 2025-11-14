from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class Coordinates(BaseModel):
    lat: float
    lng: float

class Hours(BaseModel):
    day: str
    open: str
    close: str

class Place(BaseModel):
    id: str
    name: Optional[str] = ""
    category: Optional[str] = "Other"
    description: Optional[str] = ""
    banner_image_link: Optional[str] = None
    rating: Optional[float] = 0.0
    price_level: Optional[int] = None
    coordinates: Coordinates
    address: Optional[str] = ""
    city: Optional[str] = ""
    state: Optional[str] = ""
    country: Optional[str] = ""
    distance_km: Optional[float] = None
    hours: Optional[List[Hours]] = None
    open_now: Optional[bool] = None
    amenities: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    website: Optional[str] = None
    phone: Optional[str] = None
    reviews_count: Optional[int] = None
    last_updated: Optional[str] = ""

    class Config:
        from_attributes = True

class PlaceResponse(BaseModel):
    success: bool
    data: List[Place]
    count: int

class PlaceDetailResponse(BaseModel):
    success: bool
    data: Place

class ErrorResponse(BaseModel):
    success: bool
    error: str
    message: str

