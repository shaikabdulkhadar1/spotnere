import { Place } from "@/types/place";

const API_BASE_URL = process.env.VITE_API_URL_BACKEND;

console.log(API_BASE_URL);

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  error?: string;
  message?: string;
}

export interface PlacesResponse {
  success: boolean;
  data: Place[];
  count: number;
}

// Map API response to frontend Place type
const mapApiPlaceToPlace = (apiPlace: any): Place => {
  // Handle banner_image_link - prefer banner_image_link, fallback to images array
  let bannerImageLink = "";
  if (apiPlace.banner_image_link) {
    bannerImageLink = apiPlace.banner_image_link;
  } else if (apiPlace.images) {
    // Fallback: if images array exists, use first image
    if (Array.isArray(apiPlace.images) && apiPlace.images.length > 0) {
      bannerImageLink = apiPlace.images[0];
    } else if (typeof apiPlace.images === "string") {
      bannerImageLink = apiPlace.images;
    }
  }

  return {
    id: apiPlace.id,
    name: apiPlace.name,
    category: apiPlace.category as Place["category"],
    description: apiPlace.description || "",
    bannerImageLink: bannerImageLink,
    rating: apiPlace.rating || 0,
    priceLevel: apiPlace.price_level as 1 | 2 | 3 | undefined,
    coordinates: apiPlace.coordinates || { lat: 0, lng: 0 },
    address: apiPlace.address || "",
    city: apiPlace.city || "",
    state: apiPlace.state ?? "",
    country: apiPlace.country || "",
    distanceKm: apiPlace.distance_km,
    hours: apiPlace.hours || [],
    openNow: apiPlace.open_now,
    amenities: Array.isArray(apiPlace.amenities) ? apiPlace.amenities : [],
    tags: Array.isArray(apiPlace.tags) ? apiPlace.tags : [],
    website: apiPlace.website,
    phone: apiPlace.phone,
    reviewsCount: apiPlace.reviews_count,
    lastUpdated: apiPlace.last_updated || new Date().toISOString(),
  };
};

export const placesApi = {
  /**
   * Get all places with optional filters
   */
  async getPlaces(params?: {
    limit?: number;
    offset?: number;
    category?: string;
    city?: string;
    country?: string;
  }): Promise<PlacesResponse> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());
    if (params?.category) queryParams.append("category", params.category);
    if (params?.city) queryParams.append("city", params.city);
    if (params?.country) queryParams.append("country", params.country);

    const url = `${API_BASE_URL}/api/places${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch places: ${response.statusText}`);
    }

    const data: ApiResponse<any[]> = await response.json();

    if (!data.success) {
      throw new Error(data.error || data.message || "Failed to fetch places");
    }

    return {
      success: true,
      data: data.data.map(mapApiPlaceToPlace),
      count: data.count || data.data.length,
    };
  },

  /**
   * Get featured places
   */
  async getFeaturedPlaces(limit: number = 10): Promise<PlacesResponse> {
    const url = `${API_BASE_URL}/api/places/featured?limit=${limit}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch featured places: ${response.statusText}`
      );
    }

    const data: ApiResponse<any[]> = await response.json();

    if (!data.success) {
      throw new Error(
        data.error || data.message || "Failed to fetch featured places"
      );
    }

    return {
      success: true,
      data: data.data.map(mapApiPlaceToPlace),
      count: data.count || data.data.length,
    };
  },

  /**
   * Search places
   */
  async searchPlaces(query: string, limit?: number): Promise<PlacesResponse> {
    const queryParams = new URLSearchParams({ q: query });
    if (limit) queryParams.append("limit", limit.toString());

    const url = `${API_BASE_URL}/api/places/search?${queryParams.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to search places: ${response.statusText}`);
    }

    const data: ApiResponse<any[]> = await response.json();

    if (!data.success) {
      throw new Error(data.error || data.message || "Failed to search places");
    }

    return {
      success: true,
      data: data.data.map(mapApiPlaceToPlace),
      count: data.count || data.data.length,
    };
  },

  /**
   * Get place by ID
   */
  async getPlaceById(id: string): Promise<Place> {
    if (!id) {
      throw new Error("Place ID is required");
    }

    const url = `${API_BASE_URL}/api/places/${encodeURIComponent(id)}`;

    console.log("Fetching place from API:", url);

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Place with ID '${id}' not found`);
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail ||
          errorData.message ||
          `Failed to fetch place: ${response.statusText}`
      );
    }

    const data: ApiResponse<any> = await response.json();

    if (!data.success) {
      throw new Error(data.error || data.message || "Failed to fetch place");
    }

    console.log("Place data received:", data.data);
    return mapApiPlaceToPlace(data.data);
  },
};
