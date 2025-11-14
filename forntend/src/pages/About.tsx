import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Timeline } from "@/components/ui/timeline";
import {
  UserSearch,
  MapPinHouse,
  MessageCircleHeart,
  Sparkles,
} from "lucide-react";
import AboutSection from "@/components/About";
import { motion } from "framer-motion";
import { FeatureCard } from "@/components/ui/feature-card";
import { AuthorCard } from "@/components/ui/content-card";

const About = () => {
  const values = [
    {
      icon: <UserSearch />,
      title: "Human-Centered Discovery",
      description:
        "Every feature in Spotnere is built with real people in mind — explorers, creators, and dreamers. We design experiences that feel natural, intuitive, and built for everyday life.",
    },
    {
      icon: <MapPinHouse />,
      title: "Authentic Experiences",
      description:
        "We believe the best discoveries are genuine. Spotnere highlights trusted local spots and user-shared reels so you can explore confidently and connect with places that truly matter.",
    },
    {
      icon: <MessageCircleHeart />,
      title: "Community & Connection",
      description:
        "Spotnere is powered by a growing global community that shares recommendations, stories, and reviews — making discovery more social, authentic, and rewarding for everyone.",
    },
    {
      icon: <Sparkles />,
      title: "Innovation with Purpose",
      description:
        "We use technology not to complicate travel, but to simplify it. With real-time insights, intelligent search, and location-aware recommendations, Spotnere turns curiosity into discovery.",
    },
  ];

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        // Use a cubic-bezier that matches easeOut to satisfy types in framer-motion v11
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const milestones = [
    {
      title: "2024",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Built and launched Aceternity UI and Aceternity UI Pro from scratch
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://assets.aceternity.com/templates/startup-1.webp"
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://assets.aceternity.com/templates/startup-2.webp"
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://assets.aceternity.com/templates/startup-3.webp"
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://assets.aceternity.com/templates/startup-4.webp"
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "2024",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Built and launched Aceternity UI and Aceternity UI Pro from scratch
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://assets.aceternity.com/templates/startup-1.webp"
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://assets.aceternity.com/templates/startup-2.webp"
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://assets.aceternity.com/templates/startup-3.webp"
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://assets.aceternity.com/templates/startup-4.webp"
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "2024",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Built and launched Aceternity UI and Aceternity UI Pro from scratch
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://assets.aceternity.com/templates/startup-1.webp"
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://assets.aceternity.com/templates/startup-2.webp"
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://assets.aceternity.com/templates/startup-3.webp"
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://assets.aceternity.com/templates/startup-4.webp"
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-26 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Top Section */}
          <div className="text-center mb-16 animate-fade-up">
            <AboutSection />
          </div>

          {/* Mission */}
          <section className="py-18 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                  Our Mission
                </h2>
                <p className="text-lg text-muted-foreground pt-8">
                  At Spotnere, our mission is to make local discovery personal,
                  intelligent, and inspiring. We connect explorers with unique
                  places to visit near them — from cafés and parks to cultural
                  landmarks and adventure spots. Our goal is to simplify local
                  travel planning through smart filters, real-time data, and
                  user-generated reels that bring destinations to life. Whether
                  you’re searching for hidden gems near you, planning a
                  spontaneous trip, or simply exploring your city, Spotnere
                  transforms your curiosity into unforgettable experiences.
                </p>
                <p className="text-lg text-muted-foreground pt-8">
                  We believe exploration isn’t about distance — it’s about
                  discovery. Every neighborhood has stories waiting to be
                  experienced, and Spotnere helps you find them effortlessly. By
                  blending technology, creativity, and community, we’re building
                  a world where every moment feels like a new journey.
                </p>
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="py-24 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                  Our Values
                </h2>
                <p className="text-lg text-muted-foreground">
                  The principles that guide everything we create — from the
                  experiences we design to the stories we help you discover.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {values.map((feature, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <FeatureCard
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="py-24 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                  The Journey So Far
                </h2>
                <p className="text-lg text-muted-foreground">
                  Spotnere began with a simple question — “Why is finding great
                  places still so hard?” What started as a small idea to make
                  local discovery easier has grown into a global community of
                  explorers, creators, and storytellers.
                </p>
              </div>

              <div className="mx-auto">
                <Timeline data={milestones} />
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="py-24 px-4">
            <div className="container mx-auto max-w-8xl">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                  Meet your team
                </h2>
                <p className="text-lg text-muted-foreground">
                  Behind every feature is a small team with a big vision — to
                  make local exploration smarter, simpler, and more meaningful.
                </p>
              </div>

              <div className="mx-auto justify-center grid grid-cols-3 gap-4">
                <AuthorCard
                  backgroundImage="https://images.unsplash.com/photo-1544077960-604201fe74bc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1651&q=80"
                  author={{
                    name: "Manu Arora",
                    avatar:
                      "https://ui.aceternity.com/_next/image?url=%2Fmanu.png&w=256&q=75",
                    readTime: "2 min read",
                  }}
                  content={{
                    title: "Author Card",
                    description:
                      "Card with Author avatar, complete name and time to read - most suitable for blogs.",
                  }}
                />
                <AuthorCard
                  backgroundImage="https://images.unsplash.com/photo-1544077960-604201fe74bc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1651&q=80"
                  author={{
                    name: "Manu Arora",
                    avatar:
                      "https://ui.aceternity.com/_next/image?url=%2Fmanu.png&w=256&q=75",
                    readTime: "2 min read",
                  }}
                  content={{
                    title: "Author Card",
                    description:
                      "Card with Author avatar, complete name and time to read - most suitable for blogs.",
                  }}
                />
                <AuthorCard
                  backgroundImage="https://images.unsplash.com/photo-1544077960-604201fe74bc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1651&q=80"
                  author={{
                    name: "Manu Arora",
                    avatar:
                      "https://ui.aceternity.com/_next/image?url=%2Fmanu.png&w=256&q=75",
                    readTime: "2 min read",
                  }}
                  content={{
                    title: "Author Card",
                    description:
                      "Card with Author avatar, complete name and time to read - most suitable for blogs.",
                  }}
                />
                <AuthorCard
                  backgroundImage="https://images.unsplash.com/photo-1544077960-604201fe74bc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1651&q=80"
                  author={{
                    name: "Manu Arora",
                    avatar:
                      "https://ui.aceternity.com/_next/image?url=%2Fmanu.png&w=256&q=75",
                    readTime: "2 min read",
                  }}
                  content={{
                    title: "Author Card",
                    description:
                      "Card with Author avatar, complete name and time to read - most suitable for blogs.",
                  }}
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
