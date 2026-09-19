import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import io from "socket.io-client";
import { ArrowLeft, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// 🌐 Establish dynamic URL for production Render deployment vs local fallback
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ChatRoom = () => {
  const { tripId } = useParams();

  // State for messages and the current input
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [chatError, setChatError] = useState("");
  // The socket instance doesn't affect what's rendered, so it belongs in a
  // ref, not state — assigning a ref is a plain mutation, not a setState
  // call, so it can't trigger the "setState in effect" warning.
  const socketRef = useRef(null);

  const loggedInUser = localStorage.getItem("user");
  const currentUser = loggedInUser ? JSON.parse(loggedInUser) : null;
  // Known synchronously at render time — no need to push this through
  // an effect + setState just to check whether it exists.
  const token = localStorage.getItem("token");

  // 1. Establish an authenticated connection and join the trip room
  useEffect(() => {
    if (!token) return;

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

    socketRef.current = newSocket;

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [tripId, token]);

  // 2. Handle sending a message
  const sendMessage = () => {
    if (currentMessage !== "" && socketRef.current) {
      const messageData = {
        tripId: tripId,
        text: currentMessage,
      };

      // Blast it to the backend pipe — server fills in sender/time from
      // the verified socket identity, we don't send that ourselves
      socketRef.current.emit("send_message", messageData);

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
    <div className="mx-auto flex h-[80vh] max-w-xl flex-col px-4 py-8">
      <Link
        to="/dashboard"
        className="mb-4 inline-flex items-center gap-1 font-semibold text-primary hover:underline"
      >
        <ArrowLeft className="size-4" /> Back to dashboard
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between rounded-t-2xl bg-primary px-5 py-4 text-primary-foreground">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <MessageCircle className="size-5" /> Group chat
        </h2>
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs">
          Trip #{tripId.slice(-6)}
        </span>
      </div>

      {(!token || chatError) && (
        <div className="bg-destructive/10 px-4 py-3 text-center text-sm font-semibold text-destructive">
          {!token ? "You must be logged in to use chat." : chatError}
        </div>
      )}

      {/* Chat Window */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto border-x border-border bg-secondary/30 p-5">
        <div className="my-2 text-center">
          <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            Welcome to the trip chat! Start planning your adventure.
          </span>
        </div>

        {messageList.map((msg, index) => {
          const isMe = msg.senderId === currentUser?.id;
          return (
            <div
              key={index}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                  isMe
                    ? "rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm bg-card text-card-foreground"
                }`}
              >
                {!isMe && (
                  <div className="mb-1 text-xs font-bold text-primary">
                    {msg.sender}
                  </div>
                )}
                <div className={isMe ? "" : "text-foreground"}>{msg.text}</div>
                <div
                  className={`mt-1 text-right text-[0.7rem] ${
                    isMe
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="flex gap-2 rounded-b-2xl border border-t-0 border-border bg-secondary/30 p-4">
        <Input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button onClick={sendMessage} size="icon" aria-label="Send message">
          <Send className="size-4.5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatRoom;
