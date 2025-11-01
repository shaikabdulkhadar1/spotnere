import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import PlaceCard from "@/components/PlaceCard";
import { samplePlaces } from "@/data/places";
import {
  Sailboat,
  Coffee,
  Waves,
  Trees,
  Sparkle,
  Wine,
  Gem,
  BadgePlus,
  Palette,
  Utensils,
  Volleyball,
  Users,
  Music,
  Wallet,
  TrendingUp,
  PawPrint,
  Landmark,
  Film,
  Building,
  ArrowUpRight,
  Pin,
} from "lucide-react";
import { AnimatedTestimonialGrid } from "@/components/ui/testimonial-2";
import { HowItWorks } from "@/components/ui/how-it-works";
import { StatCard } from "@/components/ui/card-10";
import { TestimonialsSection } from "@/components/blocks/testimonials-with-marquee";

const defaultProps = {
  gradientColors: {
    from: "oklch(0.646 0.222 41.116)",
    to: "oklch(0.488 0.243 264.376)",
  },
};

// --- SAMPLE DATA ---
const floatingImages = [
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

const testimonials = [
  {
    author: {
      name: "Emma Thompson",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    },
    text: "Spotnere helped me rediscover my own city — I found hidden cafés and quiet reading spots I’d never noticed before.",
    href: "",
  },
  {
    author: {
      name: "Lucas Hernández",
      avatar:
        "https://images.unsplash.com/photo-1603415526960-f7e0328e3d4b?w=150&h=150&fit=crop&crop=face",
    },
    text: "The 'Trending Near Me' section is a game changer. I’ve found so many local gems just by exploring casually on weekends.",
    href: "",
  },
  {
    author: {
      name: "Aisha Patel",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    },
    text: "I love how simple and beautiful the interface is. Searching for places feels natural, and every suggestion fits my mood perfectly.",
    href: "",
  },
  {
    author: {
      name: "Daniel Okafor",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
    },
    text: "As a frequent traveler, I rely on Spotnere to discover unique spots wherever I go — it’s like having a personal guide everywhere.",
    href: "",
  },
  {
    author: {
      name: "Sofia Rossi",
      avatar:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face",
    },
    text: "Spotnere feels personal — every place I visit through it has a story. It’s more than an app; it’s a way to explore meaningfully.",
    href: "",
  },
  {
    author: {
      name: "Ryan Mitchell",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
    text: "I’ve used many travel apps, but Spotnere’s recommendations are spot on. It adapts to my preferences and keeps things fresh.",
    href: "",
  },
  {
    author: {
      name: "Emily Nguyen",
      avatar:
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face",
    },
    text: "Spotnere makes exploring so effortless. Whether it’s a weekend adventure or a quick coffee break, I always find something new.",
    href: "",
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
          testimonials={floatingImages}
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
        className="py-18 px-4 min-h-screen bg-gradient-to-b from-transparent to-muted/20 flex items-center"
      >
        <HowItWorks />
      </section>

      {/* Featured Categories */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
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

          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: Coffee, label: "Cafés", color: "text-amber-600" },
              { icon: Trees, label: "Nature", color: "text-green-600" },
              { icon: Landmark, label: "Museums", color: "text-purple-600" },
              { icon: Users, label: "Family", color: "text-blue-600" },
              { icon: Music, label: "Nightlife", color: "text-pink-600" },
              { icon: Wallet, label: "Budget", color: "text-emerald-600" },
              { icon: TrendingUp, label: "Trending", color: "text-orange-600" },
              { icon: Utensils, label: "Restaurants", color: "text-red-600" },
              { icon: Building, label: "Events", color: "text-teal-600" },
              { icon: Volleyball, label: "Sports", color: "text-yellow-600" },
              { icon: Waves, label: "Beaches", color: "text-blue-600" },
              { icon: PawPrint, label: "Pet-Friendly", color: "text-gray-600" },
              {
                icon: Sparkle,
                label: "Wellness & Spas",
                color: "text-indigo-600",
              },
              {
                icon: Sailboat,
                label: "Water Activities",
                color: "text-violet-600",
              },
              {
                icon: Palette,
                label: "Art Galleries",
                color: "text-emerald-600",
              },
              {
                icon: Film,
                label: "Theaters & Cinemas",
                color: "text-orange-600",
              },
              {
                icon: Wine,
                label: "Rooftop Bars",
                color: "text-fuchsia-600",
              },
              { icon: Gem, label: "Hidden Gems", color: "text-yellow-600" },
              { icon: BadgePlus, label: "Many More", color: "text-stone-600" },
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
      <section className="py-24 px-4 bg-gradient-to-b from-muted/30 to-transparent">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Trending Near You
            </h2>
            <p className="text-lg text-muted-foreground">
              See what's buzzing around you - places that are loved, shared, and
              celebrated by locals and travelers alike.
            </p>
            <p className="text-lg text-muted-foreground">
              Stay updated with places that are making waves right now.
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
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Discover with us
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore the scale of our journey — millions of moments shared
              across places, cities, and experiences.
            </p>
            <p className="text-lg text-muted-foreground">
              Together, we’re redefining how people discover the world around
              them.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <StatCard
              title="Places added"
              valueIcon={Pin}
              value={500}
              change={32}
              changeDescription="last week"
              icon={
                <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400" />
              }
            />
            <StatCard
              title="Cities"
              valueIcon={Building}
              value={30}
              change={12}
              changeDescription="last week"
              icon={
                <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400" />
              }
            />
            <StatCard
              title="Average rating"
              valueIcon={Sparkle}
              value={4}
              change={75}
              changeDescription="last month"
              icon={
                <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400" />
              }
            />
            <StatCard
              title="Users"
              valueIcon={Users}
              value={1500}
              change={27}
              changeDescription="last month"
              icon={
                <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400" />
              }
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-muted/30 to-transparent">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Why People Love Spotnere
            </h2>
            <p className="text-lg text-muted-foreground">
              Real experiences from people discovering their cities and the
              world with Spotnere.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <TestimonialsSection testimonials={testimonials} />
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent to-muted/20">
        <div className="container mx-auto max-w-4xl">
          <GlassCard hover={false} className="text-center p-14">
            <h2 className="text-5xl font-serif font-bold mb-4">
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
