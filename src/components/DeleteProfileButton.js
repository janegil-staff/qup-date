import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as SecureStore from "expo-secure-store";

export default function DeleteProfileButton({ userId, navigation }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleConfirmDelete() {
    setLoading(true);
    setError(null);

    try {
      const token = await SecureStore.getItemAsync("authToken");

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/user/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete profile");

      // Remove token
      await SecureStore.deleteItemAsync("authToken");

      // Redirect to home (MainTabs)
      navigation.reset({
        index: 0,
        routes: [{ name: "LandingScreen" }],
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)} style={styles.deleteBtn}>
        <Text style={styles.deleteText}>Delete Profile</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Confirm Deletion</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete your profile? This action cannot
              be undone.
            </Text>

            {error && <Text style={styles.error}>Error: {error}</Text>}

            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => setOpen(false)}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmDelete}
                disabled={loading}
                style={styles.confirmBtn}
              >
                <Text style={styles.confirmText}>
                  {loading ? "Deleting…" : "Confirm"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  deleteBtn: {
    backgroundColor: "#dc2626",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-end",
  },
  deleteText: {
    color: "white",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#1f2937",
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ec4899",
    marginBottom: 10,
  },
  modalText: {
    color: "#d1d5db",
    marginBottom: 20,
  },
  error: {
    color: "#f87171",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  cancelBtn: {
    backgroundColor: "#374151",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  cancelText: {
    color: "white",
  },
  confirmBtn: {
    backgroundColor: "#dc2626",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  confirmText: {
    color: "white",
    fontWeight: "600",
  },
});
