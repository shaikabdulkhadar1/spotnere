import { Link } from "react-router-dom";
import { MapPin, Mail, Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-6 h-6 text-primary" />
              <span className="text-xl font-serif font-bold">Spotnere</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Discover amazing places near you. From cozy cafés to hidden parks,
              we help you find the best spots for every moment.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/explore" className="text-muted-foreground hover:text-primary transition-smooth">
                  All Places
                </Link>
              </li>
              <li>
                <Link to="/explore?category=cafe" className="text-muted-foreground hover:text-primary transition-smooth">
                  Cafés
                </Link>
              </li>
              <li>
                <Link to="/explore?category=park" className="text-muted-foreground hover:text-primary transition-smooth">
                  Parks
                </Link>
              </li>
              <li>
                <Link to="/explore?category=museum" className="text-muted-foreground hover:text-primary transition-smooth">
                  Museums
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-smooth">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-smooth">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Spotnere. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-smooth"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-smooth"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-smooth"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
