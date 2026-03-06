import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Heart, Calendar, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    // Check on mount in case page loads below hero
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?location=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4",
      )}
    >
      <div
        className={cn(
          "transition-all duration-300 w-full",
          scrolled ? "max-w-6xl mx-auto px-4" : "container mx-auto px-4",
        )}
      >
        <div
          className={cn(
            "flex items-center transition-all duration-300",
            scrolled ? "justify-between h-[42px]" : "justify-between",
          )}
        >
          <Link
            to="/"
            className={cn(
              "flex items-center gap-2 group shrink-0",
              scrolled ? "z-10" : "",
            )}
          >
            <img
              src="/logo.png"
              alt="Spotnere logo"
              className={`object-contain transition-all duration-300 group-hover:scale-110 ${
                scrolled ? "w-5 h-5" : "w-6 h-6"
              }`}
            />
            <span
              className={`font-serif font-bold text-foreground transition-all duration-300 ${
                scrolled ? "text-xl" : "text-2xl"
              }`}
            >
              Spotnere
            </span>
          </Link>

          <div
            className={cn(
              "hidden md:flex items-center transition-all duration-300",
              scrolled
                ? "flex-1 justify-center h-[42px] px-2"
                : "flex-1 justify-center",
            )}
          >
            {scrolled && (
              <form
                onSubmit={handleSearch}
                className="flex items-center gap-2 transition-all duration-300 w-full max-w-[600px] opacity-100 translate-y-0 animate-in fade-in slide-in-from-top-2"
              >
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-[42px] pr-10 bg-background border-border rounded-full shadow-sm focus:shadow-md transition-shadow focus-visible:ring-2 focus-visible:ring-primary/20"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-[42px] px-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
                >
                  <Search className="h-5 w-5 text-primary-foreground" />
                  <span className="text-primary-foreground font-semibold">
                    Search
                  </span>
                </Button>
              </form>
            )}
          </div>

          <div
            ref={profileMenuRef}
            className={cn(
              "relative shrink-0 h-full flex items-center",
              scrolled ? "z-10" : "",
            )}
          >
            <button
              type="button"
              onClick={() => setIsProfileOpen((o) => !o)}
              className={[
                "flex items-center gap-2 rounded-full border border-border bg-background px-3 h-[42px]",
                "shadow-sm transition-all duration-150 hover:shadow-md hover:-translate-y-[1px]",
                "active:scale-95",
              ].join(" ")}
            >
              {/* Hamburger / menu icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 8h16M4 16h16"
                />
              </svg>
              {/* Avatar */}
              <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                <span>
                  {isLoggedIn && user
                    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() || user.email[0].toUpperCase()
                    : "U"}
                </span>
              </span>
            </button>

            {/* Profile dropdown - positioned at bottom */}
            {isProfileOpen && (
              <div
                className={[
                  "absolute right-0 top-full mt-2 w-60 origin-top-right rounded-2xl border border-border bg-background shadow-xl",
                  "transition-all duration-150 ease-out z-50",
                  "scale-100 opacity-100 translate-y-0",
                ].join(" ")}
              >
                <div className="py-2 text-sm text-foreground">
                  {!isLoggedIn ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          navigate("/login?mode=signup");
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-muted active:scale-[0.99] transition-colors"
                      >
                        <span>Sign Up</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          navigate("/login?mode=login");
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-muted active:scale-[0.99] transition-colors"
                      >
                        <span>Log In</span>
                      </button>
                      <div className="my-1 border-t border-border" />
                      <button
                        type="button"
                        onClick={() => {
                          navigate("/contact");
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-muted active:scale-[0.99] transition-colors"
                      >
                        <span>Contact Us</span>
                      </button>
                    </>
                  ) : (
                    <>
                      {user && (
                        <div className="px-4 py-2.5 border-b border-border">
                          <p className="font-semibold truncate">
                            {user.first_name || user.last_name
                              ? `${user.first_name} ${user.last_name}`.trim()
                              : user.email}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          navigate("/favorites");
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-muted active:scale-[0.99] transition-colors"
                      >
                        <Heart className="h-4 w-4 text-muted-foreground" />
                        <span>Favorites</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          navigate("/bookings");
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-muted active:scale-[0.99] transition-colors"
                      >
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Your Bookings</span>
                      </button>
                      <div className="my-1 border-t border-border" />
                      <button
                        type="button"
                        onClick={() => {
                          navigate("/contact");
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-muted active:scale-[0.99] transition-colors"
                      >
                        <span>Help Center</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                          navigate("/");
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-muted active:scale-[0.99] transition-colors text-destructive"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Log Out</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
