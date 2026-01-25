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
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import MessageBubble from "../components/MessageBubble";
import ImagePreviewBar from "../components/ImagePreviewBar";
import { useChat } from "../../hooks/useChat";
import { useImageUpload } from "../../hooks/useImageUpload";
import FullScreenImageModal from "../components/FullScreenImageModal";
import EmojiModal from "react-native-emoji-modal";

export default function ChatScreen({ route, navigation }) {
  const { userId, user } = route.params;
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [currentUserId, setCurrentUserId] = useState(null);
  const [text, setText] = useState("");
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const listRef = useRef(null);

  useEffect(() => {
    if (!messages || messages.length === 0) return;

    // Delay ensures layout is complete
    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: false });
    }, 50);
  }, [messages]);

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync("authToken");
      if (!token) return;

      const payload = JSON.parse(
        global.atob
          ? atob(token.split(".")[1])
          : Buffer.from(token.split(".")[1], "base64").toString("utf8"),
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#111827" }}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        ></TouchableOpacity>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={90}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <TouchableOpacity
                onPress={() =>
                  navigation
                    .getParent()
                    ?.navigate("UserProfile", { userId: user._id })
                }
              >
                <Image
                  source={{
                    uri: user.profileImage
                      ? user.profileImage
                      : "https://res.cloudinary.com/dbcdsonhz/image/upload/v1769110864/dating-app/empty-profile-image_dlwotm.png",
                  }}
                  style={styles.avatar}
                />
                <Text style={styles.name}>{user.name || ""}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Image previews */}
          <ImagePreviewBar images={selectedImages} remove={removeImage} />

          <FlatList
            ref={listRef}
            data={messages}
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
            keyExtractor={(item) => item._id.toString()}
            contentContainerStyle={{ padding: 12 }}
            onContentSizeChange={() => {
              listRef.current?.scrollToEnd({ animated: false });
            }}
          />

          <FullScreenImageModal
            visible={!!fullscreenImage}
            imageUrl={fullscreenImage}
            onClose={() => setFullscreenImage(null)}
          />

          <View
            style={{
              backgroundColor: "#1f2937",
              marginBottom: Platform.OS === "android" ? 58 : 47,
            }}
          >
            <View style={styles.inputRow}>
              <TouchableOpacity
                onPress={() => setShowEmojiPicker((prev) => !prev)}
              >
                <Text style={styles.icon}>😀</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={pickImages}>
                <Text style={styles.icon}>📷</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                value={text}
                onChangeText={(t) => setText(t || "")} // prevent undefined
                placeholder="Type a message…"
                placeholderTextColor="#999"
                multiline
              />
              <TouchableOpacity
                style={[styles.sendBtn, uploading && { opacity: 0.5 }]}
                onPress={handleSend}
                disabled={uploading}
              >
                {uploading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.sendText}>Send</Text>
                )}
              </TouchableOpacity>
            </View>
            {showEmojiPicker && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setShowEmojiPicker(false)}
                style={styles.emojiOverlay}
              >
                <View style={styles.emojiPickerContainer}>
                  <EmojiModal
                    open={showEmojiPicker}
                    onClose={() => setShowEmojiPicker(false)}
                    onEmojiSelected={(emoji) => {
                      setText((prev) => (prev || "") + emoji);
                      setShowEmojiPicker(false);
                    }}
                    modalStyle={{
                      backgroundColor: "#1f2937",
                    }}
                    emojiStyle={{ fontSize: 28 }}
                    containerStyle={{
                      backgroundColor: "#1f2937",
                      borderTopWidth: 1,
                      borderTopColor: "#374151",
                    }}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 90,
    left: 5,
    zIndex: 999,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 30,
  },
  emojiOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 50,
    elevation: 50,
    justifyContent: "flex-end",
  },

  emojiPickerContainer: {
    height: 300,
    backgroundColor: "#1f2937",
    borderTopWidth: 1,
    borderTopColor: "#374151",
  },

  emojiContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 300, // perfect height for emoji selector
    backgroundColor: "#1f2937",
    borderTopWidth: 1,
    borderTopColor: "#374151",
    zIndex: 50,
  },

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
  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0, // ← important
  },

  inputRow: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#1f2937",
    alignItems: "flex-end",
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
    letterSpacing: 0,
  },

  input: {
    flex: 1,
    backgroundColor: "#111827",
    color: "#fff",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16, // ← REQUIRED FIX
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
  sendText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0,
  },
});
