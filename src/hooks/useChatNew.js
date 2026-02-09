import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

/**
 * Simple useChat hook - fetches and manages chat messages
 * No Socket.io required - uses polling for updates
 */
export function useChat(currentUserId, otherUserId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial messages
  useEffect(() => {
    if (!currentUserId || !otherUserId) {
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        if (!token) {
          setError("No auth token found");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `https://qup.dating/api/mobile/chat/${otherUserId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages || []);
          setError(null);
        } else {
          console.error("Failed to fetch messages:", response.status);
          setError("Failed to load messages");
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Optional: Poll for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);

    return () => clearInterval(interval);
  }, [currentUserId, otherUserId]);

  // Mark messages as read when chat opens
  useEffect(() => {
    if (!otherUserId) return;

    const markAsRead = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        if (!token) return;

        await fetch(`https://qup.dating/api/mobile/chat/${otherUserId}/read`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } catch (err) {
        console.error("Error marking messages as read:", err);
      }
    };

    markAsRead();
  }, [otherUserId]);

  // Send message function
  const sendMessage = async ({ content, images }) => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      if (!token) {
        throw new Error("No auth token");
      }

      const response = await fetch(
        `https://qup.dating/api/mobile/messages/${otherUserId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: content || null,
            images: images || [],
            receiver: otherUserId,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        // Optimistically add the message to the list
        if (data.message) {
          setMessages((prev) => [...prev, data.message]);
        }
        
        return { success: true, message: data.message };
      } else {
        throw new Error("Failed to send message");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
      return { success: false, error: err.message };
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
  };
}
