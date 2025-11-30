import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePlaceById, usePlaceGallery } from "@/hooks/use-places";
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
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const PlaceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const {
    data: place,
    isLoading: isPlaceLoading,
    isError: isPlaceError,
    error: placeError,
  } = usePlaceById(id || "", !!id);

  const {
    data: galleryImages,
    isLoading: isGalleryLoading,
    isError: isGalleryError,
    error: galleryError,
  } = usePlaceGallery(id || "", !!id);

  // Combined loading state - show skeleton until both place and gallery are loaded
  const isLoading = isPlaceLoading || isGalleryLoading;
  const isError = isPlaceError || isGalleryError;
  const error = placeError || galleryError;

  // Combine all images: banner first, then gallery images
  const allImages = place
    ? [place.bannerImageLink, ...(galleryImages || [])].filter(Boolean)
    : [];

  // Handle image click to open modal
  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  // Navigate to previous image
  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) =>
      prev > 0 ? prev - 1 : allImages.length - 1
    );
  };

  // Navigate to next image
  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev < allImages.length - 1 ? prev + 1 : 0
    );
  };

  // Scroll to top when page loads or ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  // Keyboard navigation for image modal
  useEffect(() => {
    if (!isImageModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setSelectedImageIndex((prev) =>
          prev > 0 ? prev - 1 : allImages.length - 1
        );
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setSelectedImageIndex((prev) =>
          prev < allImages.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "Escape") {
        setIsImageModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isImageModalOpen, allImages.length]);

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
            {/* Top bar skeleton */}
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-10 w-20" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>

            {/* Title skeleton */}
            <div className="mb-6 space-y-2">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-6 w-48" />
            </div>

            {/* Banner skeleton */}
            <div className="mb-8">
              <Skeleton className="h-[260px] md:h-[360px] w-full rounded-3xl" />
            </div>

            {/* Gallery skeleton */}
            <div className="mb-8">
              <Skeleton className="h-8 w-32 mb-4" />
              <div className="border border-border rounded-xl p-4">
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className="flex-shrink-0 w-[200px] md:w-[250px] aspect-square rounded-xl"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Trust + stats skeleton */}
            <div className="mb-8">
              <Skeleton className="h-24 w-full rounded-3xl mb-4" />
              <Skeleton className="h-20 w-full rounded-2xl" />
            </div>

            {/* Content skeleton */}
            <div className="grid md:grid-cols-[2fr,1.2fr] gap-8">
              <div className="space-y-8">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
              <Skeleton className="h-96 w-full rounded-3xl" />
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
                    isFavorite && "fill-destructive text-destructive"
                  )}
                />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Title + location */}
          <div className="mb-4 space-y-2">
            <p className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              {place.name}
            </p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-base">
                {place.city}
                {place.state && `, ${place.state}`}
                {place.country && `, ${place.country}`}
              </span>
            </div>
          </div>

          {/* Image banner + Gallery grid layout */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-3 md:gap-4">
            {/* Large banner image on left */}
            <div
              className="relative h-[320px] md:h-[450px] rounded-3xl overflow-hidden shadow-lg cursor-pointer group"
              onClick={() => handleImageClick(0)}
            >
              <img
                src={place.bannerImageLink || "/placeholder.svg"}
                alt={place.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>

            {/* Gallery images grid on right */}
            {galleryImages && galleryImages.length > 0 && (
              <div className="grid grid-cols-2 gap-2 md:gap-3 h-[320px] md:h-[450px]">
                {galleryImages.slice(0, 5).map((imageUrl, index) => (
                  <div
                    key={index}
                    className="relative rounded-xl overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300 shadow-md"
                    onClick={() => handleImageClick(index + 1)}
                  >
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt={`${place.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    {/* Show "+X" overlay on last visible image if there are more */}
                    {index === 4 && galleryImages.length > 5 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
                        <span className="text-white text-2xl md:text-3xl font-bold">
                          +{galleryImages.length - 5}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trust + stats section - more compact */}
          <div className="mb-8 space-y-3 rounded-2xl border bg-background/90 shadow-md px-4 py-3 md:px-5 md:py-4">
            {/* Trust badges row - more compact */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] md:text-xs font-medium">
                  Certified owners
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 shadow-sm">
                <BadgeCheck className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] md:text-xs font-medium">
                  Best price guarantee
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 shadow-sm">
                <Shield className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] md:text-xs font-medium">
                  100% trusted
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 shadow-sm">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
                <span className="text-[10px] md:text-xs font-medium">
                  {place.rating.toFixed(1)} rating
                </span>
              </div>
            </div>

            {/* Stats row - more compact */}
            <div className="rounded-xl bg-background/80 mt-1 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
              <div className="flex items-center gap-2.5 py-2.5 md:px-3 px-2">
                <Users className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Guests</p>
                  <p className="text-xs md:text-sm font-semibold">
                    {place.tags?.length ? `${place.tags.length}+` : "Up to 4"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 py-2.5 md:px-3 px-2">
                <BedDouble className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Category</p>
                  <p className="text-xs md:text-sm font-semibold">
                    {place.category}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 py-2.5 md:px-3 px-2">
                <Bath className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-[10px] text-muted-foreground">City</p>
                  <p className="text-xs md:text-sm font-semibold">
                    {place.city || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 py-2.5 md:px-3 px-2">
                <Ruler className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Avg price</p>
                  <p className="text-xs md:text-sm font-semibold">
                    {place.avgPrice ? `$${place.avgPrice}` : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main content + reservation sidebar */}
          <div className="grid md:grid-cols-[1.8fr,1fr] gap-6 md:gap-8 items-start">
            {/* Left: details */}
            <div className="space-y-6">
              {/* Description */}
              <section>
                <p className="text-2xl md:text-3xl font-serif font-bold mb-4 text-foreground">
                  About this place
                </p>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {place.description || "No description available."}
                </p>
              </section>

              {/* Amenities */}
              {place.amenities && place.amenities.length > 0 && (
                <section>
                  <p className="text-xl font-semibold mb-4 text-foreground">
                    Amenities
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {place.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm md:text-base"
                      >
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Hours */}
              {place.hours && place.hours.length > 0 && (
                <section>
                  <p className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                    <Clock className="h-5 w-5" />
                    Opening hours
                  </p>
                  <div className="rounded-xl border bg-background divide-y">
                    {place.hours.map((hour, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center px-4 py-3"
                      >
                        <span className="text-sm md:text-base font-medium">
                          {hour.day}
                        </span>
                        <span className="text-xs md:text-sm text-muted-foreground">
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

              {/* Tags */}
              {place.tags && place.tags.length > 0 && (
                <section>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {place.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right: reservation / contact card */}
            <aside>
              <div className="sticky top-24">
                <div className="rounded-2xl bg-background shadow-lg border p-5 md:p-6 space-y-4">
                  <p className="text-2xl font-semibold mb-3 text-foreground">
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
                          className="w-full border-border"
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

      {/* Image Gallery Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0 gap-0 bg-black/95 border-none [&>button]:hidden">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 z-50 rounded-full bg-black/50 hover:bg-black/70 text-white p-2 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Previous button */}
            {allImages.length > 1 && (
              <button
                onClick={handlePreviousImage}
                className="absolute left-4 z-50 rounded-full bg-black/50 hover:bg-black/70 text-white p-3 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Main image */}
            {allImages[selectedImageIndex] && (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={allImages[selectedImageIndex] || "/placeholder.svg"}
                  alt={`${place?.name} - Image ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}

            {/* Next button */}
            {allImages.length > 1 && (
              <button
                onClick={handleNextImage}
                className="absolute right-4 z-50 rounded-full bg-black/50 hover:bg-black/70 text-white p-3 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            {/* Image counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                {selectedImageIndex + 1} / {allImages.length}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlaceDetails;
