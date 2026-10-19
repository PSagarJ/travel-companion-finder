import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Lock, AlertCircle, Sparkles, MapPin, Users } from "lucide-react";
import api from "../api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// Cover photos cycled across match cards
const coverPhotos = [
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1000",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000",
];

// Demo matches to showcase the cosine + jaccard compatibility breakdown
const demoMatches = [
  {
    user: {
      _id: "demo-user-1",
      name: "Maya Lin",
      travelStyle: "Backpacker",
      vibeBadges: ["Photography", "Backpacking", "Mountains"],
    },
    matchPercentage: "94.5",
    sharedDestinations: ["Bali", "Kyoto"],
    breakdown: {
      travelStyle: { score: 95, label: "Very similar travel style" },
      destinations: { score: 92, sharedCount: 2, shared: ["Bali", "Kyoto"] },
      interests: { score: 96, sharedCount: 3, shared: ["Photography", "Backpacking", "Mountains"] },
    },
  },
  {
    user: {
      _id: "demo-user-2",
      name: "Liam O'Connor",
      travelStyle: "Adventure",
      vibeBadges: ["Road Trips", "Camping", "Hiking"],
    },
    matchPercentage: "88.0",
    sharedDestinations: ["Ladakh", "Swiss Alps"],
    breakdown: {
      travelStyle: { score: 90, label: "Compatible travel style" },
      destinations: { score: 85, sharedCount: 2, shared: ["Ladakh", "Swiss Alps"] },
      interests: { score: 89, sharedCount: 2, shared: ["Road Trips", "Hiking"] },
    },
  },
  {
    user: {
      _id: "demo-user-3",
      name: "Sofia Rossi",
      travelStyle: "Luxury",
      vibeBadges: ["Food Trails", "Beaches", "Culture"],
    },
    matchPercentage: "82.4",
    sharedDestinations: ["Amalfi Coast", "Santorini"],
    breakdown: {
      travelStyle: { score: 80, label: "Compatible travel style" },
      destinations: { score: 85, sharedCount: 2, shared: ["Amalfi Coast", "Santorini"] },
      interests: { score: 82, sharedCount: 2, shared: ["Food Trails", "Beaches"] },
    },
  },
  {
    user: {
      _id: "demo-user-4",
      name: "Elena Rostova",
      travelStyle: "Chill",
      vibeBadges: ["Culture", "Photography", "Food Trails"],
    },
    matchPercentage: "79.2",
    sharedDestinations: ["Kyoto", "Santorini"],
    breakdown: {
      travelStyle: { score: 75, label: "Compatible travel style" },
      destinations: { score: 80, sharedCount: 2, shared: ["Kyoto", "Santorini"] },
      interests: { score: 83, sharedCount: 2, shared: ["Culture", "Photography"] },
    },
  },
];

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authRequired, setAuthRequired] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setAuthRequired(true);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/api/matches");
      setMatches(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setAuthRequired(true);
      } else {
        console.error("Matches fetch failed:", err.message);
        setError("Unable to load matches right now.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadOnMount = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        if (!ignore) {
          setAuthRequired(true);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await api.get("/api/matches");
        if (!ignore) setMatches(response.data);
      } catch (err) {
        if (!ignore) {
          if (err.response?.status === 401) {
            setAuthRequired(true);
          } else {
            console.error("Matches fetch failed:", err.message);
            setError("Unable to load matches right now.");
          }
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadOnMount();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Finding your travel buddies...</p>
      </div>
    );
  }

  const effectiveMatches = matches.length > 0 ? matches : (showDemo ? demoMatches : []);

  if (authRequired && !showDemo) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <Lock className="mx-auto mb-3 size-10 text-muted-foreground" />
        <h2 className="font-display text-2xl font-semibold text-foreground">
          Log in to see your matches
        </h2>
        <p className="mt-2 mb-6 text-muted-foreground">
          Log in to see companions custom-matched to your travel personality, or preview demo matches below.
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button variant="outline" onClick={() => setShowDemo(true)}>
            Preview Demo Matches
          </Button>
        </div>
      </div>
    );
  }

  if (error && !showDemo) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <AlertCircle className="mx-auto mb-3 size-10 text-destructive" />
        <h2 className="font-display text-2xl font-semibold text-foreground">
          {error}
        </h2>
        <div className="mt-4 flex justify-center gap-3">
          <Button variant="secondary" onClick={fetchMatches}>
            Try again
          </Button>
          <Button variant="outline" onClick={() => setShowDemo(true)}>
            Preview Demo Matches
          </Button>
        </div>
      </div>
    );
  }

  if (matches.length === 0 && !showDemo) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <Users className="mx-auto mb-3 size-10 text-muted-foreground" />
        <h2 className="font-display text-2xl font-semibold text-foreground">
          No matches found yet
        </h2>
        <p className="mt-2 mb-6 text-muted-foreground">
          Check back once more travelers join, or update your wishlist and vibe badges.
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild>
            <Link to="/profile/edit">Update travel profile</Link>
          </Button>
          <Button variant="outline" onClick={() => setShowDemo(true)}>
            Preview Demo Matches
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 pb-16">
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-semibold text-foreground">
          Your travel matches
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          We found these explorers based on your travel style, destinations, and
          interests.
        </p>
        <Link
          to="/profile/edit"
          className="mt-2 inline-block text-sm font-semibold text-primary hover:underline"
        >
          Edit your travel profile →
        </Link>
      </div>

      {showDemo && matches.length === 0 && (
        <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/10 p-4 text-center text-sm font-semibold text-primary">
          ✨ Viewing Matchmaking Algorithm Demo — Showing compatible companions scored with Cosine & Jaccard multi-factor similarity.
        </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-7">
        {effectiveMatches.map((match, index) => {
          const bgImage = coverPhotos[index % coverPhotos.length];
          const initial = match.user?.name
            ? match.user.name.charAt(0).toUpperCase()
            : "👤";

          return (
            <Card
              key={index}
              className="overflow-hidden p-0 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Cover photo + match score */}
              <div
                className="relative h-36 bg-cover bg-center"
                style={{ backgroundImage: `url(${bgImage})` }}
              >
                <Badge
                  variant="success"
                  className="absolute top-4 right-4 gap-1 bg-white text-success shadow-md"
                >
                  <Sparkles className="size-3" />
                  {match.matchScore || match.matchPercentage || 0}%
                </Badge>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col px-6 pb-6">
                {/* Overlapping avatar */}
                <div className="-mt-9 mb-4">
                  <div className="flex size-[70px] items-center justify-center rounded-full border-4 border-card bg-secondary text-2xl font-bold text-foreground shadow-md">
                    {initial}
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-foreground">
                  {match.user?.name || "Travel Buddy"}
                </h2>
                <span className="mb-5 text-sm font-bold tracking-wide text-primary uppercase">
                  {match.user?.travelStyle || "Explorer"}
                </span>

                {/* Vibe badges */}
                <div className="mb-5 flex flex-wrap gap-2">
                  {match.user?.vibeBadges?.length > 0 ? (
                    match.user.vibeBadges.map((badge, i) => (
                      <Badge key={i} variant="outline">
                        {badge}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm italic text-muted-foreground">
                      No badges yet
                    </span>
                  )}
                </div>

                {/* Why this match — factor breakdown */}
                {match.breakdown && (
                  <div className="mb-6 flex flex-col gap-1.5 rounded-xl bg-secondary/50 p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {match.breakdown.travelStyle.label}
                      </span>
                      <span className="font-semibold text-foreground">
                        {match.breakdown.travelStyle.score}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="size-3.5" />
                        {match.breakdown.destinations.sharedCount > 0
                          ? `${match.breakdown.destinations.sharedCount} shared destination${match.breakdown.destinations.sharedCount > 1 ? "s" : ""}`
                          : "No shared destinations yet"}
                      </span>
                      <span className="font-semibold text-foreground">
                        {match.breakdown.destinations.score}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {match.breakdown.interests.sharedCount > 0
                          ? `${match.breakdown.interests.sharedCount} shared interest${match.breakdown.interests.sharedCount > 1 ? "s" : ""}`
                          : "No shared interests yet"}
                      </span>
                      <span className="font-semibold text-foreground">
                        {match.breakdown.interests.score}%
                      </span>
                    </div>
                  </div>
                )}

                <Button asChild className="mt-auto w-full">
                  <Link to={`/profile/${match.user?._id}`}>
                    View full profile
                  </Link>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Matches;
