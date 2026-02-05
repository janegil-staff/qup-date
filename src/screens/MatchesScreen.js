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
import * as SecureStore from "expo-secure-store";
import VerifiedBadge from "../components/VerifiedBadge";
import { useFocusEffect } from "@react-navigation/native";
import Screen from "../components/Screen";
import UnreadBadge from "../components/UnreadBadge";

export default function MatchesScreen({ navigation }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportedUsers, setReportedUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      fetchMatches();
    }, []),
  );

  const fetchMatches = async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");

      if (!token) {
        console.warn("No auth token found");
        setLoading(false);
        return;
      }

      // Fetch matches
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

      // ⭐ Fetch reports created by this user
      const reportsRes = await fetch(
        "https://qup.dating/api/mobile/reports/mine",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const reportsData = await reportsRes.json();
      const reportedIds = reportsData.reports?.map((r) => r.reportedUser) || [];

      setReportedUsers(reportedIds);

      // ⭐ Fetch blocked users
      const blockedRes = await fetch("https://qup.dating/api/mobile/blocked", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const blockedData = await blockedRes.json();
      const blockedIds = blockedData.blocked?.map((u) => u._id) || [];

      setBlockedUsers(blockedIds);
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
        <Image
          source={{
            uri:
              item.profileImage ||
              "https://res.cloudinary.com/dbcdsonhz/image/upload/v1769110864/dating-app/empty-profile-image_dlwotm.png",
          }}
          style={styles.image}
        />
      </TouchableOpacity>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Text style={styles.name}>{item.name}</Text>

        {item.isVerified && <VerifiedBadge />}
      </View>

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
      <UnreadBadge count={item.unreadCount} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }
  const safeMatches = matches.filter(
    (m) => !reportedUsers.includes(m._id) && !blockedUsers.includes(m._id),
  );

  return (
    <Screen style={{ backgroundColor: "#111827" }}>
      <View style={styles.container}>
        <Text style={styles.title}>Your Matches</Text>

        {safeMatches.length === 0 ? (
          <Text style={styles.empty}>No matches yet. Keep swiping!</Text>
        ) : (
          <FlatList
            data={safeMatches}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={{ gap: 12 }}
            contentContainerStyle={{ gap: 12, paddingBottom: 40 }}
          />
        )}
      </View>
    </Screen>
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
