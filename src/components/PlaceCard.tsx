import { Place } from "@/types/place";
import GlassCard from "./GlassCard";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, DollarSign } from "lucide-react";

interface PlaceCardProps {
  place: Place;
  onClick?: () => void;
}

const PlaceCard = ({ place, onClick }: PlaceCardProps) => {
  const priceSymbols = place.priceLevel
    ? "$".repeat(place.priceLevel)
    : undefined;

  return (
    <GlassCard onClick={onClick} className="group overflow-hidden">
      <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
        <img
          src={place.images[0]}
          alt={place.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif font-semibold text-lg leading-tight">
            {place.name}
          </h3>
          <div className="flex items-center gap-1 text-sm shrink-0">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="font-medium">{place.rating}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {place.description}
        </p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            {place.category}
          </Badge>
          {place.openNow && (
            <Badge variant="default" className="text-xs">
              Open Now
            </Badge>
          )}
          {place.tags?.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{place.distanceKm} km</span>
          </div>
          {priceSymbols && (
            <div className="flex items-center gap-1">
              <span className="font-medium">{priceSymbols}</span>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default PlaceCard;
