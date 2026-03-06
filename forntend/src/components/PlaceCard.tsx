import { useMemo, useState } from "react";
import { Place } from "@/types/place";
import GlassCard from "./GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Star, Heart, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { cn } from "@/lib/utils";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function checkIsOpenNow(raw?: unknown): boolean | null {
  try {
    if (!raw) return null;

    // Handle JSON string that wasn't parsed
    let hours = raw;
    if (typeof hours === "string") {
      try {
        hours = JSON.parse(hours);
      } catch {
        return null;
      }
    }

    if (!hours || typeof hours !== "object") return null;

    const now = new Date();
    const todayName = DAYS[now.getDay()];
    let openTime: string | undefined;
    let closeTime: string | undefined;

    if (Array.isArray(hours)) {
      // Format: [{ day: "Monday", open: "11:00", close: "21:00" }, ...]
      const entry = hours.find(
        (h) => typeof h?.day === "string" && h.day.toLowerCase() === todayName.toLowerCase(),
      );
      if (!entry) return null;
      openTime = entry.open;
      closeTime = entry.close;
    } else {
      // Format: { "Monday": { open: "06:00", close: "23:30" }, ... }
      const record = hours as Record<string, unknown>;
      const entry = Object.entries(record).find(
        ([day]) => day.toLowerCase() === todayName.toLowerCase(),
      );
      if (!entry || !entry[1] || typeof entry[1] !== "object") return null;
      const val = entry[1] as Record<string, string>;
      openTime = val.open;
      closeTime = val.close;
    }

    if (typeof openTime !== "string" || typeof closeTime !== "string") return null;
    if (openTime.toLowerCase() === "closed" || closeTime.toLowerCase() === "closed") return false;

    const [openH, openM] = openTime.split(":").map(Number);
    const [closeH, closeM] = closeTime.split(":").map(Number);
    if (isNaN(openH) || isNaN(openM) || isNaN(closeH) || isNaN(closeM)) return null;

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    if (closeMinutes > openMinutes) {
      return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
    }
    // Overnight hours (e.g. 22:00 – 02:00)
    return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
  } catch {
    return null;
  }
}

interface PlaceCardProps {
  place: Place;
  onClick?: () => void;
  isGuestFavorite?: boolean;
  forceFavorited?: boolean;
}

const PlaceCard = ({ place, onClick, isGuestFavorite = false, forceFavorited }: PlaceCardProps) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [bouncing, setBouncing] = useState(false);

  const liked = forceFavorited ?? isFavorite(place.id);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/place/${place.id}`);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      setShowLoginDialog(true);
      return;
    }
    toggleFavorite(place.id);
    setBouncing(true);
    setTimeout(() => setBouncing(false), 400);
  };

  const isOpen = useMemo(() => checkIsOpenNow(place.hours), [place.hours]);

  const priceSymbols = place.priceLevel
    ? "$".repeat(place.priceLevel)
    : undefined;

  return (
    <>
    <GlassCard
      onClick={handleClick}
      className="h-[26rem] w-full group overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center 
                       transition-transform duration-500 ease-in-out group-hover:scale-110"
        style={{
          backgroundImage: `url(${place.bannerImageLink || "/placeholder.svg"})`,
        }}
      />
      {/* Top bar: Guest Favorite label + Like button */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
        {isGuestFavorite ? (
          <span className="bg-white/90 backdrop-blur-sm text-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
            Guest favorite
          </span>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className={cn(
            "backdrop-blur-sm p-1.5 rounded-full transition-all duration-200 hover:scale-110 active:scale-90",
            liked ? "bg-white/90" : "bg-black/30 hover:bg-black/50",
            bouncing && "animate-[bounce-heart_0.4s_ease-in-out]",
          )}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors duration-200",
              liked ? "fill-red-500 text-red-500" : "text-white",
            )}
          />
        </button>
      </div>

      {/* Themed Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, rgb(0,0,0,0.9), rgb(0,0,0,0.6) 30%, transparent 60%)`,
        }}
      />

      {/* Content */}
      <div className="relative flex flex-col justify-end h-full pb-0 text-white">
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
          {isOpen !== null && (
            isOpen ? (
              <Badge variant="default" className="text-xs">
                Open Now
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-xs">
                Closed
              </Badge>
            )
          )}
          {place.tags?.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs text-white">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="pt-2 flex items-center justify-between text-sm text-white opacity-80">
          <div className="flex items-center">
            <DollarSign className="w-4 h-4" />
            <span>{place.avgPrice} per person</span>
          </div>
        </div>
      </div>
    </GlassCard>

    <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Log in to save favorites</DialogTitle>
          <DialogDescription>
            You need to be logged in to add places to your favorites.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setShowLoginDialog(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              setShowLoginDialog(false);
              navigate("/login");
            }}
          >
            Log in
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default PlaceCard;
