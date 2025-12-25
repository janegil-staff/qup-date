import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Link } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function MatchesScreen({ navigation }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");

      if (!token) {
        console.warn("No auth token found");
        setLoading(false);
        return;
      }

      const res = await fetch("https://qup.dating/api/mobile/matches", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("API returned non-JSON response:", text);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        console.warn("API error:", data);
        setLoading(false);
        return;
      }

      setMatches(data.matches || []);
    } catch (err) {
      console.error("Fetch matches error:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Profile Image */}

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate("UserProfile", { userId: item._id })}
      >
        <Image source={{ uri: item.profileImage }} style={styles.image} />
      </TouchableOpacity>

      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.bio} numberOfLines={2}>
        {item.bio || "No bio yet"}
      </Text>

      {/* Chat button using Link */}
      <TouchableOpacity
        style={styles.chatBtn}
        onPress={() =>
          navigation.navigate("ChatScreen", { userId: item._id, user: item })
        }
      >
        <Text style={styles.chatText}>Start Chat</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Matches</Text>

      {matches.length === 0 ? (
        <Text style={styles.empty}>No matches yet. Keep swiping!</Text>
      ) : (
        <FlatList
          data={matches}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ gap: 12, paddingBottom: 40 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 12,
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  empty: {
    color: "#9ca3af",
    marginTop: 20,
  },
  card: {
    flex: 1,
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 10,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
  },
  name: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  bio: {
    color: "#9ca3af",
    fontSize: 13,
    marginTop: 2,
  },
  chatBtn: {
    marginTop: 8,
    backgroundColor: "#22c55e",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  chatText: {
    color: "white",
    fontWeight: "600",
  },
  loader: {
    flex: 1,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
  },
});
