import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { bookingsApi, Booking } from "@/lib/api";
import {
  CalendarDays,
  Users,
  Hash,
  CreditCard,
  MapPin,
  Clock,
  Receipt,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    }) +
    " at " +
    d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function PaymentBadge({ status }: { status: string }) {
  const s = status.toUpperCase();
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
        (s === "PAID" || s === "SUCCESS") &&
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
        s === "PENDING" &&
          "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
        (s === "FAILED" || s === "ERROR") &&
          "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
        !["PAID", "SUCCESS", "PENDING", "FAILED", "ERROR"].includes(s) &&
          "bg-muted text-muted-foreground",
      )}
    >
      {status}
    </span>
  );
}

function BookingStatusBadge({ status }: { status: string }) {
  const s = status.toUpperCase();
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
        s === "CONFIRMED" &&
          "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
        s === "CANCELLED" &&
          "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
        s === "COMPLETED" &&
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
        !["CONFIRMED", "CANCELLED", "COMPLETED"].includes(s) &&
          "bg-muted text-muted-foreground",
      )}
    >
      {status}
    </span>
  );
}

function BookingCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-border bg-background overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="sm:w-48 h-40 sm:h-auto shrink-0 bg-muted-foreground/10" />
      {/* Content */}
      <div className="flex-1 p-4 sm:py-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="h-5 w-3/5 rounded bg-muted-foreground/10" />
            <div className="h-3.5 w-2/5 rounded bg-muted-foreground/10" />
          </div>
          <div className="h-5 w-20 rounded-full bg-muted-foreground/10" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          <div className="h-4 w-44 rounded bg-muted-foreground/10" />
          <div className="h-4 w-36 rounded bg-muted-foreground/10" />
          <div className="h-4 w-24 rounded bg-muted-foreground/10" />
          <div className="h-4 w-28 rounded bg-muted-foreground/10" />
        </div>
        <div className="flex items-center gap-2 mt-auto pt-1">
          <div className="h-3.5 w-14 rounded bg-muted-foreground/10" />
          <div className="h-5 w-16 rounded-full bg-muted-foreground/10" />
        </div>
      </div>
    </div>
  );
}

function BookingModalSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Banner placeholder */}
      <div className="h-44 w-full bg-muted-foreground/10" />
      <div className="p-5 space-y-4">
        {/* Status badges */}
        <div className="flex gap-2">
          <div className="h-5 w-24 rounded-full bg-muted-foreground/10" />
          <div className="h-5 w-16 rounded-full bg-muted-foreground/10" />
        </div>
        {/* Detail rows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 py-2.5">
            <div className="w-4 h-4 rounded bg-muted-foreground/10 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-20 rounded bg-muted-foreground/10" />
              <div className="h-4 w-40 rounded bg-muted-foreground/10" />
            </div>
          </div>
        ))}
        {/* Button placeholder */}
        <div className="h-10 w-full rounded-md bg-muted-foreground/10 mt-2" />
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  mono,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string | null | undefined;
  mono?: boolean;
  href?: string | null;
}) {
  if (!value || value === "—") return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0">
      <Icon className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            {value}
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <p className={cn("text-sm text-foreground", mono && "font-mono")}>
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

function BookingDetailModal({
  booking,
  open,
  onClose,
}: {
  booking: Booking;
  open: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const place = booking.place;
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-4 pb-0 gap-0">
        {/* Place banner */}
        {place?.banner_image_link && (
          <div className="relative h-44 w-full">
            {!imgLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse rounded-xl" />
            )}
            <img
              src={place.banner_image_link}
              alt={place.name}
              className={cn(
                "w-full h-full object-cover rounded-xl transition-opacity duration-300",
                imgLoaded ? "opacity-100" : "opacity-0",
              )}
              onLoad={() => setImgLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
            <div className="absolute bottom-3 left-4 right-4">
              <h3
                className="text-white font-semibold font-parkinsans text-lg cursor-pointer hover:underline"
                onClick={() => {
                  onClose();
                  navigate(`/place/${place.id}`);
                }}
              >
                {place.name}
              </h3>
              {place.city && (
                <p className="text-white/80 text-sm flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {place.city}
                  {place.country ? `, ${place.country}` : ""}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="p-5">
          {/* Header (no banner fallback) */}
          {!place?.banner_image_link && (
            <DialogHeader className="mb-4">
              <DialogTitle className="font-parkinsans">
                {place?.name || "Booking Details"}
              </DialogTitle>
            </DialogHeader>
          )}

          {/* Status badges */}
          <div className="flex items-center gap-2 mb-4">
            <BookingStatusBadge status={booking.booking_status} />
            <PaymentBadge status={booking.payment_status} />
          </div>

          {/* Detail rows */}
          <div className="divide-y-0">
            <DetailRow
              icon={CalendarDays}
              label="Booking Date & Time"
              value={formatDateTime(booking.booking_date_time)}
            />
            <DetailRow
              icon={Hash}
              label="Reference Number"
              value={booking.booking_ref_number}
              mono
            />
            <DetailRow
              icon={Users}
              label="Number of Guests"
              value={
                booking.number_of_guests != null
                  ? `${booking.number_of_guests} guest${booking.number_of_guests !== 1 ? "s" : ""}`
                  : null
              }
            />
            <DetailRow
              icon={CreditCard}
              label="Amount Paid"
              value={
                booking.amount_paid != null
                  ? `${booking.currency_paid || "INR"} ${Number(booking.amount_paid).toFixed(2)}`
                  : null
              }
            />
            <DetailRow
              icon={CreditCard}
              label="Payment Method"
              value={booking.payment_method}
            />
            <DetailRow
              icon={Clock}
              label="Paid At"
              value={formatDate(booking.paid_at)}
            />
            <DetailRow
              icon={Hash}
              label="Transaction ID"
              value={booking.transaction_id}
              mono
            />
            <DetailRow
              icon={Receipt}
              label="Receipt"
              value={booking.receipt_url ? "View Receipt" : null}
              href={booking.receipt_url}
            />
            <DetailRow
              icon={Clock}
              label="Booked On"
              value={formatDate(booking.created_at)}
            />
          </div>

          {/* View place button */}
          {place && (
            <Button
              className="w-full mt-5"
              onClick={() => {
                onClose();
                navigate(`/place/${place.id}`);
              }}
            >
              View Place
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BookingCard({
  booking,
  onClick,
}: {
  booking: Booking;
  onClick: () => void;
}) {
  const place = booking.place;

  return (
    <div
      onClick={onClick}
      className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-border bg-background overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-primary/30 active:scale-[0.995]"
    >
      {/* Place image */}
      <div className="sm:w-48 h-40 sm:h-auto shrink-0">
        <img
          src={place?.banner_image_link || "/placeholder.svg"}
          alt={place?.name || "Place"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 p-4 sm:py-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold font-parkinsans text-lg leading-tight">
              {place?.name || "Unknown Place"}
            </h3>
            {place?.city && (
              <p className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                {place.city}
                {place.country ? `, ${place.country}` : ""}
              </p>
            )}
          </div>
          <BookingStatusBadge status={booking.booking_status} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="w-4 h-4 shrink-0" />
            <span>{formatDateTime(booking.booking_date_time)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Hash className="w-4 h-4 shrink-0" />
            <span className="font-mono text-xs">
              {booking.booking_ref_number}
            </span>
          </div>
          {booking.number_of_guests != null && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4 shrink-0" />
              <span>
                {booking.number_of_guests} guest
                {booking.number_of_guests !== 1 ? "s" : ""}
              </span>
            </div>
          )}
          {booking.amount_paid != null && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <CreditCard className="w-4 h-4 shrink-0" />
              <span>
                {booking.currency_paid || "INR"}{" "}
                {Number(booking.amount_paid).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-auto pt-1">
          <span className="text-xs text-muted-foreground">Payment:</span>
          <PaymentBadge status={booking.payment_status} />
        </div>
      </div>
    </div>
  );
}

const Bookings = () => {
  const navigate = useNavigate();
  const { isLoggedIn, token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !token) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    bookingsApi
      .getBookings(token)
      .then((res) => {
        if (!cancelled) setBookings(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, token]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40 px-4">
          <CalendarDays className="w-16 h-16 text-muted-foreground/40 mb-6" />
          <h2 className="text-2xl font-serif font-bold mb-2">
            Log in to see your bookings
          </h2>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            View and manage all your upcoming and past bookings.
          </p>
          <Button onClick={() => navigate("/login")} size="lg">
            Log In
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-parkinsans font-bold text-foreground">
            Your Bookings
          </h1>
          <p className="text-muted-foreground mt-1 mb-8">
            {bookings.length > 0
              ? `${bookings.length} booking${bookings.length !== 1 ? "s" : ""}`
              : "Manage your reservations"}
          </p>

          {isLoading ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <BookingCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-destructive mb-2">Failed to load bookings</p>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4"
                  variant="outline"
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : bookings.length > 0 ? (
            <div className="flex flex-col gap-4">
              {bookings.map((b) => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  onClick={() => setSelectedBooking(b)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <CalendarDays className="w-16 h-16 text-muted-foreground/40 mb-6" />
              <h2 className="text-xl font-semibold mb-2">No bookings yet</h2>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Once you book a place, it will show up here.
              </p>
              <Button onClick={() => navigate("/")} variant="outline">
                Explore Places
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Booking detail modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          open={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default Bookings;
