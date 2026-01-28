import { useEffect, useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function MessageButton({ otherUser }) {
 const navigation = useNavigation();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [otherUserId, setOtherUserId] = useState(otherUser._id);

  useEffect(() => {
    const loadUser = async () => {
      const id = await SecureStore.getItemAsync("userId");
      setOtherUserId(otherUser._id);
      setCurrentUserId(id);
    };
    loadUser();
  }, []);

  if (!currentUserId) return null;

  const openChat = () => {

    navigation.navigate("ChatScreen", { userId: otherUserId, user: otherUser });
  };

  return (
    <TouchableOpacity style={styles.button} onPress={openChat}>
      <Text style={styles.text}>Message</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: 80,
    zIndex: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    marginTop: 20,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
