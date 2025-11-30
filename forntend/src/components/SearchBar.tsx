import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Typewriter } from "@/components/ui/typewriter";
import { useGeolocation } from "@/contexts/GeolocationContext";
import { Search, MapPin } from "lucide-react";

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
          }
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
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <section
      className={`relative min-h-[45vh] flex items-center justify-center pt-6 pb-6 px-4 overflow-hidden ${backgroundClassName}`}
    >
      {/* Floating Emojis - Scattered throughout entire component */}
      {/* Top Area */}

      <div
        className="absolute top-20 left-1/4 text-4xl opacity-65 hover:opacity-100 transition-opacity pointer-events-none z-0"
        style={{
          animation: "float 4.2s ease-in-out infinite",
          animationDelay: "0.8s",
        }}
      >
        ✈️
      </div>

      <div
        className="absolute top-24 left-1/3 text-3xl opacity-65 hover:opacity-100 transition-opacity pointer-events-none z-0"
        style={{
          animation: "float 4.5s ease-in-out infinite",
          animationDelay: "1.2s",
        }}
      >
        🎡
      </div>
      <div
        className="absolute top-10 right-1/4 text-4xl opacity-70 hover:opacity-100 transition-opacity pointer-events-none z-0"
        style={{
          animation: "float 3.6s ease-in-out infinite",
          animationDelay: "0.6s",
        }}
      >
        🗺️
      </div>

      {/* Middle/Title Area */}
      <div
        className="absolute top-1/3 left-12 text-4xl opacity-70 hover:opacity-100 transition-opacity pointer-events-none z-0"
        style={{
          animation: "float 4.3s ease-in-out infinite",
          animationDelay: "0.4s",
        }}
      >
        🌴
      </div>
      <div
        className="absolute top-1/3 right-12 text-4xl opacity-70 hover:opacity-100 transition-opacity pointer-events-none z-0"
        style={{
          animation: "float 3.7s ease-in-out infinite",
          animationDelay: "0.9s",
        }}
      >
        🎠
      </div>

      <div
        className="absolute top-2/5 right-1/5 text-4xl opacity-65 hover:opacity-100 transition-opacity pointer-events-none z-0"
        style={{
          animation: "float 3.9s ease-in-out infinite",
          animationDelay: "0.7s",
        }}
      >
        📍
      </div>
      <div
        className="absolute top-1/2 left-20 text-3xl opacity-70 hover:opacity-100 transition-opacity pointer-events-none z-0"
        style={{
          animation: "float 4.4s ease-in-out infinite",
          animationDelay: "0.2s",
        }}
      >
        ⛰️
      </div>
      <div
        className="absolute top-1/2 right-20 text-4xl opacity-70 hover:opacity-100 transition-opacity pointer-events-none z-0"
        style={{
          animation: "float 3.8s ease-in-out infinite",
          animationDelay: "1.0s",
        }}
      >
        🏝️
      </div>
      <div
        className="absolute top-2/5 left-1/3 text-3xl opacity-65 hover:opacity-100 transition-opacity pointer-events-none z-0"
        style={{
          animation: "float 4.0s ease-in-out infinite",
          animationDelay: "0.5s",
        }}
      >
        ☁️
      </div>

      {/* Bottom Area */}

      <div
        className="absolute bottom-12 right-12 text-5xl opacity-70 hover:opacity-100 transition-opacity pointer-events-none z-0"
        style={{
          animation: "float 3.8s ease-in-out infinite",
          animationDelay: "0.3s",
        }}
      >
        🎢
      </div>

      <div
        className="absolute bottom-14 left-1/3 text-3xl opacity-65 hover:opacity-100 transition-opacity pointer-events-none z-0"
        style={{
          animation: "float 4.1s ease-in-out infinite",
          animationDelay: "0.9s",
        }}
      >
        🌊
      </div>

      <div
        className="absolute bottom-10 left-12 text-3xl opacity-70 hover:opacity-100 transition-opacity pointer-events-none z-0"
        style={{
          animation: "float 4.3s ease-in-out infinite",
          animationDelay: "0.8s",
        }}
      >
        🗺️
      </div>

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
            <div className="flex-[2] px-6 py-4">
              <label className="text-sm font-semibold text-foreground mb-1 block opacity-80">
                🎡 Where
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Search destinations or categories"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                />
              </div>
            </div>

            {/* Location */}
            <div className="flex-1 px-6 py-4">
              <label className="text-sm font-semibold text-foreground mb-1 block opacity-80">
                📍 Location
              </label>
              <div className="flex items-center gap-2">
                <Select
                  value={selectedCity || undefined}
                  onValueChange={setSelectedCity}
                  disabled={citiesLoading || !country || !state}
                >
                  <SelectTrigger className="border-0 p-0 h-auto focus:ring-0 focus:ring-offset-0 text-sm shadow-none">
                    <SelectValue
                      placeholder={
                        citiesLoading
                          ? "Loading cities..."
                          : !country || !state
                          ? "Select location"
                          : "Any location"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Any location option */}
                    <SelectItem value="any">Any location</SelectItem>
                    {citiesError ? (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        {citiesError}
                      </div>
                    ) : cities.length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        No cities available
                      </div>
                    ) : (
                      cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
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
