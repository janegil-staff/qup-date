import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  Platform,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import GlassBackground from "../components/GlassBackground";
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
import theme from "../theme";

// Wrapper component for safety checks BEFORE hooks
export default function ChatScreen({ route, navigation }) {
  // CRITICAL: Check route before rendering main component
  if (!route || !route.params) {
    console.error("❌ FATAL: Route or params undefined");
    return (
      <GlassBackground>
        <View style={styles.errorContainer}>
          <View style={styles.errorCard}>
            <LinearGradient
              colors={theme.gradients.glass}
              style={styles.errorGradient}
            >
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorTitle}>Navigation Error</Text>
              <Text style={styles.errorText}>
                Something went wrong. Please try again.
              </Text>
              <TouchableOpacity
                style={styles.errorButton}
                onPress={() => navigation?.goBack()}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={theme.gradients.primary}
                  style={styles.errorButtonGradient}
                >
                  <Text style={styles.errorButtonText}>Go Back</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </GlassBackground>
    );
  }

  const { userId, user } = route.params;

  if (!userId || !user) {
    console.error("❌ Missing userId or user");
    return (
      <GlassBackground>
        <View style={styles.errorContainer}>
          <View style={styles.errorCard}>
            <LinearGradient
              colors={theme.gradients.glass}
              style={styles.errorGradient}
            >
              <Text style={styles.errorIcon}>👤</Text>
              <Text style={styles.errorTitle}>Missing User Data</Text>
              <Text style={styles.errorText}>
                Unable to load user information.
              </Text>
              <TouchableOpacity
                style={styles.errorButton}
                onPress={() => navigation?.goBack()}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={theme.gradients.primary}
                  style={styles.errorButtonGradient}
                >
                  <Text style={styles.errorButtonText}>Go Back</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </GlassBackground>
    );
  }

  // All checks passed, render main chat component
  return <ChatContent userId={userId} user={user} navigation={navigation} />;
}

// Main chat component with hooks
function ChatContent({ userId, user, navigation }) {
  const [fullscreenImage, setFullscreenImage] = useState(null);

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

  // Dismiss keyboard when emoji picker opens
  useEffect(() => {
    if (showEmojiPicker) {
      Keyboard.dismiss();
    }
  }, [showEmojiPicker]);

  // Hide tab bar when this screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const parent = navigation.getParent();
      
      if (parent) {
        parent.setOptions({
          tabBarStyle: { display: 'none' }
        });
      }
      
      // Show tab bar again when leaving
      return () => {
        if (parent) {
          parent.setOptions({
            tabBarStyle: {
              display: 'flex',
              position: 'absolute',
              borderTopWidth: 0,
              elevation: 0,
              height: Platform.OS === 'ios' ? 88 : 85,
              backgroundColor: 'transparent',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              paddingBottom: Platform.OS === 'android' ? 20 : 0,
              paddingTop: Platform.OS === 'android' ? 8 : 0,
            }
          });
        }
      };
    }, [navigation])
  );

  if (!currentUserId || userLoading || messagesLoading) {
    return (
      <GlassBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading chat...</Text>
        </View>
      </GlassBackground>
    );
  }

  return (
    <GlassBackground>
      <StatusBar barStyle="light-content" />
      
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        {Platform.OS === 'ios' ? (
          // iOS: Use KeyboardAvoidingView
          <KeyboardAvoidingView 
            style={styles.flex}
            behavior="padding"
            keyboardVerticalOffset={0}
          >
            <View style={styles.chatContainer}>
              <ChatHeader
                user={user}
                onBack={() => navigation?.goBack()}
                onClose={() => navigation?.navigate("MatchesHome")}
                onProfilePress={() =>
                  navigation?.navigate("UserProfile", { userId: user._id })
                }
                onReportPress={() => setReportVisible(true)}
              />

              <View style={styles.messagesContainer}>
                <ChatMessageList
                  messages={messages}
                  currentUserId={currentUserId}
                  onImagePress={setFullscreenImage}
                  onDismissEmojiPicker={() => setShowEmojiPicker(false)}
                />
              </View>

              {/* Image Preview Bar */}
              {selectedImages.length > 0 && (
                <ImagePreviewBar images={selectedImages} remove={removeImage} />
              )}

              {/* Input Bar */}
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
          </KeyboardAvoidingView>
        ) : (
          // Android: No KeyboardAvoidingView, use native adjustPan
          <View style={styles.chatContainer}>
            <ChatHeader
              user={user}
              onBack={() => navigation?.goBack()}
              onClose={() => navigation?.navigate("MatchesHome")}
              onProfilePress={() =>
                navigation?.navigate("UserProfile", { userId: user._id })
              }
              onReportPress={() => setReportVisible(true)}
            />

            <View style={styles.messagesContainer}>
              <ChatMessageList
                messages={messages}
                currentUserId={currentUserId}
                onImagePress={setFullscreenImage}
                onDismissEmojiPicker={() => setShowEmojiPicker(false)}
              />
            </View>

            {/* Image Preview Bar */}
            {selectedImages.length > 0 && (
              <ImagePreviewBar images={selectedImages} remove={removeImage} />
            )}

            {/* Input Bar */}
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
        )}

        {/* Modals */}
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
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.textSecondary,
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorCard: {
    width: '100%',
    maxWidth: 350,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  errorGradient: {
    padding: 32,
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  errorButton: {
    width: '100%',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  errorButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  errorButtonText: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
});
