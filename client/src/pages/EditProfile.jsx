import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import api from "../api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const TRAVEL_STYLES = ["Adventure", "Backpacker", "Luxury", "Chill", "Budget"];

const EditProfile = () => {
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem("user");
  const currentUser = loggedInUser ? JSON.parse(loggedInUser) : null;

  const [loading, setLoading] = useState(true);
  const [travelStyle, setTravelStyle] = useState("Chill");
  const [vibeBadgesText, setVibeBadgesText] = useState("");
  const [destinationsText, setDestinationsText] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let ignore = false;

    const loadProfile = async () => {
      if (!currentUser?.id) {
        if (!ignore) setLoading(false);
        return;
      }
      try {
        const response = await api.get(`/api/users/${currentUser.id}`);
        if (ignore) return;
        const profile = response.data;
        setTravelStyle(profile.travelStyle || "Chill");
        setVibeBadgesText((profile.vibeBadges || []).join(", "));
        setDestinationsText((profile.preferredDestinations || []).join(", "));
      } catch (error) {
        if (!ignore) console.error("Failed to load profile:", error.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    loadProfile();

    return () => {
      ignore = true;
    };
  }, [currentUser?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus("");

    const vibeBadges = vibeBadgesText
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);
    const preferredDestinations = destinationsText
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);

    try {
      const response = await api.put("/api/users/me", {
        travelStyle,
        vibeBadges,
        preferredDestinations,
      });

      // Keep the cached user object's travelStyle in sync
      if (currentUser) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...currentUser,
            travelStyle: response.data.travelStyle,
          }),
        );
      }

      setStatus("Saved! Your matches will now reflect this.");
    } catch (error) {
      setStatus(
        error.response?.data?.message ||
          "Something went wrong saving your profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Link
        to="/matches"
        className="mb-4 inline-flex items-center gap-1 font-semibold text-primary hover:underline"
      >
        <ArrowLeft className="size-4" /> Back to matches
      </Link>

      <h1 className="font-display text-3xl font-semibold text-foreground">
        Your travel profile
      </h1>
      <p className="mt-1 mb-6 text-muted-foreground">
        This is what powers your match compatibility score — the more you fill
        in, the better your matches.
      </p>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="mb-1.5 block text-xs font-bold tracking-wide text-foreground uppercase">
              Travel style
            </label>
            <select
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
              className="h-11 w-full rounded-full border border-input bg-background px-5 text-sm shadow-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              {TRAVEL_STYLES.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold tracking-wide text-foreground uppercase">
              Vibe badges / interests
            </label>
            <Input
              value={vibeBadgesText}
              onChange={(e) => setVibeBadgesText(e.target.value)}
              placeholder="e.g. Mountain Goat, Foodie, Photographer"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Comma-separated. These are matched against other travelers'
              badges.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold tracking-wide text-foreground uppercase">
              Destinations you want to visit
            </label>
            <Input
              value={destinationsText}
              onChange={(e) => setDestinationsText(e.target.value)}
              placeholder="e.g. Bali, Indonesia, Kyoto, Japan"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Comma-separated. Shared destinations boost your match score.
            </p>
          </div>

          <Button type="submit" disabled={saving} className="mt-1 w-full">
            <Sparkles className="size-4" />
            {saving ? "Saving..." : "Save profile"}
          </Button>

          {status && (
            <p className="text-center text-sm font-medium text-primary">
              {status}
            </p>
          )}
        </form>
      </Card>

      {status.startsWith("Saved") && (
        <Button
          variant="secondary"
          className="mt-4 w-full"
          onClick={() => navigate("/matches")}
        >
          View your matches
        </Button>
      )}
    </div>
  );
};

export default EditProfile;
