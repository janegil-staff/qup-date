import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function UserCard({ user, navigation }) {
  const mainImage = user?.images?.[0]?.url || user?.profileImage || "https://via.placeholder.com/400";
  const age = user?.birthdate 
    ? new Date().getFullYear() - new Date(user.birthdate).getFullYear()
    : "?";

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.95}
      onPress={() => navigation?.navigate("UserProfile", { userId: user._id })}
    >
      {/* Main Image */}
      <Image
        source={{ uri: mainImage }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Gradient Overlay */}
      <LinearGradient
        colors={["transparent", "rgba(0, 0, 0, 0.85)"]}
        style={styles.gradient}
      />

      {/* ⭐ Verified Badge (Top Right) */}
      {user.isVerified && (
        <View style={styles.verifiedBadge}>
          <Ionicons name="shield-checkmark" size={16} color="#fff" />
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      )}

      {/* 🔗 LinkedIn Badge (Top Left) */}
      {user.linkedin?.isVerified && (
        <View style={styles.linkedinBadge}>
          <FontAwesome name="linkedin-square" size={14} color="#fff" />
          <Text style={styles.linkedinText}>LinkedIn</Text>
        </View>
      )}

      {/* User Info */}
      <View style={styles.info}>
        {/* Name and Age */}
        <View style={styles.nameRow}>
          <Text style={styles.name}>
            {user.name}, {age}
          </Text>
          {user.isVerified && (
            <Ionicons name="checkmark-circle" size={24} color="#00D9A8" />
          )}
        </View>

        {/* ⭐ Professional Info */}
        <View style={styles.professionalInfo}>
          {user.jobTitle && user.company && (
            <View style={styles.infoRow}>
              <Ionicons name="briefcase" size={16} color="#fff" />
              <Text style={styles.infoText}>
                {user.jobTitle} at {user.company}
              </Text>
            </View>
          )}

          {user.educationLevel && (
            <View style={styles.infoRow}>
              <Ionicons name="school" size={16} color="#fff" />
              <Text style={styles.infoText}>{user.educationLevel}</Text>
            </View>
          )}

          {user.industry && (
            <View style={styles.infoRow}>
              <Ionicons name="globe" size={16} color="#fff" />
              <Text style={styles.infoText}>{user.industry}</Text>
            </View>
          )}
        </View>

        {/* Bio */}
        {user.bio && (
          <Text style={styles.bio} numberOfLines={3}>
            {user.bio}
          </Text>
        )}

        {/* Location */}
        {user.location?.name && (
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color="rgba(255,255,255,0.7)" />
            <Text style={styles.locationText}>{user.location.name}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width * 0.9,
    height: "100%",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#1f2937",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "55%",
  },

  // ⭐ Verified Badge
  verifiedBadge: {
    position: "absolute",
    top: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(91, 95, 237, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  verifiedText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  // 🔗 LinkedIn Badge
  linkedinBadge: {
    position: "absolute",
    top: 20,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 102, 194, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  linkedinText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  // User Info
  info: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },

  // ⭐ Professional Info Section
  professionalInfo: {
    marginBottom: 12,
    gap: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },

  // Bio
  bio: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 20,
    marginBottom: 8,
  },

  // Location
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
    textTransform: "capitalize",
  },
});
