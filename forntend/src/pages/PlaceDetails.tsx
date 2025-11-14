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
} from "lucide-react";
import { Loader2 } from "lucide-react";
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
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {/* Header Section */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
                  {place.name}
                </h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-500" />
                    <span className="font-semibold">{place.rating}</span>
                    {place.reviewsCount && (
                      <span className="text-muted-foreground">
                        ({place.reviewsCount} reviews)
                      </span>
                    )}
                  </div>
                  <Badge variant="outline">{place.category}</Badge>
                  {place.priceLevel && (
                    <span className="text-sm font-medium">
                      {getPrice(place.priceLevel)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart
                    className={cn(
                      "h-5 w-5",
                      isFavorite && "fill-red-500 text-red-500"
                    )}
                  />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {place.address && `${place.address}, `}
                {place.city}
                {place.state && `, ${place.state}`}
                {place.country && `, ${place.country}`}
              </span>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="mb-8">
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
              <img
                src={place.bannerImageLink || "/placeholder.svg"}
                alt={place.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="md:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-serif font-bold mb-4">
                  About this place
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {place.description || "No description available."}
                </p>
              </div>

              {/* Hours */}
              {place.hours && place.hours.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Hours
                  </h3>
                  <div className="space-y-2">
                    {place.hours.map((hour, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-gray-100"
                      >
                        <span className="font-medium">{hour.day}</span>
                        <span className="text-muted-foreground">
                          {hour.open} - {hour.close}
                        </span>
                      </div>
                    ))}
                    {place.openNow !== undefined && (
                      <div className="mt-3">
                        <Badge
                          variant={place.openNow ? "default" : "secondary"}
                        >
                          {place.openNow ? "Open Now" : "Closed"}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {place.amenities && place.amenities.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Amenities</h3>
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
                </div>
              )}

              {/* Tags */}
              {place.tags && place.tags.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {place.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="md:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Contact Info Card */}
                <div className="border rounded-2xl p-6 space-y-4">
                  <h3 className="text-xl font-semibold">Contact Information</h3>

                  {place.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <a
                        href={`tel:${place.phone}`}
                        className="text-primary hover:underline"
                      >
                        {place.phone}
                      </a>
                    </div>
                  )}

                  {place.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <a
                        href={place.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline truncate"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}

                  {place.coordinates && (
                    <div className="pt-4 border-t">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          const url = `https://www.google.com/maps?q=${place.coordinates.lat},${place.coordinates.lng}`;
                          window.open(url, "_blank");
                        }}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        View on Map
                      </Button>
                    </div>
                  )}
                </div>

                {/* Booking Card */}
                {place.priceLevel && (
                  <div className="border rounded-2xl p-6 space-y-4">
                    <div>
                      <p className="text-2xl font-bold mb-1">
                        {getPrice(place.priceLevel)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Price for 2 nights
                      </p>
                    </div>
                    <Button className="w-full" size="lg">
                      Book Now
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PlaceDetails;
