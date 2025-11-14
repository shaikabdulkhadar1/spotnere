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
    <GlassCard onClick={onClick} className="h-[28rem] group overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center 
                       transition-transform duration-500 ease-in-out group-hover:scale-110"
        style={{ backgroundImage: `url(${place.bannerImageLink || "/placeholder.svg"})` }}
      />
      {/* Themed Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, rgb(0,0,0,0.9), rgb(0,0,0,0.6) 30%, transparent 60%)`,
        }}
      />

      {/* Content */}
      <div className="relative flex flex-col justify-end h-full pb-0 p-6 text-white">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-lg leading-tight">{place.name}</p>
          <div className="flex items-center gap-1 text-sm shrink-0">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span className="font-medium">{place.rating}</span>
          </div>
        </div>

        <p className="text-sm text-white opacity-80 line-clamp-2 pt-1">
          {place.description}
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="secondary" className="text-xs">
            {place.category}
          </Badge>
          {place.openNow ? (
            <Badge variant="default" className="text-xs">
              Open Now
            </Badge>
          ) : (
            <Badge variant="destructive" className="text-xs">
              Closed
            </Badge>
          )}
          {place.tags?.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs text-white">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="pt-2 flex items-center justify-between text-sm text-white opacity-80">
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
