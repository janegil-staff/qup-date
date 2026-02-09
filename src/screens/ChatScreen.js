import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  Platform,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ChatHeader from "../components/chat/ChatHeader";
import ChatMessageList from "../components/chat/ChatMessageList";
import ChatInputBar from "../components/chat/ChatInputBar";

import ImagePreviewBar from "../components/ImagePreviewBar";
import FullScreenImageModal from "../components/FullScreenImageModal";
import ReportUserModal from "../components/ReportUserModal";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useChat } from "../hooks/useChat";
import { useChatInput } from "../hooks/useChatInput";
import { useReportUser } from "../hooks/useReportUser";
import { useImageUpload } from "../hooks/useImageUpload";

// Wrapper component for safety checks BEFORE hooks
export default function ChatScreen({ route, navigation }) {
  // CRITICAL: Check route before rendering main component
  if (!route || !route.params) {
    console.error("❌ FATAL: Route or params undefined");
    return (
      <View style={styles.loader}>
        <Text style={styles.errorText}>Navigation Error</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => navigation?.goBack()}
        >
          <Text style={{ color: "white" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { userId, user } = route.params;

  if (!userId || !user) {
    console.error("❌ Missing userId or user");
    return (
      <View style={styles.loader}>
        <Text style={styles.errorText}>Missing User Data</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => navigation?.goBack()}
        >
          <Text style={{ color: "white" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // All checks passed, render main chat component
  return <ChatContent userId={userId} user={user} navigation={navigation} />;
}

// Main chat component with hooks
function ChatContent({ userId, user, navigation }) {
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const { currentUserId, loading: userLoading } = useCurrentUser();
  const {
    messages,
    loading: messagesLoading,
    sendMessage,
  } = useChat(currentUserId, userId);
  const { selectedImages, uploading, pickImages, uploadImages, removeImage } =
    useImageUpload();
  const { text, setText, showEmojiPicker, setShowEmojiPicker, handleSend } =
    useChatInput({
      sendMessage,
      uploadImages,
      selectedImages,
    });
  const { reportVisible, setReportVisible, submitReport } =
    useReportUser(userId);

  // Track keyboard height
  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        const offset = 50;
        const adjustedHeight = Math.max(0, e.endCoordinates.height - offset);
        setKeyboardHeight(adjustedHeight);
      },
    );

    const hideSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      },
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  if (!currentUserId || userLoading || messagesLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={styles.loadingText}>Loading chat...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ChatHeader
        user={user}
        onBack={() => navigation?.goBack()}
        onClose={() => navigation?.navigate("MatchesHome")}
        onProfilePress={() =>
          navigation?.navigate("UserProfile", { userId: user._id })
        }
        onReportPress={() => setReportVisible(true)}
      />

      <ImagePreviewBar images={selectedImages} remove={removeImage} />

      <View style={{ flex: 1 }}>
        <ChatMessageList
          messages={messages}
          currentUserId={currentUserId}
          onImagePress={setFullscreenImage}
          onDismissEmojiPicker={() => setShowEmojiPicker(false)}
        />
      </View>

      <View style={{ marginBottom: keyboardHeight }}>
        <ChatInputBar
          text={text}
          setText={setText}
          showEmojiPicker={showEmojiPicker}
          setShowEmojiPicker={setShowEmojiPicker}
          uploading={uploading}
          onSend={handleSend}
          onPickImages={pickImages}
        />
      </View>

      <FullScreenImageModal
        visible={!!fullscreenImage}
        imageUrl={fullscreenImage}
        onClose={() => setFullscreenImage(null)}
      />

      <ReportUserModal
        visible={reportVisible}
        onClose={() => setReportVisible(false)}
        userId={userId}
        onSubmit={(payload) => {
          setReportVisible(false);
          submitReport(payload);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111827",
    padding: 20,
  },
  loadingText: {
    color: "#9ca3af",
    marginTop: 10,
    fontSize: 14,
  },
  errorText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  errorButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#22c55e",
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
});
