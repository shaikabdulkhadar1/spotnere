import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageSquare, MapPin, Phone } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "We'll get back to you within 24 hours.",
      });
      setIsSubmitting(false);
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-32 pb-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 animate-fade-up">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have a question, suggestion, or want to partner with us? We'd love
              to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <GlassCard
              hover={false}
              className="animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              <p className="text-2xl font-serif font-bold mb-6">
                Send us a message
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    required
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    required
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select required>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="listing">Add a Listing</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Brief subject line"
                    required
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more..."
                    rows={5}
                    required
                    className="mt-1.5 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full hover-lift"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  We typically respond within 24 hours
                </p>
              </form>
            </GlassCard>

            {/* Contact Info */}
            <div
              className="space-y-6 animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              <GlassCard className="group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <p className="text-xl font-serif font-semibold mb-2">Email</p>
                <p className="text-muted-foreground mb-2">
                  For general inquiries and support
                </p>
                <a
                  href="mailto:Syedthbst7@gmail.com"
                  className="text-primary hover:underline"
                >
                  Syedthbst7@gmail.com
                </a>
              </GlassCard>

              <GlassCard className="group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <p className="text-xl font-serif font-semibold mb-2">Call Us</p>
                <p className="text-muted-foreground mb-2">
                  Own a business? Get listed on Spotnere
                </p>
                <a href="" className="text-primary hover:underline">
                  +91 9392323040 / +91 6303885143
                </a>
              </GlassCard>

              <GlassCard className="group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <p className="text-xl font-serif font-semibold mb-2">
                  Meet us at our office
                </p>
                <p className="text-muted-foreground mb-2">
                  Own a business? Get listed on Spotnere
                </p>
                <a href="" className="text-primary hover:underline">
                  Shaheen Nagar, Opposite Paradise Functional Hall lane, 500005
                </a>
              </GlassCard>

              <GlassCard hover={false} className="bg-primary/5">
                <p className="text-xl font-serif font-semibold mb-3">
                  Follow Us
                </p>
                <p className="text-muted-foreground mb-4">
                  Stay updated with the latest features and places
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://twitter.com"
                    className="text-primary hover:underline text-sm"
                  >
                    Twitter
                  </a>
                  <a
                    href="https://instagram.com"
                    className="text-primary hover:underline text-sm"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://linkedin.com"
                    className="text-primary hover:underline text-sm"
                  >
                    LinkedIn
                  </a>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
