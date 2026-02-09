import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

/**
 * useCurrentUser - Gets the current logged-in user's ID from JWT token
 * @returns {Object} { currentUserId, loading, error }
 */
export function useCurrentUser() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchCurrentUser = async () => {
      try {

        // Get auth token from secure storage
        const token = await SecureStore.getItemAsync("authToken");

        if (!token) {
          console.log("❌ No auth token found");
          if (mounted) {
            setError("Not authenticated");
            setLoading(false);
          }
          return;
        }

        console.log("✅ Token found, decoding...");

        // Decode JWT token to get user ID
        try {
          // Split token into parts (header.payload.signature)
          const parts = token.split(".");
          
          if (parts.length !== 3) {
            throw new Error("Invalid token format");
          }

          const payload = parts[1];

          // Decode base64 payload
          let decodedPayload;
          if (global.atob) {
            // Browser environment
            decodedPayload = JSON.parse(atob(payload));
          } else {
            // React Native environment
            decodedPayload = JSON.parse(
              Buffer.from(payload, "base64").toString("utf8")
            );
          }

          console.log("📋 Decoded payload:", decodedPayload);

          // Extract user ID from payload
          const userId = decodedPayload.id || decodedPayload.userId || decodedPayload.sub;

          if (!userId) {
            throw new Error("No user ID found in token");
          }

          console.log("✅ Current user ID:", userId);

          if (mounted) {
            setCurrentUserId(userId);
            setError(null);
          }
        } catch (decodeError) {
          console.error("❌ Token decode error:", decodeError);
          if (mounted) {
            setError("Invalid authentication token");
          }
        }
      } catch (err) {
        console.error("💥 useCurrentUser error:", err);
        if (mounted) {
          setError(err.message || "Failed to get current user");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchCurrentUser();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      mounted = false;
    };
  }, []);

  return {
    currentUserId,
    loading,
    error,
  };
}