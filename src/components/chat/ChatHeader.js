import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ChatHeader(props) {
  const user = props.user;
  const onBack = props.onBack;
  const onClose = props.onClose;
  const onProfilePress = props.onProfilePress;
  const onReportPress = props.onReportPress;

  if (!user) {
    return null;
  }

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity onPress={onProfilePress} style={styles.userInfo}>
        <Image
          source={{ 
            uri: user.profileImage || "https://res.cloudinary.com/dbcdsonhz/image/upload/v1769110864/dating-app/empty-profile-image_dlwotm.png"
          }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{user.name || "Unknown"}</Text>
      </TouchableOpacity>

      <View style={styles.rightButtons}>
        {onReportPress && (
          <TouchableOpacity onPress={onReportPress} style={styles.iconButton}>
            <Ionicons name="flag-outline" size={20} color="white" />
          </TouchableOpacity>
        )}
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.iconButton}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#1f2937",
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  backButton: {
    padding: 8,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  userName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  rightButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    marginLeft: 4,
  },
});