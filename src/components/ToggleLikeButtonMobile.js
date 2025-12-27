import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import * as SecureStore from "expo-secure-store";

export default function ToggleLikeButtonMobile({
  profileId,
  initialLiked,
  onMatch,
}) {
  const [liked, setLiked] = useState(initialLiked);

  const handleLike = async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/mobile/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ targetUserId: profileId }),
        }
      );

      const data = await res.json();

      setLiked(true);

      if (data.isMatch && onMatch) {
        onMatch();
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleDislike = async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");

      await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/mobile/dislike`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUserId: profileId }),
      });

      setLiked(false);
    } catch (err) {
      console.error("Dislike error:", err);
    }
  };

  return (
    <View style={styles.row}>
      {/* Dislike */}
      <TouchableOpacity style={styles.dislikeBtn} onPress={handleDislike}>
        <Text style={styles.btnText}>✕</Text>
      </TouchableOpacity>

      {/* Like */}
      <TouchableOpacity style={styles.likeBtn} onPress={handleLike}>
        <Text style={styles.btnText}>♥</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  likeBtn: {
    backgroundColor: "#ec4899",
    padding: 12,
    borderRadius: 50,
  },
  dislikeBtn: {
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 50,
  },
  btnText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
});
