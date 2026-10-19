import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ImagePlus, MapPin } from "lucide-react";
import api from "../api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const fallbackPosts = [
  {
    _id: "demo-post-1",
    userName: "Sagar J P",
    imageUrl:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=85&w=1200&auto=format&fit=crop",
    caption:
      "Sunrise at Uluwatu Temple. Waves crashing hundreds of feet below with coastal monkeys along the cliffs.",
    destination: "Uluwatu, Bali",
    createdAt: "2026-09-19T05:33:18.355Z",
  },
  {
    _id: "demo-post-2",
    userName: "Elena Rostova",
    imageUrl:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=85&w=1200&auto=format&fit=crop",
    caption:
      "Early morning in Arashiyama Bamboo Grove before the crowds arrive. Whispering wind through towering stalks.",
    destination: "Kyoto, Japan",
    createdAt: "2026-09-22T08:15:20.120Z",
  },
  {
    _id: "demo-post-3",
    userName: "Marcus Vance",
    imageUrl:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=85&w=1200&auto=format&fit=crop",
    caption:
      "Highest motorable pass at 18,380 ft. Thin cold air, warm butter tea, and lifelong riding crew.",
    destination: "Khardung La, Ladakh",
    createdAt: "2026-09-28T11:42:05.412Z",
  },
  {
    _id: "demo-post-4",
    userName: "Aria Chen",
    imageUrl:
      "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=85&w=1200&auto=format&fit=crop",
    caption:
      "Lake Brienz reflecting the snow-dusted Bernese Oberland peaks like an emerald mirror.",
    destination: "Interlaken, Switzerland",
    createdAt: "2026-10-02T14:20:10.890Z",
  },
  {
    _id: "demo-post-5",
    userName: "Mateo Rossi",
    imageUrl:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=85&w=1200&auto=format&fit=crop",
    caption:
      "Golden hour sailing past the iconic Faraglioni rock formations off the cliffs of Capri.",
    destination: "Amalfi Coast, Italy",
    createdAt: "2026-10-08T17:35:44.200Z",
  },
  {
    _id: "demo-post-6",
    userName: "Zara Larsson",
    imageUrl:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=85&w=1200&auto=format&fit=crop",
    caption:
      "Iconic whitewashed blue domes of Oia glowing gold as the Aegean sun dips below the horizon.",
    destination: "Santorini, Greece",
    createdAt: "2026-10-12T19:10:30.500Z",
  },
];

const Feed = () => {
  const [searchParams] = useSearchParams();
  const linkedTripId = searchParams.get("tripId") || "";

  const [posts, setPosts] = useState([]);
  const loggedInUser = localStorage.getItem("user");
  const currentUser = loggedInUser ? JSON.parse(loggedInUser) : null;

  const [loading, setLoading] = useState(true);
  const [caption, setCaption] = useState("");
  const [destination, setDestination] = useState(
    searchParams.get("destination") || "",
  );
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchPosts = async () => {
      try {
        const response = await api.get("/api/posts");
        if (!ignore) {
          if (Array.isArray(response.data) && response.data.length > 0) {
            setPosts(response.data);
          } else {
            setPosts(fallbackPosts);
          }
        }
      } catch (error) {
        if (!ignore) {
          console.error("Error loading feed:", error.message);
          setPosts(fallbackPosts);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchPosts();

    return () => {
      ignore = true;
    };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatus("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setStatus("Image must be under 5MB.");
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setStatus("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setStatus("You must be logged in to post a photo.");
      return;
    }
    if (!imageFile) {
      setStatus("Please choose a photo first.");
      return;
    }

    setUploading(true);
    setStatus("Uploading your travel memory...");

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("caption", caption);
      formData.append("destination", destination);
      if (linkedTripId) formData.append("tripId", linkedTripId);

      const response = await api.post("/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPosts([response.data, ...posts]);
      setCaption("");
      setDestination("");
      setImageFile(null);
      setPreview(null);
      setStatus("Posted!");
    } catch (error) {
      setStatus(error.response?.data?.message || "Failed to upload photo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[935px] px-4 py-8">
      <h1 className="mb-6 font-display text-3xl font-semibold text-foreground">
        Travel memories
      </h1>

      {/* Upload form for members or prompt card for visitors */}
      {currentUser ? (
        <Card className="mb-8 max-w-md p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {linkedTripId && (
            <div className="rounded-xl bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
              Sharing a photo for this trip
            </div>
          )}
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="max-h-80 w-full rounded-xl object-cover"
            />
          )}

          <input
            id="photo-upload-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
          />
          <label
            htmlFor="photo-upload-input"
            className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-center font-semibold transition-colors ${
              imageFile
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-input bg-background text-foreground hover:bg-secondary/50"
            }`}
          >
            <ImagePlus className="size-4.5" />
            {imageFile ? imageFile.name : "Choose a photo to upload"}
          </label>

          <Input
            type="text"
            placeholder="Where was this taken?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          <Textarea
            placeholder="Say something about this trip..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
          />

          <Button type="submit" disabled={uploading} className="mt-1 w-full">
            {uploading ? "Posting..." : "Post photo"}
          </Button>

          {status && (
            <p className="text-sm font-medium text-primary">{status}</p>
          )}
        </form>
      </Card>
      ) : (
        <Card className="mb-8 max-w-md border-white/10 bg-white/[.03] p-6">
          <div className="flex items-center gap-3.5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#ff704d]/15 text-[#ff9a78]">
              <ImagePlus className="size-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-white">Share your adventures</h3>
              <p className="text-xs text-white/55">
                Join our community to upload photos, geotag destinations, and connect with fellow explorers.
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-2.5">
            <Button asChild size="sm" className="rounded-full bg-[#ff704d] text-black hover:bg-[#ff8566]">
              <Link to="/login">Log in to post</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="rounded-full border-white/15 text-white hover:bg-white/10">
              <Link to="/register">Create passport</Link>
            </Button>
          </div>
        </Card>
      )}

      {/* Feed grid */}
      {loading ? (
        <p className="text-center text-muted-foreground">Loading memories...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No travel photos yet. Be the first to share one!
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-0.5 md:grid-cols-4 md:gap-1">
          {posts.map((post) => (
            <div
              key={post._id}
              className="group relative aspect-square cursor-pointer overflow-hidden bg-muted"
              onClick={() => setSelectedPost(post)}
            >
              <img
                src={post.imageUrl}
                alt={post.caption || "Travel photo"}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/55 p-2 text-center text-xs text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                {post.userName}
                {post.destination ? ` · ${post.destination}` : ""}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox for viewing a single post's full details */}
      <Dialog
        open={!!selectedPost}
        onOpenChange={(open) => !open && setSelectedPost(null)}
      >
        {selectedPost && (
          <DialogContent className="max-w-md p-0">
            <img
              src={selectedPost.imageUrl}
              alt={selectedPost.caption || "Travel photo"}
              className="max-h-[60vh] w-full object-cover"
            />
            <div className="p-4">
              <p className="font-semibold text-foreground">
                <Link
                  to={`/profile/${selectedPost.userId}`}
                  className="hover:underline"
                >
                  {selectedPost.userName}
                </Link>
                {selectedPost.destination && (
                  <span className="flex items-center gap-1 text-sm font-normal text-muted-foreground">
                    <MapPin className="size-3.5" /> {selectedPost.destination}
                  </span>
                )}
              </p>
              {selectedPost.caption && (
                <p className="mt-1 text-foreground">{selectedPost.caption}</p>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Feed;
