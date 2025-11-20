import { Place } from "@/types/place";
import { categories, getCategory, getSubCategories } from "@/lib/categories";

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
 * Handles common country name variations
 */
export const filterPlacesByCountry = (
  places: Place[],
  country: string
): Place[] => {
  if (!country) return [];
  const countryLower = country.toLowerCase().trim();

  // Common country name variations/mappings
  const countryVariations: Record<string, string[]> = {
    "united states": [
      "united states",
      "usa",
      "us",
      "united states of america",
      "u.s.a.",
      "u.s.",
    ],
    "united kingdom": [
      "united kingdom",
      "uk",
      "great britain",
      "britain",
      "england",
    ],
    "united arab emirates": ["united arab emirates", "uae", "emirates"],
    "south korea": ["south korea", "korea", "republic of korea"],
    "north korea": [
      "north korea",
      "democratic people's republic of korea",
      "dprk",
    ],
  };

  // Get variations for the country, or use the country itself
  const variations = countryVariations[countryLower] || [countryLower];
  // Also add the original country name
  if (!variations.includes(countryLower)) {
    variations.push(countryLower);
  }

  return places.filter((place) => {
    if (!place.country) return false;
    const placeCountryLower = place.country.toLowerCase().trim();

    // Exact match with any variation
    if (variations.some((v) => placeCountryLower === v)) {
      return true;
    }

    // Partial match (for cases like "United States" matching "United States of America")
    if (
      variations.some(
        (v) => placeCountryLower.includes(v) || v.includes(placeCountryLower)
      )
    ) {
      return true;
    }

    return false;
  });
};

/**
 * Filter places by category (case-insensitive)
 * Uses categories and subcategories from categories.ts
 * Also checks tags array for category matches
 */
export const filterPlacesByCategory = (
  places: Place[],
  category: string
): Place[] => {
  if (!category) return [];
  const categoryLower = category.toLowerCase().trim();

  // Get category from categories.ts
  const categoryData = getCategory(category);
  const subCategories = getSubCategories(category);

  // Build variations array: category name + all subcategories
  const variations: string[] = [categoryLower];
  if (categoryData) {
    // Add category name (lowercased)
    variations.push(categoryData.name.toLowerCase().trim());
    // Add all subcategories (lowercased)
    subCategories.forEach((sub) => {
      variations.push(sub.toLowerCase().trim());
    });
  }

  // Special handling for "Tickets and Events" / "Tickets to Event"
  // If searching for "event", also check "Tickets to Event" category
  if (categoryLower === "event" || categoryLower.includes("ticket")) {
    const ticketsEventCategory = getCategory("Tickets to Event");
    if (ticketsEventCategory) {
      variations.push("tickets to event");
      variations.push("tickets and events");
      getSubCategories("Tickets to Event").forEach((sub) => {
        variations.push(sub.toLowerCase().trim());
      });
    }
  }

  return places.filter((place) => {
    // Check category field - exact match
    if (place.category) {
      const placeCategoryLower = place.category.toLowerCase().trim();

      // Exact match with category name or any variation
      if (variations.some((v) => placeCategoryLower === v)) {
        return true;
      }

      // Partial match (for cases like "Tickets to Event" matching "Event")
      if (
        variations.some(
          (v) =>
            placeCategoryLower.includes(v) || v.includes(placeCategoryLower)
        )
      ) {
        return true;
      }
    }

    // Check sub_category field
    if (place.subCategory) {
      const placeSubCategoryLower = place.subCategory.toLowerCase().trim();
      if (variations.some((v) => placeSubCategoryLower === v)) {
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
