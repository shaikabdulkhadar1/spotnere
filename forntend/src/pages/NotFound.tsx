import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="relative h-screen w-screen overflow-hidden hero-gradient-mesh flex items-center justify-center">
      {/* Animated orbs */}
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />

      {/* Dot grid overlay */}
      <div className="absolute inset-0 hero-dot-grid" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg px-4">
        <div className="relative mb-10">
          <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-background/60 backdrop-blur-sm border-2 border-black/25 flex items-center justify-center shadow-[inset_0_-8px_20px_rgba(0,0,0,0.06)]">
            <span className="text-7xl sm:text-8xl font-extrabold text-foreground/60 select-none tracking-tight">
              404
            </span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-parkinsans text-foreground mb-4">
          Oops! Page Not Found
        </h1>

        <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-md leading-relaxed">
          The page you're looking for seems to have wandered off into the
          digital wilderness. Don't worry, it happens to the best of us!
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-sm font-semibold text-background shadow hover:bg-foreground/90 transition-colors"
          >
            <Home className="h-4 w-4" />
            Take Me Home
          </Link>
        </div>

        <p className="mt-10 text-sm text-muted-foreground/70">
          If you think this is a mistake, please{" "}
          <Link
            to="/contact"
            className="font-medium text-foreground/60 hover:text-foreground transition-colors"
          >
            contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
