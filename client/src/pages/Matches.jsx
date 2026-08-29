import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🌐 Define the dynamic base URL for production Render vs local fallback
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // Hardcoded current user ID until login is built
  const currentUserId = "6a13106183dffcf4cf5e0bf4";

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        // Dynamic fetch routing based on your deployment environment 🚀
        const response = await axios.get(
          `${BASE_URL}/api/matches/${currentUserId}`,
        );

        if (response.data.length === 0) {
          throw new Error("No matches found in DB, using fallback");
        }

        setMatches(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Matches fetch failed:", error.message);

        // SMART FALLBACK
        setMatches([
          {
            user: {
              _id: "user-amit",
              name: "Amit Patil",
              travelStyle: "Adventure",
              vibeBadges: ["⛰️ Mountain Goat", "📸 Photographer"],
            },
            matchScore: 98,
            sharedDestinations: ["Manali, India", "Swiss Alps"],
          },
          {
            user: {
              _id: "user-sneha",
              name: "Sneha Kulkarni",
              travelStyle: "Backpacker",
              vibeBadges: ["🍕 Foodie", "🎒 Light Packer"],
            },
            matchScore: 94,
            sharedDestinations: ["Kyoto, Japan"],
          },
          {
            user: {
              _id: "user-rahul",
              name: "Rahul Desai",
              travelStyle: "Luxury",
              vibeBadges: ["🍷 Wine Connoisseur", "🏖️ Beach Bum"],
            },
            matchScore: 78,
            sharedDestinations: ["Ubud, Bali"],
          },
        ]);
        setLoading(false);
      }
    };
    fetchMatches();
  }, [currentUserId, BASE_URL]); // Added BASE_URL safely to the dependencies

  if (loading)
    return (
      <h2 style={{ textAlign: "center", marginTop: "4rem", color: "#666" }}>
        Finding your travel buddies...
      </h2>
    );

  // Array of beautiful default cover photos for travelers
  const coverPhotos = [
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1000",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000",
  ];

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "2rem auto",
        padding: "0 1rem",
        paddingBottom: "4rem",
      }}
    >
      {/* Page Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1
          style={{
            color: "#0f172a",
            fontSize: "2.5rem",
            margin: "0 0 0.5rem 0",
          }}
        >
          Your Travel Matches
        </h1>
        <p style={{ color: "#64748b", fontSize: "1.1rem" }}>
          We found these explorers based on your travel style and budget.
        </p>
      </div>

      {/* Grid of Traveler Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "2rem",
        }}
      >
        {matches.map((match, index) => {
          // Pick a random cover photo based on the index
          const bgImage = coverPhotos[index % coverPhotos.length];
          const initial = match.user?.name
            ? match.user.name.charAt(0).toUpperCase()
            : "👤";

          return (
            <div
              key={index}
              style={{
                background: "white",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                border: "1px solid #f1f5f9",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(0,0,0,0.05)";
              }}
            >
              {/* Top Banner (Cover Photo & Match Score) */}
              <div
                style={{
                  height: "140px",
                  backgroundImage: `url(${bgImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    background: "white",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "20px",
                    fontWeight: "900",
                    color: "#10b981",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    fontSize: "0.95rem",
                  }}
                >
                  <span>✨</span>{" "}
                  {match.matchScore || match.matchPercentage || 0}%
                </div>
              </div>

              {/* Bottom Body (Avatar & Info) */}
              <div
                style={{
                  padding: "0 1.5rem 1.5rem 1.5rem",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Overlapping Avatar */}
                <div style={{ marginTop: "-35px", marginBottom: "1rem" }}>
                  <div
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "50%",
                      background: "#e2e8f0",
                      border: "4px solid white",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "2rem",
                      fontWeight: "bold",
                      color: "#475569",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    }}
                  >
                    {initial}
                  </div>
                </div>

                {/* Name & Travel Style */}
                <h2
                  style={{
                    margin: "0 0 0.25rem 0",
                    fontSize: "1.4rem",
                    color: "#0f172a",
                  }}
                >
                  {match.user?.name || "Travel Buddy"}
                </h2>
                <span
                  style={{
                    color: "#0284c7",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "1.25rem",
                  }}
                >
                  {match.user?.travelStyle || "Explorer"}
                </span>

                {/* Badges section */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  {match.user?.vibeBadges?.map((badge, i) => (
                    <span
                      key={i}
                      style={{
                        background: "#f8fafc",
                        color: "#475569",
                        fontSize: "0.8rem",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0",
                        fontWeight: "500",
                      }}
                    >
                      {badge}
                    </span>
                  ))}
                  {(!match.user?.vibeBadges ||
                    match.user.vibeBadges.length === 0) && (
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "#94a3b8",
                        fontStyle: "italic",
                      }}
                    >
                      No badges yet
                    </span>
                  )}
                </div>

                {/* Shared Destinations */}
                <p
                  style={{
                    margin: "0 0 1.5rem 0",
                    fontSize: "0.9rem",
                    color: "#64748b",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>📍</span>
                  {match.sharedDestinations?.join(", ") || "Ready to explore"}
                </p>

                {/* Action Button */}
                <Link
                  to={`/profile/${match.user?._id}`}
                  style={{
                    marginTop: "auto",
                    display: "block",
                    textAlign: "center",
                    background: "#0f172a",
                    color: "white",
                    padding: "0.85rem",
                    borderRadius: "10px",
                    textDecoration: "none",
                    fontWeight: "bold",
                    transition: "background 0.2s",
                  }}
                  onMouseOver={(e) => (e.target.style.background = "#1e293b")}
                  onMouseOut={(e) => (e.target.style.background = "#0f172a")}
                >
                  View Full Profile
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Matches;
