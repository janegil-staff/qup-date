import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_SOCKET_URL || "https://qup.dating";

export function useChat(currentUserId, otherUserId) {
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const roomId =
    currentUserId && otherUserId
      ? [currentUserId, otherUserId].sort().join("-")
      : null;

  // SOCKET SETUP
  useEffect(() => {
    if (!currentUserId) return;

    const socket = io(API_BASE_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join", roomId);
    });

    socket.on("receive-message", (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    });

    return () => socket.disconnect();
  }, [currentUserId, roomId]);

  // FETCH MESSAGES
  const fetchMessages = useCallback(async () => {
    if (!roomId) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/messages?roomId=${roomId}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Fetch messages error:", err);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // SEND MESSAGE (TEXT + IMAGES)
  const sendMessage = async ({ content, images }) => {
    if (!roomId || !currentUserId || !otherUserId) return;

    const tempId = Date.now().toString();

    const optimistic = {
      _id: tempId,
      roomId,
      content: content || null,
      images: images || [],
      sender: currentUserId,
      receiver: otherUserId,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await fetch(`${API_BASE_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(optimistic),
      });

      const data = await res.json();
      if (!res.ok || !data.message) return;

      const saved = data.message;

      socketRef.current.emit("send-message", {
        roomId,
        message: saved,
      });

      setMessages((prev) => {
        const filtered = prev.filter((m) => m._id !== tempId);
        return [...filtered, saved];
      });
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  return {
    messages,
    loading,
    sendMessage,
  };
}
