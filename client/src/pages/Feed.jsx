import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Lock, ImagePlus, MapPin } from "lucide-react";
import api from "../api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Feed = () => {
  const [searchParams] = useSearchParams();
  const linkedTripId = searchParams.get("tripId") || "";

  const [posts, setPosts] = useState([]);
  const loggedInUser = localStorage.getItem("user");
  const currentUser = loggedInUser ? JSON.parse(loggedInUser) : null;

  const [loading, setLoading] = useState(true);
  const [authRequired, setAuthRequired] = useState(false);
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
    // Guards against setting state after this effect has been cleaned up
    // (e.g. the component unmounted before the request resolved).
    let ignore = false;

    const fetchPosts = async () => {
      // Read localStorage fresh here instead of closing over the outer
      // `currentUser`/`loggedInUser` variables — this is what lets the
      // effect safely run once on mount with an empty dependency array.
      const token = localStorage.getItem("token");

      if (!token) {
        if (!ignore) {
          setAuthRequired(true);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await api.get("/api/posts");
        if (!ignore) setPosts(response.data);
      } catch (error) {
        if (!ignore) {
          // A stored token can still be expired/invalid — treat a 401 the same way
          if (error.response?.status === 401) {
            setAuthRequired(true);
          } else {
            console.error("Error loading feed:", error.message);
          }
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
      if (error.response?.status === 401) {
        setAuthRequired(true);
      } else {
        setStatus(error.response?.data?.message || "Failed to upload photo.");
      }
    } finally {
      setUploading(false);
    }
  };

  // Logged-out (or expired-session) view: friendly prompt instead of a
  // silently empty feed.
  if (!loading && authRequired) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <Lock className="mx-auto mb-3 size-10 text-muted-foreground" />
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Log in to see travel memories
        </h1>
        <p className="mt-2 mb-6 text-muted-foreground">
          The photo feed is only visible to logged-in members. Log in or create
          an account to view and share travel photos.
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/register">Sign up</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[935px] px-4 py-8">
      <h1 className="mb-6 font-display text-3xl font-semibold text-foreground">
        Travel memories
      </h1>

      {/* Upload form */}
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
