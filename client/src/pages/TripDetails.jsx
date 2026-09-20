import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Compass,
  User,
  Users,
  MessageCircle,
  Camera,
  Star,
} from "lucide-react";
import api from "../api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const TripDetails = () => {
  const { id } = useParams();
  const location = useLocation(); // 💥 Captures the secret data from the Home page

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [applyStatus, setApplyStatus] = useState("");
  const [tripPosts, setTripPosts] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [reviewDrafts, setReviewDrafts] = useState({}); // { [revieweeId]: { rating, comment } }
  const [reviewStatus, setReviewStatus] = useState({}); // { [revieweeId]: "saving" | "saved" | "error" }

  const statusStyles = {
    Upcoming: "bg-primary/15 text-primary",
    Planning: "bg-primary/15 text-primary",
    Ongoing: "bg-success/15 text-success",
    Completed: "bg-secondary text-muted-foreground",
    Cancelled: "bg-destructive/15 text-destructive",
  };

  // 💥 Determine if the user clicked the "Solo" button on the Home page
  const mode = location.state?.mode || "group";
  const isSoloMode = mode === "solo";

  // 💥 FIXED: Dynamically extract the real logged-in user from localStorage
  const loggedInUser = localStorage.getItem("user");
  const currentUser = loggedInUser ? JSON.parse(loggedInUser) : null;
  const currentUserId = currentUser ? currentUser.id : null;

  useEffect(() => {
    // Prevents a stale request for a previously-viewed trip from overwriting
    // the current one if it resolves out of order.
    let ignore = false;

    const fetchTrip = async () => {
      try {
        // Dynamic fetch request based on environment 🚀
        const response = await api.get(`/api/trips/${id}`);
        if (ignore) return;

        const tripData = response.data;
        setTrip(tripData);
        setLoadError(false);

        // Check user relationship to this trip immediately on page load
        if (currentUserId) {
          if (tripData.creatorId === currentUserId) {
            // Guardrail: Lock out the creator from applying to their own trip
            setApplyStatus("👑 You are the manager of this trip itinerary.");
          } else {
            // Check if user is already verified inside the crew
            const isApproved = tripData.approvedMembers?.some(
              (m) => m.userId === currentUserId,
            );

            // Check if user has an active pending application
            const existingApplication = tripData.applicants?.find(
              (a) => a.userId === currentUserId,
            );

            if (
              isApproved ||
              (existingApplication && existingApplication.status === "approved")
            ) {
              setApplyStatus(
                "✨ You are an approved member of this travel crew!",
              );
            } else if (
              existingApplication &&
              existingApplication.status === "pending"
            ) {
              setApplyStatus(
                "📩 Application submitted. Waiting for creator approval.",
              );
            } else if (
              existingApplication &&
              existingApplication.status === "rejected"
            ) {
              setApplyStatus("❌ Your application for this trip was declined.");
            }
          }
        }

        setLoading(false);
      } catch (error) {
        if (ignore) return;
        console.error("Error loading trip:", error.message);
        // Show a real error state instead of fabricated placeholder trip data —
        // showing made-up content when the fetch fails is misleading, not helpful.
        setLoadError(true);
        setLoading(false);
      }
    };
    fetchTrip();

    return () => {
      ignore = true;
    };
  }, [id, currentUserId]);

  useEffect(() => {
    // Prevents a slow, stale request for a previously-viewed trip from
    // overwriting the current trip's photos if it resolves out of order —
    // e.g. quickly clicking from Trip A to Trip B.
    let ignore = false;

    const fetchTripPosts = async () => {
      try {
        const response = await api.get(`/api/posts/trip/${id}`);
        if (!ignore) setTripPosts(response.data);
      } catch (error) {
        if (!ignore) console.error("Error loading trip photos:", error.message);
      }
    };
    fetchTripPosts();

    return () => {
      ignore = true;
    };
  }, [id]);

  useEffect(() => {
    // Only relevant once the trip is actually over — no point fetching
    // review state for a trip that hasn't finished yet.
    if (!trip || trip.status !== "Completed" || !currentUserId) return;

    let ignore = false;

    const fetchMyReviews = async () => {
      try {
        const response = await api.get(`/api/reviews/trip/${id}`);
        if (!ignore) setMyReviews(response.data);
      } catch (error) {
        if (!ignore)
          console.error("Error loading review status:", error.message);
      }
    };
    fetchMyReviews();

    return () => {
      ignore = true;
    };
  }, [trip, id, currentUserId]);

  const submitReview = async (revieweeId) => {
    const draft = reviewDrafts[revieweeId];
    if (!draft?.rating) return;

    setReviewStatus((prev) => ({ ...prev, [revieweeId]: "saving" }));
    try {
      const response = await api.post("/api/reviews", {
        tripId: id,
        revieweeId,
        rating: draft.rating,
        comment: draft.comment || "",
      });
      setMyReviews((prev) => [
        ...prev.filter((r) => r.revieweeId !== revieweeId),
        response.data,
      ]);
      setReviewStatus((prev) => ({ ...prev, [revieweeId]: "saved" }));
    } catch (error) {
      console.error("Error submitting review:", error.message);
      setReviewStatus((prev) => ({ ...prev, [revieweeId]: "error" }));
    }
  };
  const handleAction = async () => {
    if (isSoloMode) {
      // 1. Create the text content for the downloaded file
      const itineraryContent = `
🌍 TRAVEL BUDDY FINDER: SOLO ITINERARY 🌍
--------------------------------------------------
Title: ${trip.title}
Destination: ${trip.destination}
Dates: ${trip.startDate} to ${trip.endDate}
Style: ${trip.travelStyle} (${trip.targetVibe})
Estimated Budget: $${trip.estimatedBudget}

Notes: This is your curated solo adventure. Have a great trip!
--------------------------------------------------
      `;

      // 2. Convert the text into a Blob (a file-like object in the browser)
      const blob = new Blob([itineraryContent], { type: "text/plain" });
      const downloadUrl = URL.createObjectURL(blob);

      // 3. Create an invisible 'a' tag, force the browser to click it, and destroy it
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${trip.destination.replace(/[^a-zA-Z0-9]/g, "_")}_Itinerary.txt`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl); // Clean up browser memory

      setApplyStatus("✨ Itinerary downloaded successfully!");
      return;
    }

    // UPGRADED GROUP MODE LOGIC: Stop unauthenticated users instantly
    if (!currentUserId) {
      setApplyStatus("❌ You must be logged in to apply for a trip!");
      return;
    }

    setApplyStatus("Sending application...");
    try {
      // Server now identifies you from your auth token, no need to send userId
      await api.post(`/api/trips/${id}/apply`);
      setApplyStatus("Application successful! Waiting for approval.");
    } catch (error) {
      if (error.response && error.response.data) {
        setApplyStatus(`❌ ${error.response.data.message}`);
      } else {
        setApplyStatus("✨ Application sent to creator! (Simulated)");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Loading adventure...</p>
      </div>
    );
  }

  if (loadError || !trip) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h2 className="font-display text-2xl font-semibold text-foreground">
          Something went wrong loading this trip.
        </h2>
        <p className="mt-2 mb-6 text-muted-foreground">
          It may have been removed, or there was a connection problem.
        </p>
        <Button asChild>
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  const canAccessChat =
    trip.creatorId === currentUserId ||
    trip.approvedMembers?.some((m) => m.userId === currentUserId);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1 font-semibold text-primary hover:underline"
      >
        <ArrowLeft className="size-4" /> Back to home
      </Link>

      <Card className="overflow-hidden p-0">
        <div
          className="h-64 w-full bg-muted bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800)",
          }}
        />

        <div className="p-6 md:p-8">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
            <div>
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <h1 className="font-display text-3xl font-semibold text-foreground">
                  {trip.title}
                </h1>
                <Badge
                  className={statusStyles[trip.status] || statusStyles.Upcoming}
                >
                  {trip.status || "Upcoming"}
                </Badge>
              </div>
              <p className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="size-4" /> {trip.destination}
              </p>
            </div>
            <div className="text-right">
              <span className="block text-2xl font-bold text-success">
                ${trip.estimatedBudget}
              </span>
              <span className="text-sm text-muted-foreground">
                Estimated total
              </span>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-secondary/50 p-4">
              <p className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                <CalendarDays className="size-3.5" /> Dates
              </p>
              <p className="mt-1 font-semibold text-foreground">
                {trip.startDate} to {trip.endDate}
              </p>
            </div>

            <div className="rounded-xl bg-secondary/50 p-4">
              <p className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                <Compass className="size-3.5" /> Travel style
              </p>
              <p className="mt-1 font-semibold text-foreground">
                {trip.travelStyle} • {trip.targetVibe}
              </p>
            </div>

            <div className="rounded-xl bg-secondary/50 p-4">
              <p className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                <User className="size-3.5" /> Creator
              </p>
              <p className="mt-1 font-semibold text-foreground">
                {trip.creatorId?.name || "Anonymous traveler"}
              </p>
            </div>

            <div className="rounded-xl bg-secondary/50 p-4">
              <p className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                <Users className="size-3.5" />
                {isSoloMode ? "Itinerary status" : "Applicants"}
              </p>
              <p className="mt-1 font-semibold text-foreground">
                {isSoloMode
                  ? "Ready for download"
                  : `${trip.applicants?.length || 0} travelers applied`}
              </p>
            </div>
          </div>

          <div className="text-center">
            {applyStatus ? (
              <div>
                <div className="rounded-xl bg-success/15 px-4 py-3 font-semibold text-success">
                  {applyStatus}
                </div>
                {canAccessChat && (
                  <Button asChild className="mt-3">
                    <Link to={`/chat/${trip._id}`}>
                      <MessageCircle className="size-4" /> Open trip chat
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <Button
                onClick={handleAction}
                variant={isSoloMode ? "default" : "accent"}
                size="lg"
                className={
                  isSoloMode
                    ? "w-full bg-success text-success-foreground hover:bg-success/90"
                    : "w-full"
                }
              >
                {isSoloMode
                  ? "Download solo itinerary"
                  : "Apply to join this trip"}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Trip photos */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Trip photos
          </h2>
          <Link
            to={`/feed?tripId=${trip._id}&destination=${encodeURIComponent(trip.destination)}`}
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            <Camera className="size-4" /> Share a photo
          </Link>
        </div>

        {tripPosts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No photos shared for this trip yet.
          </p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
            {tripPosts.map((post) => (
              <img
                key={post._id}
                src={post.imageUrl}
                alt={post.caption || "Trip photo"}
                className="h-[150px] w-full rounded-lg object-cover"
              />
            ))}
          </div>
        )}
      </div>

      {/* Rate your crew — only once the trip is actually over, and only for members */}
      {trip.status === "Completed" && canAccessChat && (
        <div className="mt-8">
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">
            Rate your crew
          </h2>
          <div className="flex flex-col gap-4">
            {[
              ...(trip.creatorId !== currentUserId
                ? [{ userId: trip.creatorId, name: "Trip creator" }]
                : []),
              ...(trip.approvedMembers || []).filter(
                (m) => m.userId !== currentUserId,
              ),
            ].map((member) => {
              const existing = myReviews.find(
                (r) => r.revieweeId === member.userId,
              );
              const draft = reviewDrafts[member.userId] || {
                rating: existing?.rating || 0,
                comment: existing?.comment || "",
              };
              const status = reviewStatus[member.userId];

              return (
                <Card key={member.userId} className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-semibold text-foreground">
                      {member.name}
                    </p>
                    {existing && (
                      <span className="text-xs font-semibold text-success">
                        ✓ Reviewed
                      </span>
                    )}
                  </div>

                  <div className="mb-3 flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setReviewDrafts((prev) => ({
                            ...prev,
                            [member.userId]: { ...draft, rating: star },
                          }))
                        }
                      >
                        <Star
                          className={`size-6 ${
                            star <= draft.rating
                              ? "fill-accent text-accent"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <Textarea
                    placeholder="How was traveling with them? (optional)"
                    value={draft.comment}
                    onChange={(e) =>
                      setReviewDrafts((prev) => ({
                        ...prev,
                        [member.userId]: { ...draft, comment: e.target.value },
                      }))
                    }
                    rows={2}
                  />

                  <Button
                    size="sm"
                    className="mt-3"
                    disabled={!draft.rating || status === "saving"}
                    onClick={() => submitReview(member.userId)}
                  >
                    {status === "saving"
                      ? "Saving..."
                      : existing
                        ? "Update review"
                        : "Submit review"}
                  </Button>
                  {status === "error" && (
                    <p className="mt-2 text-sm text-destructive">
                      Something went wrong. Try again.
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDetails;
