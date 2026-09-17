import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  // Clock3,
  Compass,
  MapPin,
  Search,
  Sparkles,
  Users,
  Mountain,
  Heart,
  // Camera,
  Globe2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

const curatedTrips = [
  {
    _id: "dest-1",
    title: "The Ultimate Bali Escape",
    location: "Bali, Indonesia",
    days: 7,
    img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=85&w=1400&auto=format&fit=crop",
  },
  {
    _id: "dest-2",
    title: "Kyoto Temple Tour",
    location: "Kyoto, Japan",
    days: 10,
    img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=85&w=1400&auto=format&fit=crop",
  },
  {
    _id: "dest-3",
    title: "Roads of Ladakh",
    location: "Ladakh, India",
    days: 6,
    img: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=85&w=1400&auto=format&fit=crop",
  },
];

const interests = [
  ["🏔️", "Mountains"],
  ["🌊", "Beaches"],
  ["🏍️", "Road Trips"],
  ["📸", "Photography"],
  ["🍜", "Food Trails"],
  ["🎒", "Backpacking"],
];

const Home = () => {
  const [isSolo, setIsSolo] = useState(false);
  const [communityTrips, setCommunityTrips] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    let ignore = false;
    axios
      .get(`${BASE_URL}/api/trips`)
      .then((r) => {
        if (!ignore) setCommunityTrips(r.data);
      })
      .catch((e) => console.error("Error fetching community trips:", e))
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [BASE_URL]);

  const filteredTrips = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return communityTrips;
    return communityTrips.filter(
      (t) =>
        t.title?.toLowerCase().includes(q) ||
        t.destination?.toLowerCase().includes(q),
    );
  }, [communityTrips, searchTerm]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#07090d] text-white">
      {/* HERO */}
      <section className="noise relative flex min-h-[780px] items-center overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover scale-[1.03]"
          src="https://res.cloudinary.com/x27weii0/video/upload/v1787976527/3_video.mp4"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=85&w=2200&auto=format&fit=crop"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(255,112,77,.18),transparent_30%),linear-gradient(180deg,rgba(4,6,10,.35),#07090d_97%)]" />
        <div className="travel-grid absolute inset-0 opacity-20 [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-28 sm:px-8 lg:px-10">
          <div className="max-w-4xl">
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={0}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-4 py-2 text-xs font-bold uppercase tracking-[.16em] text-white/80 backdrop-blur-md"
            >
              <Sparkles className="size-3.5 text-[#ff9a78]" /> Travel smarter.
              Meet better.
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={1}
              className="max-w-4xl font-display text-[clamp(3.6rem,9vw,8.3rem)] font-extrabold leading-[.88] tracking-[-.07em]"
            >
              {isSolo ? "Go your way." : "Find your people."}
              <br />
              <span className="text-gradient">
                {isSolo ? "Make it yours." : "See the world."}
              </span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={2}
              className="mt-8 max-w-2xl text-base leading-7 text-white/68 sm:text-xl sm:leading-8"
            >
              Discover incredible trips, meet travelers with the same vibe, and
              turn a destination into a story worth remembering.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={3}
              className="mt-9 flex flex-wrap gap-3"
            >
              <Button
                asChild
                size="lg"
                className="h-13 rounded-full bg-[#ff704d] px-7 text-[#120b08] shadow-[0_12px_40px_rgba(255,112,77,.28)] hover:bg-[#ff8566]"
              >
                <Link to="/create-trip">
                  {isSolo ? "Plan my adventure" : "Post a trip"}{" "}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="glass"
                className="h-13 rounded-full px-7"
              >
                <a href="#discover">Explore trips</a>
              </Button>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={4}
              className="mt-12 flex flex-wrap items-center gap-6 text-sm text-white/55"
            >
              <span className="flex items-center gap-2">
                <Globe2 className="size-4 text-[#ff9a78]" /> Real travelers
              </span>
              <span className="flex items-center gap-2">
                <Users className="size-4 text-[#ff9a78]" /> Group matching
              </span>
              <span className="flex items-center gap-2">
                <Heart className="size-4 text-[#ff9a78]" /> Shared experiences
              </span>
            </motion.div>
          </div>

          {/* Floating trip card */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: 20 }}
            animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
            transition={{
              opacity: { duration: 0.8, delay: 0.7 },
              x: { duration: 0.8, delay: 0.7 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
            className="glass absolute bottom-28 right-[5%] hidden w-64 overflow-hidden rounded-3xl p-2 lg:block"
          >
            <img
              src="https://images.unsplash.com/photo-1500534623283-312aade485b7?q=85&w=700&auto=format&fit=crop"
              className="h-32 w-full rounded-2xl object-cover"
              alt="Mountain travel"
            />
            <div className="px-3 pb-3 pt-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.15em] text-white/45">
                    Trending now
                  </p>
                  <p className="mt-1 font-display font-bold">
                    Weekend in the hills
                  </p>
                </div>
                <span className="rounded-full bg-[#ff704d]/15 px-2 py-1 text-xs text-[#ff9a78]">
                  +24
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-center text-[10px] font-bold uppercase tracking-[.25em] text-white/40"
        >
          <span>Scroll to explore</span>
          <div className="mx-auto mt-2 h-8 w-px bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </section>

      {/* MODE / SEARCH PANEL */}
      <section
        id="discover"
        className="relative z-20 mx-auto -mt-8 max-w-7xl px-5 sm:px-8 lg:px-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="glass rounded-[2rem] p-4 sm:p-6"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#ff9a78]">
                Choose your pace
              </p>
              <div className="mt-2 flex rounded-full bg-white/5 p-1">
                <button
                  onClick={() => setIsSolo(false)}
                  className={cn(
                    "rounded-full px-5 py-2.5 text-sm font-bold transition-all",
                    !isSolo
                      ? "bg-white text-black shadow"
                      : "text-white/55 hover:text-white",
                  )}
                >
                  Group travel
                </button>
                <button
                  onClick={() => setIsSolo(true)}
                  className={cn(
                    "rounded-full px-5 py-2.5 text-sm font-bold transition-all",
                    isSolo
                      ? "bg-[#ff704d] text-[#120b08] shadow"
                      : "text-white/55 hover:text-white",
                  )}
                >
                  Solo adventure
                </button>
              </div>
            </div>
            <div className="w-full max-w-xl">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 size-4 -translate-y-1/2 text-white/35" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search a destination, trip or adventure..."
                  className="h-13 rounded-full border-white/10 bg-white/[.06] pl-12 text-white placeholder:text-white/35 focus-visible:ring-[#ff704d]/30"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* INTERESTS */}
      <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8 lg:px-10">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#ff9a78]">
              Find your vibe
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
              Travel your way.
            </h2>
          </div>
          <Compass className="hidden size-12 text-white/10 sm:block" />
        </div>
        <div className="hide-scrollbar mt-8 flex gap-3 overflow-x-auto pb-2">
          {interests.map(([emoji, label]) => (
            <div
              key={label}
              className="shrink-0 rounded-full border border-white/10 bg-white/[.035] px-5 py-3 text-sm font-semibold text-white/75 transition hover:-translate-y-1 hover:border-[#ff704d]/40 hover:bg-[#ff704d]/10 hover:text-white"
            >
              {emoji} {label}
            </div>
          ))}
        </div>
      </section>

      {/* CURATED */}
      <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8 lg:px-10">
        <div className="mb-9 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#ff9a78]">
              Handpicked
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
              Places worth the detour.
            </h2>
          </div>
          <span className="hidden text-sm text-white/35 sm:block">
            03 experiences
          </span>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {curatedTrips.map((trip, i) => (
            <motion.article
              key={trip._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#0e1218]"
            >
              <div className="relative h-[390px] overflow-hidden">
                <img
                  src={trip.img}
                  alt={trip.location}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" />
                <div className="absolute left-5 top-5 rounded-full bg-black/35 px-3 py-1.5 text-xs font-bold text-white/80 backdrop-blur-md">
                  {trip.days} days
                </div>
                <div className="absolute bottom-0 p-6">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[.12em] text-white/60">
                    <MapPin className="size-3.5" /> {trip.location}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-extrabold">
                    {trip.title}
                  </h3>
                  <Link
                    to={`/destination/${trip._id}`}
                    state={{ mode: isSolo ? "solo" : "group" }}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#ffb09a] transition group-hover:gap-3"
                  >
                    {isSolo ? "Get itinerary" : "Find a crew"}{" "}
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="mx-auto max-w-7xl px-5 pb-32 pt-28 sm:px-8 lg:px-10">
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-white/10 pb-7 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#ff9a78]">
              Live community
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
              Trips looking for people.
            </h2>
          </div>
          <Link
            to="/create-trip"
            className="flex items-center gap-2 text-sm font-bold text-white/60 transition hover:text-[#ff9a78]"
          >
            Start a trip <ArrowRight className="size-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-3xl bg-white/[.04]"
              />
            ))}
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 py-20 text-center text-white/45">
            <Users className="mx-auto mb-3 size-9" />
            <p>No trips found.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredTrips.map((trip, i) => (
              <motion.div
                key={trip._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.05 }}
                className="group rounded-3xl border border-white/10 bg-white/[.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[.045]"
              >
                <div className="flex items-center justify-between gap-5">
                  <div className="min-w-0">
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#ff9a78]">
                      <MapPin className="size-3.5" />
                      {trip.destination}
                    </div>
                    <h3 className="truncate font-display text-lg font-bold">
                      {trip.title}
                    </h3>
                    <p className="mt-2 flex items-center gap-2 text-xs text-white/40">
                      <CalendarDays className="size-3.5" />
                      {new Date(trip.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="shrink-0 rounded-full border-white/10 bg-white/[.03] text-white hover:bg-white hover:text-black"
                  >
                    <Link to={`/destination/${trip._id}`}>
                      View <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-[#ff704d]/20 bg-[radial-gradient(circle_at_80%_20%,rgba(255,112,77,.25),transparent_30%),#11151c] p-8 sm:p-14">
          <Mountain className="absolute -bottom-10 -right-10 size-64 text-white/[.025]" />
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#ff9a78]">
            Your next chapter
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
            The best trips rarely start with a destination.
          </h2>
          <p className="mt-5 max-w-xl text-white/55">
            They start with the right people. Find yours.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 rounded-full bg-white px-7 text-black hover:bg-white/90"
          >
            <Link to="/register">
              Create your passport <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Home;
