import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlaceCard from "@/components/PlaceCard";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { samplePlaces } from "@/data/places";
import { Link } from "react-router-dom";

import { MapIcon, Grid3x3 } from "lucide-react";

const Explore = () => {
  const [view, setView] = useState<"grid" | "map">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Get unique categories from places
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(samplePlaces.map((place) => place.category))
    );
    return ["All", ...uniqueCategories.sort()];
  }, []);

  // Filter places based on selected category
  const filteredPlaces = useMemo(() => {
    if (selectedCategory === "All") {
      return samplePlaces;
    }
    return samplePlaces.filter((place) => place.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-32 pb-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Featured Categories
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover the best your city has to offer.
            </p>
            <p className="text-lg text-muted-foreground">
              Browse curated categories designed to match every mood, moment,
              and adventure.
            </p>
          </div>

          {/* Category Filter Bar */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  className="cursor-pointer px-4 py-2 text-sm transition-smooth hover:bg-primary hover:text-primary-foreground"
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedCategory(category)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedCategory(category);
                    }
                  }}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Results */}
          <main>
            <div className="flex items-center justify-end mb-6">
              <div className="flex gap-2">
                <Button
                  variant={view === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView("grid")}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={view === "map" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView("map")}
                >
                  <MapIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {view === "grid" ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPlaces.map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </div>
            ) : (
              <GlassCard
                hover={false}
                className="h-[600px] flex items-center justify-center"
              >
                <div className="text-center">
                  <MapIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Map view coming soon</p>
                </div>
              </GlassCard>
            )}
          </main>

          <div className="w-full flex justify-center pt-20">
            <Button
              asChild
              size="sm"
              className="bg-white border border-primary text-black hover:text-white"
            >
              <Link to="/explore" className="px-6 py-6 ">
                Sign In/Log In to see more
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Explore;
