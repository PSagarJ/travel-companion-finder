import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Mail, Lock, Compass } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/api/auth/login", formData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen bg-[#07090d] px-4 pb-10 pt-28 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d1117] shadow-2xl lg:grid-cols-2">
        <div className="relative hidden overflow-hidden lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1500534623283-312aade485b7?q=85&w=1800&auto=format&fit=crop"
            alt="Travel landscape"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#ffb09a]">
              TravelBuddy
            </p>
            <h2 className="mt-3 font-display text-5xl font-extrabold leading-[.95]">
              The world feels
              <br />
              smaller with
              <br />
              <span className="text-[#ff9a78]">your people.</span>
            </h2>
          </div>
        </div>
        <div className="flex items-center justify-center p-7 sm:p-12">
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="mb-12 inline-flex items-center gap-2 text-sm font-semibold text-white/45 hover:text-white"
            >
              <ArrowLeft className="size-4" /> Back home
            </Link>
            <div className="mb-8">
              <div className="mb-5 flex size-11 items-center justify-center rounded-2xl bg-[#ff704d]/10 text-[#ff9a78]">
                <Compass className="size-5" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#ff9a78]">
                Welcome back
              </p>
              <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight">
                Ready for your next trip?
              </h1>
              <p className="mt-3 text-white/45">
                Log in and get back to discovering your crew.
              </p>
            </div>
            {error && (
              <div className="mb-5 rounded-2xl border border-[#ff5f6d]/20 bg-[#ff5f6d]/10 px-4 py-3 text-sm text-[#ff9ba5]">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/50">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/25" />
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="h-13 rounded-2xl border-white/10 bg-white/[.04] pl-11 text-white placeholder:text-white/25"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/50">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/25" />
                  <Input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="h-13 rounded-2xl border-white/10 bg-white/[.04] pl-11 text-white placeholder:text-white/25"
                  />
                </div>
              </div>
              <Button
                disabled={loading}
                className="h-13 w-full rounded-2xl bg-[#ff704d] text-[#130b08] hover:bg-[#ff8566]"
              >
                {loading ? "Logging in..." : "Log in"}{" "}
                {!loading && <ArrowRight className="size-4" />}
              </Button>
            </form>
            <p className="mt-7 text-center text-sm text-white/40">
              New here?{" "}
              <Link
                to="/register"
                className="font-bold text-[#ff9a78] hover:text-white"
              >
                Create your passport
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
export default Login;
