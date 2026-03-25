import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import PlaceCard, { PlaceCardSkeleton } from "@/components/PlaceCard";
import { usePlaces, useSearchPlaces } from "@/hooks/use-places";
import { useGeolocation } from "@/contexts/GeolocationContext";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/categories";

const CATEGORY_PILLS = [
  { label: "All", value: "all", icon: "/categoryImages/allImg.png" },
  ...categories.map((cat) => ({
    label: cat.name,
    value: cat.name,
    icon: cat.icon,
  })),
];

const Index = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { country: geoCountry, loading: geoLoading } = useGeolocation();
  const searchQuery = searchParams.get("q") || "";
  const activeCategory = searchParams.get("category") || "";
  const activeSubcategory = searchParams.get("subcategory") || "";
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pillsRef.current && !pillsRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {
    data: allPlaces,
    isLoading: allLoading,
    isError: allError,
    error: allErr,
  } = usePlaces({
    limit: 100,
    enabled: !geoLoading,
    category: activeCategory || undefined,
    sub_category: activeSubcategory || undefined,
    country: geoCountry || undefined,
  });

  const {
    data: searchResults,
    isLoading: searchLoading,
    isError: searchError,
    error: searchErr,
  } = useSearchPlaces(searchQuery, 100, searchQuery.length > 0);

  const isSearching = searchQuery.length > 0;
  const isFiltering = !!activeCategory;
  const places = isSearching ? searchResults : allPlaces;
  const isLoading = isSearching ? searchLoading : (geoLoading || allLoading);
  const isError = isSearching ? searchError : allError;
  const error = isSearching ? searchErr : allErr;

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section - Search Bar */}
      <SearchBar />

      {/* Category Pills */}
      <div className="sticky top-[58px] z-40 bg-background/80 backdrop-blur-md">
        <div
          ref={pillsRef}
          className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-center gap-2 flex-wrap"
        >
          {CATEGORY_PILLS.map((cat) => {
            const catData = categories.find((c) => c.name === cat.value);
            const isOpen = openDropdown === cat.value;
            const isActive =
              cat.value === "all"
                ? !activeCategory
                : activeCategory === cat.value;

            return (
              <div key={cat.value} className="relative shrink-0">
                <button
                  onClick={() => {
                    if (cat.value === "all") {
                      navigate("/");
                      setOpenDropdown(null);
                    } else {
                      setOpenDropdown(isOpen ? null : cat.value);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    "border active:scale-95",
                    isActive
                      ? "border-primary bg-primary/10 text-primary shadow-sm ring-1 ring-primary/30"
                      : isOpen
                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                        : "border-border bg-background text-foreground hover:bg-muted hover:shadow-sm",
                  )}
                >
                  <img
                    src={cat.icon}
                    alt={cat.label}
                    className="w-6 h-6"
                  />
                  {cat.label}
                  {cat.value !== "all" && (
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        isOpen && "rotate-180",
                      )}
                    />
                  )}
                </button>

                {isOpen && catData && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 max-h-[220px] overflow-y-auto rounded-xl border border-border bg-background shadow-xl py-1.5 z-[45] animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                      onClick={() => {
                        navigate(
                          `/?category=${encodeURIComponent(cat.value)}`,
                        );
                        setOpenDropdown(null);
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm font-medium transition-colors",
                        activeCategory === cat.value && !activeSubcategory
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted",
                      )}
                    >
                      All {cat.label}
                    </button>
                    <div className="mx-3 my-1 border-t border-border" />
                    {catData.subCategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => {
                          navigate(
                            `/?category=${encodeURIComponent(cat.value)}&subcategory=${encodeURIComponent(sub)}`,
                          );
                          setOpenDropdown(null);
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm transition-colors",
                          activeCategory === cat.value && activeSubcategory === sub
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-foreground hover:bg-muted",
                        )}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Places Grid */}
      <section className="py-10 px-4">
        <div className="max-w-[1400px] mx-auto">
          {isSearching && (
            <div className="flex items-center gap-3 mb-6">
              <p className="text-lg text-muted-foreground">
                Results for <span className="font-semibold text-foreground">"{searchQuery}"</span>
              </p>
              <button
                onClick={() => setSearchParams({})}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            </div>
          )}

          {!isSearching && isFiltering && (
            <div className="flex items-center gap-3 mb-6">
              <p className="text-lg text-muted-foreground">
                {activeSubcategory ? (
                  <>
                    <span className="font-semibold text-foreground">{activeSubcategory}</span>
                    {" "}in{" "}
                    <span className="font-semibold text-foreground">{activeCategory}</span>
                  </>
                ) : (
                  <>
                    All{" "}
                    <span className="font-semibold text-foreground">{activeCategory}</span>
                  </>
                )}
              </p>
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
                Clear filter
              </button>
            </div>
          )}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <PlaceCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-destructive mb-2">Failed to load places</p>
                <p className="text-sm text-muted-foreground">
                  {error instanceof Error ? error.message : "Unknown error"}
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4"
                  variant="outline"
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : places && places.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {[...places]
                .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
                .map((place, index) => (
                  <PlaceCard
                    key={place.id}
                    place={place}
                    isGuestFavorite={!isSearching && index < 5}
                  />
                ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-muted-foreground">
                  {isSearching
                    ? `No places found for "${searchQuery}"`
                    : isFiltering
                      ? `No places found in "${activeSubcategory || activeCategory}"`
                      : "No places found"}
                </p>
                {(isSearching || isFiltering) && (
                  <Button
                    onClick={() => isSearching ? setSearchParams({}) : navigate("/")}
                    className="mt-4"
                    variant="outline"
                  >
                    {isSearching ? "Clear Search" : "Clear Filter"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
