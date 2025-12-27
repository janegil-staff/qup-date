import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import VerifiedBadge from "./VerifiedBadge";

export default function UserCard({ user, navigation }) {
  if (!user) return null;

  return (
    <View style={styles.card}>
      <Image source={{ uri: user.profileImage }} style={styles.image} />

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.7)"]}
        style={styles.overlay}
      />

      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>{user.name}</Text>
          {user.isVerified && <VerifiedBadge />}
        </View>

        {user.bio && (
          <Text style={styles.bio} numberOfLines={2}>
            {user.bio}
          </Text>
        )}

        {/* ⭐ View Profile Button */}
        <TouchableOpacity
          style={styles.viewBtn}
          onPress={() =>
            navigation.navigate("UserProfile", { userId: user._id })
          }
        >
          <Text style={styles.viewBtnText}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#1f2937",
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
    gap: 6,
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

  // ⭐ Button styles
  viewBtn: {
    marginTop: 12,
    backgroundColor: "#ec4899",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  viewBtnText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});
