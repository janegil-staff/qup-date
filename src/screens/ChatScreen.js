import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import * as SecureStore from "expo-secure-store";

import MessageBubble from "../components/MessageBubble";
import ImagePreviewBar from "../components/ImagePreviewBar";
import { useChat } from "../../hooks/useChat";
import { useImageUpload } from "../../hooks/useImageUpload";
import FullScreenImageModal from "../components/FullScreenImageModal";

export default function ChatScreen({ route, navigation }) {
  const { userId, user } = route.params;

  const [currentUserId, setCurrentUserId] = useState(null);
  const [text, setText] = useState("");
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const listRef = useRef(null);

  // Decode JWT
  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync("authToken");
      if (!token) return;

      const payload = JSON.parse(
        global.atob
          ? atob(token.split(".")[1])
          : Buffer.from(token.split(".")[1], "base64").toString("utf8")
      );
      setCurrentUserId(payload.id);
    })();
  }, []);

  const { messages, loading, sendMessage } = useChat(currentUserId, userId);
  const { selectedImages, uploading, pickImages, uploadImages, removeImage } =
    useImageUpload();

  const scrollToBottom = () => {
    listRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() && selectedImages.length === 0) return;

    const uploaded = await uploadImages();

    await sendMessage({
      content: text.trim() || null,
      images: uploaded,
    });

    setText("");
  };

  if (!currentUserId || loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <Image source={{ uri: user.profileImage }} style={styles.avatar} />
          <Text style={styles.name}>{user.name}</Text>
        </View>
      </View>

      {/* Image previews */}
      <ImagePreviewBar images={selectedImages} remove={removeImage} />

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <MessageBubble
            item={item}
            isSender={
              item.sender === currentUserId ||
              item.sender?._id === currentUserId
            }
            onImagePress={(url) => setFullscreenImage(url)}
          />
        )}
        contentContainerStyle={{ padding: 12 }}
      />

      <FullScreenImageModal
        visible={!!fullscreenImage}
        imageUrl={fullscreenImage}
        onClose={() => setFullscreenImage(null)}
      />

      {/* Input */}
      <View style={styles.inputRow}>
        <TouchableOpacity onPress={pickImages}>
          <Text style={styles.icon}>📷</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type a message…"
          placeholderTextColor="#999"
          multiline
        />

        <TouchableOpacity
          style={styles.sendBtn}
          onPress={handleSend}
          disabled={uploading}
        >
          <Text style={styles.sendText}>{uploading ? "Sending…" : "Send"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111827" },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111827",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#1f2937",
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  back: { color: "#22c55e", fontSize: 22, marginRight: 12 },
  userInfo: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  name: { color: "#fff", fontSize: 18, fontWeight: "700" },
  inputRow: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#1f2937",
    alignItems: "flex-end",
  },
  icon: { fontSize: 24, marginRight: 8 },
  input: {
    flex: 1,
    backgroundColor: "#111827",
    color: "#fff",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: "#22c55e",
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  sendText: { color: "#fff", fontWeight: "600" },
});
