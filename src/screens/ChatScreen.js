import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { io } from "socket.io-client";

// Same base URL as web/socket backend
const API_BASE_URL =
  process.env.EXPO_PUBLIC_SOCKET_URL || "https://qupdating.onrender.com";

export default function ChatScreen({ route, navigation }) {
  const { userId, user } = route.params; // userId = other user's id

  const socketRef = useRef(null);
  const listRef = useRef(null);

  const [currentUserId, setCurrentUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");

  // Decode JWT once to get currentUserId
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

  // Helper: compute roomId the SAME way as web
  const getRoomId = useCallback(
    () =>
      currentUserId && userId ? [currentUserId, userId].sort().join("-") : null,
    [currentUserId, userId]
  );

  // Initialize socket + join room
  useEffect(() => {
    if (!currentUserId) return;

    const socket = io(API_BASE_URL, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      const roomId = getRoomId();
      if (!roomId) return;
      console.log("MOBILE CONNECTED, JOINING ROOM:", roomId);
      socket.emit("join", roomId);
    });

    // Dedup incoming messages
    socket.on("receive-message", (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    });

    socket.on("connect_error", (err) => {
      console.log("SOCKET CONNECT ERROR:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUserId, getRoomId]);

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollToEnd({ animated: true });
    }
  };

  // Fetch existing messages from unified /api/messages
  const fetchMessages = useCallback(async () => {
    if (!currentUserId) return;

    const roomId = getRoomId();
    if (!roomId) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/api/messages?roomId=${encodeURIComponent(roomId)}`
      );

      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Fetch messages error:", err);
    } finally {
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  }, [currentUserId, getRoomId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Send message using unified /api/messages + socket
  const handleSend = async () => {
    if (!newMessage.trim() || !currentUserId) return;

    const roomId = getRoomId();
    if (!roomId) return;

    const content = newMessage.trim();
    setNewMessage("");

    const tempId = Date.now().toString();

    // Optimistic message – SAME SHAPE as web
    const optimisticMessage = {
      _id: tempId,
      roomId,
      content,
      images: [],
      sender: currentUserId,
      receiver: userId,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      // Persist to unified API
      const res = await fetch(`${API_BASE_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(optimisticMessage),
      });

      const data = await res.json();

      if (!res.ok || !data.message) {
        console.error("Failed to save message:", data.error || res.statusText);
        return;
      }

      const savedMessage = data.message;

      // Emit saved message to socket room
      if (socketRef.current) {
        socketRef.current.emit("send-message", {
          roomId,
          message: savedMessage,
        });
      }

      // Replace optimistic with saved one (fresh _id, timestamps, etc.)
      setMessages((prev) => {
        const filtered = prev.filter((m) => m._id !== tempId);
        return [...filtered, savedMessage];
      });
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  const renderItem = ({ item }) => {
    const isSender =
      item.sender === currentUserId || item.sender?._id === currentUserId;

    return (
      <View
        style={[
          styles.messageBubble,
          isSender ? styles.outgoing : styles.incoming,
        ]}
      >
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.createdAt).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  if (loading || !currentUserId) {
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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <Image source={{ uri: user.profileImage }} style={styles.avatar} />
          <Text style={styles.headerTitle}>{user.name}</Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={{ padding: 12 }}
        onContentSizeChange={scrollToBottom}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message…"
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity
          style={styles.sendBtn}
          onPress={handleSend}
          disabled={!newMessage.trim()}
        >
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 26,
    paddingBottom: 14,
    backgroundColor: "#1f2937",
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  backBtn: {
    paddingRight: 12,
    paddingVertical: 4,
    marginTop: 8,
  },
  backText: {
    color: "#22c55e",
    fontSize: 18,
    fontWeight: "600",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  container: { flex: 1, backgroundColor: "#111827" },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111827",
  },
  messageBubble: {
    maxWidth: "80%",
    marginBottom: 8,
    padding: 10,
    borderRadius: 16,
  },
  outgoing: {
    backgroundColor: "#22c55e",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  incoming: {
    backgroundColor: "#374151",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  messageText: { color: "#fff", fontSize: 15 },
  timestamp: {
    fontSize: 10,
    color: "#d1d5db",
    marginTop: 4,
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#1f2937",
    alignItems: "flex-end",
  },
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
