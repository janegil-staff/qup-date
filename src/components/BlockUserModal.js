import { Modal, View, Text, TouchableOpacity } from "react-native";

const BlockUserModal = ({ visible, onClose, onConfirm }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "80%",
            backgroundColor: "#1c1c1e",
            padding: 20,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "600",
              marginBottom: 12,
            }}
          >
            Block this user?
          </Text>

          <Text style={{ color: "#ccc", marginBottom: 20 }}>
            They will no longer appear in your feed and cannot interact with
            you.
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: "#ff3b30",
              paddingVertical: 12,
              borderRadius: 8,
              marginBottom: 10,
            }}
            onPress={onConfirm}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              Block User
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#3a3a3c",
              paddingVertical: 12,
              borderRadius: 8,
            }}
            onPress={onClose}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BlockUserModal;