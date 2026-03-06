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
  backgroundClassName?: string;
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
  backgroundClassName = "bg-muted",
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
    const params = new URLSearchParams();
    if (searchLocation) params.set("location", searchLocation);
    // Only add city param if a specific city is selected (not "any")
    if (selectedCity && selectedCity !== "any") {
      params.set("city", selectedCity);
    }
    navigate(`/?${params.toString()}`);
  };

  return (
    <section
      className={`relative min-h-[33vh] flex items-center justify-center pt-6 pb-6 px-4 overflow-hidden border-b-2 border-border shadow-xl ${backgroundClassName}`}
    >
      <div className={`relative z-10 w-full max-w-5xl ${className}`}>
        <div className="mb-6">
          <h1 className="text-5xl font-bold text-center text-foreground">
            {title ? (
              title
            ) : (
              <>
                Find your next{" "}
                <span className="text-primary">
                  <Typewriter
                    text={words}
                    speed={100}
                    deleteSpeed={50}
                    waitTime={2000}
                    loop={true}
                    showCursor={true}
                    cursorChar="_"
                    cursorClassName="ml-1 text-primary"
                  />
                </span>
              </>
            )}
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="bg-background rounded-full shadow-lg border border-[#dfdede] overflow-hidden flex items-center divide-x divide-[#dfdede] relative z-10">
            {/* Where */}
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
                  className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 text-sm placeholder:opacity-80"
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="px-4 py-2">
              <Button
                onClick={handleSearch}
                className="rounded-full h-12 px-6 bg-primary hover:bg-primary/90 flex items-center gap-2"
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
    </section>
  );
};

export default SearchBar;
