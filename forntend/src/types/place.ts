export type PlaceCategory =
  | "Cafe"
  | "Restaurant"
  | "Park"
  | "Museum"
  | "Nightlife"
  | "Event"
  | "Other";

export type Place = {
  id: string;
  name: string;
  category: PlaceCategory;
  subCategory?: string;
  description: string;
  bannerImageLink: string;
  rating: number; // 0-5
  avgPrice?: number;
  priceLevel?: 1 | 2 | 3; // Computed from avgPrice for backward compatibility
  coordinates: { lat: number; lng: number };
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  locationMapLink?: string;
  distanceKm?: number; // Computed field
  hours?: Array<{ day: string; open: string; close: string }>;
  openNow?: boolean; // Computed field
  amenities?: string[];
  tags?: string[]; // Optional - not in schema but used in components
  website?: string;
  phoneNumber?: string;
  phone?: string; // Backward compatibility alias
  reviewCount?: number;
  reviewsCount?: number; // Backward compatibility alias
  visible?: boolean;
  lastUpdated: string;
};
