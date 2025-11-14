import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Place } from "@/types/place";
import {
  Star,
  Heart,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface PlacesCarouselProps {
  title: string;
  subtitle?: string;
  places: Place[];
  showGuestFavorite?: boolean;
  isLoading?: boolean;
}

const PlacesCarousel: React.FC<PlacesCarouselProps> = ({
  title,
  subtitle,
  places,
  showGuestFavorite = true,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 220; // Adjusted for smaller cards
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "right" ? scrollAmount : -scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const toggleFavorite = (placeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(placeId)) {
        newFavorites.delete(placeId);
      } else {
        newFavorites.add(placeId);
      }
      return newFavorites;
    });
  };

  // Calculate price from priceLevel (mock pricing)
  const getPrice = (priceLevel?: 1 | 2 | 3) => {
    if (!priceLevel) return null;
    const basePrices = { 1: 200, 2: 400, 3: 600 };
    const price = basePrices[priceLevel];
    return `From $${price} for 2 nights`;
  };

  // Skeleton card component
  const SkeletonCard = () => (
    <div className="flex-shrink-0 w-[170px] md:w-[180px]">
      <div className="relative rounded-xl overflow-hidden bg-white shadow-md border">
        {/* Image Skeleton */}
        <Skeleton className="h-[140px] md:h-[150px] w-full rounded-t-xl" />

        {/* Content Skeleton */}
        <div className="p-2.5 space-y-1">
          {/* Title */}
          <Skeleton className="h-3 w-4/5 mb-0.5" />

          {/* Rating */}
          <div className="flex items-center gap-0.5 mb-1">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-2.5 w-6" />
          </div>

          {/* Price */}
          <Skeleton className="h-2.5 w-20 mb-0.5" />

          {/* Location */}
          <Skeleton className="h-2 w-2/3" />
        </div>
      </div>
    </div>
  );

  return (
    <section className="px-4 py-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xl md:text-2xl font-serif font-bold mb-0.5">
              {title}
            </p>
            {subtitle && (
              <p className="text-muted-foreground text-xs md:text-sm">
                {subtitle}
              </p>
            )}
          </div>

          {/* Navigation Arrows */}
          {!isLoading && (
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => scroll("left")}
                disabled={!showLeftArrow}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => scroll("right")}
                disabled={!showRightArrow}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Scrollable Container */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {isLoading ? (
              // Show skeleton cards while loading
              <>
                {[...Array(6)].map((_, index) => (
                  <SkeletonCard key={`skeleton-${index}`} />
                ))}
              </>
            ) : (
              <>
                {places.map((place, index) => {
                  const isFavorite = favorites.has(place.id);
                  const price = getPrice(place.priceLevel);
                  const isGuestFavorite = showGuestFavorite && index < 2;

                  return (
                    <div
                      key={place.id}
                      onClick={() => navigate(`/place/${place.id}`)}
                      className="flex-shrink-0 w-[170px] md:w-[180px] group cursor-pointer border shadow-md rounded-xl overflow-hidden"
                    >
                      <div className="relative rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                        {/* Image */}
                        <div className="relative h-[140px] md:h-[150px] overflow-hidden">
                          <img
                            src={place.bannerImageLink || "/placeholder.svg"}
                            alt={place.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                          {/* Badges and Icons */}
                          <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                            {isGuestFavorite && (
                              <Badge className="bg-white text-gray-900 font-semibold text-[9px] px-1 py-0.5">
                                Guest favorite
                              </Badge>
                            )}
                          </div>

                          {/* Heart Icon */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(place.id, e);
                            }}
                            className={cn(
                              "absolute top-1.5 right-1.5 p-1 rounded-full transition-all duration-200 z-10",
                              isFavorite
                                ? "bg-red-500 text-white"
                                : "bg-white/90 text-gray-700 hover:bg-white"
                            )}
                          >
                            <Heart
                              className={cn(
                                "h-3 w-3",
                                isFavorite && "fill-current"
                              )}
                            />
                          </button>
                        </div>

                        {/* Content */}
                        <div className="p-2.5">
                          <p className="font-semibold text-xs mb-0.5 line-clamp-1">
                            {place.name}
                          </p>

                          {/* Rating */}
                          <div className="flex items-center gap-0.5 mb-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                            <span className="text-[10px] font-medium">
                              {place.rating}
                            </span>
                            {place.reviewsCount && (
                              <span className="text-[9px] text-muted-foreground">
                                ({place.reviewsCount})
                              </span>
                            )}
                          </div>

                          {/* Price */}
                          {price && (
                            <p className="text-[10px] font-medium text-foreground mb-0.5">
                              {price}
                            </p>
                          )}

                          {/* Location */}
                          <p className="text-[9px] text-muted-foreground line-clamp-1">
                            {[place.city, place.state, place.country]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Explore More Button */}
                {!isLoading && (
                  <div className="flex-shrink-0 w-[170px] md:w-[180px] group border shadow-md rounded-xl">
                    <Link to="/explore">
                      <div className="relative rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                        {/* Image Placeholder - Same height as other cards */}
                        <div className="relative h-[140px] md:h-[150px] overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                          {/* Center Arrow */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-1.5">
                              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                                <ArrowRight className="h-5 w-5 text-primary" />
                              </div>
                              <p className="text-xs font-semibold text-foreground">
                                Explore more
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Content - Same padding as other cards */}
                        <div className="p-2.5 flex-1 flex items-center justify-center">
                          <p className="text-[9px] text-muted-foreground text-center">
                            Discover more amazing places
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Navigation Hints */}
          <div className="md:hidden flex justify-center gap-2 mt-4">
            <div className="h-1 w-1 rounded-full bg-gray-300" />
            <div className="h-1 w-1 rounded-full bg-gray-300" />
            <div className="h-1 w-1 rounded-full bg-gray-300" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlacesCarousel;
