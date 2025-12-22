import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

export default function MatchCongrats({
  visible = true,
  onClose,
  matchedUser,
}) {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>🎉 It's a Match!</Text>

          {matchedUser?.profileImage ? (
            <Image
              source={{ uri: matchedUser.profileImage }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.image, styles.placeholder]}>
              <Text style={styles.placeholderText}>
                {matchedUser?.name || "User"}
              </Text>
            </View>
          )}

          <Text style={styles.message}>
            You and {matchedUser?.name || "someone"} liked each other!
          </Text>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "80%",
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ff69b4",
    marginBottom: 12,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  placeholder: {
    backgroundColor: "#374151",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#ccc",
    fontWeight: "700",
    fontSize: 18,
  },
  message: {
    color: "#ccc",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#ff69b4",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
