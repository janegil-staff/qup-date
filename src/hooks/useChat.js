import { useEffect, useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";

export function useChat(currentUserId, otherUserId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ Fetch messages from backend
  const fetchMessages = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      if (!token) return;

      const res = await fetch(
        `https://qup.dating/api/mobile/chat/${otherUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Fetch chat error:", err);
    } finally {
      setLoading(false);
    }
  }, [otherUserId]);

  // ⭐ Send a message
  const sendMessage = async ({ content, images }) => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      if (!token) return;

      const body = {
        sender: currentUserId,
        receiver: otherUserId,
        content,
        images,
      };

      const res = await fetch("https://qup.dating/api/mobile/messages/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        // ⭐ Optimistic update
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  // ⭐ Fetch messages on mount + when user changes
  useEffect(() => {
    if (!currentUserId || !otherUserId) return;
    fetchMessages();
  }, [currentUserId, otherUserId]);

  // ⭐ Polling every 3 seconds (simple real‑time)
  useEffect(() => {
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  return {
    messages,
    loading,
    sendMessage,
  };
}
