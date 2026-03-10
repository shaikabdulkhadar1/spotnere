import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import { FeatureCard } from "@/components/ui/feature-card";
import { motion } from "framer-motion";
import {
  UserSearch,
  MapPinHouse,
  MessageCircleHeart,
  Sparkles,
  Linkedin,
  Twitter,
} from "lucide-react";

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

const team = [
  {
    name: "Syed Thouseef",
    role: "Co-Founder & CEO",
    avatar: "/svg/avatar2.svg",
    socials: { linkedin: "#", twitter: "#" },
  },
  {
    name: "Abdul Khadar",
    role: "Co-Founder & CTO",
    avatar: "/svg/avatar1.svg",
    socials: { linkedin: "#", twitter: "#" },
  },
  {
    name: "Team Member",
    role: "Head of Design",
    avatar: "/svg/avatar3.svg",
    socials: { linkedin: "#" },
  },
];

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const About = () => {
  return (
    <div className="min-h-screen relative overflow-hidden hero-gradient-mesh">
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />
      <div className="absolute inset-0 hero-dot-grid" />

      <Navbar />

      <div className="relative z-10">
        {/* Hero */}
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-4xl text-center animate-fade-up">
            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-4">
              About Us
            </p>
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-foreground">
              About Spotnere
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We're on a mission to make local discovery personal, intelligent,
              and inspiring — helping you uncover the best places around you,
              one spot at a time.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <GlassCard
              hover={false}
              className="animate-fade-up mx-auto text-center max-w-6xl bg-background/60 rounded-3xl p-8"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="text-center mb-16 animate-fade-up">
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">
                  Our Mission
                </h2>
              </div>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
                At Spotnere, our mission is to make local discovery personal,
                intelligent, and inspiring. We connect explorers with unique
                places to visit near them — from cafés and parks to cultural
                landmarks and adventure spots. Our goal is to simplify local
                travel planning through smart filters, real-time data, and
                user-generated reels that bring destinations to life. Whether
                you're searching for hidden gems near you, planning a
                spontaneous trip, or simply exploring your city, Spotnere
                transforms your curiosity into unforgettable experiences.
              </p>
              <div className="w-16 h-px bg-primary/30 mx-auto mb-6" />
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                We believe exploration isn't about distance — it's about
                discovery. Every neighborhood has stories waiting to be
                experienced, and Spotnere helps you find them effortlessly. By
                blending technology, creativity, and community, we're building a
                world where every moment feels like a new journey.
              </p>
            </GlassCard>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12 animate-fade-up">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">
                Our Values
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we create — from the
                experiences we design to the stories we help you discover.
              </p>
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {values.map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    className="bg-background/60 rounded-3xl p-8"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 pb-24 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12 animate-fade-up">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">
                Meet the Team
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Behind every feature is a small team with a big vision — to make
                local exploration smarter, simpler, and more meaningful.
              </p>
            </div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {team.map((member, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <GlassCard className="text-center">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 ring-2 ring-gray-400"
                    />

                    <p className="text-lg font-semibold text-foreground mb-1">
                      {member.name}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      {member.role}
                    </p>
                    <div className="flex justify-center gap-3">
                      {member.socials.linkedin && (
                        <a
                          href={member.socials.linkedin}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {member.socials.twitter && (
                        <a
                          href={member.socials.twitter}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default About;
