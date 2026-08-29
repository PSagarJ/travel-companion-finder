import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import io from "socket.io-client";

// 🌐 Establish dynamic URL for production Render deployment vs local fallback
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// 1. Establish the connection to your backend Socket.io server dynamically
const socket = io.connect(BASE_URL);

const ChatRoom = () => {
  const { tripId } = useParams();

  // State for messages and the current input
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  // Hardcoded current user details
  const currentUserName = "Pratap Sagar";

  // 2. Join the specific Trip Room when the component loads
  useEffect(() => {
    socket.emit("join_trip_room", tripId);

    // Set up the listener for incoming messages from the server
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });

    // Cleanup function when you leave the page
    return () => {
      socket.off("receive_message");
    };
  }, [tripId]);

  // 3. Handle sending a message
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        tripId: tripId,
        sender: currentUserName,
        text: currentMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      // Blast it to the backend pipe
      await socket.emit("send_message", messageData);

      // Add it to our own screen instantly
      setMessageList((list) => [...list, messageData]);
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
          const isMe = msg.sender === currentUserName;
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
