import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axiosInstance";

const Feed = () => {
  const [searchParams] = useSearchParams();
  const linkedTripId = searchParams.get("tripId") || "";

  const [posts, setPosts] = useState([]);
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

  const loggedInUser = localStorage.getItem("user");
  const currentUser = loggedInUser ? JSON.parse(loggedInUser) : null;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/api/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Error loading feed:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
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
    <div style={{ maxWidth: "935px", margin: "2rem auto", padding: "0 1rem" }}>
      <h1
        style={{
          fontSize: "1.75rem",
          color: "#0f172a",
          marginBottom: "1.5rem",
        }}
      >
        Travel memories
      </h1>

      {/* Upload form */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "1.25rem",
          marginBottom: "2rem",
          maxWidth: "500px",
        }}
      >
        {linkedTripId && (
          <div
            style={{
              background: "#e0f2fe",
              color: "#0369a1",
              fontSize: "0.85rem",
              fontWeight: "600",
              padding: "0.5rem 0.75rem",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          >
            Sharing a photo for this trip
          </div>
        )}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={{
              width: "100%",
              maxHeight: "320px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginBottom: "0.75rem" }}
        />

        <input
          type="text"
          placeholder="Where was this taken?"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          style={{
            width: "100%",
            padding: "0.65rem 0.85rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            marginBottom: "0.75rem",
            boxSizing: "border-box",
          }}
        />

        <textarea
          placeholder="Say something about this trip..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={3}
          style={{
            width: "100%",
            padding: "0.65rem 0.85rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            marginBottom: "0.75rem",
            boxSizing: "border-box",
            resize: "vertical",
          }}
        />

        <button
          type="submit"
          disabled={uploading}
          style={{
            background: "#0284c7",
            color: "white",
            border: "none",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: uploading ? "not-allowed" : "pointer",
            opacity: uploading ? 0.7 : 1,
          }}
        >
          {uploading ? "Posting..." : "Post photo"}
        </button>

        {status && (
          <p
            style={{
              marginTop: "0.75rem",
              color: "#0284c7",
              fontSize: "0.9rem",
            }}
          >
            {status}
          </p>
        )}
      </form>

      {/* Feed grid */}
      {loading ? (
        <p style={{ textAlign: "center", color: "#64748b" }}>
          Loading memories...
        </p>
      ) : posts.length === 0 ? (
        <p style={{ textAlign: "center", color: "#64748b" }}>
          No travel photos yet. Be the first to share one!
        </p>
      ) : (
        <>
          <style>{`
            .photo-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 4px;
            }
            @media (max-width: 768px) {
              .photo-grid {
                grid-template-columns: repeat(3, 1fr);
                gap: 2px;
              }
            }
            .photo-grid-item {
              position: relative;
              aspect-ratio: 1 / 1;
              overflow: hidden;
              cursor: pointer;
              background: #e2e8f0;
            }
            .photo-grid-item img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
              transition: transform 0.15s ease;
            }
            .photo-grid-item:hover img {
              transform: scale(1.04);
            }
            .photo-grid-overlay {
              position: absolute;
              inset: 0;
              background: rgba(15, 23, 42, 0.55);
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              padding: 0.5rem;
              font-size: 0.8rem;
              opacity: 0;
              transition: opacity 0.15s ease;
            }
            .photo-grid-item:hover .photo-grid-overlay {
              opacity: 1;
            }
          `}</style>

          <div className="photo-grid">
            {posts.map((post) => (
              <div
                key={post._id}
                className="photo-grid-item"
                onClick={() => setSelectedPost(post)}
              >
                <img src={post.imageUrl} alt={post.caption || "Travel photo"} />
                <div className="photo-grid-overlay">
                  {post.userName}
                  {post.destination ? ` · ${post.destination}` : ""}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Lightbox for viewing a single post's full details */}
      {selectedPost && (
        <div
          onClick={() => setSelectedPost(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "12px",
              overflow: "hidden",
              maxWidth: "500px",
              width: "100%",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              src={selectedPost.imageUrl}
              alt={selectedPost.caption || "Travel photo"}
              style={{
                width: "100%",
                maxHeight: "60vh",
                objectFit: "cover",
                display: "block",
              }}
            />
            <div style={{ padding: "1rem" }}>
              <p
                style={{
                  fontWeight: "bold",
                  margin: "0 0 0.25rem 0",
                  color: "#0f172a",
                }}
              >
                <Link
                  to={`/profile/${selectedPost.userId}`}
                  style={{ color: "#0f172a", textDecoration: "none" }}
                >
                  {selectedPost.userName}
                </Link>
                {selectedPost.destination && (
                  <span style={{ color: "#64748b", fontWeight: "normal" }}>
                    {" "}
                    · {selectedPost.destination}
                  </span>
                )}
              </p>
              {selectedPost.caption && (
                <p style={{ margin: 0, color: "#334155" }}>
                  {selectedPost.caption}
                </p>
              )}
              <button
                onClick={() => setSelectedPost(null)}
                style={{
                  marginTop: "0.85rem",
                  background: "#f1f5f9",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
