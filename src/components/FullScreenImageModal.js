import React from "react";
import { Modal, View, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function FullScreenImageModal({ visible, imageUrl, onClose }) {
  if (!visible || !imageUrl) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={styles.container}
        onPress={onClose}
        activeOpacity={1}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
