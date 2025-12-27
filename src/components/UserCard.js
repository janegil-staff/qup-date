import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import VerifiedBadge from "./VerifiedBadge";

const { width } = Dimensions.get("window");

export default function UserCard({ user }) {
  if (!user) return null;

  return (
    <View style={styles.card}>
      {/* Profile Image */}
      <Image source={{ uri: user.profileImage }} style={styles.image} />

      {/* Gradient Overlay */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.7)"]}
        style={styles.overlay}
      />

      {/* Bottom Info */}
      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>
            {user.name}
            {user.age ? `, ${user.age}` : ""}
          </Text>

          {user.isVerified && <VerifiedBadge />}
        </View>

        {user.bio && (
          <Text style={styles.bio} numberOfLines={2}>
            {user.bio}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width * 0.9,
    height: "100%",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#1f2937",
    alignSelf: "center",
  },

  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "45%",
  },

  infoContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  name: {
    color: "white",
    fontSize: 26,
    fontWeight: "800",
  },

  bio: {
    color: "#d1d5db",
    marginTop: 6,
    fontSize: 14,
  },
});
