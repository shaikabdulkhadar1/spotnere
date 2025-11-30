import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlaceCard from "@/components/PlaceCard";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePlaces, useSearchPlaces } from "@/hooks/use-places";
import { useGeolocation } from "@/contexts/GeolocationContext";
import {
  filterPlacesByCountry,
  filterPlacesByCategory,
  filterPlacesByState,
  filterPlacesByCity,
} from "@/lib/place-filters";
import { categories, getSubCategories, categoryExists } from "@/lib/categories";
import { X, Filter, Search } from "lucide-react";

const defaultProps = {
  gradientColors: {
    from: "oklch(0.646 0.222 41.116)",
    to: "oklch(0.488 0.243 264.376)",
  },
};

const Explore = () => {
  const [searchParams] = useSearchParams();
  const searchLocation = searchParams.get("location") || "";
  const searchCityParam = searchParams.get("city") || "";
  // Only use city filter if a specific city is provided (not "any" or empty)
  const searchCity =
    searchCityParam && searchCityParam !== "any" ? searchCityParam : "";
  const isSearchMode = !!(searchLocation || searchCityParam);

  const { country } = useGeolocation();
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState(!isSearchMode);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [states, setStates] = useState<{ name: string; state_code?: string }[]>(
    []
  );
  const [statesLoading, setStatesLoading] = useState(false);
  const [statesError, setStatesError] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [citiesError, setCitiesError] = useState<string | null>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Show skeleton loader for 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Fetch states for the user's country from CountriesNow API
  // API docs/sample response: `https://countriesnow.space/api/v0.1/countries/states`
  useEffect(() => {
    // If we don't have a country yet, clear states and skip
    if (!country) {
      setStates([]);
      return;
    }

    let isCancelled = false;

    const fetchStates = async () => {
      try {
        setStatesLoading(true);
        setStatesError(null);

        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/states"
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch states: ${response.statusText}`);
        }

        const json: {
          error?: boolean;
          msg?: string;
          data?: {
            name: string;
            iso2?: string;
            iso3?: string;
            states?: { name: string; state_code: string }[];
          }[];
        } = await response.json();

        if (isCancelled) return;

        const allCountries = json.data || [];
        const countryLower = country.toLowerCase();

        // Find the matching country by name (case-insensitive)
        const matchedCountry = allCountries.find(
          (c) => c.name && c.name.toLowerCase() === countryLower
        );

        if (matchedCountry && matchedCountry.states) {
          setStates(matchedCountry.states);
        } else {
          setStates([]);
        }
      } catch (err) {
        if (isCancelled) return;
        console.error("Error fetching states data:", err);
        setStates([]);
        setStatesError("Unable to load states for your country right now.");
      } finally {
        if (!isCancelled) {
          setStatesLoading(false);
        }
      }
    };

    fetchStates();

    return () => {
      isCancelled = true;
    };
  }, [country]);

  // Fetch cities for the selected state from CountriesNow API
  // API docs/sample: https://countriesnow.space/api/v0.1/countries/state/cities
  useEffect(() => {
    // Reset city selection when state changes
    setSelectedCity("");
    setCities([]);
    setCitiesError(null);

    // Only fetch cities when we have both country and state
    if (!country || !selectedState) {
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
              state: selectedState,
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
        setCitiesError("Unable to load cities for this state right now.");
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
  }, [country, selectedState]);

  // Check if search term matches a category
  const matchedCategory = useMemo(() => {
    if (!searchLocation) return null;
    const searchLower = searchLocation.toLowerCase().trim();

    // Check if search term matches any category name
    for (const category of categories) {
      if (category.name.toLowerCase() === searchLower) {
        return category.name;
      }
      // Also check subcategories
      for (const subCat of category.subCategories) {
        if (subCat.toLowerCase() === searchLower) {
          return category.name; // Return parent category
        }
      }
    }
    return null;
  }, [searchLocation]);

  // Build search query from URL params (only for place name search, not category)
  const searchQuery = useMemo(() => {
    // If it's a category match, don't use search query
    if (matchedCategory) return "";

    // Only use location for name search, not city
    if (searchLocation) return searchLocation;
    return "";
  }, [searchLocation, matchedCategory]);

  // Fetch places from API - use search if in search mode, otherwise get all places
  const {
    data: allPlaces,
    isLoading,
    isError,
    error,
  } = usePlaces({
    limit: 1000, // Get all places to filter
    enabled: !isSearchMode,
  });

  // Use search API when in search mode (only if not a category match)
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    isError: isSearchError,
    error: searchError,
  } = useSearchPlaces(
    searchQuery,
    100,
    isSearchMode && searchQuery.length > 0 && !matchedCategory
  );

  // Fetch places for category filtering when category is matched
  const {
    data: categoryPlaces,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
    error: categoryError,
  } = usePlaces({
    limit: 1000,
    enabled: isSearchMode && !!matchedCategory,
  });

  // Filter places by country first
  const countryFilteredPlaces = useMemo(() => {
    if (!allPlaces || !country) return [];
    return filterPlacesByCountry(allPlaces, country);
  }, [allPlaces, country]);

  // Apply all filters
  const filteredPlaces = useMemo(() => {
    // If in search mode with category match, filter by category
    if (isSearchMode && matchedCategory && categoryPlaces) {
      let places = filterPlacesByCategory(categoryPlaces, matchedCategory);

      // Filter by state if selected in sidebar
      if (selectedState) {
        places = filterPlacesByState(places, selectedState);
      }

      // Filter by city if selected (prioritize sidebar selection over URL param)
      if (selectedCity) {
        places = filterPlacesByCity(places, selectedCity);
      } else if (searchCity) {
        places = filterPlacesByCity(places, searchCity);
      }

      // Apply additional filters
      if (selectedCategories.length > 0) {
        const categoryFiltered: typeof places = [];
        selectedCategories.forEach((category) => {
          const categoryPlaces = filterPlacesByCategory(places, category);
          categoryFiltered.push(...categoryPlaces);
        });
        places = Array.from(
          new Map(categoryFiltered.map((place) => [place.id, place])).values()
        );
      }

      if (selectedSubCategories.length > 0) {
        places = places.filter((place) => {
          if (!place.subCategory) return false;
          return selectedSubCategories.some(
            (subCat) =>
              place.subCategory?.toLowerCase().trim() ===
              subCat.toLowerCase().trim()
          );
        });
      }

      places = places.filter((place) => {
        if (!place.avgPrice) return true; // Include places without price
        return (
          place.avgPrice >= priceRange[0] && place.avgPrice <= priceRange[1]
        );
      });

      if (minRating > 0) {
        places = places.filter((place) => place.rating >= minRating);
      }

      return places;
    }

    // If in search mode, use search results directly (name search only)
    if (isSearchMode && searchResults) {
      // Filter search results to only include places where name matches (if searchQuery exists)
      let places = searchResults;
      if (searchQuery && searchQuery.trim().length > 0) {
        places = searchResults.filter((place) => {
          const placeName = place.name.toLowerCase();
          const searchLower = searchQuery.toLowerCase().trim();
          return placeName.includes(searchLower);
        });
      }

      // Filter by state if selected in sidebar
      if (selectedState) {
        places = filterPlacesByState(places, selectedState);
      }

      // Filter by city if selected (prioritize sidebar selection over URL param)
      if (selectedCity) {
        places = filterPlacesByCity(places, selectedCity);
      } else if (searchCity) {
        places = filterPlacesByCity(places, searchCity);
      }

      // Filter by selected categories
      if (selectedCategories.length > 0) {
        const categoryFiltered: typeof places = [];
        selectedCategories.forEach((category) => {
          const categoryPlaces = filterPlacesByCategory(places, category);
          categoryFiltered.push(...categoryPlaces);
        });
        places = Array.from(
          new Map(categoryFiltered.map((place) => [place.id, place])).values()
        );
      }

      // Filter by selected subcategories
      if (selectedSubCategories.length > 0) {
        places = places.filter((place) => {
          if (!place.subCategory) return false;
          return selectedSubCategories.some(
            (subCat) =>
              place.subCategory?.toLowerCase().trim() ===
              subCat.toLowerCase().trim()
          );
        });
      }

      // Filter by price range (only filter if price exists, otherwise include the place)
      places = places.filter((place) => {
        if (!place.avgPrice) return true; // Include places without price
        return (
          place.avgPrice >= priceRange[0] && place.avgPrice <= priceRange[1]
        );
      });

      // Filter by minimum rating
      if (minRating > 0) {
        places = places.filter((place) => place.rating >= minRating);
      }

      return places;
    }

    // Normal filtering mode
    let places = countryFilteredPlaces;

    // Filter by selected state
    if (selectedState) {
      places = filterPlacesByState(places, selectedState);
    }

    // Filter by selected city
    if (selectedCity) {
      places = filterPlacesByCity(places, selectedCity);
    }

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      const categoryFiltered: typeof places = [];
      selectedCategories.forEach((category) => {
        const categoryPlaces = filterPlacesByCategory(places, category);
        categoryFiltered.push(...categoryPlaces);
      });
      // Remove duplicates
      places = Array.from(
        new Map(categoryFiltered.map((place) => [place.id, place])).values()
      );
    }

    // Filter by selected subcategories
    if (selectedSubCategories.length > 0) {
      places = places.filter((place) => {
        if (!place.subCategory) return false;
        return selectedSubCategories.some(
          (subCat) =>
            place.subCategory?.toLowerCase().trim() ===
            subCat.toLowerCase().trim()
        );
      });
    }

    // Filter by price range (only filter if price exists, otherwise include the place)
    places = places.filter((place) => {
      if (!place.avgPrice) return true; // Include places without price
      return place.avgPrice >= priceRange[0] && place.avgPrice <= priceRange[1];
    });

    // Filter by minimum rating
    if (minRating > 0) {
      places = places.filter((place) => place.rating >= minRating);
    }

    return places;
  }, [
    isSearchMode,
    matchedCategory,
    categoryPlaces,
    searchResults,
    searchQuery,
    searchCity,
    countryFilteredPlaces,
    selectedState,
    selectedCity,
    selectedCategories,
    selectedSubCategories,
    priceRange,
    minRating,
  ]);

  // Toggle category selection
  const toggleCategory = (categoryName: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryName)) {
        return prev.filter((cat) => cat !== categoryName);
      } else {
        return [...prev, categoryName];
      }
    });
    // Clear subcategories when category is deselected
    if (selectedCategories.includes(categoryName)) {
      const subCats = getSubCategories(categoryName);
      setSelectedSubCategories((prev) =>
        prev.filter((subCat) => !subCats.includes(subCat))
      );
    }
  };

  // Toggle subcategory selection
  const toggleSubCategory = (subCategoryName: string) => {
    setSelectedSubCategories((prev) => {
      if (prev.includes(subCategoryName)) {
        return prev.filter((subCat) => subCat !== subCategoryName);
      } else {
        return [...prev, subCategoryName];
      }
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedState("");
    setSelectedCity("");
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setPriceRange([0, 500]);
    setMinRating(0);
  };

  // Get available subcategories based on selected categories
  const availableSubCategories = useMemo(() => {
    const subCats: string[] = [];
    selectedCategories.forEach((categoryName) => {
      const subCategories = getSubCategories(categoryName);
      subCats.push(...subCategories);
    });
    return Array.from(new Set(subCats));
  }, [selectedCategories]);

  return (
    <div className="min-h-screen relative ">
      <Navbar />

      {/* Scrollable Content */}
      <div className="relative z-10 pt-32 pb-12 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1" />
              <div className="flex-1 text-center">
                {isSearchMode ? (
                  <>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-2 text-foreground flex items-center justify-center gap-2">
                      <Search className="h-8 w-8 md:h-10 md:w-10" />
                      Search Results
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      {searchLocation && searchCity
                        ? `Results for "${searchLocation}" in ${searchCity}`
                        : searchLocation
                        ? `Results for "${searchLocation}"${
                            searchCityParam === "any" ? " (any location)" : ""
                          }`
                        : searchCity
                        ? `Results in ${searchCity}`
                        : "Search results"}
                    </p>
                    {filteredPlaces.length > 0 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {filteredPlaces.length} place
                        {filteredPlaces.length !== 1 ? "s" : ""} found
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-2 text-foreground">
                      Explore Places
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      {country
                        ? `Discover amazing places in ${country}`
                        : "Discover amazing places"}
                    </p>
                    {filteredPlaces.length > 0 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {filteredPlaces.length} place
                        {filteredPlaces.length !== 1 ? "s" : ""} found
                      </p>
                    )}
                  </>
                )}
              </div>
              <div className="flex-1 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Filter Sidebar */}
            <aside
              className={`${
                sidebarOpen ? "block" : "hidden"
              } md:block w-full md:w-80 flex-shrink-0`}
            >
              <GlassCard hover={false} className="sticky top-32 p-6">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-xl font-semibold">Filters</p>
                  <div className="flex items-center gap-2">
                    {(selectedCategories.length > 0 ||
                      selectedSubCategories.length > 0 ||
                      selectedState ||
                      selectedCity ||
                      priceRange[0] > 0 ||
                      priceRange[1] < 500 ||
                      minRating > 0) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-xs"
                      >
                        Clear All
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="md:hidden"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* State Filter */}
                {country && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-base font-semibold block">
                        State
                      </Label>
                      {selectedState && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedState("")}
                          className="text-xs h-auto p-0"
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                    <Select
                      value={selectedState || undefined}
                      onValueChange={setSelectedState}
                      disabled={statesLoading || !country}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            statesLoading
                              ? "Loading states..."
                              : "Select a state"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem
                            key={state.state_code || state.name}
                            value={state.name}
                          >
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {statesError && (
                      <p className="mt-2 text-xs text-destructive">
                        {statesError}
                      </p>
                    )}
                  </div>
                )}

                <Separator className="my-6" />

                {/* City Filter - shown only when a state is selected */}
                {country && selectedState && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-base font-semibold block">
                        City
                      </Label>
                      {selectedCity && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedCity("")}
                          className="text-xs h-auto p-0"
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                    <Select
                      value={selectedCity || undefined}
                      onValueChange={setSelectedCity}
                      disabled={citiesLoading || !selectedState}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            citiesLoading
                              ? "Loading cities..."
                              : "Select a city"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {citiesError && (
                      <p className="mt-2 text-xs text-destructive">
                        {citiesError}
                      </p>
                    )}
                  </div>
                )}

                <Separator className="my-6" />

                {/* Categories Filter */}
                <div className="mb-6">
                  <Label className="text-base font-semibold mb-3 block">
                    Categories
                  </Label>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div key={category.name} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category.name}`}
                            checked={selectedCategories.includes(category.name)}
                            onCheckedChange={() =>
                              toggleCategory(category.name)
                            }
                          />
                          <Label
                            htmlFor={`category-${category.name}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {category.name}
                          </Label>
                        </div>
                        {/* Show subcategories when category is selected */}
                        {selectedCategories.includes(category.name) && (
                          <div className="ml-6 space-y-2">
                            {category.subCategories.map((subCat) => (
                              <div
                                key={subCat}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`subcat-${subCat}`}
                                  checked={selectedSubCategories.includes(
                                    subCat
                                  )}
                                  onCheckedChange={() =>
                                    toggleSubCategory(subCat)
                                  }
                                />
                                <Label
                                  htmlFor={`subcat-${subCat}`}
                                  className="text-xs font-normal cursor-pointer text-muted-foreground"
                                >
                                  {subCat}
                                </Label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Price Range Filter */}
                <div className="mb-6">
                  <Label className="text-base font-semibold mb-3 block">
                    Price Range
                  </Label>
                  <div className="space-y-4">
                    <Slider
                      value={priceRange}
                      onValueChange={(value) =>
                        setPriceRange(value as [number, number])
                      }
                      min={0}
                      max={500}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Rating Filter */}
                <div className="mb-6">
                  <Label className="text-base font-semibold mb-3 block">
                    Minimum Rating
                  </Label>
                  <div className="space-y-4">
                    <Slider
                      value={[minRating]}
                      onValueChange={(value) => setMinRating(value[0])}
                      min={0}
                      max={5}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>0</span>
                      <span className="font-medium">{minRating} ⭐</span>
                      <span>5</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </aside>

            {/* Places Grid */}
            <main className="flex-1">
              {isSearchMode ? (
                // Search mode loading/error states
                isSearchLoading || (matchedCategory && isCategoryLoading) ? (
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <GlassCard
                        key={i}
                        hover={false}
                        className="h-[22rem] animate-pulse"
                      >
                        <div className="w-full h-full bg-muted/20 rounded-lg" />
                      </GlassCard>
                    ))}
                  </div>
                ) : isSearchError || (matchedCategory && isCategoryError) ? (
                  <GlassCard
                    hover={false}
                    className="h-[400px] flex items-center justify-center"
                  >
                    <div className="text-center">
                      <p className="text-destructive mb-2">
                        Failed to load search results
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {searchError instanceof Error
                          ? searchError.message
                          : "An error occurred"}
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                      >
                        Try Again
                      </Button>
                    </div>
                  </GlassCard>
                ) : filteredPlaces.length === 0 ? (
                  <GlassCard
                    hover={false}
                    className="h-[400px] flex items-center justify-center"
                  >
                    <div className="text-center">
                      <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-xl font-semibold mb-2">
                        No places found
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search terms or filters
                      </p>
                    </div>
                  </GlassCard>
                ) : (
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredPlaces.map((place) => (
                      <PlaceCard key={place.id} place={place} />
                    ))}
                  </div>
                )
              ) : (
                // Normal explore mode loading/error states
                <>
                  {isLoading || showSkeleton ? (
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {[...Array(6)].map((_, i) => (
                        <GlassCard
                          key={i}
                          hover={false}
                          className="h-[22rem] animate-pulse"
                        >
                          <div className="w-full h-full bg-muted/20 rounded-lg" />
                        </GlassCard>
                      ))}
                    </div>
                  ) : isError ? (
                    <GlassCard
                      hover={false}
                      className="h-[400px] flex items-center justify-center"
                    >
                      <div className="text-center">
                        <p className="text-destructive mb-2">
                          Failed to load places
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {error instanceof Error
                            ? error.message
                            : "Unknown error"}
                        </p>
                        <Button
                          onClick={() => window.location.reload()}
                          className="mt-4"
                          variant="outline"
                        >
                          Retry
                        </Button>
                      </div>
                    </GlassCard>
                  ) : !country ? (
                    <GlassCard
                      hover={false}
                      className="h-[400px] flex items-center justify-center"
                    >
                      <div className="text-center">
                        <p className="text-muted-foreground mb-2">
                          Getting your location...
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Please allow location access to see places in your
                          country
                        </p>
                      </div>
                    </GlassCard>
                  ) : filteredPlaces.length === 0 ? (
                    <GlassCard
                      hover={false}
                      className="h-[400px] flex items-center justify-center"
                    >
                      <div className="text-center">
                        <p className="text-muted-foreground mb-2">
                          No places found
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your filters
                        </p>
                        <Button
                          onClick={clearFilters}
                          className="mt-4"
                          variant="outline"
                        >
                          Clear Filters
                        </Button>
                      </div>
                    </GlassCard>
                  ) : (
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredPlaces.map((place) => (
                        <PlaceCard key={place.id} place={place} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Explore;
