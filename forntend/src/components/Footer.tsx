import { Link } from "react-router-dom";
import { MapPin, Mail, Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/logo.png"
                alt="Spotnere logo"
                className="w-6 h-6 object-contain transition-transform group-hover:scale-110"
              />{" "}
              <span className="text-xl font-serif font-bold">Spotnere</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Discover amazing places near you. From cozy cafés to hidden parks,
              we help you find the best spots for every moment.
            </p>

            <p className="font-semibold mt-6 mb-3 text-foreground">
              Get the App
            </p>
            <div className="flex flex-row gap-2">
              <a
                href="#"
                className="inline-flex items-center gap-2.5 bg-black text-white rounded-lg px-4 py-2 hover:opacity-80 transition-opacity w-fit"
              >
                <img
                  src="/svg/appstore.svg"
                  alt="App Store"
                  className="w-5 h-5"
                />
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] font-light">
                    Available on the
                  </span>
                  <span className="text-sm font-semibold -mt-0.5">
                    App Store
                  </span>
                </div>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2.5 bg-black text-white rounded-lg px-4 py-2 hover:opacity-80 transition-opacity w-fit"
              >
                <img
                  src="/svg/googleplay.svg"
                  alt="App Store"
                  className="w-5 h-5"
                />
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] font-light">
                    Available on the
                  </span>
                  <span className="text-sm font-semibold -mt-0.5">
                    Play Store
                  </span>
                </div>
              </a>
            </div>
          </div>

          <div>
            <p className="font-semibold mb-4 text-foreground">Company</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  All Places
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Spotnere. All rights reserved. |
            Designed by{" "}
            <a href="https://github.com/shaikabdulkhadar1">
              Shaik Abdul Khadar
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
