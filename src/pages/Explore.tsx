import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlaceCard from "@/components/PlaceCard";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { samplePlaces } from "@/data/places";
import { SlidersHorizontal, MapIcon, Grid3x3 } from "lucide-react";

const Explore = () => {
  const [view, setView] = useState<"grid" | "map">("grid");
  const [distance, setDistance] = useState([10]);

  const categories = ["All", "Cafe", "Restaurant", "Park", "Museum", "Nightlife", "Event"];
  const pricelevels = ["$", "$$", "$$$"];
  const amenities = ["wifi", "kid-friendly", "pet-friendly", "wheelchair", "parking"];

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Explore Places
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover amazing spots tailored to your preferences
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-80 shrink-0">
              <GlassCard hover={false} className="sticky top-28">
                <div className="flex items-center gap-2 mb-6">
                  <SlidersHorizontal className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-serif font-semibold">Filters</h2>
                </div>

                <div className="space-y-6">
                  {/* Location */}
                  <div>
                    <Label className="mb-2 block">Location</Label>
                    <Input placeholder="Enter city or zip code" />
                  </div>

                  {/* Distance */}
                  <div>
                    <Label className="mb-2 block">
                      Distance: {distance[0]} km
                    </Label>
                    <Slider
                      value={distance}
                      onValueChange={setDistance}
                      max={50}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <Label className="mb-3 block">Category</Label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <Badge
                          key={cat}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-smooth"
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Price Level */}
                  <div>
                    <Label className="mb-3 block">Price</Label>
                    <div className="flex gap-2">
                      {pricelevels.map((price) => (
                        <Badge
                          key={price}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-smooth"
                        >
                          {price}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <Label className="mb-2 block">Minimum Rating</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Any rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any rating</SelectItem>
                        <SelectItem value="4.0">4.0+</SelectItem>
                        <SelectItem value="4.5">4.5+</SelectItem>
                        <SelectItem value="5.0">5.0</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Open Now */}
                  <div className="flex items-center space-x-2">
                    <Checkbox id="open-now" />
                    <Label htmlFor="open-now" className="cursor-pointer">
                      Open Now
                    </Label>
                  </div>

                  {/* Amenities */}
                  <div>
                    <Label className="mb-3 block">Amenities</Label>
                    <div className="space-y-2">
                      {amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Checkbox id={amenity} />
                          <Label htmlFor={amenity} className="cursor-pointer capitalize">
                            {amenity}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <Label className="mb-2 block">Sort By</Label>
                    <Select defaultValue="relevance">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="distance">Distance</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                        <SelectItem value="popularity">Popularity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full">Apply Filters</Button>
                </div>
              </GlassCard>
            </aside>

            {/* Results */}
            <main className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  Found <span className="font-semibold text-foreground">{samplePlaces.length}</span> places
                </p>
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
                  {samplePlaces.map((place) => (
                    <PlaceCard key={place.id} place={place} />
                  ))}
                </div>
              ) : (
                <GlassCard hover={false} className="h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <MapIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Map view coming soon</p>
                  </div>
                </GlassCard>
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
