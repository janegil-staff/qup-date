import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function UserCard({ user }) {
  if (!user) return null;
  console.log("USERCARD USER:", user);

  // Support multiple backend shapes
  const image = user.profileImage || user.images?.[0].url || null;

  return (
    <View style={styles.card}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={{ color: "#9ca3af" }}>No image</Text>
        </View>
      )}

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.overlay}
      />

      <View style={styles.info}>
        <Text style={styles.name}>
          {user.name}
          {user.age ? <Text style={styles.age}> {user.age}</Text> : null}
        </Text>

        {user.bio ? (
          <Text style={styles.bio} numberOfLines={2}>
            {user.bio}
          </Text>
        ) : (
          <Text style={styles.bioPlaceholder}>No bio yet</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: "100%", // ⭐ fills the 420px container, not the screen
    borderRadius: 20,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#374151",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 180,
  },
  info: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  name: {
    fontSize: 32,
    fontWeight: "800",
    color: "white",
  },
  age: {
    fontSize: 32,
    fontWeight: "600",
    color: "#d1d5db",
  },
  bio: {
    marginTop: 6,
    fontSize: 16,
    color: "#e5e7eb",
  },
  bioPlaceholder: {
    marginTop: 6,
    fontSize: 16,
    color: "#9ca3af",
    fontStyle: "italic",
  },
});
