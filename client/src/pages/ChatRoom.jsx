import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import io from "socket.io-client";

// 🌐 Establish dynamic URL for production Render deployment vs local fallback
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ChatRoom = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();

  // State for messages and the current input
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [chatError, setChatError] = useState("");
  const [socket, setSocket] = useState(null);

  const loggedInUser = localStorage.getItem("user");
  const currentUser = loggedInUser ? JSON.parse(loggedInUser) : null;

  // 1. Establish an authenticated connection and join the trip room
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setChatError("You must be logged in to use chat.");
      return;
    }

    const newSocket = io.connect(BASE_URL, {
      auth: { token },
    });

    newSocket.emit("join_trip_room", tripId);

    newSocket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });

    newSocket.on("chat_error", (message) => {
      setChatError(message);
    });

    newSocket.on("connect_error", () => {
      setChatError("Could not connect to chat. Try logging in again.");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [tripId]);

  // 2. Handle sending a message
  const sendMessage = () => {
    if (currentMessage !== "" && socket) {
      const messageData = {
        tripId: tripId,
        text: currentMessage,
      };

      // Blast it to the backend pipe — server fills in sender/time from
      // the verified socket identity, we don't send that ourselves
      socket.emit("send_message", messageData);

      // Add it to our own screen instantly, using our own known identity
      setMessageList((list) => [
        ...list,
        {
          ...messageData,
          sender: currentUser?.name || "You",
          senderId: currentUser?.id,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setCurrentMessage(""); // Clear the input box
    }
  };

  // Allow sending by pressing "Enter"
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "2rem auto",
        padding: "0 1rem",
        height: "80vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Link
        to="/dashboard"
        style={{
          color: "#0284c7",
          textDecoration: "none",
          fontWeight: "bold",
          marginBottom: "1rem",
          display: "inline-block",
        }}
      >
        &larr; Back to Dashboard
      </Link>

      {/* Header */}
      <div
        style={{
          background: "#0284c7",
          color: "white",
          padding: "1rem",
          borderRadius: "12px 12px 0 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>💬 Group Chat</h2>
        <span
          style={{
            fontSize: "0.9rem",
            background: "rgba(255,255,255,0.2)",
            padding: "4px 10px",
            borderRadius: "20px",
          }}
        >
          Trip ID: {tripId}
        </span>
      </div>

      {chatError && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "0.75rem 1rem",
            fontSize: "0.9rem",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {chatError}
        </div>
      )}

      {/* Chat Window */}
      <div
        style={{
          flex: 1,
          background: "#f0f2f5",
          padding: "1.5rem",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          borderLeft: "1px solid #ccc",
          borderRight: "1px solid #ccc",
        }}
      >
        <div style={{ textAlign: "center", margin: "1rem 0" }}>
          <span
            style={{
              background: "#e2e8f0",
              color: "#475569",
              fontSize: "0.8rem",
              padding: "4px 12px",
              borderRadius: "20px",
            }}
          >
            Welcome to the trip chat! Start planning your adventure.
          </span>
        </div>

        {messageList.map((msg, index) => {
          const isMe = msg.senderId === currentUser?.id;
          return (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  background: isMe ? "#dcf8c6" : "white",
                  padding: "0.75rem 1rem",
                  borderRadius: isMe ? "12px 12px 0 12px" : "12px 12px 12px 0",
                  maxWidth: "70%",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                {!isMe && (
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      color: "#0284c7",
                      marginBottom: "4px",
                    }}
                  >
                    {msg.sender}
                  </div>
                )}
                <div style={{ color: "#333", marginBottom: "4px" }}>
                  {msg.text}
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "#888",
                    textAlign: "right",
                  }}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div
        style={{
          background: "#f0f2f5",
          padding: "1rem",
          borderRadius: "0 0 12px 12px",
          display: "flex",
          gap: "0.5rem",
          border: "1px solid #ccc",
          borderTop: "none",
        }}
      >
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "0.75rem",
            borderRadius: "24px",
            border: "none",
            outline: "none",
            fontSize: "1rem",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            background: "#0284c7",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "45px",
            height: "45px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
