import { View, Text, StyleSheet } from "react-native";

export default function StatCard({ title, value }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1f2937",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#374151",
  },
  title: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
});
