import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native";

const UnreadBadge = ({ count }) => {
  if (!count || count === 0) return null;

  return (
    <View style={styles.badge}>
      <Ionicons name="chatbubble-ellipses" size={12} color="#fff" />
      <Text style={styles.badgeText}>{count}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: 6,
    right: 6,

    flexDirection: "row",
    alignItems: "center",
    gap: 4,

    minWidth: 26,
    height: 22,
    paddingHorizontal: 8,

    backgroundColor: "rgba(255, 70, 70, 0.95)",
    borderRadius: 14,

    // Glow
    shadowColor: "#ff4d4d",
    shadowOpacity: 0.45,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },

    elevation: 6,
  },

  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});

export default UnreadBadge;
