import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import PlaceCard from "@/components/PlaceCard";
import { samplePlaces } from "@/data/places";
import {
  Search,
  Map,
  Filter,
  Navigation,
  Coffee,
  Trees,
  Palette,
  Users,
  Music,
  Wallet,
  TrendingUp,
  BarChart3,
  MapPin,
  Star,
} from "lucide-react";

const Index = () => {
  const featuredPlaces = samplePlaces.slice(0, 6);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent -z-10" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10 animate-float" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: "1s" }} />

        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 animate-fade-up">
            Find amazing places{" "}
            <span className="gradient-text">near you</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Spotnere unifies parks, cafés, events, and hidden gems—tailored to
            your location.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <Button asChild size="lg" className="text-base hover-lift">
              <Link to="/explore">Start Exploring</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base">
              <a href="#how-it-works">How it works</a>
            </Button>
          </div>

          {/* Search Bar */}
          <GlassCard className="max-w-3xl mx-auto animate-fade-up" hover={false} style={{ animationDelay: "0.3s" }}>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Your location (auto-detect)"
                  className="bg-background/50"
                />
              </div>
              <div className="w-full md:w-48">
                <Select>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="cafe">Cafés</SelectItem>
                    <SelectItem value="restaurant">Restaurants</SelectItem>
                    <SelectItem value="park">Parks</SelectItem>
                    <SelectItem value="museum">Museums</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="hover-lift">
                <Search className="w-4 h-4 mr-2" />
                Explore
              </Button>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* How Spotnere Works */}
      <section id="how-it-works" className="py-24 px-4 bg-gradient-to-b from-transparent to-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              How Spotnere Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to discover your next favorite place
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <GlassCard className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                <Map className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3">
                Discover
              </h3>
              <p className="text-muted-foreground">
                Explore nearby places organized by categories, from cozy cafés
                to beautiful parks.
              </p>
            </GlassCard>

            <GlassCard className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                <Filter className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3">Filter</h3>
              <p className="text-muted-foreground">
                Refine by mood, price, rating, and amenities like "open now" or
                "kid-friendly."
              </p>
            </GlassCard>

            <GlassCard className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                <Navigation className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3">Go</h3>
              <p className="text-muted-foreground">
                Save favorites, share with friends, and get directions to your
                next destination.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Featured Categories
            </h2>
            <p className="text-lg text-muted-foreground">
              What are you in the mood for?
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: Coffee, label: "Cafés", color: "text-amber-600" },
              { icon: Trees, label: "Nature", color: "text-green-600" },
              { icon: Palette, label: "Museums", color: "text-purple-600" },
              { icon: Users, label: "Family", color: "text-blue-600" },
              { icon: Music, label: "Nightlife", color: "text-pink-600" },
              { icon: Wallet, label: "Budget", color: "text-emerald-600" },
              { icon: TrendingUp, label: "Trending", color: "text-orange-600" },
            ].map((category) => (
              <Link key={category.label} to={`/explore?category=${category.label.toLowerCase()}`}>
                <GlassCard className="flex items-center gap-2 px-5 py-3">
                  <category.icon className={`w-5 h-5 ${category.color}`} />
                  <span className="font-medium">{category.label}</span>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Highlights */}
      <section className="py-24 px-4 bg-gradient-to-b from-muted/20 to-transparent">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Trending Near You
            </h2>
            <p className="text-lg text-muted-foreground">
              Popular spots loved by the community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" variant="outline" className="hover-lift">
              <Link to="/explore">View All Places</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof & Stats */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <GlassCard hover={false} className="text-center">
            <div className="grid md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-border">
              <div className="py-4 md:py-0">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  <div className="text-4xl font-serif font-bold">120k+</div>
                </div>
                <div className="text-muted-foreground">Places</div>
              </div>
              <div className="py-4 md:py-0">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  <div className="text-4xl font-serif font-bold">2k+</div>
                </div>
                <div className="text-muted-foreground">Cities</div>
              </div>
              <div className="py-4 md:py-0">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-6 h-6 text-primary fill-primary" />
                  <div className="text-4xl font-serif font-bold">4.8</div>
                </div>
                <div className="text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent to-muted/20">
        <div className="container mx-auto max-w-2xl">
          <GlassCard hover={false} className="text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">
              Stay in the Loop
            </h2>
            <p className="text-muted-foreground mb-8">
              Get weekly recommendations for new places to explore in your area
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background/50"
              />
              <Button className="hover-lift">Subscribe</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
