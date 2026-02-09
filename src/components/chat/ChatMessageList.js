import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function ChatMessageList({
  messages,
  currentUserId,
  onImagePress,
  onDismissEmojiPicker,
}) {
  const flatListRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [messages?.length]);

  const renderMessage = ({ item, index }) => {
    // sender can be either a string ID or an object with _id
    const senderId = typeof item.sender === 'object' ? item.sender._id : item.sender;
    const isMyMessage = senderId === currentUserId;

    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.theirMessage,
        ]}
      >
        <View
          style={[
            styles.bubble,
            isMyMessage ? styles.myBubble : styles.theirBubble,
          ]}
        >
          {/* Text content */}
          {item.content && (
            <Text
              style={[
                styles.messageText,
                isMyMessage ? styles.myMessageText : styles.theirMessageText,
              ]}
            >
              {item.content}
            </Text>
          )}

          {/* Images */}
          {item.images && item.images.length > 0 && (
            <View style={styles.imagesContainer}>
              {item.images.map((imageUrl, imgIndex) => {
                // Handle both string URLs and object URLs
                const url = typeof imageUrl === 'string' ? imageUrl : imageUrl?.url;
                
                if (!url) return null;
                
                return (
                  <TouchableOpacity
                    key={imgIndex}
                    onPress={() => onImagePress?.(url)}
                    activeOpacity={0.9}
                  >
                    <Image
                      source={{ uri: url }}
                      style={styles.messageImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Timestamp */}
          <Text
            style={[
              styles.timestamp,
              isMyMessage ? styles.myTimestamp : styles.theirTimestamp,
            ]}
          >
            {formatTime(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (!messages || messages.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No messages yet</Text>
        <Text style={styles.emptySubtext}>Send a message to start chatting!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        style={styles.flatList}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={true}
        onContentSizeChange={() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
  flatList: {
    flex: 1,
  },
  listContent: {
    padding: 12,
    paddingBottom: 20,
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: "80%",
  },
  myMessage: {
    alignSelf: "flex-end",
  },
  theirMessage: {
    alignSelf: "flex-start",
  },
  bubble: {
    borderRadius: 16,
    padding: 12,
  },
  myBubble: {
    backgroundColor: "#22c55e",
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: "#1f2937",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myMessageText: {
    color: "white",
  },
  theirMessageText: {
    color: "#e5e7eb",
  },
  imagesContainer: {
    marginTop: 8,
    gap: 8,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 4,
    backgroundColor: "#374151",
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  myTimestamp: {
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "right",
  },
  theirTimestamp: {
    color: "#9ca3af",
    textAlign: "left",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#111827",
  },
  emptyText: {
    color: "#9ca3af",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  emptySubtext: {
    color: "#6b7280",
    fontSize: 14,
    textAlign: "center",
  },
});
