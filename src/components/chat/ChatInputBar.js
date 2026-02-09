import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import EmojiModal from "react-native-emoji-modal";

export default function ChatInputBar({
  text,
  setText,
  showEmojiPicker,
  setShowEmojiPicker,
  uploading,
  onSend,
  onPickImages,
}) {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.inputRow}>
          <TouchableOpacity onPress={() => setShowEmojiPicker((p) => !p)}>
            <Text style={styles.icon}>😀</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onPickImages}>
            <Text style={styles.icon}>📷</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={text}
            onChangeText={(t) => setText(t || "")}
            placeholder="Type a message…"
            placeholderTextColor="#999"
            multiline
            onFocus={() => setShowEmojiPicker(false)}
          />

          <TouchableOpacity
            style={[styles.sendBtn, uploading && { opacity: 0.5 }]}
            onPress={onSend}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendText}>Send</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {showEmojiPicker && (
        <View style={styles.emojiPickerContainer}>
          <EmojiModal
            open
            onClose={() => setShowEmojiPicker(false)}
            onEmojiSelected={(emoji) => {
              setText((prev) => (prev || "") + emoji);
              setShowEmojiPicker(false);
            }}
            modalStyle={{ backgroundColor: "#1f2937" }}
            emojiStyle={{ fontSize: 28 }}
            containerStyle={{
              backgroundColor: "#1f2937",
              borderTopWidth: 1,
              borderTopColor: "#374151",
            }}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1f2937",
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
    fontSize: 16,
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
  emojiPickerContainer: {
    height: 300,
    backgroundColor: "#1f2937",
    borderTopWidth: 1,
    borderTopColor: "#374151",
  },
});
