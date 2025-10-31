import React from "react";
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
import { AnimatedTestimonialGrid } from "@/components/ui/testimonial-2";

const defaultProps = {
  gradientColors: {
    from: "oklch(0.646 0.222 41.116)",
    to: "oklch(0.488 0.243 264.376)",
  },
};

// --- SAMPLE DATA ---
const testimonials = [
  {
    imgSrc:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300",
    alt: "Professional Man",
  },
  {
    imgSrc:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300",
    alt: "Smiling Man",
  },
  {
    imgSrc:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300",
    alt: "Professional Woman",
  },
  {
    imgSrc:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300",
    alt: "Smiling Woman",
  },
  {
    imgSrc:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300",
    alt: "Man in a suit",
  },
  {
    imgSrc:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300",
    alt: "Bearded Man",
  },
  {
    imgSrc:
      "https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=300",
    alt: "Man in a blue shirt",
  },
  {
    imgSrc:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300",
    alt: "Older Man",
  },
  {
    imgSrc:
      "https://images.unsplash.com/photo-1619895862022-09114b41f16f?q=80&w=300",
    alt: "Woman with curly hair",
  },
  {
    imgSrc:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=300",
    alt: "Woman in an office",
  },
  {
    imgSrc:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300",
    alt: "Woman with glasses",
  },
  {
    imgSrc:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300",
    alt: "Woman with a dog",
  },
];

const Index = () => {
  const featuredPlaces = samplePlaces.slice(0, 6);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-28 pb-24 px-4 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 min-h-screen"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              background: `linear-gradient(to top right, ${defaultProps.gradientColors?.from}, ${defaultProps.gradientColors?.to})`,
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] min-h-screen"
          />
        </div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10 animate-float" />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)] min-h-screen"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              background: `linear-gradient(to top right, ${defaultProps.gradientColors?.from}, ${defaultProps.gradientColors?.to})`,
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem] min-h-screen"
          />
        </div>
        <div
          className="absolute bottom-10 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10 animate-float"
          style={{ animationDelay: "1s" }}
        />
        <AnimatedTestimonialGrid
          testimonials={testimonials}
          title={
            <>
              Find amazing places{" "}
              <span className="gradient-text">near you</span>
            </>
          }
          description="Spotnere unifies parks, cafés, events, and hidden gems—tailored to
            your location."
          ctaText="Explore Now"
          ctaHref="/explore"
        />
      </section>

      {/* How Spotnere Works */}
      <section
        id="how-it-works"
        className="py-24 px-4 min-h-screen bg-gradient-to-b from-transparent to-muted/20 flex items-center"
      >
        <div className="container mx-auto my-auto max-w-6xl">
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
              <Link
                key={category.label}
                to={`/explore?category=${category.label.toLowerCase()}`}
              >
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
