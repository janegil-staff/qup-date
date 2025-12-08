import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function Button({ label, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#5E81AC",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  label: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
});
