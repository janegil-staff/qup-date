import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileCompletion({ user }) {
  if (!user) return null;

  const completion = calculateCompletion(user);

  return (
    <LinearGradient colors={["#4f46e5", "#3b82f6"]} style={styles.container}>
      <Text style={styles.title}>Profile Completion</Text>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${completion}%` }]} />
      </View>

      <Text style={styles.progressText}>{completion}% complete</Text>

      <View style={styles.suggestions}>
        {!user.photos?.length && (
          <Text style={styles.suggestion}>• Add at least one photo</Text>
        )}
        {!user.bio && (
          <Text style={styles.suggestion}>• Write a short bio</Text>
        )}
        {!user.interests?.length && (
          <Text style={styles.suggestion}>• Add your interests</Text>
        )}
      </View>
    </LinearGradient>
  );
}

function calculateCompletion(user) {
  let score = 0;
  if (user.images?.length) score += (user.images?.length * 5);
  if (user.bio) score += 5;
  if (user.smoking) score += 5;
  if (user.drinking) score += 5;
  if (user.exercise) score += 5;
  if (user.height) score += 5;
  if (user.occupation) score += 5;
  if (user.bodyType) score += 5;
  if (user.hasChildren) score += 5;
  if (user.lookingFor) score += 5;
  if (user.location) score += 5;
  if (user.religion) score += 5;
  if (user.diet) score += 5;
  if (user.wantsChildren) score += 5;
  if (user.relationshipStatus) score += 5;
  if (user.willingToRelocate) score += 5;
  return score;
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    marginBottom: 10,
  },
  progressBar: {
    width: "100%",
    height: 10,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "white",
  },
  progressText: {
    color: "white",
    fontWeight: "600",
    marginBottom: 10,
  },
  suggestions: {
    marginTop: 10,
  },
  suggestion: {
    color: "white",
    opacity: 0.9,
    marginBottom: 4,
  },
});
