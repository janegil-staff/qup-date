import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Expo icon library

export default function VerifiedBadge({ size = 16, style }) {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name="checkmark-circle" size={size} color="#4ade80" />
      <Text style={[styles.text, { fontSize: size * 0.6 }]}>Verified</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4, // space between icon and text
  },
  text: {
    color: "#4ade80", // green color
    fontWeight: "700",
  },
});
