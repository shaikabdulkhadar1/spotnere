import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/contexts/GeolocationContext";
import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Home,
  ChevronDown,
  Search,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { country: userCountry } = useGeolocation();

  // Determine initial mode from URL parameter
  const initialMode = searchParams.get("mode") === "signup" ? false : true;
  const [isLoginMode, setIsLoginMode] = useState(initialMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update mode when URL parameter changes
  useEffect(() => {
    const mode = searchParams.get("mode");
    setIsLoginMode(mode !== "signup");
  }, [searchParams]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Sign up form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhonePopoverOpen, setIsPhonePopoverOpen] = useState(false);

  // Country flag mapping (emoji flags)
  const getCountryFlag = (code: string): string => {
    const flagMap: Record<string, string> = {
      "+1": "🇺🇸", // USA
      "+44": "🇬🇧", // UK
      "+91": "🇮🇳", // India
      "+86": "🇨🇳", // China
      "+81": "🇯🇵", // Japan
      "+49": "🇩🇪", // Germany
      "+33": "🇫🇷", // France
      "+39": "🇮🇹", // Italy
      "+34": "🇪🇸", // Spain
      "+61": "🇦🇺", // Australia
      "+55": "🇧🇷", // Brazil
      "+7": "🇷🇺", // Russia
      "+82": "🇰🇷", // South Korea
      "+52": "🇲🇽", // Mexico
      "+31": "🇳🇱", // Netherlands
      "+46": "🇸🇪", // Sweden
      "+41": "🇨🇭", // Switzerland
      "+65": "🇸🇬", // Singapore
      "+971": "🇦🇪", // UAE
      "+966": "🇸🇦", // Saudi Arabia
      "+20": "🇪🇬", // Egypt
      "+27": "🇿🇦", // South Africa
      "+234": "🇳🇬", // Nigeria
      "+62": "🇮🇩", // Indonesia
      "+60": "🇲🇾", // Malaysia
      "+66": "🇹🇭", // Thailand
      "+84": "🇻🇳", // Vietnam
      "+63": "🇵🇭", // Philippines
      "+64": "🇳🇿", // New Zealand
      "+358": "🇫🇮", // Finland
      "+995": "🇬🇪", // Georgia
      "+47": "🇳🇴", // Norway
      "+45": "🇩🇰", // Denmark
      "+32": "🇧🇪", // Belgium
      "+351": "🇵🇹", // Portugal
      "+353": "🇮🇪", // Ireland
      "+48": "🇵🇱", // Poland
      "+90": "🇹🇷", // Turkey
      "+212": "🇲🇦", // Morocco
      "+254": "🇰🇪", // Kenya
    };
    return flagMap[code] || "🌐";
  };

  // Get country name from code for display
  const getCountryNameFromCode = (code: string): string => {
    const country = countryPhoneCodes.find((c) => c.code === code);
    return country ? country.country : "";
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Country phone codes list - sorted alphabetically by country name
  const countryPhoneCodes = [
    { code: "+61", country: "Australia" },
    { code: "+32", country: "Belgium" },
    { code: "+55", country: "Brazil" },
    { code: "+1", country: "Canada" },
    { code: "+86", country: "China" },
    { code: "+45", country: "Denmark" },
    { code: "+20", country: "Egypt" },
    { code: "+358", country: "Finland" },
    { code: "+33", country: "France" },
    { code: "+995", country: "Georgia" },
    { code: "+49", country: "Germany" },
    { code: "+91", country: "India" },
    { code: "+62", country: "Indonesia" },
    { code: "+353", country: "Ireland" },
    { code: "+39", country: "Italy" },
    { code: "+81", country: "Japan" },
    { code: "+254", country: "Kenya" },
    { code: "+60", country: "Malaysia" },
    { code: "+52", country: "Mexico" },
    { code: "+212", country: "Morocco" },
    { code: "+31", country: "Netherlands" },
    { code: "+64", country: "New Zealand" },
    { code: "+234", country: "Nigeria" },
    { code: "+47", country: "Norway" },
    { code: "+63", country: "Philippines" },
    { code: "+48", country: "Poland" },
    { code: "+351", country: "Portugal" },
    { code: "+7", country: "Russia" },
    { code: "+966", country: "Saudi Arabia" },
    { code: "+65", country: "Singapore" },
    { code: "+82", country: "South Korea" },
    { code: "+27", country: "South Africa" },
    { code: "+34", country: "Spain" },
    { code: "+46", country: "Sweden" },
    { code: "+41", country: "Switzerland" },
    { code: "+66", country: "Thailand" },
    { code: "+90", country: "Turkey" },
    { code: "+971", country: "UAE" },
    { code: "+44", country: "UK" },
    { code: "+1", country: "USA" },
    { code: "+84", country: "Vietnam" },
  ];

  // Map country names to phone codes
  const countryToPhoneCode: Record<string, string> = {
    "United States": "+1",
    "United States of America": "+1",
    Canada: "+1",
    "United Kingdom": "+44",
    India: "+91",
    China: "+86",
    Japan: "+81",
    Germany: "+49",
    France: "+33",
    Italy: "+39",
    Spain: "+34",
    Australia: "+61",
    Brazil: "+55",
    Russia: "+7",
    "South Korea": "+82",
    Mexico: "+52",
    Netherlands: "+31",
    Sweden: "+46",
    Switzerland: "+41",
    Singapore: "+65",
    "United Arab Emirates": "+971",
    UAE: "+971",
    "Saudi Arabia": "+966",
    Egypt: "+20",
    "South Africa": "+27",
    Nigeria: "+234",
    Indonesia: "+62",
    Malaysia: "+60",
    Thailand: "+66",
    Vietnam: "+84",
    Philippines: "+63",
    "New Zealand": "+64",
    Finland: "+358",
    Norway: "+47",
    Denmark: "+45",
    Belgium: "+32",
    Portugal: "+351",
    Ireland: "+353",
    Poland: "+48",
    Turkey: "+90",
    Morocco: "+212",
    Kenya: "+254",
  };

  // Countries, states, cities data
  const [countries, setCountries] = useState<{ name: string }[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [states, setStates] = useState<{ name: string }[]>([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);

  // Set default country from geolocation when available
  useEffect(() => {
    if (userCountry && !country && countries.length > 0) {
      const matchingCountry = countries.find(
        (c) => c.name.toLowerCase() === userCountry.toLowerCase()
      );
      if (matchingCountry) {
        setCountry(matchingCountry.name);
      }
    }
  }, [userCountry, countries, country]);

  // Auto-update phone country code when country is selected
  useEffect(() => {
    if (country && countryToPhoneCode[country]) {
      setPhoneCountryCode(countryToPhoneCode[country]);
    }
  }, [country]);

  // Auto-update phone country code when country is selected
  useEffect(() => {
    if (country && countryToPhoneCode[country]) {
      setPhoneCountryCode(countryToPhoneCode[country]);
    }
  }, [country]);

  // Fetch countries from CountriesNow API
  useEffect(() => {
    let isCancelled = false;

    const fetchCountries = async () => {
      try {
        setCountriesLoading(true);
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/states"
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch countries: ${response.statusText}`);
        }

        const json: {
          error?: boolean;
          msg?: string;
          data?: {
            name: string;
            states?: { name: string; state_code: string }[];
          }[];
        } = await response.json();

        if (isCancelled) return;

        if (!json.error && Array.isArray(json.data)) {
          const countryList = json.data.map((c) => ({ name: c.name }));
          setCountries(
            countryList.sort((a, b) => a.name.localeCompare(b.name))
          );
        }
      } catch (err) {
        if (isCancelled) return;
        console.error("Error fetching countries:", err);
      } finally {
        if (!isCancelled) {
          setCountriesLoading(false);
        }
      }
    };

    fetchCountries();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Fetch states for selected country
  useEffect(() => {
    setState("");
    setCity("");
    setStates([]);
    setCities([]);

    if (!country) return;

    let isCancelled = false;

    const fetchStates = async () => {
      try {
        setStatesLoading(true);
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/states"
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch states: ${response.statusText}`);
        }

        const json: {
          error?: boolean;
          msg?: string;
          data?: {
            name: string;
            states?: { name: string; state_code: string }[];
          }[];
        } = await response.json();

        if (isCancelled) return;

        if (!json.error && Array.isArray(json.data)) {
          const countryLower = country.toLowerCase();
          const matchedCountry = json.data.find(
            (c) => c.name && c.name.toLowerCase() === countryLower
          );

          if (matchedCountry && matchedCountry.states) {
            setStates(matchedCountry.states);
          }
        }
      } catch (err) {
        if (isCancelled) return;
        console.error("Error fetching states:", err);
      } finally {
        if (!isCancelled) {
          setStatesLoading(false);
        }
      }
    };

    fetchStates();

    return () => {
      isCancelled = true;
    };
  }, [country]);

  // Fetch cities for selected state
  useEffect(() => {
    setCity("");
    setCities([]);

    if (!country || !state) return;

    let isCancelled = false;

    const fetchCities = async () => {
      try {
        setCitiesLoading(true);
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/state/cities",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              country,
              state,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch cities: ${response.statusText}`);
        }

        const json: {
          error?: boolean;
          msg?: string;
          data?: string[];
        } = await response.json();

        if (isCancelled) return;

        if (!json.error && Array.isArray(json.data)) {
          setCities(json.data);
        }
      } catch (err) {
        if (isCancelled) return;
        console.error("Error fetching cities:", err);
      } finally {
        if (!isCancelled) {
          setCitiesLoading(false);
        }
      }
    };

    fetchCities();

    return () => {
      isCancelled = true;
    };
  }, [country, state]);

  // Handle phone number input - numeric only
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    setPhoneNumber(value);
  };

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Implement actual login logic
    setTimeout(() => {
      toast({
        title: "Login successful!",
        description: "Welcome back to Spotnere.",
      });
      setIsSubmitting(false);
      // TODO: Update auth state and redirect
      navigate("/");
    }, 1000);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password match
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !email ||
      !password ||
      !address ||
      !country ||
      !state ||
      !city ||
      !postalCode
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // TODO: Implement actual signup logic
    setTimeout(() => {
      toast({
        title: "Account created!",
        description: "Welcome to Spotnere. Please log in.",
      });
      setIsSubmitting(false);
      setIsLoginMode(true);
      // Reset form
      setFirstName("");
      setLastName("");
      setPhoneCountryCode("+1");
      setPhoneNumber("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAddress("");
      setCountry("");
      setState("");
      setCity("");
      setPostalCode("");
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-32 pb-12 px-4">
        <div
          className={`container mx-auto transition-all duration-300 ${
            isLoginMode ? "max-w-2xl" : "max-w-5xl"
          }`}
        >
          <div className="text-center mb-12 animate-fade-up">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-foreground">
              {isLoginMode ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isLoginMode
                ? "Sign in to your account to continue exploring amazing places"
                : "Join Spotnere to discover and book the best places around you"}
            </p>
          </div>

          <GlassCard hover={false} className="animate-fade-up">
            {/* Toggle between Login and Sign Up */}
            <div className="flex gap-2 mb-8 p-1 bg-muted/20 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setIsLoginMode(true);
                  navigate("/login?mode=login", { replace: true });
                }}
                className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  isLoginMode
                    ? "bg-muted text-foreground border border-border shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLoginMode(false);
                  navigate("/login?mode=signup", { replace: true });
                }}
                className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  !isLoginMode
                    ? "bg-muted text-foreground border border-border shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Login Form */}
            {isLoginMode ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="pl-10 placeholder:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="pl-10 placeholder:opacity-50"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full hover-lift"
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? "Logging in..." : "Log In"}
                </Button>
              </form>
            ) : (
              /* Sign Up Form - 2 column layout */
              <form onSubmit={handleSignUp} className="space-y-4">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="signup-first-name">First Name</Label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-first-name"
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="pl-10 placeholder:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-last-name">Last Name</Label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-last-name"
                        type="text"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="pl-10 placeholder:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone Number & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="signup-phone">Phone number*</Label>
                    <div className="flex items-center mt-1.5 border border-input rounded-md bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                      {/* Country Code Selector */}
                      <Popover
                        open={isPhonePopoverOpen}
                        onOpenChange={setIsPhonePopoverOpen}
                      >
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="flex items-center gap-2 px-3 py-2 border-r border-input hover:bg-muted/50 transition-colors focus:outline-none"
                          >
                            <span className="text-xl">
                              {getCountryFlag(phoneCountryCode)}
                            </span>
                            <span className="text-sm font-medium">
                              {phoneCountryCode}
                            </span>
                            <ChevronDown
                              className={`h-4 w-4 text-muted-foreground transition-transform ${
                                isPhonePopoverOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[320px] p-0"
                          align="start"
                          sideOffset={4}
                        >
                          <Command shouldFilter>
                            <CommandInput
                              placeholder="Search for countries"
                              className="h-11"
                            />
                            <CommandList className="max-h-[300px]">
                              <CommandEmpty>No country found.</CommandEmpty>
                              <CommandGroup>
                                {countryPhoneCodes.map((item) => (
                                  <CommandItem
                                    key={`${item.code}-${item.country}`}
                                    value={`${item.country} ${item.code}`}
                                    onSelect={() => {
                                      setPhoneCountryCode(item.code);
                                      setIsPhonePopoverOpen(false);
                                    }}
                                    className="flex items-center gap-3 cursor-pointer py-2"
                                  >
                                    <span className="text-xl">
                                      {getCountryFlag(item.code)}
                                    </span>
                                    <span className="flex-1">
                                      {item.country}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      ({item.code})
                                    </span>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {/* Phone Number Input */}
                      <Input
                        id="signup-phone"
                        type="text"
                        placeholder="1234567890"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        required
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:opacity-50 flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 placeholder:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 placeholder:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-confirm-password">
                      Confirm Password
                    </Label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="pl-10 placeholder:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <Label htmlFor="signup-address">Address</Label>
                  <div className="relative mt-1.5">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-address"
                      type="text"
                      placeholder="123 Main Street"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="pl-10 placeholder:opacity-50"
                    />
                  </div>
                </div>

                {/* Country & State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="signup-country">Country</Label>
                    <Select value={country} onValueChange={setCountry} required>
                      <SelectTrigger
                        className="mt-1.5 [&>span]:opacity-50"
                        id="signup-country"
                      >
                        <SelectValue
                          placeholder={
                            countriesLoading ? "Loading..." : "Select country"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((c) => (
                          <SelectItem key={c.name} value={c.name}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="signup-state">State</Label>
                    <Select
                      value={state}
                      onValueChange={setState}
                      required
                      disabled={!country || statesLoading}
                    >
                      <SelectTrigger
                        className="mt-1.5 [&>span]:opacity-50"
                        id="signup-state"
                      >
                        <SelectValue
                          placeholder={
                            statesLoading
                              ? "Loading..."
                              : !country
                              ? "Select country first"
                              : "Select state"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((s) => (
                          <SelectItem key={s.name} value={s.name}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* City & Postal Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="signup-city">City</Label>
                    <Select
                      value={city}
                      onValueChange={setCity}
                      required
                      disabled={!state || citiesLoading}
                    >
                      <SelectTrigger
                        className="mt-1.5 [&>span]:opacity-50"
                        id="signup-city"
                      >
                        <SelectValue
                          placeholder={
                            citiesLoading
                              ? "Loading..."
                              : !state
                              ? "Select state first"
                              : "Select city"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="signup-postal-code">Postal Code</Label>
                    <div className="relative mt-1.5">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-postal-code"
                        type="text"
                        placeholder="12345"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                        className="pl-10 placeholder:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  By signing up, you agree to our Terms of Service and Privacy
                  Policy.
                </div>

                <Button
                  type="submit"
                  className="w-full hover-lift"
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
            )}
          </GlassCard>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
