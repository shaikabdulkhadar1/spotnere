import { useQuery } from "@tanstack/react-query";
import { placesApi } from "@/lib/api";
import { Place } from "@/types/place";

export interface UsePlacesParams {
  limit?: number;
  offset?: number;
  category?: string;
  city?: string;
  country?: string;
  enabled?: boolean;
}

export const usePlaces = (params?: UsePlacesParams) => {
  return useQuery<Place[]>({
    queryKey: ["places", params],
    queryFn: async () => {
      const response = await placesApi.getPlaces(params);
      return response.data;
    },
    enabled: params?.enabled !== false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useFeaturedPlaces = (limit: number = 10) => {
  return useQuery<Place[]>({
    queryKey: ["places", "featured", limit],
    queryFn: async () => {
      const response = await placesApi.getFeaturedPlaces(limit);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSearchPlaces = (query: string, limit?: number, enabled: boolean = true) => {
  return useQuery<Place[]>({
    queryKey: ["places", "search", query, limit],
    queryFn: async () => {
      const response = await placesApi.searchPlaces(query, limit);
      return response.data;
    },
    enabled: enabled && query.length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const usePlaceById = (id: string, enabled: boolean = true) => {
  return useQuery<Place>({
    queryKey: ["places", id],
    queryFn: async () => {
      return await placesApi.getPlaceById(id);
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

