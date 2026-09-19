import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, UserRound } from "lucide-react";
import api from "../api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const UserProfile = () => {
  const { userId } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Prevents a stale request for a previously-viewed profile from
    // overwriting this one if it resolves out of order.
    let ignore = false;

    const fetchProfile = async () => {
      try {
        const response = await api.get(`/api/users/${userId}`);
        // Show the real record as-is — no fabricated bio, badges, or trip
        // count merged in. Your User schema doesn't track those yet, so
        // making up numbers would misrepresent every real traveler.
        if (!ignore) setProfile(response.data);
      } catch (error) {
        if (!ignore) {
          console.error("Profile fetch failed:", error.message);
          setNotFound(true);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchProfile();

    return () => {
      ignore = true;
    };
  }, [userId]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <UserRound className="mx-auto mb-3 size-10 text-muted-foreground" />
        <h2 className="font-display text-2xl font-semibold text-foreground">
          Profile not found
        </h2>
        <p className="mt-2 mb-6 text-muted-foreground">
          This traveler's profile may have been removed.
        </p>
        <Button asChild>
          <Link to="/matches">Back to matches</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link
        to="/matches"
        className="mb-4 inline-flex items-center gap-1 font-semibold text-primary hover:underline"
      >
        <ArrowLeft className="size-4" /> Back to matches
      </Link>

      <Card className="overflow-hidden p-0">
        {/* Cover photo + avatar */}
        <div
          className="relative h-48 bg-muted bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1501785888041-af3ef285b470)",
          }}
        >
          <div className="absolute -bottom-10 left-8 flex size-24 items-center justify-center rounded-full border-4 border-card bg-secondary text-3xl font-bold text-foreground shadow-md">
            {profile.name ? profile.name.charAt(0).toUpperCase() : "👤"}
          </div>
        </div>

        <div className="px-8 pt-14 pb-8">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="font-display text-3xl font-semibold text-foreground">
                {profile.name || "Traveler"}
              </h1>
              <Badge className="mt-1.5">
                {profile.travelStyle || "Explorer"}
              </Badge>
            </div>
          </div>

          {/* Vibe badges */}
          <h3 className="mb-3 border-b border-border pb-2 text-sm font-semibold text-foreground">
            Traveler vibe badges
          </h3>
          <div className="mb-8 flex flex-wrap gap-2">
            {profile.vibeBadges?.length > 0 ? (
              profile.vibeBadges.map((badge, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {badge}
                </Badge>
              ))
            ) : (
              <span className="text-sm italic text-muted-foreground">
                No badges yet
              </span>
            )}
          </div>

          <Button className="w-full" size="lg" disabled>
            <MessageCircle className="size-4.5" />
            Message {profile.name ? profile.name.split(" ")[0] : "traveler"}
          </Button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Direct messaging is coming soon.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default UserProfile;
