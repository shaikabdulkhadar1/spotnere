"use client";

import { cn } from "@/lib/utils";
import { Layers, Search, Zap } from "lucide-react";
import type React from "react";

// The main props for the HowItWorks component
interface HowItWorksProps extends React.HTMLAttributes<HTMLElement> {}

// The props for a single step card
interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
}

/**
 * A single step card within the "How It Works" section.
 * It displays an icon, title, description, and a list of benefits.
 */
const StepCard: React.FC<StepCardProps> = ({
  icon,
  title,
  description,
  benefits,
}) => (
  <div
    className={cn(
      "relative rounded-2xl border bg-card p-6 text-card-foreground transition-all duration-300 ease-in-out",
      "hover:scale-105 hover:shadow-lg hover:border-primary/50 hover:bg-muted"
    )}
  >
    {/* Icon */}
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-primary">
      {icon}
    </div>
    {/* Title and Description */}
    <p className="mb-2 text-xl font-semibold">{title}</p>
    <p className="mb-6 text-muted-foreground">{description}</p>
    {/* Benefits List */}
    <ul className="space-y-3">
      {benefits.map((benefit, index) => (
        <li key={index} className="flex items-center gap-3">
          <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
          </div>
          <span className="text-muted-foreground">{benefit}</span>
        </li>
      ))}
    </ul>
  </div>
);

/**
 * A responsive "How It Works" section that displays a 3-step process.
 * It is styled with shadcn/ui theme variables to support light and dark modes.
 */
export const HowItWorks: React.FC<HowItWorksProps> = ({
  className,
  ...props
}) => {
  const stepsData = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Enter your interests",
      description:
        "Tell us what you’re looking for — coffee, parks, nightlife, or experiences — and we’ll instantly find the best options near you.",
      benefits: [
        "Understands natural phrases like “best brunch near me” or “quiet spots to read”",
        "Detects your city or lets you choose manually",
        "Displays opening hours and live availability",
      ],
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "Explore the best options",
      description:
        "Compare places by distance, reviews, and popularity — all tailored to your mood and time.",
      benefits: [
        "Filters for category, rating, and distance",
        "Sort by “Most Loved”, “Open Now”, or “Trending Nearby”",
        "View real images and short reels posted by other travelers",
      ],
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Plan, Book & Experience",
      description:
        "Save your favorites, create trips, or book experiences directly within Spotnere.",
      benefits: [
        "Book available slots or activities directly",
        "Contact venues instantly or request a callback",
        "Get instant navigation and directions",
      ],
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Share Your Moments",
      description:
        "Become part of the Spotnere community by capturing and sharing your adventures.",
      benefits: [
        "Post short clips that inspire other explorers",
        "Add captions and tags to reach more people",
        "Be featured in the “Top Explorers” feed",
      ],
    },
  ];

  return (
    <section
      id="how-it-works"
      className={cn("w-full sm:py-24", className)}
      {...props}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <h2 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our platform helps you discover amazing places around you — from
            cozy cafés to hidden adventures. Spotnere combines smart location
            data with real-time insights to make finding your next spot
            effortless.
          </p>
        </div>

        {/* Step Indicators with Connecting Line */}
        <div className="relative mx-auto mb-8 w-full max-w-8xl">
          <div
            aria-hidden="true"
            className="absolute left-[13.6667%] top-1/2 h-0.5 w-[73.6667%] -translate-y-1/2 bg-border"
          ></div>
          {/* Use grid to align numbers with the card grid below */}
          <div className="relative grid grid-cols-4">
            {stepsData.map((_, index) => (
              <div
                key={index}
                // Center the number within its grid column
                className="flex h-8 w-8 items-center justify-center justify-self-center rounded-full bg-muted font-semibold text-foreground ring-4 ring-background"
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Steps Grid */}
        <div className="mx-auto grid max-w-8xl grid-cols-1 gap-8 md:grid-cols-4">
          {stepsData.map((step, index) => (
            <StepCard
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              benefits={step.benefits}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
