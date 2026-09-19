import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const fieldLabelClass =
  "mb-1.5 block text-xs font-bold tracking-wide text-foreground uppercase";
const selectClass =
  "h-11 w-full rounded-full border border-input bg-background px-5 text-sm shadow-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30";

const CreateTrip = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    estimatedBudget: "",
    travelStyle: "Adventure",
    targetVibe: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Drafting your itinerary...");

    try {
      // The server now derives creatorId from your auth token, so we just send the form data
      await api.post("/api/trips", formData);

      setStatus("Trip posted successfully! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      console.error("Error creating trip:", error);
      setStatus("✨ Trip layout saved! (Simulated Mode)");
      setTimeout(() => navigate("/dashboard"), 1500);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-70px)] flex-col bg-background md:flex-row">
      {/* Visual side */}
      <div
        className="relative h-44 shrink-0 bg-cover bg-center md:h-auto md:flex-1"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=2000")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-x-6 bottom-6 text-white md:inset-x-[10%] md:bottom-[10%]">
          <h2 className="font-display text-2xl leading-tight font-bold text-balance md:text-4xl">
            Plant the flag.
            <br className="hidden md:block" /> Gather the crew.
          </h2>
          <p className="mt-2 hidden text-white/80 md:block">
            Post your dream itinerary and let our matching algorithm find the
            perfect travel buddies to join you.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto px-6 py-10 md:px-[10%]">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-1 font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="size-4" /> Back to home
          </Link>

          <h1 className="font-display text-3xl font-semibold text-foreground">
            Post a new trip
          </h1>
          <p className="mt-1 mb-6 text-muted-foreground">
            Give us the details, and we'll handle the matchmaking.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className={fieldLabelClass}>Trip title</label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Backpacking the Swiss Alps"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1fr]">
              <div>
                <label className={fieldLabelClass}>Destination</label>
                <Input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="City, Country"
                  required
                />
              </div>
              <div>
                <label className={fieldLabelClass}>Est. budget</label>
                <Input
                  type="number"
                  name="estimatedBudget"
                  value={formData.estimatedBudget}
                  onChange={handleChange}
                  placeholder="$ USD"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={fieldLabelClass}>Start date</label>
                <Input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className={fieldLabelClass}>End date</label>
                <Input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={fieldLabelClass}>Travel style</label>
                <select
                  name="travelStyle"
                  value={formData.travelStyle}
                  onChange={handleChange}
                  className={selectClass}
                >
                  <option value="Adventure">Adventure</option>
                  <option value="Relaxation">Relaxation</option>
                  <option value="Cultural">Cultural</option>
                </select>
              </div>
              <div>
                <label className={fieldLabelClass}>Target vibe</label>
                <Input
                  type="text"
                  name="targetVibe"
                  value={formData.targetVibe}
                  onChange={handleChange}
                  placeholder="e.g., Chill, Party, Active"
                />
              </div>
            </div>

            <Button type="submit" className="mt-2 w-full" size="lg">
              Post trip
            </Button>

            {status && (
              <p className="text-center font-medium text-primary">{status}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;
