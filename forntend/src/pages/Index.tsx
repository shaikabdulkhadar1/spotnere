import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import PlacesCarousel from "@/components/PlacesCarousel";
import { usePlaces } from "@/hooks/use-places";
import { useGeolocation } from "@/contexts/GeolocationContext";
import { MapPin } from "lucide-react";
import {
  filterPlacesNearMe,
  filterPlacesByCity,
  filterPlacesByState,
  filterPlacesByCountry,
  filterPlacesByCategory,
} from "@/lib/place-filters";
import { useMemo } from "react";

const Index = () => {
  // Get user's location
  const {
    latitude,
    longitude,
    country,
    city,
    state,
    loading: locationLoading,
    error: locationError,
  } = useGeolocation();

  // Fetch all places when page loads
  // We'll filter them on the frontend for different carousels
  const {
    data: allPlaces,
    isLoading,
    isError,
    error,
  } = usePlaces({
    limit: 100, // Get more places to filter
    enabled: true, // Always fetch on page load
  });

  // Filter places for different carousels
  const placesNearMe = useMemo(() => {
    if (!allPlaces || !latitude || !longitude) return [];
    return filterPlacesNearMe(allPlaces, latitude, longitude, 50).slice(0, 6);
  }, [allPlaces, latitude, longitude]);

  const placesByCity = useMemo(() => {
    if (!allPlaces || !city) {
      if (city) {
        console.log("City filter: No places or city missing", {
          hasPlaces: !!allPlaces,
          city,
        });
      }
      return [];
    }
    const filtered = filterPlacesByCity(allPlaces, city);
    // Debug: Log city filtering results
    if (city && filtered.length === 0 && allPlaces.length > 0) {
      console.log("City filter debug:", {
        city,
        totalPlaces: allPlaces.length,
        placesWithCity: allPlaces.filter((p) => p.city).length,
        sampleCities: allPlaces
          .filter((p) => p.city)
          .slice(0, 10)
          .map((p) => p.city),
        cityComparison: {
          geolocationCity: city,
          geolocationCityLower: city.toLowerCase().trim(),
          sampleCityLower: allPlaces
            .filter((p) => p.city)
            .slice(0, 5)
            .map((p) => ({
              original: p.city,
              lower: p.city?.toLowerCase().trim(),
              matches:
                p.city?.toLowerCase().trim() === city.toLowerCase().trim(),
            })),
        },
      });
    }
    return filtered.slice(0, 6);
  }, [allPlaces, city]);

  const placesByState = useMemo(() => {
    if (!allPlaces || !state) return [];
    return filterPlacesByState(allPlaces, state).slice(0, 6);
  }, [allPlaces, state]);

  const placesByCountry = useMemo(() => {
    if (!allPlaces || !country) {
      console.log("🌍 Country filter: No places or country missing", {
        hasPlaces: !!allPlaces,
        country,
      });
      return [];
    }
    const filtered = filterPlacesByCountry(allPlaces, country);
    console.log("🌍 Country filter results:", {
      country,
      totalPlaces: allPlaces.length,
      filteredCount: filtered.length,
      placesWithCountry: allPlaces.filter((p) => p.country).length,
      sampleCountries: allPlaces
        .filter((p) => p.country)
        .slice(0, 10)
        .map((p) => p.country),
    });
    return filtered.slice(0, 6);
  }, [allPlaces, country]);

  // Filter places by category: Sports (within same country)
  const placesBySports = useMemo(() => {
    if (!allPlaces || !country) return [];
    const categoryFiltered = filterPlacesByCategory(allPlaces, "Sports");
    const countryFiltered = filterPlacesByCountry(categoryFiltered, country);
    return countryFiltered.slice(0, 6);
  }, [allPlaces, country]);

  // Filter places by category: Adventure (within same country)
  const placesByAdventure = useMemo(() => {
    if (!allPlaces || !country) return [];
    const categoryFiltered = filterPlacesByCategory(allPlaces, "Adventure");
    const countryFiltered = filterPlacesByCountry(categoryFiltered, country);
    return countryFiltered.slice(0, 6);
  }, [allPlaces, country]);

  // Filter places by category: Staycation (within same country)
  const placesByStaycation = useMemo(() => {
    if (!allPlaces || !country) return [];
    const categoryFiltered = filterPlacesByCategory(allPlaces, "Staycation");
    const countryFiltered = filterPlacesByCountry(categoryFiltered, country);
    return countryFiltered.slice(0, 6);
  }, [allPlaces, country]);

  // Filter places by category: Tickets and Events (within same country)
  const placesByTicketsAndEvents = useMemo(() => {
    if (!allPlaces || !country) return [];
    // Filter by "Event" category - the filter will handle variations
    const categoryFiltered = filterPlacesByCategory(allPlaces, "event");
    const countryFiltered = filterPlacesByCountry(categoryFiltered, country);
    return countryFiltered.slice(0, 6);
  }, [allPlaces, country]);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section - Search Bar */}
      <SearchBar />

      {/* Places Carousel */}
      <section
        id="how-it-works"
        className="py-18 min-h-screen bg-gradient-to-b from-transparent to-muted/20 flex items-center relative"
      >
        {/* Location Error Banner (non-blocking) */}
        {locationError && !locationLoading && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800 flex items-center gap-2 shadow-sm">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{locationError}. Showing all places instead.</span>
            </div>
          </div>
        )}

        {locationLoading ? (
          // Show skeleton carousels while getting location
          <div className="w-full space-y-4">
            <PlacesCarousel
              title="Loading..."
              subtitle="Getting your location"
              places={[]}
              isLoading={true}
            />
            <PlacesCarousel
              title="Loading..."
              subtitle="Preparing places for you"
              places={[]}
              isLoading={true}
            />
          </div>
        ) : isLoading ? (
          // Show skeleton carousels while loading
          <div className="w-full space-y-4">
            {/* Skeleton Carousels */}
            <PlacesCarousel
              title="Loading..."
              subtitle="Discover amazing places"
              places={[]}
              isLoading={true}
            />
            <PlacesCarousel
              title="Loading..."
              subtitle="Explore great locations"
              places={[]}
              isLoading={true}
            />
            <PlacesCarousel
              title="Loading..."
              subtitle="Find your next adventure"
              places={[]}
              isLoading={true}
            />
          </div>
        ) : isError ? (
          <div className="w-full flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-destructive mb-2">Failed to load places</p>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4"
                variant="outline"
              >
                Retry
              </Button>
            </div>
          </div>
        ) : allPlaces && allPlaces.length > 0 ? (
          <div className="w-full space-y-4">
            {/* Near Me Carousel */}
            {latitude && longitude && placesNearMe.length > 0 && (
              <PlacesCarousel
                title="Near me"
                subtitle={`Places within 50km of your location`}
                places={placesNearMe}
                showGuestFavorite={true}
              />
            )}

            {/* City Carousel */}
            {city && placesByCity.length > 0 && (
              <PlacesCarousel
                title={`In ${city}`}
                subtitle={`Discover amazing places in ${city}`}
                places={placesByCity}
                showGuestFavorite={true}
              />
            )}

            {/* State Carousel */}
            {state && placesByState.length > 0 && (
              <PlacesCarousel
                title={`In ${state}`}
                subtitle={`Explore places in ${state}`}
                places={placesByState}
                showGuestFavorite={true}
              />
            )}

            {/* Country Carousel */}
            {country && placesByCountry.length > 0 && (
              <PlacesCarousel
                title={`In ${country}`}
                subtitle={`Discover amazing places across ${country}`}
                places={placesByCountry}
                showGuestFavorite={true}
              />
            )}

            {/* Sports Carousel */}
            {placesBySports.length > 0 && (
              <PlacesCarousel
                title="Sports"
                subtitle="Discover exciting sports venues and activities"
                places={placesBySports}
                showGuestFavorite={true}
              />
            )}

            {/* Adventure Carousel */}
            {placesByAdventure.length > 0 && (
              <PlacesCarousel
                title="Adventure"
                subtitle="Thrilling adventures and extreme experiences"
                places={placesByAdventure}
                showGuestFavorite={true}
              />
            )}

            {/* Staycation Carousel */}
            {placesByStaycation.length > 0 && (
              <PlacesCarousel
                title="Staycation"
                subtitle="Perfect staycation spots for a relaxing getaway"
                places={placesByStaycation}
                showGuestFavorite={true}
              />
            )}

            {/* Tickets and Events Carousel */}
            {placesByTicketsAndEvents.length > 0 && (
              <PlacesCarousel
                title="Tickets and Events"
                subtitle="Upcoming events and ticket opportunities"
                places={placesByTicketsAndEvents}
                showGuestFavorite={true}
              />
            )}

            {/* Fallback if no filtered results */}
            {(!latitude || !longitude) &&
              !city &&
              !state &&
              !country &&
              allPlaces.length > 0 && (
                <PlacesCarousel
                  title="Featured places"
                  subtitle="A collection of independent and handpicked places"
                  places={allPlaces.slice(0, 6)}
                  showGuestFavorite={true}
                />
              )}
          </div>
        ) : (
          <div className="w-full flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-muted-foreground">No places found</p>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Index;
