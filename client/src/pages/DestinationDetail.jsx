import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Star,
  Plane,
  UtensilsCrossed,
  BedDouble,
  Download,
  CheckCircle2,
} from "lucide-react";
import destinationsData from "../data/destinationsData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  generateBookingRef,
  generateFlightTicket,
  generateStayReceipt,
} from "../utils/generateTicket";

const DestinationDetail = () => {
  const { id } = useParams();
  const destination = destinationsData[id];

  const loggedInUser = localStorage.getItem("user");
  const currentUser = loggedInUser ? JSON.parse(loggedInUser) : null;

  // Booking dialog state — shared between flights and stays
  const [bookingType, setBookingType] = useState(null); // "flight" | "stay" | null
  const [bookingItem, setBookingItem] = useState(null);
  const [travelerName, setTravelerName] = useState(currentUser?.name || "");
  const [travelDate, setTravelDate] = useState("");
  const [nights, setNights] = useState(2);
  const [confirmed, setConfirmed] = useState(null); // { ref } | null

  if (!destination) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h2 className="font-display text-2xl font-semibold text-foreground">
          Destination not found
        </h2>
        <Button asChild className="mt-6">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  const openBooking = (type, item) => {
    setBookingType(type);
    setBookingItem(item);
    setConfirmed(null);
    setNights(2);
  };

  const closeBooking = () => {
    setBookingType(null);
    setBookingItem(null);
    setConfirmed(null);
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    const ref = generateBookingRef();

    if (bookingType === "flight") {
      generateFlightTicket({
        passengerName: travelerName,
        destination: destination.location,
        flight: bookingItem,
        travelDate,
        bookingRef: ref,
      });
    } else if (bookingType === "stay") {
      generateStayReceipt({
        guestName: travelerName,
        destination: destination.location,
        stay: bookingItem,
        checkInDate: travelDate,
        nights,
        bookingRef: ref,
      });
    }

    setConfirmed({ ref });
  };

  const redownload = () => {
    if (!confirmed) return;
    if (bookingType === "flight") {
      generateFlightTicket({
        passengerName: travelerName,
        destination: destination.location,
        flight: bookingItem,
        travelDate,
        bookingRef: confirmed.ref,
      });
    } else {
      generateStayReceipt({
        guestName: travelerName,
        destination: destination.location,
        stay: bookingItem,
        checkInDate: travelDate,
        nights,
        bookingRef: confirmed.ref,
      });
    }
  };

  return (
    <div>
      {/* Hero */}
      <div
        className="relative flex h-72 items-end bg-cover bg-center md:h-96"
        style={{ backgroundImage: `url(${destination.heroImg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="relative mx-auto w-full max-w-5xl px-4 pb-8">
          <Link
            to="/"
            className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-white/80 hover:text-white"
          >
            <ArrowLeft className="size-4" /> Back to home
          </Link>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-white/70">
            <MapPin className="size-4" /> {destination.location}
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-white md:text-5xl">
            {destination.title}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10">
        <p className="max-w-3xl text-muted-foreground">
          {destination.description}
        </p>

        {/* Flights */}
        <section className="mt-12">
          <h2 className="mb-5 flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
            <Plane className="size-5 text-primary" /> Flights to{" "}
            {destination.location.split(",")[0]}
          </h2>
          <div className="flex flex-col gap-3">
            {destination.flights.map((flight, i) => (
              <Card
                key={i}
                className="flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="font-semibold text-foreground">
                    {flight.airline}{" "}
                    <span className="font-normal text-muted-foreground">
                      • {flight.flightNumber}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {flight.from} → {flight.to}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {flight.departTime} – {flight.arriveTime} •{" "}
                    {flight.duration}
                  </p>
                </div>
                <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:flex-col sm:items-end">
                  <span className="text-xl font-bold text-foreground">
                    ${flight.price}
                  </span>
                  <Button onClick={() => openBooking("flight", flight)}>
                    Book flight
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Stays */}
        <section className="mt-14">
          <h2 className="mb-5 flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
            <BedDouble className="size-5 text-primary" /> Local stays
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {destination.stays.map((stay, i) => (
              <Card key={i} className="overflow-hidden p-0">
                <img
                  src={stay.img}
                  alt={stay.name}
                  className="h-40 w-full object-cover"
                />
                <div className="p-4">
                  <p className="font-semibold text-foreground">{stay.name}</p>
                  <p className="text-sm text-muted-foreground">{stay.type}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge variant="outline" className="gap-1">
                      <Star className="size-3 fill-current" /> {stay.rating}
                    </Badge>
                    <span className="font-semibold text-foreground">
                      ${stay.pricePerNight}
                      <span className="font-normal text-muted-foreground">
                        /night
                      </span>
                    </span>
                  </div>
                  <Button
                    className="mt-3 w-full"
                    variant="secondary"
                    onClick={() => openBooking("stay", stay)}
                  >
                    Book stay
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Cuisines */}
        <section className="mt-14 mb-6">
          <h2 className="mb-5 flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
            <UtensilsCrossed className="size-5 text-primary" /> Local cuisine to
            try
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {destination.cuisines.map((dish, i) => (
              <Card key={i} className="overflow-hidden p-0">
                <img
                  src={dish.img}
                  alt={dish.name}
                  className="h-36 w-full object-cover"
                />
                <div className="p-4">
                  <p className="font-semibold text-foreground">{dish.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {dish.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Booking dialog — shared by both flights and stays */}
      <Dialog
        open={!!bookingType}
        onOpenChange={(open) => !open && closeBooking()}
      >
        {bookingType && (
          <DialogContent className="max-w-sm p-6">
            {!confirmed ? (
              <>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {bookingType === "flight"
                    ? "Book this flight"
                    : "Book this stay"}
                </h3>
                <p className="mt-1 mb-5 text-sm text-muted-foreground">
                  {bookingType === "flight"
                    ? `${bookingItem.airline} • ${bookingItem.flightNumber}`
                    : bookingItem.name}
                </p>

                <form
                  onSubmit={handleConfirmBooking}
                  className="flex flex-col gap-3"
                >
                  <div>
                    <label className="mb-1.5 block text-xs font-bold tracking-wide text-foreground uppercase">
                      {bookingType === "flight"
                        ? "Passenger name"
                        : "Guest name"}
                    </label>
                    <Input
                      value={travelerName}
                      onChange={(e) => setTravelerName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold tracking-wide text-foreground uppercase">
                      {bookingType === "flight"
                        ? "Travel date"
                        : "Check-in date"}
                    </label>
                    <Input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      required
                    />
                  </div>

                  {bookingType === "stay" && (
                    <div>
                      <label className="mb-1.5 block text-xs font-bold tracking-wide text-foreground uppercase">
                        Nights
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={nights}
                        onChange={(e) => setNights(Number(e.target.value))}
                        required
                      />
                    </div>
                  )}

                  <p className="mt-1 text-xs text-muted-foreground">
                    This is a demo booking for the TravelBuddy project — no real
                    payment will be processed.
                  </p>

                  <Button type="submit" className="mt-2 w-full">
                    Confirm booking & download{" "}
                    {bookingType === "flight" ? "ticket" : "receipt"}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <CheckCircle2 className="mx-auto mb-3 size-12 text-success" />
                <h3 className="font-display text-xl font-semibold text-foreground">
                  Booking confirmed!
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Reference: <strong>{confirmed.ref}</strong>
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Your {bookingType === "flight" ? "ticket" : "receipt"} has
                  been downloaded as a PDF.
                </p>
                <div className="mt-5 flex flex-col gap-2">
                  <Button onClick={redownload} variant="secondary">
                    <Download className="size-4" /> Download again
                  </Button>
                  <Button onClick={closeBooking}>Done</Button>
                </div>
              </div>
            )}
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default DestinationDetail;
