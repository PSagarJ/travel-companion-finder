import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    travelStyle: "Adventure",
  });

  // States to track live API network behavior
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Connects dynamically to your deployment environment 🚀
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api/auth/register", formData);

      // Save secure token and user details to the browser cache
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert(
        `Passport Created! Welcome to the crew, ${response.data.user.name}!`,
      );
      navigate("/dashboard");
    } catch (err) {
      // Catch duplicate emails or verification problems straight from the backend
      setError(
        err.response?.data?.message ||
          "Something went wrong during registration.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "calc(100vh - 70px)",
        background: "#fff",
      }}
    >
      {/* LEFT SIDE: Visual Travel Inspiration */}
      <div
        style={{
          flex: 1,
          display: "block",
          backgroundImage:
            'url("https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=2000")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.1))",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "10%",
            right: "10%",
            color: "white",
          }}
        >
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "900",
              marginBottom: "1rem",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Your next great story starts here.
          </h2>
          <p style={{ fontSize: "1.2rem", color: "#e2e8f0" }}>
            Join a community of travelers, find your perfect crew, and explore
            the world together.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: The Form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "3rem 10%",
          background: "#f8fafc",
        }}
      >
        <div style={{ maxWidth: "400px", width: "100%", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "2rem",
              color: "#0f172a",
              marginBottom: "0.5rem",
            }}
          >
            Create your passport
          </h1>
          <p style={{ color: "#64748b", marginBottom: "2.5rem" }}>
            Sign up to post trips and match with buddies.
          </p>

          {/* Alerts the user if the backend catches a duplicate account or problem */}
          {error && (
            <div
              style={{
                color: "#ef4444",
                background: "#fef2f2",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                marginBottom: "1.5rem",
                fontWeight: "bold",
                fontSize: "0.9rem",
                border: "1px solid #fee2e2",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  color: "#334155",
                  marginBottom: "0.5rem",
                  textTransform: "uppercase",
                }}
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Where should we send your ticket?"
                required
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  background: "white",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.border = "1px solid #0284c7")}
                onBlur={(e) => (e.target.style.border = "1px solid #cbd5e1")}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  color: "#334155",
                  marginBottom: "0.5rem",
                  textTransform: "uppercase",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  background: "white",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.border = "1px solid #0284c7")}
                onBlur={(e) => (e.target.style.border = "1px solid #cbd5e1")}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  color: "#334155",
                  marginBottom: "0.5rem",
                  textTransform: "uppercase",
                }}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  background: "white",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.border = "1px solid #0284c7")}
                onBlur={(e) => (e.target.style.border = "1px solid #cbd5e1")}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  color: "#334155",
                  marginBottom: "0.5rem",
                  textTransform: "uppercase",
                }}
              >
                Primary Travel Style
              </label>
              <select
                name="travelStyle"
                value={formData.travelStyle}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  background: "white",
                  fontSize: "1rem",
                  outline: "none",
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              >
                <option value="Adventure">🏕️ Adventure & Hiking</option>
                <option value="Backpacker">🎒 Budget Backpacker</option>
                <option value="Luxury">🍾 Luxury & Resorts</option>
                <option value="Chill">🧘 Chill & Culture</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading} // Prevent double requests while loading
              style={{
                marginTop: "1rem",
                width: "100%",
                padding: "1rem",
                background: loading ? "#64748b" : "#0284c7",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s, transform 0.1s",
              }}
              onMouseOver={(e) => {
                if (!loading) e.target.style.background = "#0369a1";
              }}
              onMouseOut={(e) => {
                if (!loading) e.target.style.background = "#0284c7";
              }}
              onMouseDown={(e) => {
                if (!loading) e.target.style.transform = "scale(0.98)";
              }}
              onMouseUp={(e) => {
                if (!loading) e.target.style.transform = "scale(1)";
              }}
            >
              {loading ? "Creating Passport..." : "Start My Journey"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: "2rem",
              color: "#64748b",
              fontSize: "0.9rem",
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#0284c7",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
