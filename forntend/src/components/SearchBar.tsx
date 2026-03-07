import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typewriter } from "@/components/ui/typewriter";
import { useGeolocation } from "@/contexts/GeolocationContext";
import { Search } from "lucide-react";

interface SearchBarProps {
  title?: string;
  words?: string[];
  className?: string;
}

const SearchBar = ({
  title,
  words = [
    "adventure",
    "experience",
    "journey",
    "escape",
    "discovery",
    "getaway",
  ],
  className = "",
}: SearchBarProps) => {
  const navigate = useNavigate();
  const { country, state } = useGeolocation();
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [cities, setCities] = useState<string[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [citiesError, setCitiesError] = useState<string | null>(null);

  // Fetch cities based on country and state
  useEffect(() => {
    if (!country || !state) {
      setCities([]);
      return;
    }

    let isCancelled = false;

    const fetchCities = async () => {
      try {
        setCitiesLoading(true);
        setCitiesError(null);

        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/state/cities",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              country,
              state,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch cities: ${response.statusText}`);
        }

        const json: {
          error?: boolean;
          msg?: string;
          data?: string[];
        } = await response.json();

        if (isCancelled) return;

        if (!json.error && Array.isArray(json.data)) {
          setCities(json.data);
        } else {
          setCities([]);
        }
      } catch (err) {
        if (isCancelled) return;
        console.error("Error fetching cities data:", err);
        setCities([]);
        setCitiesError("Unable to load cities right now.");
      } finally {
        if (!isCancelled) {
          setCitiesLoading(false);
        }
      }
    };

    fetchCities();

    return () => {
      isCancelled = true;
    };
  }, [country, state]);

  const handleSearch = () => {
    const query = searchLocation.trim();
    if (query) {
      navigate(`/?q=${encodeURIComponent(query)}`);
    } else {
      navigate("/");
    }
  };

  return (
    <section
      className={`relative min-h-[36vh] flex items-center justify-center pt-8 pb-16 px-4 overflow-hidden hero-gradient-mesh ${className}`}
    >
      {/* Animated orbs */}
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />

      {/* Dot grid overlay */}
      <div className="absolute inset-0 hero-dot-grid" />

      <div className="relative z-10 w-full max-w-5xl">
        <div className="mb-8">
          <p className="text-center text-sm font-medium tracking-widest uppercase text-muted-foreground mb-3">
            Discover experiences around you
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-center text-foreground leading-tight">
            {title ? (
              title
            ) : (
              <>
                Find your next{" "}
                <span className="hero-text-shimmer">
                  <Typewriter
                    text={words}
                    speed={100}
                    deleteSpeed={50}
                    waitTime={2000}
                    loop={true}
                    showCursor={true}
                    cursorChar="_"
                    cursorClassName="ml-1"
                  />
                </span>
              </>
            )}
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="bg-background/95 backdrop-blur-sm rounded-full shadow-xl border border-border/60 overflow-hidden flex items-center divide-x divide-border/60 relative z-10">
            <div className="flex-[2] px-10 py-4">
              <label className="text-md font-bold text-foreground mb-1 block opacity-80">
                🎡 Where
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Start typing to search..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 text-sm placeholder:opacity-80 bg-transparent"
                />
              </div>
            </div>
            <div className="px-4 py-2">
              <Button
                onClick={handleSearch}
                className="rounded-full h-12 px-6 bg-primary hover:bg-primary/90 flex items-center gap-2 shadow-lg shadow-primary/25"
              >
                <Search className="h-5 w-5 text-primary-foreground" />
                <span className="text-primary-foreground font-semibold">
                  Search
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Wavy bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0]">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-10 md:h-14"
        >
          <path
            d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};

export default SearchBar;
