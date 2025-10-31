import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
// Replaced icon with logo image from public folder

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-navbar py-3" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/logo.png"
              alt="Spotnere logo"
              className="w-6 h-6 object-contain transition-transform group-hover:scale-110"
            />
            <span className="text-2xl font-serif font-bold text-foreground">
              Spotnere
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/explore"
              className={`text-sm font-medium transition-smooth relative ${
                isActive("/explore")
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
            >
              Explore
              {isActive("/explore") && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
              )}
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium transition-smooth relative ${
                isActive("/about")
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
            >
              About
              {isActive("/about") && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
              )}
            </Link>
            <Link
              to="/contact"
              className={`text-sm font-medium transition-smooth relative ${
                isActive("/contact")
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
            >
              Contact
              {isActive("/contact") && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          </div>

          <Button asChild size="sm" className="transition-smooth hover-lift">
            <Link to="/explore">Start Exploring</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
