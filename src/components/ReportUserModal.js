import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";

export default function ReportUserModal({
  visible,
  onClose,
  onSubmit,
  userId,
}) {
  const [reason, setReason] = useState(null);

  const reasons = [
    "Spam or scam",
    "Fake profile",
    "Inappropriate content",
    "Harassment or threats",
  ];

  const submitReport = () => {
    if (!reason) return;
    onSubmit({ userId, reason });
    setReason(null);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Report User</Text>

          {reasons.map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.reasonButton, reason === r && styles.selected]}
              onPress={() => setReason(r)}
            >
              <Text style={styles.reasonText}>{r}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.submitButton, reason && styles.submitActive]}
            onPress={submitReport}
          >
            <Text style={styles.submitText}>Submit Report</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "85%",
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 12,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
  },
  reasonButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#333",
    marginBottom: 10,
  },
  selected: {
    backgroundColor: "#4da6ff",
  },
  reasonText: {
    color: "#fff",
    fontSize: 16,
  },
  submitButton: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#333",
    marginTop: 20,
  },
  submitActive: {
    backgroundColor: "#4da6ff",
  },
  submitText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    marginTop: 16,
  },
  cancelText: {
    color: "#aaa",
    textAlign: "center",
  },
});
