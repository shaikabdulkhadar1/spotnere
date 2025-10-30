import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import { Target, Heart, Users, Zap } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Discovery First",
      description:
        "We believe every neighborhood has hidden gems waiting to be found. Our mission is to make discovery effortless and delightful.",
    },
    {
      icon: Heart,
      title: "Community Driven",
      description:
        "Real reviews from real people. We're building a platform where authentic experiences matter more than marketing.",
    },
    {
      icon: Users,
      title: "For Everyone",
      description:
        "Whether you're a local or a traveler, budget-conscious or seeking luxury, Spotnere helps you find the perfect place.",
    },
    {
      icon: Zap,
      title: "Always Evolving",
      description:
        "We're constantly improving our platform with new features, better filters, and smarter recommendations.",
    },
  ];

  const milestones = [
    { year: "2023", event: "Spotnere founded with a vision to unify local discovery" },
    { year: "2024", event: "Reached 100,000+ places across 1,000 cities" },
    { year: "2024", event: "Launched advanced filtering and personalized recommendations" },
    { year: "2025", event: "Expanded to 2,000+ cities with community reviews" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-32 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Hero */}
          <div className="text-center mb-16 animate-fade-up">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              About Spotnere
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We're on a mission to help you discover the best places near you—
              from cozy cafés to hidden parks, cultural museums to vibrant nightlife.
            </p>
          </div>

          {/* Mission */}
          <GlassCard hover={false} className="mb-16 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <h2 className="text-3xl font-serif font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              Spotnere was born from a simple frustration: finding great places
              nearby shouldn't require juggling multiple apps, endless scrolling,
              or questionable recommendations. We built a unified platform that
              brings together parks, restaurants, museums, events, and more—all
              tailored to your location and preferences. Our goal is to make
              every outing an adventure worth remembering.
            </p>
          </GlassCard>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-serif font-bold mb-8 text-center">
              Our Values
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <GlassCard
                  key={value.title}
                  className="animate-fade-up"
                  style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <GlassCard hover={false} className="mb-16">
            <h2 className="text-3xl font-serif font-bold mb-8">Our Journey</h2>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary">
                        {milestone.year}
                      </span>
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="absolute top-16 left-1/2 w-0.5 h-8 bg-border -translate-x-1/2" />
                    )}
                  </div>
                  <div className="flex-1 pt-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {milestone.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Team Section */}
          <div className="text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">The Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Spotnere is built by a passionate team of explorers, designers, and
              engineers who believe that great experiences start with great
              discovery.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-full bg-muted mb-3" />
                  <div className="text-sm font-medium">Team Member</div>
                  <div className="text-xs text-muted-foreground">Role</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
