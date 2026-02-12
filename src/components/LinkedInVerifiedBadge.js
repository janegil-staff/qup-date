// src/components/LinkedInVerifiedBadge.js
// Use this anywhere you show user profiles:
//   import LinkedInVerifiedBadge from "./LinkedInVerifiedBadge";
//   {user.linkedin?.isVerified && <LinkedInVerifiedBadge />}

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function LinkedInVerifiedBadge({ size = "sm" }) {
  const isSmall = size === "sm";

  return (
    <View style={[styles.badge, isSmall ? styles.badgeSm : styles.badgeMd]}>
      <FontAwesome
        name="linkedin-square"
        size={isSmall ? 12 : 16}
        color="#0A66C2"
      />
      <Text style={[styles.text, isSmall ? styles.textSm : styles.textMd]}>
        Verified
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 102, 194, 0.12)",
    borderRadius: 20,
    gap: 4,
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeMd: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  text: {
    color: "#0A66C2",
    fontWeight: "700",
  },
  textSm: {
    fontSize: 11,
  },
  textMd: {
    fontSize: 13,
  },
});
