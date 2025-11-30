import { Place } from "@/types/place";

const API_BASE_URL =
  import.meta.env.VITE_API_URL_BACKEND || "http://localhost:8000";

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

// Map API response to frontend Place type based on database schema
const mapApiPlaceToPlace = (apiPlace: any): Place => {
  // Handle coordinates from latitude/longitude columns (from schema)
  const latitude =
    apiPlace.latitude !== undefined && apiPlace.latitude !== null
      ? parseFloat(apiPlace.latitude)
      : undefined;
  const longitude =
    apiPlace.longitude !== undefined && apiPlace.longitude !== null
      ? parseFloat(apiPlace.longitude)
      : undefined;

  // Create coordinates object from latitude/longitude (required by Place type)
  const coordinates = {
    lat: latitude ?? 0,
    lng: longitude ?? 0,
  };

  // Handle last_updated timestamp
  let lastUpdated = new Date().toISOString();
  if (apiPlace.last_updated) {
    if (typeof apiPlace.last_updated === "string") {
      lastUpdated = apiPlace.last_updated;
    } else {
      lastUpdated = new Date(apiPlace.last_updated).toISOString();
    }
  }

  return {
    id: apiPlace.id,
    name: apiPlace.name || "",
    category: (apiPlace.category || "Other") as Place["category"],
    subCategory: apiPlace.sub_category || undefined,
    description: apiPlace.description || "",
    bannerImageLink: apiPlace.banner_image_link || "",
    images: Array.isArray(apiPlace.images)
      ? apiPlace.images.filter((img: any) => img && typeof img === "string")
      : apiPlace.image_links && Array.isArray(apiPlace.image_links)
      ? apiPlace.image_links.filter(
          (img: any) => img && typeof img === "string"
        )
      : apiPlace.images && typeof apiPlace.images === "string"
      ? [apiPlace.images]
      : undefined,
    rating:
      apiPlace.rating !== undefined && apiPlace.rating !== null
        ? parseFloat(apiPlace.rating)
        : 0,
    avgPrice:
      apiPlace.avg_price !== undefined && apiPlace.avg_price !== null
        ? parseFloat(apiPlace.avg_price)
        : undefined,
    coordinates: coordinates,
    address: apiPlace.address || "",
    city: apiPlace.city || "",
    state: apiPlace.state || undefined,
    country: apiPlace.country || "",
    postalCode: apiPlace.postal_code || undefined,
    latitude: latitude,
    longitude: longitude,
    locationMapLink: apiPlace.location_map_link || undefined,
    hours: apiPlace.hours || undefined,
    amenities: Array.isArray(apiPlace.amenities)
      ? apiPlace.amenities
      : undefined,
    website: apiPlace.website || undefined,
    phoneNumber: apiPlace.phone_number || undefined,
    reviewCount: apiPlace.review_count ?? 0,
    visible: apiPlace.visible !== undefined ? apiPlace.visible : true,
    lastUpdated: lastUpdated,
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

    console.log("🔗 Fetching places from:", url);
    console.log("🌐 API Base URL:", API_BASE_URL);

    const response = await fetch(url);

    console.log("📡 Response status:", response.status, response.statusText);
    console.log(
      "📡 Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    // Check if response is actually JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("❌ Non-JSON response received:", text.substring(0, 200));
      throw new Error(
        `API returned non-JSON response. Status: ${response.status}. Check if backend server is running at ${API_BASE_URL}`
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error response:", errorText);
      throw new Error(
        `Failed to fetch places: ${response.statusText} (${response.status})`
      );
    }

    const data: ApiResponse<any[]> = await response.json();
    console.log("✅ Places API response:", data);

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

  /**
   * Get gallery images for a place
   */
  async getPlaceGallery(placeId: string): Promise<string[]> {
    if (!placeId) {
      throw new Error("Place ID is required");
    }

    const url = `${API_BASE_URL}/api/places/${encodeURIComponent(
      placeId
    )}/gallery`;

    console.log("Fetching gallery images from API:", url);

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        // No gallery images found, return empty array
        return [];
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail ||
          errorData.message ||
          `Failed to fetch gallery images: ${response.statusText}`
      );
    }

    const data: ApiResponse<string[]> = await response.json();

    if (!data.success) {
      throw new Error(
        data.error || data.message || "Failed to fetch gallery images"
      );
    }

    console.log("Gallery images received:", data.data);
    return data.data || [];
  },
};
