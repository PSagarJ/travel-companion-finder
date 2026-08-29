import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance";

const Dashboard = () => {
  const [myTrips, setMyTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const loggedInUser = localStorage.getItem("user");
  const currentUser = loggedInUser ? JSON.parse(loggedInUser) : null;
  const currentUserId = currentUser ? currentUser.id : null;

  useEffect(() => {
    const fetchMyTrips = async () => {
      if (!currentUserId) return;
      try {
        const response = await api.get(`/api/trips/user/${currentUserId}`);
        setMyTrips(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Dashboard engine error:", error.message);
        setLoading(false);
      }
    };
    fetchMyTrips();
  }, [currentUserId]);

  const handleDecision = async (tripId, applicantId, decision) => {
    try {
      const dbStatus = decision === "approve" ? "approved" : "rejected";

      await api.put(`/api/trips/${tripId}/status`, {
        userId: applicantId,
        status: dbStatus,
      });

      setMyTrips((prevTrips) =>
        prevTrips.map((trip) => {
          if (trip._id === tripId) {
            const applicantToMove = trip.applicants.find(
              (a) => a.userId === applicantId,
            );
            return {
              ...trip,
              applicants: trip.applicants.filter(
                (a) => a.userId !== applicantId,
              ),
              approvedMembers:
                decision === "approve"
                  ? [...(trip.approvedMembers || []), applicantToMove]
                  : trip.approvedMembers,
            };
          }
          return trip;
        }),
      );
      alert(`User successfully ${decision}d!`);
    } catch (error) {
      console.error("Error updating applicant:", error.message);
    }
  };

  // 🧠 SEPARATION MATRIX: Split trips by your corporate access level
  const hostedTrips = myTrips.filter(
    (trip) => trip.creatorId === currentUserId,
  );
  const joinedTrips = myTrips.filter(
    (trip) => trip.creatorId !== currentUserId,
  );

  if (loading)
    return (
      <h2 style={{ textAlign: "center", marginTop: "4rem", color: "#666" }}>
        Loading Dashboard...
      </h2>
    );

  // Reusable component template card for rendering trips cleanly
  const renderTripCard = (trip, isHost) => (
    <div
      key={trip._id}
      style={{
        background: "white",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        border: "1px solid #e5e7eb",
        marginBottom: "1.5rem",
      }}
    >
      {/* Trip Header Content Panel */}
      <div
        style={{
          background: "#f8fafc",
          padding: "1.5rem",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2 style={{ margin: "0 0 0.5rem 0", color: "#0f172a" }}>
            {trip.title}
          </h2>
          <span style={{ color: "#64748b", fontWeight: "bold" }}>
            📍 {trip.destination} • 📅 {trip.startDate}
          </span>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link
            to={`/ledger/${trip._id}`}
            style={{
              background: "#f59e0b",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "0.9rem",
            }}
          >
            View Ledger
          </Link>
          <div
            style={{
              background: "#0284c7",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              fontWeight: "bold",
              fontSize: "0.9rem",
            }}
          >
            {(trip.approvedMembers?.length || 0) + 1} in Crew
          </div>
        </div>
      </div>

      {/* 💥 SECURITY CHECK: Only display administration requests if you are the host! */}
      {isHost && (
        <div style={{ padding: "1.5rem" }}>
          <h3
            style={{
              margin: "0 0 1rem 0",
              color: "#334155",
              fontSize: "1.1rem",
            }}
          >
            Pending Applications (
            {trip.applicants?.filter((a) => a.status === "pending" || !a.status)
              .length || 0}
            )
          </h3>

          {!trip.applicants ||
          trip.applicants.filter((a) => a.status === "pending" || !a.status)
            .length === 0 ? (
            <p style={{ color: "#94a3b8", fontStyle: "italic", margin: 0 }}>
              No pending applications right now.
            </p>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {trip.applicants
                .filter((a) => a.status === "pending" || !a.status)
                .map((applicant, index) => (
                  <div
                    key={applicant.userId || index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1rem",
                      background: "#f1f5f9",
                      borderRadius: "8px",
                    }}
                  >
                    <div>
                      <h4 style={{ margin: "0 0 0.25rem 0", color: "#1e293b" }}>
                        {applicant.name}
                      </h4>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: "#475569",
                          background: "#e2e8f0",
                          padding: "2px 8px",
                          borderRadius: "12px",
                        }}
                      >
                        {applicant.travelStyle}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() =>
                          handleDecision(trip._id, applicant.userId, "approve")
                        }
                        style={{
                          padding: "0.5rem 1rem",
                          background: "#10b981",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleDecision(trip._id, applicant.userId, "reject")
                        }
                        style={{
                          padding: "0.5rem 1rem",
                          background: "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "0 1rem" }}>
      <h1 style={{ color: "#1f2937", marginBottom: "2.5rem" }}>
        💼 My Travel Control Deck
      </h1>

      {/* SECTION 1: TRIPS YOU ARE HOSTING */}
      <h3
        style={{
          color: "#0284c7",
          borderBottom: "2px solid #e0f2fe",
          paddingBottom: "0.5rem",
          marginBottom: "1.5rem",
        }}
      >
        👑 Trips You Are Hosting
      </h3>
      {hostedTrips.length === 0 ? (
        <p
          style={{
            color: "#94a3b8",
            fontStyle: "italic",
            marginBottom: "3rem",
          }}
        >
          You haven't posted any trip itineraries yet.
        </p>
      ) : (
        <div style={{ marginBottom: "3rem" }}>
          {hostedTrips.map((trip) => renderTripCard(trip, true))}
        </div>
      )}

      {/* SECTION 2: TRIPS YOU ARE JOINING */}
      <h3
        style={{
          color: "#10b981",
          borderBottom: "2px solid #dcfce7",
          paddingBottom: "0.5rem",
          marginBottom: "1.5rem",
        }}
      >
        🎒 Trips You Are Joining
      </h3>
      {joinedTrips.length === 0 ? (
        <p style={{ color: "#94a3b8", fontStyle: "italic" }}>
          You haven't joined any buddy crews yet.
        </p>
      ) : (
        <div>{joinedTrips.map((trip) => renderTripCard(trip, false))}</div>
      )}
    </div>
  );
};

export default Dashboard;
