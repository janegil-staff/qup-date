import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import MatchCongrats from "../components/MatchCongrats";
import VerifiedBadge from "../components/VerifiedBadge";
import { getAgeFromDate } from "../utils/getAgeFromDate";
import Screen from "../components/Screen";
import { useFocusEffect } from "@react-navigation/native";

export default function DiscoverScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showCongrats, setShowCongrats] = useState(false);

  const fetchDiscoverUsers = async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/mobile/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Error fetching discover users:", err);
      setUsers([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDiscoverUsers();
    }, [])
  );

  const fetchUsers = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const token = await SecureStore.getItemAsync("authToken");

      const res = await fetch(
        `https://qup.dating/api/mobile/discover${
          cursor ? `?cursor=${cursor}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Fetch failed");

      setUsers((prev) => {
        const map = new Map([...prev, ...data.users].map((u) => [u._id, u]));
        return Array.from(map.values());
      });

      setCursor(data.nextCursor);
      setHasMore(data.users.length === 20);
    } catch (err) {
      console.error("Fetch users error:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLike = async (id) => {
    setUsers((prev) => prev.filter((u) => u._id !== id));
    // optional: POST /api/like
  };

  const handleDislike = async (id) => {
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("UserProfile", { userId: item._id })}
    >
      <View style={styles.card}>
        {item.isVerified && <VerifiedBadge />}
        <Image
          source={{
            uri: item.profileImage || "https://via.placeholder.com/300",
          }}
          style={styles.image}
        />

        <Text style={styles.name}>
          {item.name}, {getAgeFromDate(item.birthdate)}
        </Text>

        <Text style={styles.bio} numberOfLines={2}>
          {item.bio}
        </Text>

        {!item.isMatch && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.dislike]}
              onPress={() => handleDislike(item._id)}
            >
              <Text>👎</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.like]}
              onPress={() => handleLike(item._id)}
            >
              <Text>👍</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <Screen style={{ backgroundColor: "#111827" }}>
      <View style={styles.container}>
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          onEndReached={fetchUsers}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? <ActivityIndicator color="#ff69b4" /> : null
          }
        />

        {showCongrats && (
          <MatchCongrats onClose={() => setShowCongrats(false)} />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111827", padding: 10 },
  card: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    position: "relative",
  },
  isVerified: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 12,
  },
  name: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
  },
  bio: {
    color: "#9ca3af",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
  },
  btn: {
    padding: 12,
    borderRadius: 50,
  },
  like: { backgroundColor: "#22c55e" },
  dislike: { backgroundColor: "#ef4444" },
});
