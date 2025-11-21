import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePlaceById } from "@/hooks/use-places";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Star,
  Heart,
  MapPin,
  Phone,
  Globe,
  Clock,
  ArrowLeft,
  Share2,
  ShieldCheck,
  BadgeCheck,
  Shield,
  Users,
  BedDouble,
  Bath,
  Ruler,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const PlaceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const {
    data: place,
    isLoading,
    isError,
    error,
  } = usePlaceById(id || "", !!id);

  // Scroll to top when page loads or ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  // Log for debugging
  useEffect(() => {
    if (id) {
      console.log("Fetching place details for ID:", id);
    }
  }, [id]);

  const getPrice = (priceLevel?: 1 | 2 | 3) => {
    if (!priceLevel) return null;
    const basePrices = { 1: 200, 2: 400, 3: 600 };
    const price = basePrices[priceLevel];
    return `From $${price} for 2 nights`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-6">
              <Skeleton className="h-10 w-64 mb-4" />
              <Skeleton className="h-6 w-48" />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Skeleton className="h-[400px] w-full rounded-2xl" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !place) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center py-20">
              <p className="text-destructive mb-2 text-xl">
                {error instanceof Error ? error.message : "Place not found"}
              </p>
              <Button onClick={() => navigate("/")} className="mt-4">
                Go Back Home
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/10">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Top bar: back + bookmark */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart
                  className={cn(
                    "h-5 w-5",
                    isFavorite && "fill-red-500 text-red-500"
                  )}
                />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Title + location */}
          <div className="mb-6 space-y-2">
            <p className="text-3xl md:text-4xl font-serif font-bold">
              {place.name}
            </p>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span>
                {place.city}
                {place.state && `, ${place.state}`}
                {place.country && `, ${place.country}`}
              </span>
            </div>
          </div>

          {/* Image banner */}
          <div className="mb-8">
            <div className="relative h-[260px] md:h-[360px] rounded-3xl overflow-hidden">
              <img
                src={place.bannerImageLink || "/placeholder.svg"}
                alt={place.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </div>

          {/* Trust + stats section */}
          <div className="mb-8 space-y-4 rounded-3xl border bg-white/90 shadow-md px-4 py-4 md:px-6 md:py-5">
            {/* Trust badges row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-2 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium">Certified owners</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-2 shadow-sm">
                <BadgeCheck className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium">
                  Best price guarantee
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-2 shadow-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium">100% trusted</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-2 shadow-sm">
                <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
                <span className="text-xs font-medium">
                  {place.rating.toFixed(1)} rating
                </span>
              </div>
            </div>

            {/* Stats row */}
            <div className="rounded-2xl bg-white/80 mt-2 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
              <div className="flex items-center gap-3 py-3 md:px-4 px-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Guests</p>
                  <p className="text-sm font-semibold">
                    {place.tags?.length ? `${place.tags.length}+` : "Up to 4"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-3 md:px-4 px-3">
                <BedDouble className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="text-sm font-semibold">{place.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-3 md:px-4 px-3">
                <Bath className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">City</p>
                  <p className="text-sm font-semibold">{place.city || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-3 md:px-4 px-3">
                <Ruler className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Avg price</p>
                  <p className="text-sm font-semibold">
                    {place.avgPrice ? `$${place.avgPrice}` : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main content + reservation sidebar */}
          <div className="grid md:grid-cols-[2fr,1.2fr] gap-8 items-start">
            {/* Left: details */}
            <div className="space-y-8">
              {/* Description */}
              <section>
                <p className="text-xl md:text-2xl font-serif font-bold mb-3">
                  Place details
                </p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {place.description || "No description available."}
                </p>
              </section>

              {/* Hours */}
              {place.hours && place.hours.length > 0 && (
                <section>
                  <p className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Opening hours
                  </p>
                  <div className="rounded-2xl border bg-white divide-y">
                    {place.hours.map((hour, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center px-4 py-2"
                      >
                        <span className="text-sm font-medium">{hour.day}</span>
                        <span className="text-xs text-muted-foreground">
                          {hour.open} – {hour.close}
                        </span>
                      </div>
                    ))}
                  </div>
                  {place.openNow !== undefined && (
                    <div className="mt-3">
                      <Badge variant={place.openNow ? "default" : "secondary"}>
                        {place.openNow ? "Open now" : "Currently closed"}
                      </Badge>
                    </div>
                  )}
                </section>
              )}

              {/* Amenities */}
              {place.amenities && place.amenities.length > 0 && (
                <section>
                  <p className="text-lg font-semibold mb-3">Amenities</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {place.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Tags */}
              {place.tags && place.tags.length > 0 && (
                <section>
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {place.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right: reservation / contact card */}
            <aside>
              <div className="sticky top-24 space-y-4">
                <div className="rounded-3xl bg-white shadow-md border p-6 space-y-4">
                  <p className="text-xl font-semibold mb-2">
                    Make a reservation
                  </p>
                  {place.priceLevel && (
                    <div className="mb-2">
                      <p className="text-2xl font-bold">
                        {getPrice(place.priceLevel)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Approximate price for 2 people
                      </p>
                    </div>
                  )}
                  <div className="space-y-3 text-sm">
                    {place.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`tel:${place.phone}`}
                          className="text-primary hover:underline"
                        >
                          {place.phone}
                        </a>
                      </div>
                    )}
                    {place.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={place.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate"
                        >
                          Visit website
                        </a>
                      </div>
                    )}
                    {place.coordinates && (
                      <div className="pt-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            const url = `https://www.google.com/maps?q=${place.coordinates.lat},${place.coordinates.lng}`;
                            window.open(url, "_blank");
                          }}
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          View on map
                        </Button>
                      </div>
                    )}
                  </div>
                  <Button className="w-full mt-4" size="lg">
                    Send request
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PlaceDetails;
