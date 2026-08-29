import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Clock,
  ArrowRight,
  Users,
  Sparkles,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
  }),
};

const curatedTrips = [
  {
    _id: "dest-1",
    title: "The Ultimate Bali Escape",
    location: "Bali, Indonesia",
    days: 7,
    img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    _id: "dest-2",
    title: "Kyoto Temple Tour",
    location: "Kyoto, Japan",
    days: 10,
    img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop",
  },
];

const Home = () => {
  const [isSolo, setIsSolo] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const [communityTrips, setCommunityTrips] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunityTrips = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/trips`);
        setCommunityTrips(response.data);
      } catch (error) {
        console.error("Error fetching community trips:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCommunityTrips();
  }, [BASE_URL]);

  const filteredTrips = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return communityTrips.filter(
      (trip) =>
        trip.title.toLowerCase().includes(searchLower) ||
        trip.destination.toLowerCase().includes(searchLower),
    );
  }, [communityTrips, searchTerm]);

  return (
    <div className="pb-24">
      {/* ---------------- HERO WITH VIDEO BACKGROUND ---------------- */}
      <section className="relative flex h-[92vh] min-h-[640px] w-full items-center justify-center overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="https://res.cloudinary.com/x27weii0/video/upload/v1787976527/3_video.mp4"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
        />
        {/* Gradient scrim for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />

        <motion.div
          initial="hidden"
          animate="show"
          className="relative z-10 mx-auto max-w-3xl px-6 text-center text-white"
        >
          <motion.div variants={fadeUp} custom={0}>
            <Badge
              variant="secondary"
              className="mb-6 bg-white/15 text-white backdrop-blur-md border border-white/20"
            >
              <Sparkles className="size-3.5" /> Over 12,000 travelers matched
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-balance text-5xl font-black tracking-tight sm:text-6xl md:text-7xl"
          >
            {isSolo ? "Find Yourself" : "Never Travel"}{" "}
            <span
              className={cn(
                "transition-colors duration-300",
                isSolo ? "text-emerald-400" : "text-sky-400",
              )}
            >
              {isSolo ? "Out There." : "Alone."}
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mx-auto mt-5 max-w-xl text-balance text-lg text-white/80"
          >
            {isSolo
              ? "Grab an expert-crafted itinerary and explore the world at your own pace."
              : "Discover curated itineraries and find your perfect travel buddies."}
          </motion.p>

          {/* Mode toggle */}
          <motion.div
            variants={fadeUp}
            custom={3}
            className="mt-8 flex justify-center"
          >
            <div className="inline-flex rounded-full border border-white/25 bg-white/10 p-1 backdrop-blur-md">
              <button
                onClick={() => setIsSolo(false)}
                className={cn(
                  "rounded-full px-6 py-2.5 text-sm font-bold transition-all",
                  !isSolo
                    ? "scale-105 bg-sky-500 text-white shadow-lg"
                    : "text-white/70 hover:text-white",
                )}
              >
                Group Travel
              </button>
              <button
                onClick={() => setIsSolo(true)}
                className={cn(
                  "rounded-full px-6 py-2.5 text-sm font-bold transition-all",
                  isSolo
                    ? "scale-105 bg-emerald-500 text-white shadow-lg"
                    : "text-white/70 hover:text-white",
                )}
              >
                Solo Adventure
              </button>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={4}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <Button asChild size="lg" variant={isSolo ? "accent" : "default"}>
              <Link to="/create-trip">
                Post a Trip <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="glass">
              <Link to="/feed">Browse the Feed</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/70"
        >
          <div className="h-9 w-5 rounded-full border-2 border-white/40 p-1">
            <div className="h-2 w-full rounded-full bg-white/70" />
          </div>
        </motion.div>
      </section>

      <div className="relative z-10 mx-auto -mt-16 max-w-6xl px-4 sm:px-6">
        {/* ---------------- CURATED TRIPS ---------------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-16 border-none p-2 shadow-xl shadow-black/5 sm:p-4">
            <CardContent className="pt-2">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">
                  Curated Experiences
                </h2>
                <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Verified Routes
                </span>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {curatedTrips.map((trip, i) => (
                  <motion.div
                    key={trip._id}
                    variants={fadeUp}
                    custom={i}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    whileHover={{ y: -6 }}
                    className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg"
                  >
                    <div
                      className="h-52 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${trip.img})` }}
                    />
                    <div className="p-5">
                      <h3 className="mb-1.5 font-semibold">{trip.title}</h3>
                      <p className="mb-4 flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3.5" /> {trip.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5" /> {trip.days} Days
                        </span>
                      </p>
                      <Button
                        asChild
                        variant={isSolo ? "secondary" : "secondary"}
                        className={cn(
                          "w-full",
                          isSolo
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-sky-50 text-sky-700 hover:bg-sky-100",
                        )}
                      >
                        <Link
                          to={`/destination/${trip._id}`}
                          state={{ mode: isSolo ? "solo" : "group" }}
                        >
                          {isSolo
                            ? "Grab Solo Itinerary"
                            : "Find a Group to Join"}
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ---------------- COMMUNITY BOARD ---------------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 flex items-end justify-between border-b pb-3">
            <h2 className="text-2xl font-bold tracking-tight">
              Community Board
            </h2>
            <Link
              to="/create-trip"
              className="flex items-center gap-1 text-sm font-bold text-primary hover:underline"
            >
              + Post a Trip
            </Link>
          </div>

          <div className="relative mb-8">
            <Search className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search destinations or trips (e.g., 'Goa' or 'Alps')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-13 text-base"
            />
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-xl bg-muted"
                />
              ))}
            </div>
          ) : filteredTrips.length === 0 ? (
            <div className="rounded-xl border border-dashed py-16 text-center text-muted-foreground">
              <Users className="mx-auto mb-3 size-8 opacity-50" />
              <h3 className="font-semibold text-foreground">No trips found!</h3>
              <p className="text-sm">
                {communityTrips.length === 0
                  ? "Be the first to gather a crew."
                  : "Try adjusting your search terms."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredTrips.map((trip, i) => (
                <motion.div
                  key={trip._id}
                  variants={fadeUp}
                  custom={i % 4}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <Card className="flex-row items-center justify-between gap-4 p-5">
                    <div className="min-w-0">
                      <h4 className="mb-1 truncate font-semibold">
                        {trip.title}
                      </h4>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-semibold text-primary">
                          Traveler
                        </span>{" "}
                        is going to {trip.destination}
                      </div>
                      <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground/80">
                        <CalendarDays className="size-3.5" />
                        {new Date(trip.startDate).toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                    >
                      <Link to={`/destination/${trip._id}`}>View</Link>
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
