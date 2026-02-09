import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

export function useLikeStatus(profileId) {
  const [likedUsers, setLikedUsers] = useState([]);
  const [isLiked, setIsLiked] = useState(false);

  // Fetch liked users
  const fetchLikedUsers = async () => {
    const token = await SecureStore.getItemAsync("authToken");

    const res = await fetch(`https://qup.dating/api/mobile/likes`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    const list = data.likedUsers || [];

    setLikedUsers(list);
    setIsLiked(list.some((u) => u._id === profileId));
  };

  // Toggle like/dislike
  const toggleLike = async () => {
    const token = await SecureStore.getItemAsync("authToken");

    const endpoint = isLiked ? "/api/mobile/dislike" : "/api/mobile/like";

    // Optimistic update
    setIsLiked(!isLiked);
    setLikedUsers((prev) =>
      isLiked
        ? prev.filter((u) => u._id !== profileId)
        : [...prev, { _id: profileId }]
    );

    await fetch(`http://qup.dating/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ targetUserId: profileId }),
    });

    // Sync with backend
    fetchLikedUsers();
  };

  useEffect(() => {
    if (profileId) fetchLikedUsers();
  }, [profileId]);

  return { isLiked, toggleLike };
}
