import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import api from "../api/axiosInstance";

const TripDetails = () => {
  const { id } = useParams();
  const location = useLocation(); // 💥 Captures the secret data from the Home page

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyStatus, setApplyStatus] = useState("");
  const [tripPosts, setTripPosts] = useState([]);

  // 💥 Determine if the user clicked the "Solo" button on the Home page
  const mode = location.state?.mode || "group";
  const isSoloMode = mode === "solo";

  // 💥 FIXED: Dynamically extract the real logged-in user from localStorage
  const loggedInUser = localStorage.getItem("user");
  const currentUser = loggedInUser ? JSON.parse(loggedInUser) : null;
  const currentUserId = currentUser ? currentUser.id : null;

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        // Dynamic fetch request based on environment 🚀
        const response = await api.get(`/api/trips/${id}`);
        const tripData = response.data;
        setTrip(tripData);

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
        console.error("Backend not ready yet:", error.message);
        setTrip({
          _id: id,
          title: "Expedition to the Highlands",
          destination:
            id === "dest-1"
              ? "Bali, Indonesia"
              : id === "dest-2"
                ? "Kyoto, Japan"
                : "Swiss Alps",
          startDate: "2026-09-10",
          endDate: "2026-09-24",
          estimatedBudget: 1200,
          travelStyle: "Adventure",
          targetVibe: "Nature & Hiking",
          creatorId: "fallback-id",
          applicants: [],
        });
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id, currentUserId]);

  useEffect(() => {
    const fetchTripPosts = async () => {
      try {
        const response = await api.get(`/api/posts/trip/${id}`);
        setTripPosts(response.data);
      } catch (error) {
        console.error("Error loading trip photos:", error.message);
      }
    };
    fetchTripPosts();
  }, [id]);

  // Dynamic button handler based on mode
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

      setApplyStatus("✨ Itinerary Downloaded Successfully!");
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

  if (loading)
    return (
      <h2 style={{ textAlign: "center", marginTop: "4rem", color: "#666" }}>
        Loading adventure...
      </h2>
    );

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}>
      <Link
        to="/"
        style={{
          color: "#0284c7",
          textDecoration: "none",
          fontWeight: "bold",
          marginBottom: "1rem",
          display: "inline-block",
        }}
      >
        &larr; Back to Home
      </Link>

      <div
        style={{
          background: "white",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            height: "300px",
            width: "100%",
            backgroundColor: "#e2e8f0",
            backgroundImage:
              "url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        <div style={{ padding: "2rem" }}>
          <div
            style={{
              display: "flex",
              justifycontent: "space-between",
              alignItems: "flex-start",
              borderBottom: "1px solid #eee",
              paddingBottom: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <div>
              <h1
                style={{
                  margin: "0 0 0.5rem 0",
                  color: "#1f2937",
                  fontSize: "2rem",
                }}
              >
                {trip.title}
              </h1>
              <h3
                style={{
                  margin: 0,
                  color: "#6b7280",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                📍 {trip.destination}
              </h3>
            </div>
            <div style={{ textAlign: "right" }}>
              <span
                style={{
                  display: "block",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#10b981",
                }}
              >
                ${trip.estimatedBudget}
              </span>
              <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                Estimated total
              </span>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                background: "#f8fafc",
                padding: "1rem",
                borderRadius: "8px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: "0.85rem",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                }}
              >
                Dates
              </p>
              <p
                style={{
                  margin: "0.25rem 0 0 0",
                  color: "#334155",
                  fontWeight: "bold",
                }}
              >
                {trip.startDate} to {trip.endDate}
              </p>
            </div>
            <div
              style={{
                background: "#f8fafc",
                padding: "1rem",
                borderRadius: "8px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: "0.85rem",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                }}
              >
                Travel Style
              </p>
              <p
                style={{
                  margin: "0.25rem 0 0 0",
                  color: "#334155",
                  fontWeight: "bold",
                }}
              >
                {trip.travelStyle} • {trip.targetVibe}
              </p>
            </div>

            <div
              style={{
                background: "#f8fafc",
                padding: "1rem",
                borderRadius: "8px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: "0.85rem",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                }}
              >
                Creator
              </p>
              <p
                style={{
                  margin: "0.25rem 0 0 0",
                  color: "#334155",
                  fontWeight: "bold",
                }}
              >
                {trip.creatorId?.name || "Anonymous Traveler"}
              </p>
            </div>

            {/* Dynamically change the 4th box based on mode */}
            <div
              style={{
                background: "#f8fafc",
                padding: "1rem",
                borderRadius: "8px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: "0.85rem",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                }}
              >
                {isSoloMode ? "Itinerary Status" : "Current Applicants"}
              </p>
              <p
                style={{
                  margin: "0.25rem 0 0 0",
                  color: "#334155",
                  fontWeight: "bold",
                }}
              >
                {isSoloMode
                  ? "Ready for Download"
                  : `${trip.applicants?.length || 0} travelers applied`}{" "}
              </p>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            {applyStatus ? (
              <div
                style={{
                  padding: "1rem",
                  background: "#dcfce7",
                  color: "#166534",
                  borderRadius: "8px",
                  fontWeight: "bold",
                }}
              >
                {applyStatus}
              </div>
            ) : (
              <button
                onClick={handleAction}
                style={{
                  width: "100%",
                  padding: "1rem",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "background 0.2s",
                  /* Dynamically change the button color */
                  background: isSoloMode ? "#10b981" : "#0284c7",
                  color: "white",
                }}
              >
                {/* Dynamically change the button text */}
                {isSoloMode
                  ? "Download Solo Itinerary"
                  : "Apply to Join This Trip"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Trip photos */}
      <div style={{ marginTop: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.3rem", color: "#1f2937" }}>
            Trip photos
          </h2>
          <Link
            to={`/feed?tripId=${trip._id}&destination=${encodeURIComponent(trip.destination)}`}
            style={{
              textDecoration: "none",
              color: "#0284c7",
              fontWeight: "bold",
              fontSize: "0.9rem",
            }}
          >
            Share a photo &rarr;
          </Link>
        </div>

        {tripPosts.length === 0 ? (
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
            No photos shared for this trip yet.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {tripPosts.map((post) => (
              <img
                key={post._id}
                src={post.imageUrl}
                alt={post.caption || "Trip photo"}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDetails;
