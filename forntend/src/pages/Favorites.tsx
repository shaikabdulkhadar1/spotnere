import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlaceCard from "@/components/PlaceCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { favoritesApi } from "@/lib/api";
import { Place } from "@/types/place";
import { Heart } from "lucide-react";

const Favorites = () => {
  const navigate = useNavigate();
  const { isLoggedIn, token } = useAuth();
  const { favorites } = useFavorites();
  const [allFavPlaces, setAllFavPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !token) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    favoritesApi
      .getFavoritePlaces(token)
      .then((res) => {
        if (!cancelled) setAllFavPlaces(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, token]);

  // Filter displayed places to only those still in the favorites context,
  // so unfavorited cards disappear instantly without a refetch.
  const places = useMemo(
    () => allFavPlaces.filter((p) => favorites.has(p.id)),
    [allFavPlaces, favorites],
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40 px-4">
          <Heart className="w-16 h-16 text-muted-foreground/40 mb-6" />
          <h2 className="text-2xl font-serif font-bold mb-2">
            Log in to see your favorites
          </h2>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            Save the places you love and find them all here.
          </p>
          <Button onClick={() => navigate("/login")} size="lg">
            Log In
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Your Favorites
          </h1>
          <p className="text-muted-foreground mt-1 mb-8">Places you've saved</p>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[26rem] rounded-2xl bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-destructive mb-2">
                  Failed to load favorites
                </p>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4"
                  variant="outline"
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : places.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {places.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <Heart className="w-16 h-16 text-muted-foreground/40 mb-6" />
              <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Tap the heart icon on any place to save it here.
              </p>
              <Button onClick={() => navigate("/")} variant="outline">
                Explore Places
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Favorites;
