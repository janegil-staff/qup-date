import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

export default function LikesCard({
  user,
  navigation,
  showRemoveLike,
  showRestore,
  onRemoveLike,
  onRestore,
}) {
  const handleRemoveLike = async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");

      const res = await fetch("https://qup.dating/api/mobile/like/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetId: user._id }),
      });

      const data = await res.json();
      console.log("Remove like response:", data);

      if (res.ok) onRemoveLike?.(user._id);
    } catch (err) {
      console.error("Remove like error:", err);
    }
  };

  const handleRestore = async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");

      const res = await fetch(
        "https:qup.dating/api/mobile/dislike/remove",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ targetId: user._id }),
        }
      );

      const data = await res.json();
      console.log("Restore response:", data);

      if (res.ok) onRestore?.(user._id);
    } catch (err) {
      console.error("Restore error:", err);
    }
  };

  return (
    <View style={styles.card}>
      {/* Restore button */}
      {showRestore && (
        <TouchableOpacity style={styles.restore} onPress={handleRestore}>
          <Ionicons name="refresh" size={22} color="#fff" />
        </TouchableOpacity>
      )}

      {showRemoveLike && (
        <TouchableOpacity style={styles.cross} onPress={handleRemoveLike}>
          <Ionicons name="close" size={22} color="#fff" />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate("UserProfile", { userId: user._id })}
      >
        <Image source={{ uri: (user.profileImage ? user.profileImage : "https://res.cloudinary.com/dbcdsonhz/image/upload/v1769110864/dating-app/empty-profile-image_dlwotm.png") }} style={styles.image} />
        <Text style={styles.name}>{user.name}</Text>
        {user.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 12,
    position: "relative",
  },
  cross: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(150,0,0,0.7)",
    padding: 6,
    borderRadius: 20,
    zIndex: 10,
  },
  restore: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,150,0,0.7)",
    padding: 6,
    borderRadius: 20,
    zIndex: 10,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  bio: {
    color: "#ccc",
    marginTop: 4,
  },
});
