import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosInstance";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api/auth/login", formData);

      // Store security credentials
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard"); // Take them directly to their working control deck
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "4rem auto",
        padding: "2rem",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
        border: "1px solid #e5e7eb",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#0f172a",
          marginBottom: "0.5rem",
        }}
      >
        Welcome Back
      </h2>
      <p
        style={{
          textAlign: "center",
          color: "#64748b",
          marginBottom: "2rem",
          fontSize: "0.9rem",
        }}
      >
        Log in to access your planned routes and coordinates.
      </p>

      {error && (
        <div
          style={{
            color: "#ef4444",
            background: "#fef2f2",
            padding: "0.75rem",
            borderRadius: "6px",
            marginBottom: "1rem",
            fontWeight: "bold",
            fontSize: "0.9rem",
            border: "1px solid #fee2e2",
          }}
        >
          {error}
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
              marginBottom: "0.4rem",
              fontWeight: "600",
              color: "#334155",
              fontSize: "0.9rem",
            }}
          >
            Email Address
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              outline: "none",
            }}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.4rem",
              fontWeight: "600",
              color: "#334155",
              fontSize: "0.9rem",
            }}
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              outline: "none",
            }}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.75rem",
            background: "#0284c7",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background 0.2s",
            marginTop: "0.5rem",
          }}
        >
          {loading ? "Verifying..." : "Log In"}
        </button>
      </form>

      <p
        style={{
          textAlign: "center",
          marginTop: "1.5rem",
          fontSize: "0.9rem",
          color: "#64748b",
        }}
      >
        Don't have an account?{" "}
        <Link
          to="/register"
          style={{
            color: "#0284c7",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;
