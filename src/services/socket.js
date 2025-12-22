import { io } from "socket.io-client";
import * as SecureStore from "expo-secure-store";

let socket = null;

export const connectSocket = async () => {
  if (socket) return socket; // already connected

  const token = await SecureStore.getItemAsync("authToken");

  socket = io("https://qup.dating", {
    transports: ["websocket"],
    auth: {
      token,
    },
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
