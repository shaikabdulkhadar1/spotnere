import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePlaceById, usePlaceGallery } from "@/hooks/use-places";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import {
  Star,
  Heart,
  MapPin,
  Phone,
  Globe,
  Clock,
  Share2,
  ShieldCheck,
  BadgeCheck,
  Shield,
  Users,
  BedDouble,
  Bath,
  Ruler,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  X,
  CalendarDays,
  Minus,
  Plus,
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useToast } from "@/hooks/use-toast";
import { bookingsApi } from "@/lib/api";
import { format } from "date-fns";

const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
];

function convertTo24h(time12h: string): string {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");
  if (modifier === "PM" && hours !== "12") hours = String(+hours + 12);
  if (modifier === "AM" && hours === "12") hours = "00";
  return `${hours.padStart(2, "0")}:${minutes}`;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PlaceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn, token, user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [bouncing, setBouncing] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Booking modal state
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [guests, setGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "cancelled" | "failed">("idle");
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    if (document.getElementById("razorpay-checkout-js")) return;
    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const liked = id ? isFavorite(id) : false;

  const handleFavoriteClick = () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true);
      return;
    }
    if (id) {
      toggleFavorite(id);
      setBouncing(true);
      setTimeout(() => setBouncing(false), 400);
    }
  };
  const handleBookNowClick = () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true);
      return;
    }
    setSelectedDate(undefined);
    setSelectedSlot("");
    setGuests(1);
    setBookingResult(null);
    setPaymentStatus("idle");
    setPaymentError("");
    setBookingOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!token || !id || !selectedDate || !selectedSlot) return;
    setBookingLoading(true);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const booking_date_time = `${dateStr}T${convertTo24h(selectedSlot)}:00`;

      const orderResult = await bookingsApi.createBooking(token, {
        place_id: id,
        booking_date_time,
        number_of_guests: guests,
      });

      const { razorpay_order_id, razorpay_key_id, amount, amount_paid, booking_ref } = orderResult;

      if (!window.Razorpay) {
        throw new Error("Payment gateway failed to load. Please refresh and try again.");
      }

      // Close the booking dialog so it doesn't block the Razorpay iframe
      setBookingOpen(false);

      const options = {
        key: razorpay_key_id,
        amount,
        currency: "INR",
        name: "Spotnere",
        description: `Booking at ${place?.name || ""}`,
        order_id: razorpay_order_id,
        prefill: {
          name: user ? `${user.first_name} ${user.last_name}` : "",
          email: user?.email || "",
          contact: user?.phone_number || "",
        },
        theme: { color: "#f97316" },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verified = await bookingsApi.verifyPayment(token, {
              place_id: id,
              booking_date_time,
              number_of_guests: guests,
              booking_ref,
              amount_paid,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setBookingResult(verified.data);
            setPaymentStatus("success");
            setBookingOpen(true);
          } catch (verifyErr: any) {
            setPaymentStatus("failed");
            setPaymentError(verifyErr.message || "Payment verification failed.");
            setBookingOpen(true);
          } finally {
            setBookingLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setBookingLoading(false);
            setPaymentStatus("cancelled");
            setBookingOpen(true);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp: any) => {
        setBookingLoading(false);
        setPaymentStatus("failed");
        setPaymentError(resp.error?.description || "Something went wrong with your payment.");
        setBookingOpen(true);
      });
      rzp.open();
    } catch (err: any) {
      setBookingLoading(false);
      toast({
        title: "Booking failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const {
    data: place,
    isLoading: isPlaceLoading,
    isError: isPlaceError,
    error: placeError,
  } = usePlaceById(id || "", !!id);

  const {
    data: galleryImages,
    isLoading: isGalleryLoading,
    isError: isGalleryError,
    error: galleryError,
  } = usePlaceGallery(id || "", !!id);

  // Combined loading state - show skeleton until both place and gallery are loaded
  const isLoading = isPlaceLoading || isGalleryLoading;
  const isError = isPlaceError || isGalleryError;
  const error = placeError || galleryError;

  const DAY_NAME_TO_INDEX: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
  };

  const closedDayIndices = useMemo(() => {
    if (!place?.hours) return new Set<number>();
    const closed = new Set<number>();

    const entries = Array.isArray(place.hours)
      ? place.hours.map((h) => ({ day: h.day, open: h.open, close: h.close }))
      : Object.entries(place.hours).map(([day, times]) => ({
          day,
          open: times.open,
          close: times.close,
        }));

    const openDays = new Set<number>();
    for (const entry of entries) {
      const idx = DAY_NAME_TO_INDEX[entry.day.toLowerCase().trim()];
      if (idx !== undefined) {
        const isClosed =
          entry.open.toLowerCase() === "closed" ||
          entry.close.toLowerCase() === "closed" ||
          (entry.open === "" && entry.close === "");
        if (isClosed) {
          closed.add(idx);
        } else {
          openDays.add(idx);
        }
      }
    }

    if (openDays.size > 0 && openDays.size < 7) {
      for (let i = 0; i < 7; i++) {
        if (!openDays.has(i)) closed.add(i);
      }
    }

    return closed;
  }, [place?.hours]);

  // Combine all images: banner first, then gallery images
  const allImages = place
    ? [place.bannerImageLink, ...(galleryImages || [])].filter(Boolean)
    : [];

  // Handle image click to open modal
  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  // Navigate to previous image
  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) =>
      prev > 0 ? prev - 1 : allImages.length - 1,
    );
  };

  // Navigate to next image
  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev < allImages.length - 1 ? prev + 1 : 0,
    );
  };

  // Scroll to top when page loads or ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  // Keyboard navigation for image modal
  useEffect(() => {
    if (!isImageModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setSelectedImageIndex((prev) =>
          prev > 0 ? prev - 1 : allImages.length - 1,
        );
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setSelectedImageIndex((prev) =>
          prev < allImages.length - 1 ? prev + 1 : 0,
        );
      } else if (e.key === "Escape") {
        setIsImageModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isImageModalOpen, allImages.length]);

  // Log for debugging
  useEffect(() => {
    if (id) {
      console.log("Fetching place details for ID:", id);
    }
  }, [id]);

  const getPrice = (priceLevel?: 1 | 2 | 3) => {
    if (!priceLevel) return null;
    const basePrices = { 1: 200, 2: 400, 3: 600 };
    const price = basePrices[priceLevel];
    return `From ₹${price} for 2 nights`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/10">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-6xl animate-pulse">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-9 w-20 rounded-md" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-9 w-9 rounded-full" />
              </div>
            </div>

            {/* Title + location */}
            <div className="mb-4 space-y-2">
              <Skeleton className="h-10 w-72 md:w-96" />
              <Skeleton className="h-5 w-48" />
            </div>

            {/* Banner + gallery grid */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-3 md:gap-4">
              <Skeleton className="h-[320px] md:h-[450px] rounded-3xl" />
              <div className="grid grid-cols-2 gap-2 md:gap-3 h-[320px] md:h-[450px]">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="rounded-xl" />
                ))}
              </div>
            </div>

            {/* Trust badges + stats */}
            <div className="mb-8 rounded-2xl border bg-background/90 shadow-md px-4 py-3 md:px-5 md:py-4 space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 rounded-full" />
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 py-2.5 px-2"
                  >
                    <Skeleton className="h-4 w-4 rounded" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-2.5 w-12" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main content + sidebar */}
            <div className="grid md:grid-cols-[1.8fr,1fr] gap-6 md:gap-8 items-start">
              {/* Left column */}
              <div className="space-y-6">
                {/* Description */}
                <div className="space-y-3">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                </div>

                {/* Amenities */}
                <div className="space-y-3">
                  <Skeleton className="h-6 w-28" />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton className="h-2 w-2 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hours */}
                <div className="space-y-3">
                  <Skeleton className="h-6 w-36" />
                  <div className="rounded-xl border divide-y">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="flex justify-between px-4 py-3">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right sidebar */}
              <div className="sticky top-24">
                <div className="rounded-2xl border shadow-lg p-5 md:p-6 space-y-4">
                  <Skeleton className="h-7 w-44 mb-3" />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                  <Skeleton className="h-11 w-full rounded-md mt-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !place) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center py-20">
              <p className="text-destructive mb-2 text-xl">
                {error instanceof Error ? error.message : "Place not found"}
              </p>
              <Button onClick={() => navigate("/")} className="mt-4">
                Go Back Home
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/10">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Top bar: back + bookmark */}
          <div className="flex items-center justify-between mb-6">
            <span> </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "rounded-full",
                  bouncing && "animate-[bounce-heart_0.4s_ease-in-out]",
                )}
                onClick={handleFavoriteClick}
              >
                <Heart
                  className={cn(
                    "h-5 w-5 transition-colors duration-200",
                    liked
                      ? "fill-red-500 text-red-500"
                      : "text-muted-foreground",
                  )}
                />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Title + location */}
          <div className="mb-4 space-y-2">
            <p className="text-4xl md:text-5xl font-parkinsans font-bold text-foreground">
              {place.name}
            </p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-base">
                {place.city}
                {place.state && `, ${place.state}`}
                {place.country && `, ${place.country}`}
              </span>
            </div>
          </div>

          {/* Image banner + Gallery grid layout */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-3 md:gap-4">
            {/* Large banner image on left */}
            <div
              className="relative h-[320px] md:h-[450px] rounded-3xl overflow-hidden shadow-lg cursor-pointer group"
              onClick={() => handleImageClick(0)}
            >
              <img
                src={place.bannerImageLink || "/placeholder.svg"}
                alt={place.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>

            {/* Gallery images grid on right */}
            {galleryImages && galleryImages.length > 0 && (
              <div className="grid grid-cols-2 gap-2 md:gap-3 h-[320px] md:h-[450px]">
                {galleryImages.slice(0, 5).map((imageUrl, index) => (
                  <div
                    key={index}
                    className="relative rounded-xl overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300 shadow-md"
                    onClick={() => handleImageClick(index + 1)}
                  >
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt={`${place.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    {/* Show "+X" overlay on last visible image if there are more */}
                    {index === 4 && galleryImages.length > 5 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
                        <span className="text-white text-2xl md:text-3xl font-bold">
                          +{galleryImages.length - 5}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trust + stats section - more compact */}
          <div className="mb-8 space-y-3 rounded-2xl border bg-background/90 shadow-md px-4 py-3 md:px-5 md:py-4">
            {/* Trust badges row - more compact */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] md:text-xs font-medium">
                  Certified owners
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 shadow-sm">
                <BadgeCheck className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] md:text-xs font-medium">
                  Best price guarantee
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 shadow-sm">
                <Shield className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] md:text-xs font-medium">
                  100% trusted
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 shadow-sm">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
                <span className="text-[10px] md:text-xs font-medium">
                  {place.rating.toFixed(1)} rating
                </span>
              </div>
            </div>

            {/* Stats row - more compact */}
            <div className="rounded-xl bg-background/80 mt-1 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
              <div className="flex items-center gap-2.5 py-2.5 md:px-3 px-2">
                <Users className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Guests</p>
                  <p className="text-xs md:text-sm font-semibold">
                    {place.tags?.length ? `${place.tags.length}+` : "Up to 4"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 py-2.5 md:px-3 px-2">
                <BedDouble className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Category</p>
                  <p className="text-xs md:text-sm font-semibold">
                    {place.category}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 py-2.5 md:px-3 px-2">
                <Bath className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-[10px] text-muted-foreground">City</p>
                  <p className="text-xs md:text-sm font-semibold">
                    {place.city || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 py-2.5 md:px-3 px-2">
                <Ruler className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Avg price</p>
                  <p className="text-xs md:text-sm font-semibold">
                    {place.avgPrice ? `₹${place.avgPrice}` : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main content + reservation sidebar */}
          <div className="grid md:grid-cols-[1.8fr,1fr] gap-6 md:gap-8 items-start">
            {/* Left: details */}
            <div className="space-y-6">
              {/* Description */}
              <section>
                <p className="text-2xl md:text-3xl font-parkinsans font-bold mb-4 text-foreground">
                  About this place
                </p>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {place.description || "No description available."}
                </p>
              </section>

              {/* Amenities */}
              {place.amenities && place.amenities.length > 0 && (
                <section>
                  <p className="text-xl font-semibold mb-4 text-foreground">
                    Amenities
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {place.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center border border-border rounded-full px-3 py-1.5 gap-2 text-sm md:text-base"
                      >
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Hours */}
              {place.hours &&
                (Array.isArray(place.hours)
                  ? place.hours.length > 0
                  : Object.keys(place.hours).length > 0) && (
                  <section>
                    <p className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                      <Clock className="h-5 w-5" />
                      Opening hours
                    </p>
                    <div className="rounded-xl border bg-background divide-y">
                      {(Array.isArray(place.hours)
                        ? place.hours.map((h) => ({
                            day: h.day,
                            open: h.open,
                            close: h.close,
                          }))
                        : Object.entries(place.hours).map(([day, times]) => ({
                            day,
                            open: times.open,
                            close: times.close,
                          }))
                      ).map((hour, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center px-4 py-3"
                        >
                          <span className="text-sm md:text-base font-medium">
                            {hour.day}
                          </span>
                          <span className="text-xs md:text-sm text-muted-foreground">
                            {hour.open} – {hour.close}
                          </span>
                        </div>
                      ))}
                    </div>
                    {place.openNow !== undefined && (
                      <div className="mt-3">
                        <Badge
                          variant={place.openNow ? "default" : "secondary"}
                        >
                          {place.openNow ? "Open now" : "Currently closed"}
                        </Badge>
                      </div>
                    )}
                  </section>
                )}

              {/* Tags */}
              {place.tags && place.tags.length > 0 && (
                <section>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {place.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right: reservation / contact card */}
            <aside>
              <div className="sticky top-24">
                <div className="rounded-2xl bg-background shadow-lg border p-5 md:p-6 space-y-4">
                  <p className="text-2xl font-semibold mb-3 text-foreground">
                    Make a reservation
                  </p>
                  {place.priceLevel && (
                    <div className="mb-2">
                      <p className="text-2xl font-bold">
                        {getPrice(place.priceLevel)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Approximate price for 2 people
                      </p>
                    </div>
                  )}
                  <div className="space-y-3 text-sm">
                    {place.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`tel:${place.phone}`}
                          className="text-primary hover:underline"
                        >
                          {place.phone}
                        </a>
                      </div>
                    )}
                    {place.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={place.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate"
                        >
                          Visit website
                        </a>
                      </div>
                    )}
                    {place.coordinates && (
                      <div className="pt-2">
                        <Button
                          variant="outline"
                          className="w-full border-border"
                          onClick={() => {
                            const url = `https://www.google.com/maps?q=${place.coordinates.lat},${place.coordinates.lng}`;
                            window.open(url, "_blank");
                          }}
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          View on map
                        </Button>
                      </div>
                    )}
                  </div>
                  <Button
                    className="w-full mt-4"
                    size="lg"
                    onClick={handleBookNowClick}
                  >
                    <CalendarDays className="w-5 h-5 mr-2" />
                    Book now
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <Footer />

      {/* Image Gallery Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0 gap-0 bg-black/95 border-none [&>button]:hidden">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 z-50 rounded-full bg-black/50 hover:bg-black/70 text-white p-2 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Previous button */}
            {allImages.length > 1 && (
              <button
                onClick={handlePreviousImage}
                className="absolute left-4 z-50 rounded-full bg-black/50 hover:bg-black/70 text-white p-3 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Main image */}
            {allImages[selectedImageIndex] && (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={allImages[selectedImageIndex] || "/placeholder.svg"}
                  alt={`${place?.name} - Image ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}

            {/* Next button */}
            {allImages.length > 1 && (
              <button
                onClick={handleNextImage}
                className="absolute right-4 z-50 rounded-full bg-black/50 hover:bg-black/70 text-white p-3 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            {/* Image counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                {selectedImageIndex + 1} / {allImages.length}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Login prompt dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Log in to save favorites</DialogTitle>
            <DialogDescription>
              You need to be logged in to add places to your favorites.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowLoginDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                setShowLoginDialog(false);
                navigate("/login");
              }}
            >
              Log in
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking modal — single page */}
      <Dialog
        open={bookingOpen}
        onOpenChange={(open) => {
          if (!bookingLoading) setBookingOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0">
          {paymentStatus === "idle" ? (
            <>
              <DialogHeader className="px-6 pt-6 pb-0">
                <DialogTitle className="text-xl font-parkinsans font-semibold">
                  Book {place?.name ?? "this place"}
                </DialogTitle>
                <DialogDescription>
                  Select a date, time slot, and number of guests
                </DialogDescription>
              </DialogHeader>

              <div className="px-6 pb-6 space-y-5 pt-3">
                {/* Date picker */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4 text-primary" /> Date
                  </p>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                      closedDayIndices.has(date.getDay())
                    }
                    className="rounded-xl border w-full p-3"
                    classNames={{
                      months: "w-full",
                      month: "w-full space-y-4",
                      table: "w-full border-collapse",
                      head_row: "flex w-full",
                      head_cell:
                        "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] text-center",
                      row: "flex w-full mt-2",
                      cell: "flex-1 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                      day: "inline-flex items-center justify-center rounded-md text-sm font-normal ring-offset-background transition-colors hover:bg-muted hover:text-foreground w-full aspect-square p-0 aria-selected:opacity-100",
                      day_today: "font-bold text-primary",
                      day_selected:
                        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    }}
                  />
                </div>

                {/* Time slots */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-primary" /> Time Slot
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={cn(
                          "rounded-lg border px-2 py-2 text-xs font-medium transition-all",
                          selectedSlot === slot
                            ? "bg-primary text-primary-foreground border-primary shadow-md"
                            : "bg-background hover:bg-muted border-border",
                        )}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-primary" /> Guests
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      disabled={guests <= 1}
                      className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-40 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-bold w-8 text-center">
                      {guests}
                    </span>
                    <button
                      onClick={() => setGuests((g) => Math.min(20, g + 1))}
                      disabled={guests >= 20}
                      className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-40 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-muted-foreground">
                      {guests === 1 ? "guest" : "guests"}
                    </span>
                  </div>
                </div>

                {/* Total */}
                {place?.avgPrice &&
                  selectedDate &&
                  selectedSlot &&
                  (() => {
                    const perGuest = place.avgPrice!;
                    const subtotal = perGuest * guests;
                    const serviceFee = 0; //Math.round(subtotal * 0.05 * 100) / 100;
                    const tax = 0; //Math.round(subtotal * 0.08 * 100) / 100;
                    const total = subtotal + serviceFee + tax;
                    return (
                      <div className="rounded-xl border bg-muted/30 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setShowBreakdown((v) => !v)}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
                        >
                          <span className="text-sm font-medium text-foreground">
                            Total
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-lg font-bold text-foreground">
                              ₹{total.toFixed(2)}
                            </span>
                            {showBreakdown ? (
                              <ChevronUp className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                        </button>
                        {showBreakdown && (
                          <div className="border-t px-4 py-2.5 space-y-1.5 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                ₹{perGuest.toFixed(2)} × {guests}{" "}
                                {guests === 1 ? "guest" : "guests"}
                              </span>
                              <span className="text-foreground">
                                ₹{subtotal.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Service fee (0%)
                              </span>
                              <span className="text-foreground">
                                ₹{serviceFee.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Taxes (0%)
                              </span>
                              <span className="text-foreground">
                                ₹{tax.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                {/* Pay button */}
                <Button
                  className="w-full gap-2"
                  size="lg"
                  disabled={!selectedDate || !selectedSlot || bookingLoading}
                  onClick={handleConfirmBooking}
                >
                  <CreditCard className="w-4 h-4" />
                  {bookingLoading ? "Processing..." : "Pay & Book"}
                </Button>
              </div>
            </>
          ) : paymentStatus === "success" ? (
            <div className="px-6 py-8 text-center bg-green-50/50 dark:bg-green-950/20 rounded-b-lg">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-xl font-semibold text-green-700 dark:text-green-400 mb-1">
                Booking Confirmed!
              </p>
              <p className="text-sm text-muted-foreground mb-5">
                Your payment was successful. Here are your booking details.
              </p>
              <div className="rounded-xl border border-green-200 dark:border-green-800/50 text-sm divide-y divide-green-200 dark:divide-green-800/50 mb-5 text-left bg-white dark:bg-background">
                <div className="flex justify-between px-4 py-2.5">
                  <span className="text-muted-foreground">Reference</span>
                  <span className="font-mono font-semibold text-foreground">
                    {bookingResult?.booking_ref_number}
                  </span>
                </div>
                <div className="flex justify-between px-4 py-2.5">
                  <span className="text-muted-foreground">Date & Time</span>
                  <span className="font-medium text-foreground">
                    {selectedDate && format(selectedDate, "MMM d, yyyy")} ·{" "}
                    {selectedSlot}
                  </span>
                </div>
                <div className="flex justify-between px-4 py-2.5">
                  <span className="text-muted-foreground">Guests</span>
                  <span className="font-medium text-foreground">{guests}</span>
                </div>
                <div className="flex justify-between px-4 py-2.5">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="default" className="bg-green-600 text-xs">
                    Confirmed
                  </Badge>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setBookingOpen(false)}
                >
                  Close
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setBookingOpen(false);
                    navigate("/bookings");
                  }}
                >
                  View Bookings
                </Button>
              </div>
            </div>
          ) : paymentStatus === "cancelled" ? (
            <div className="px-6 py-8 text-center bg-orange-50/50 dark:bg-orange-950/20 rounded-b-lg">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="text-xl font-semibold text-orange-700 dark:text-orange-400 mb-1">
                Payment Cancelled
              </p>
              <p className="text-sm text-muted-foreground mb-5">
                You closed the payment window. No amount has been charged.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setBookingOpen(false)}
                >
                  Close
                </Button>
                <Button
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                  onClick={() => {
                    setPaymentStatus("idle");
                    setPaymentError("");
                  }}
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <div className="px-6 py-8 text-center bg-red-50/50 dark:bg-red-950/20 rounded-b-lg">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-xl font-semibold text-red-700 dark:text-red-400 mb-1">
                Payment Failed
              </p>
              <p className="text-sm text-muted-foreground mb-5">
                {paymentError || "Something went wrong with your payment. Please try again."}
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setBookingOpen(false)}
                >
                  Close
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    setPaymentStatus("idle");
                    setPaymentError("");
                  }}
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlaceDetails;
