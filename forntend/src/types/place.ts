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
  description: string;
  bannerImageLink: string;
  rating: number; // 0-5
  priceLevel?: 1 | 2 | 3;
  coordinates: { lat: number; lng: number };
  address: string;
  city: string;
  state?: string;
  country: string;
  distanceKm?: number;
  hours?: Array<{ day: string; open: string; close: string }>;
  openNow?: boolean;
  amenities?: string[];
  tags?: string[];
  website?: string;
  phone?: string;
  reviewsCount?: number;
  lastUpdated: string;
};
