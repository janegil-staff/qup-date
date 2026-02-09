import React from "react";
import { TextInput, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

export default function GlassyInput({ value, onChangeText, placeholder }) {
  return (
    <BlurView intensity={30} tint="dark" style={styles.wrapper}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#6b7280"
        value={value}
        onChangeText={onChangeText}
      />
    </BlurView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 14,
    padding: 2,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginBottom: 14,
  },
  input: {
    padding: 14,
    color: "white",
    fontSize: 16,
  },
});
