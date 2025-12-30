import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import VerifiedBadge from "./VerifiedBadge";

export default function LikesCard({ user, navigation }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("Profile", {
          screen: "UserProfile",
          params: { userId: user._id },
        })
      }
    >
      <Image source={{ uri: user.profileImage }} style={styles.image} />

      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={styles.name}>{user.name}</Text>
          {user.isVerified && <VerifiedBadge />}
        </View>

        {user.bio && (
          <Text style={styles.bio} numberOfLines={2}>
            {user.bio}
          </Text>
        )}

        <Text style={styles.view}>View Profile →</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#1f2937",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 16,
    height: 120,
  },
  image: {
    width: 120,
    height: "100%",
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  name: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  bio: {
    color: "#d1d5db",
    marginTop: 4,
    fontSize: 13,
  },
  view: {
    marginTop: 8,
    color: "#ec4899",
    fontWeight: "600",
    fontSize: 14,
  },
});
