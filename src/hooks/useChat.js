import { useState, useEffect, useCallback, useRef } from "react";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

/**
 * useChat - Manages chat messages and real-time updates
 * @param {string} currentUserId - The logged-in user's ID
 * @param {string} otherUserId - The other person in the chat
 */
export function useChat(currentUserId, otherUserId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  // Use ref to track if component is mounted
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Fetch messages from API
  const fetchMessages = useCallback(async () => {
    if (!currentUserId || !otherUserId) {
      console.log("⚠️ Missing user IDs:", { currentUserId, otherUserId });
      setLoading(false);
      return;
    }

    try {
      const token = await SecureStore.getItemAsync("authToken");

      if (!token) {
        console.log("❌ No auth token found");
        if (isMounted.current) {
          setError("Authentication required");
          setLoading(false);
        }
        return;
      }

      console.log("📨 Fetching messages for:", otherUserId);

      const response = await fetch(
        `https://qup.dating/api/mobile/chat/${otherUserId}/messages`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API error:", response.status, errorText);

        if (isMounted.current) {
          if (response.status === 401) {
            setError("Session expired. Please log in again.");
          } else if (response.status === 404) {
            setError("Chat not found");
          } else {
            setError("Failed to load messages");
          }
          setLoading(false);
        }
        return;
      }

      const data = await response.json();
      console.log("✅ Messages loaded:", data.messages?.length || 0);

      if (isMounted.current) {
        setMessages(data.messages || []);
        setError(null);
      }
    } catch (err) {
      console.error("💥 Fetch error:", err);
      if (isMounted.current) {
        setError("Network error. Please check your connection.");
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [currentUserId, otherUserId]);

  // Initial fetch and polling - FIXED: removed fetchMessages from deps
  useEffect(() => {
    if (!currentUserId || !otherUserId) {
      setLoading(false);
      return;
    }

    // Initial fetch
    fetchMessages();

    // Poll for new messages every 5 seconds
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, otherUserId]); // FIXED: fetchMessages removed from deps

  // Mark messages as read when opening chat
  useEffect(() => {
    if (!currentUserId || !otherUserId) return;

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

        console.log("✅ Messages marked as read");
      } catch (err) {
        console.log("⚠️ Mark as read failed:", err.message);
      }
    };

    // Mark as read after a short delay (so user sees the messages first)
    const timer = setTimeout(markAsRead, 1000);
    return () => clearTimeout(timer);
  }, [currentUserId, otherUserId]);

  // Send message function
  const sendMessage = useCallback(
    async ({ content, images = [] }) => {
      console.log("📤 Sending message...");
      console.log("   Content:", content);
      console.log("   Images:", images?.length || 0);

      // Validation
      if (!content && (!images || images.length === 0)) {
        console.log("⚠️ No content to send");
        Alert.alert(
          "Empty Message",
          "Please enter a message or select an image",
        );
        return { success: false, error: "No content" };
      }

      if (!currentUserId || !otherUserId) {
        console.error("❌ Missing user IDs");
        Alert.alert("Error", "Unable to send message. Please try again.");
        return { success: false, error: "Missing user IDs" };
      }

      setSending(true);

      try {
        const token = await SecureStore.getItemAsync("authToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const body = {
          content: content || "",
          images: images || [],
          receiver: otherUserId,
        };

        console.log("📦 Sending to API:", body);

        const response = await fetch(
          `https://qup.dating/api/mobile/chat/${otherUserId}/send`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
          },
        );

        console.log("RESPONSE STATUS:", response.status);
        console.log("RESPONSE OK:", response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ Send failed:", response.status, errorText);
          throw new Error(`Failed to send message: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Message sent");
        console.log("   Data:", data);
        console.log("   Data.success:", data.success);
        console.log("   Data.message:", data.message);
        console.log("   Data.message type:", typeof data.message);

        // Optimistically add the message to the list
        if (data.message && isMounted.current) {
          setMessages((prev) => [...prev, data.message]);
        } else {
          // If API doesn't return the message, fetch all messages
          fetchMessages();
        }

        return { success: true, message: data.message };
      } catch (err) {
        console.error("💥 Send message error:", err);
        Alert.alert(
          "Failed to Send",
          err.message || "Please check your connection and try again",
        );
        return { success: false, error: err.message };
      } finally {
        if (isMounted.current) {
          setSending(false);
        }
      }
    },
    [currentUserId, otherUserId, fetchMessages],
  );

  // Manually refresh messages (pull to refresh)
  const refreshMessages = useCallback(async () => {
    setLoading(true);
    await fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    loading,
    error,
    sending,
    sendMessage,
    refreshMessages,
  };
}
