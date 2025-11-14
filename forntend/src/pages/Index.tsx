import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import PlaceCard from "@/components/PlaceCard";
import PlacesCarousel from "@/components/PlacesCarousel";
import { usePlaces } from "@/hooks/use-places";
import { useGeolocation } from "@/hooks/use-geolocation";
import { MapPin } from "lucide-react";
import {
  filterPlacesNearMe,
  filterPlacesByCity,
  filterPlacesByState,
  filterPlacesByCountry,
  filterPlacesByCategory,
  filterPlacesByCategoryAndState,
} from "@/lib/place-filters";
import { useMemo } from "react";
import {
  Sailboat,
  Coffee,
  Waves,
  Trees,
  Sparkle,
  Wine,
  Gem,
  BadgePlus,
  Palette,
  Utensils,
  Volleyball,
  Users,
  Music,
  Wallet,
  TrendingUp,
  PawPrint,
  Landmark,
  Film,
  Building,
  ArrowUpRight,
  Pin,
} from "lucide-react";
import { AnimatedTestimonialGrid } from "@/components/ui/testimonial-2";
import { HowItWorks } from "@/components/ui/how-it-works";
import { StatCard } from "@/components/ui/card-10";
import { TestimonialsSection } from "@/components/blocks/testimonials-with-marquee";
import Navbar2 from "@/components/Navbar2";

const defaultProps = {
  gradientColors: {
    from: "oklch(0.646 0.222 41.116)",
    to: "oklch(0.488 0.243 264.376)",
  },
};

// --- SAMPLE DATA ---
const floatingImages = [
  {
    imgSrc:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300",
    alt: "Professional Man",
  },
  {
    imgSrc:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300",
    alt: "Smiling Man",
  },
  {
    imgSrc:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300",
    alt: "Professional Woman",
  },
  {
    imgSrc:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300",
    alt: "Smiling Woman",
  },
  {
    imgSrc:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300",
    alt: "Man in a suit",
  },
  {
    imgSrc:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300",
    alt: "Bearded Man",
  },
  {
    imgSrc:
      "https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=300",
    alt: "Man in a blue shirt",
  },
  {
    imgSrc:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300",
    alt: "Older Man",
  },
  {
    imgSrc:
      "https://images.unsplash.com/photo-1619895862022-09114b41f16f?q=80&w=300",
    alt: "Woman with curly hair",
  },
  {
    imgSrc:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=300",
    alt: "Woman in an office",
  },
  {
    imgSrc:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300",
    alt: "Woman with glasses",
  },
  {
    imgSrc:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300",
    alt: "Woman with a dog",
  },
];

const testimonials = [
  {
    author: {
      name: "Emma Thompson",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    },
    text: "Spotnere helped me rediscover my own city — I found hidden cafés and quiet reading spots I’d never noticed before.",
    href: "",
  },
  {
    author: {
      name: "Lucas Hernández",
      avatar:
        "https://images.unsplash.com/photo-1603415526960-f7e0328e3d4b?w=150&h=150&fit=crop&crop=face",
    },
    text: "The 'Trending Near Me' section is a game changer. I’ve found so many local gems just by exploring casually on weekends.",
    href: "",
  },
  {
    author: {
      name: "Aisha Patel",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    },
    text: "I love how simple and beautiful the interface is. Searching for places feels natural, and every suggestion fits my mood perfectly.",
    href: "",
  },
  {
    author: {
      name: "Daniel Okafor",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
    },
    text: "As a frequent traveler, I rely on Spotnere to discover unique spots wherever I go — it’s like having a personal guide everywhere.",
    href: "",
  },
  {
    author: {
      name: "Sofia Rossi",
      avatar:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face",
    },
    text: "Spotnere feels personal — every place I visit through it has a story. It’s more than an app; it’s a way to explore meaningfully.",
    href: "",
  },
  {
    author: {
      name: "Ryan Mitchell",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
    text: "I’ve used many travel apps, but Spotnere’s recommendations are spot on. It adapts to my preferences and keeps things fresh.",
    href: "",
  },
  {
    author: {
      name: "Emily Nguyen",
      avatar:
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face",
    },
    text: "Spotnere makes exploring so effortless. Whether it’s a weekend adventure or a quick coffee break, I always find something new.",
    href: "",
  },
];

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

  // Fetch all places from country (or all places if no country)
  // We'll filter them on the frontend for different carousels
  const {
    data: allPlaces,
    isLoading,
    isError,
    error,
  } = usePlaces({
    limit: 100, // Get more places to filter
    country: country || undefined,
    enabled: !locationLoading,
  });

  // Filter places for different carousels
  const placesNearMe = useMemo(() => {
    if (!allPlaces || !latitude || !longitude) return [];
    return filterPlacesNearMe(allPlaces, latitude, longitude, 50).slice(0, 9);
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
    return filtered.slice(0, 9);
  }, [allPlaces, city]);

  const placesByState = useMemo(() => {
    if (!allPlaces || !state) return [];
    return filterPlacesByState(allPlaces, state).slice(0, 9);
  }, [allPlaces, state]);

  const placesByCountry = useMemo(() => {
    if (!allPlaces || !country) return [];
    return filterPlacesByCountry(allPlaces, country).slice(0, 9);
  }, [allPlaces, country]);

  // Filter places by category (Cafe) in the same state
  const placesByCafe = useMemo(() => {
    if (!allPlaces || !state) return [];
    return filterPlacesByCategoryAndState(allPlaces, "Cafe", state).slice(0, 9);
  }, [allPlaces, state]);

  // Filter places by category (Nature) in the same state
  const placesByNature = useMemo(() => {
    if (!allPlaces || !state) return [];
    return filterPlacesByCategoryAndState(allPlaces, "Nature", state).slice(
      0,
      9
    );
  }, [allPlaces, state]);

  // Filter places by category (Adventure) in the same state
  const placesByAdventure = useMemo(() => {
    if (!allPlaces || !state) return [];
    return filterPlacesByCategoryAndState(allPlaces, "Adventure", state).slice(
      0,
      9
    );
  }, [allPlaces, state]);

  // Filter places by category (Entertainment) in the same state
  const placesByEntertainment = useMemo(() => {
    if (!allPlaces || !state) return [];
    return filterPlacesByCategoryAndState(
      allPlaces,
      "Entertainment",
      state
    ).slice(0, 9);
  }, [allPlaces, state]);

  // Filter places by category (Restaurant) in the same state
  const placesByRestaurant = useMemo(() => {
    if (!allPlaces || !state) return [];
    return filterPlacesByCategoryAndState(allPlaces, "Restaurant", state).slice(
      0,
      9
    );
  }, [allPlaces, state]);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-28 pb-24 px-4 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 min-h-screen"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              background: `linear-gradient(to top right, ${defaultProps.gradientColors?.from}, ${defaultProps.gradientColors?.to})`,
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] min-h-screen"
          />
        </div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10 animate-float" />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)] min-h-screen"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              background: `linear-gradient(to top right, ${defaultProps.gradientColors?.from}, ${defaultProps.gradientColors?.to})`,
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem] min-h-screen"
          />
        </div>
        <div
          className="absolute bottom-10 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10 animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div className="relative z-10 w-full">
          <AnimatedTestimonialGrid
            testimonials={floatingImages}
            title={
              <>
                Find amazing places{" "}
                <span className="gradient-text">near you</span>
              </>
            }
            description="Spotnere unifies parks, cafés, events, and hidden gems—tailored to
              your location."
            ctaText="Explore Now"
            ctaHref="/explore"
          />
        </div>
      </section>

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
          <div className="w-full space-y-8">
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
          <div className="w-full space-y-16">
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
          <div className="w-full space-y-8">
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
                subtitle={`Featured places across ${country}`}
                places={placesByCountry}
                showGuestFavorite={true}
              />
            )}

            {/* Cafe Carousel */}
            {state && placesByCafe.length > 0 && (
              <PlacesCarousel
                title="Cafes"
                subtitle={`Discover cozy cafes and coffee spots in ${state}`}
                places={placesByCafe}
                showGuestFavorite={true}
              />
            )}

            {/* Restaurant Carousel */}
            {state && placesByRestaurant.length > 0 && (
              <PlacesCarousel
                title="Restaurants"
                subtitle={`Explore amazing dining experiences in ${state}`}
                places={placesByRestaurant}
                showGuestFavorite={true}
              />
            )}

            {/* Nature Carousel */}
            {state && placesByNature.length > 0 && (
              <PlacesCarousel
                title="Nature"
                subtitle={`Discover natural places in ${state}`}
                places={placesByNature}
                showGuestFavorite={true}
              />
            )}

            {/* Adventure Carousel */}
            {state && placesByAdventure.length > 0 && (
              <PlacesCarousel
                title="Adventure"
                subtitle={`Thrilling adventures in ${state}`}
                places={placesByAdventure}
                showGuestFavorite={true}
              />
            )}

            {/* Entertainment Carousel */}
            {state && placesByEntertainment.length > 0 && (
              <PlacesCarousel
                title="Entertainment"
                subtitle={`Fun entertainment venues in ${state}`}
                places={placesByEntertainment}
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
                  places={allPlaces.slice(0, 9)}
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
