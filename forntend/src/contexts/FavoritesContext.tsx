import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { favoritesApi } from "@/lib/api";

interface FavoritesContextType {
  favorites: Set<string>;
  toggleFavorite: (placeId: string) => void;
  isFavorite: (placeId: string) => boolean;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { token, isLoggedIn } = useAuth();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !token) {
      setFavorites(new Set());
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    favoritesApi
      .getFavoriteIds(token)
      .then((ids) => {
        if (!cancelled) setFavorites(new Set(ids));
      })
      .catch(() => {
        if (!cancelled) setFavorites(new Set());
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, token]);

  const toggleFavorite = useCallback(
    (placeId: string) => {
      if (!token) return;

      const wasFavorited = favorites.has(placeId);
      setFavorites((prev) => {
        const next = new Set(prev);
        if (wasFavorited) next.delete(placeId);
        else next.add(placeId);
        return next;
      });

      favoritesApi.toggle(token, placeId).catch(() => {
        setFavorites((prev) => {
          const rollback = new Set(prev);
          if (wasFavorited) rollback.add(placeId);
          else rollback.delete(placeId);
          return rollback;
        });
      });
    },
    [token, favorites],
  );

  const isFavorite = useCallback(
    (placeId: string) => favorites.has(placeId),
    [favorites],
  );

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, isLoading }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
