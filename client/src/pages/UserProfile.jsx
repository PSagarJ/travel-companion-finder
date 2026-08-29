import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const UserProfile = () => {
  const { userId } = useParams();

  // 🌐 Define the dynamic base URL for production Render vs local fallback
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Dynamic profile retrieval route mapping 🚀
        const response = await axios.get(`${BASE_URL}/api/users/${userId}`);

        // Merge real DB data with some mock display data so the UI looks great immediately
        setProfile({
          ...response.data,
          bio:
            response.data.bio ||
            "I'm a passionate traveler looking to explore the world, try new foods, and meet awesome people along the way!",
          vibeBadges: response.data.vibeBadges || [
            "🌍 Great Navigator",
            "📸 Photographer",
            "🍕 Foodie",
            "🧘 Chill Vibe",
          ],
          pastTrips: response.data.pastTrips || 4,
        });
        setLoading(false);
      } catch (error) {
        console.error(
          "Profile route not ready or user not found:",
          error.message,
        );

        // SMART FALLBACK
        setProfile({
          name: "Anonymous Traveler",
          travelStyle: "Backpacker",
          bio: "Just looking for my next adventure.",
          vibeBadges: ["🎒 Light Packer"],
          pastTrips: 1,
        });
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId, BASE_URL]); // Added BASE_URL safely to the dependencies

  if (loading)
    return (
      <h2 style={{ textAlign: "center", marginTop: "4rem", color: "#666" }}>
        Loading Profile...
      </h2>
    );

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}>
      <Link
        to="/matches"
        style={{
          color: "#0284c7",
          textDecoration: "none",
          fontWeight: "bold",
          marginBottom: "1rem",
          display: "inline-block",
        }}
      >
        &larr; Back to Matches
      </Link>

      <div
        style={{
          background: "white",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
        }}
      >
        {/* Cover Photo & Avatar */}
        <div
          style={{
            height: "200px",
            backgroundColor: "#e2e8f0",
            backgroundImage:
              "url(https://images.unsplash.com/photo-1501785888041-af3ef285b470)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: "-40px",
              left: "2rem",
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "#cbd5e1",
              border: "4px solid white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "2.5rem",
            }}
          >
            👤
          </div>
        </div>

        <div style={{ padding: "3rem 2rem 2rem 2rem" }}>
          {/* Header Info */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "1.5rem",
            }}
          >
            <div>
              <h1
                style={{
                  margin: "0 0 0.25rem 0",
                  color: "#1f2937",
                  fontSize: "2rem",
                }}
              >
                {profile.name}
              </h1>
              <span
                style={{
                  background: "#e0f2fe",
                  color: "#0369a1",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                }}
              >
                {profile.travelStyle || "Explorer"}
              </span>
            </div>
            <div style={{ textAlign: "right" }}>
              <span
                style={{
                  display: "block",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#10b981",
                }}
              >
                {profile.pastTrips}
              </span>
              <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                Past Trips
              </span>
            </div>
          </div>

          <p
            style={{
              color: "#4b5563",
              lineHeight: "1.6",
              marginBottom: "2rem",
            }}
          >
            {profile.bio}
          </p>

          {/* Vibe Badges Section */}
          <h3
            style={{
              margin: "0 0 1rem 0",
              color: "#334155",
              borderBottom: "2px solid #f1f5f9",
              paddingBottom: "0.5rem",
            }}
          >
            Traveler Vibe Badges
          </h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              marginBottom: "2rem",
            }}
          >
            {profile.vibeBadges.map((badge, index) => (
              <span
                key={index}
                style={{
                  background: "#fef3c7",
                  color: "#b45309",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                }}
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Action Button */}
          <div style={{ textAlign: "center" }}>
            <button
              style={{
                width: "100%",
                padding: "1rem",
                background: "#0f172a",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Message {profile.name.split(" ")[0]}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
