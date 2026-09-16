import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TRAVEL_STYLES = [
  { value: "Adventure", label: "🏕️ Adventure & Hiking" },
  { value: "Backpacker", label: "🎒 Budget Backpacker" },
  { value: "Luxury", label: "🍾 Luxury & Resorts" },
  { value: "Chill", label: "🧘 Chill & Culture" },
];

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    travelStyle: "Adventure",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api/auth/register", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong during registration.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-70px)] flex-col bg-background md:flex-row">
      {/* Visual side — travel inspiration. Compact banner on mobile, full-height on desktop. */}
      <div
        className="relative h-44 shrink-0 bg-cover bg-center md:h-auto md:flex-1"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=2000")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-x-6 bottom-6 text-white md:inset-x-[10%] md:bottom-[10%]">
          <h2 className="font-display text-2xl font-semibold leading-tight text-balance md:text-4xl">
            Your next great story starts here.
          </h2>
          <p className="mt-2 hidden text-white/80 md:block">
            Join a community of travelers, find your crew, and explore the world
            together.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex flex-1 items-center justify-center px-6 py-10 md:px-[10%]">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl font-semibold text-foreground">
            Create your passport
          </h1>
          <p className="mt-1 text-muted-foreground">
            Sign up to post trips and match with buddies.
          </p>

          {error && (
            <div className="mt-6 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                Full name
              </label>
              <Input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Where should we send your ticket?"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email address
              </label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="travelStyle"
                className="text-sm font-medium text-foreground"
              >
                Primary travel style
              </label>
              <select
                id="travelStyle"
                name="travelStyle"
                value={formData.travelStyle}
                onChange={handleChange}
                className="h-11 w-full cursor-pointer rounded-full border border-input bg-background px-5 text-sm shadow-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              >
                {TRAVEL_STYLES.map((style) => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
            </div>

            <Button
              type="submit"
              variant="accent"
              disabled={loading}
              className="mt-2 w-full"
            >
              {loading ? "Creating passport..." : "Start my journey"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline"
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
