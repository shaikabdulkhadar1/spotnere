import { Place } from "@/types/place";

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Filter places near the user's location (within specified radius in km)
 */
export const filterPlacesNearMe = (
  places: Place[],
  userLat: number,
  userLng: number,
  radiusKm: number = 50
): Place[] => {
  return places
    .filter((place) => {
      if (!place.coordinates?.lat || !place.coordinates?.lng) return false;
      const distance = calculateDistance(
        userLat,
        userLng,
        place.coordinates.lat,
        place.coordinates.lng
      );
      return distance <= radiusKm;
    })
    .map((place) => {
      // Add distance to place object
      const distance = calculateDistance(
        userLat,
        userLng,
        place.coordinates.lat,
        place.coordinates.lng
      );
      return {
        ...place,
        distanceKm: Math.round(distance * 10) / 10, // Round to 1 decimal
      };
    })
    .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0)); // Sort by distance
};

/**
 * Filter places by city name (case-insensitive)
 * Handles common variations and partial matches
 */
export const filterPlacesByCity = (places: Place[], city: string): Place[] => {
  if (!city) return [];
  const cityLower = city.toLowerCase().trim();

  return places.filter((place) => {
    if (!place.city) return false;

    const placeCityLower = place.city.toLowerCase().trim();

    // Exact match
    if (placeCityLower === cityLower) return true;

    // Check if city name contains the search city (for cases like "New York" matching "New York City")
    if (
      placeCityLower.includes(cityLower) ||
      cityLower.includes(placeCityLower)
    ) {
      return true;
    }

    return false;
  });
};

/**
 * Filter places by state name (case-insensitive)
 */
export const filterPlacesByState = (
  places: Place[],
  state: string
): Place[] => {
  if (!state) return [];
  return places.filter(
    (place) =>
      place.state &&
      place.state.toLowerCase().trim() === state.toLowerCase().trim()
  );
};

/**
 * Filter places by country name (case-insensitive)
 */
export const filterPlacesByCountry = (
  places: Place[],
  country: string
): Place[] => {
  if (!country) return [];
  return places.filter(
    (place) =>
      place.country &&
      place.country.toLowerCase().trim() === country.toLowerCase().trim()
  );
};

/**
 * Filter places by category (case-insensitive)
 * Also checks tags array for category matches
 * Handles common variations (e.g., "cafe" matches "café", "coffee shop")
 */
export const filterPlacesByCategory = (
  places: Place[],
  category: string
): Place[] => {
  if (!category) return [];
  const categoryLower = category.toLowerCase().trim();

  // Normalize category variations
  const categoryVariations: Record<string, string[]> = {
    cafe: ["cafe", "café", "coffee", "coffee shop", "coffeeshop"],
    restaurant: ["restaurant", "restaurants", "dining", "diner", "eatery"],
    nature: [
      "nature",
      "park",
      "parks",
      "outdoor",
      "hiking",
      "trail",
      "forest",
      "wildlife",
      "natural",
    ],
    adventure: [
      "adventure",
      "adventures",
      "adventure sports",
      "extreme sports",
      "rock climbing",
      "zip line",
      "zipline",
      "bungee",
      "rafting",
      "kayaking",
      "surfing",
      "skydiving",
      "paragliding",
    ],
    entertainment: [
      "entertainment",
      "theater",
      "theatre",
      "cinema",
      "movie",
      "movies",
      "concert",
      "music",
      "live music",
      "comedy",
      "show",
      "shows",
      "event",
      "events",
      "nightlife",
      "club",
      "bars",
    ],
  };

  const variations = categoryVariations[categoryLower] || [categoryLower];

  return places.filter((place) => {
    // Check category field
    if (place.category) {
      const placeCategoryLower = place.category.toLowerCase().trim();
      if (variations.some((v) => placeCategoryLower === v)) {
        return true;
      }
      // Also check if category contains any variation
      if (
        variations.some(
          (v) =>
            placeCategoryLower.includes(v) || v.includes(placeCategoryLower)
        )
      ) {
        return true;
      }
    }

    // Check tags array for category matches
    if (place.tags && Array.isArray(place.tags)) {
      const hasMatchingTag = place.tags.some((tag) => {
        if (!tag) return false;
        const tagLower = tag.toLowerCase().trim();
        // Exact match with any variation
        if (variations.some((v) => tagLower === v)) return true;
        // Partial match
        if (
          variations.some((v) => tagLower.includes(v) || v.includes(tagLower))
        )
          return true;
        return false;
      });
      if (hasMatchingTag) return true;
    }

    return false;
  });
};

/**
 * Filter places by category and state (case-insensitive)
 * Combines category and state filtering
 */
export const filterPlacesByCategoryAndState = (
  places: Place[],
  category: string,
  state: string
): Place[] => {
  if (!category || !state) return [];

  // First filter by category
  const categoryFiltered = filterPlacesByCategory(places, category);

  // Then filter by state
  return filterPlacesByState(categoryFiltered, state);
};
