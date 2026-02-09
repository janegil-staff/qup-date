import { useState, useCallback } from "react";
import { Alert, Keyboard } from "react-native";

/**
 * useChatInput - Manages chat input state and send logic
 * @param {Object} params - Configuration object
 * @param {Function} params.sendMessage - Function to send message from useChat hook
 * @param {Function} params.uploadImages - Function to upload images from useImageUpload hook
 * @param {Array} params.selectedImages - Array of selected images
 */
export function useChatInput({ sendMessage, uploadImages, selectedImages }) {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [sending, setSending] = useState(false);

  /**
   * Handle sending message
   */
  const handleSend = useCallback(async () => {
    // Validate that we have content
    const hasText = text && text.trim().length > 0;
    const hasImages = selectedImages && selectedImages.length > 0;

    if (!hasText && !hasImages) {
      console.log("⚠️ No content to send");
      return;
    }

    // Dismiss keyboard and emoji picker
    Keyboard.dismiss();
    setShowEmojiPicker(false);

    setSending(true);

    try {
      let imageUrls = [];

      // Upload images if any are selected
      if (hasImages) {
        const uploadResult = await uploadImages();

        if (!uploadResult.success) {
          console.error("❌ Upload failed:", uploadResult.error);
          console.error(
            "❌ Upload failed (typeof):",
            typeof uploadResult.error,
          );
          Alert.alert(
            "Upload Failed",
            uploadResult.error || "Failed to upload images",
          );
          setSending(false);
          return;
        }

        imageUrls = uploadResult.urls || [];
      }

      // Send message with text and/or images
     
      console.log("Message content:", {
        text: text.trim(),
        imageUrls: imageUrls,
      });

      const result = await sendMessage({
        content: text.trim(),
        images: imageUrls,
      });

      console.log("📥 Send result:", result);

      if (result.success) {
        console.log("✅ Message sent successfully");
        // Clear input on success
        setText("");
      } else {
        console.error("❌ Failed to send message:", result.error);
        Alert.alert("Failed to Send", result.error || "Please try again");
      }
    } catch (error) {
      console.error("💥 Error in handleSend:", error);
      Alert.alert("Error", "Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  }, [text, selectedImages, sendMessage, uploadImages]);

  return {
    text,
    setText,
    showEmojiPicker,
    setShowEmojiPicker,
    handleSend,
    sending,
  };
}
