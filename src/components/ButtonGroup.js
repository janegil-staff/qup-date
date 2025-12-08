import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function ButtonGroup({ options, selected, onSelect }) {
  return (
    <View style={styles.row}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.button, selected === opt && styles.selectedButton]}
          onPress={() => onSelect(opt)}
        >
          <Text style={styles.text}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  button: {
    flexGrow: 1,
    margin: 4,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#1F2937",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
  },
  selectedButton: {
    backgroundColor: "#10b981", // highlight green
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
