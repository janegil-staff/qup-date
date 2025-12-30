import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import Screen from "../components/Screen";
import LikesCard from "../components/LikesCard";

export default function LikesScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("likedMe");
  const [likedMe, setLikedMe] = useState([]);
  const [iLiked, setILiked] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLikes = async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");

      const res = await fetch("https://qup.dating/api/mobile/likes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      setLikedMe(data.likedMeUsers || []);
      setILiked(data.likedUsers || []);
    } catch (err) {
      console.error("Likes fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchLikes();
    }, [])
  );

  const renderList = (data) => (
    <FlatList
      data={data}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ paddingBottom: 40 }}
      renderItem={({ item }) => (
        <View style={{ marginBottom: 20 }}>
          <LikesCard user={item} navigation={navigation} />
        </View>
      )}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No users here yet.</Text>
      }
    />
  );

  if (loading) {
    return (
      <Screen style={styles.center}>
        <ActivityIndicator size="large" color="#ff69b4" />
      </Screen>
    );
  }

  return (
    <Screen style={{ backgroundColor: "#111827" }}>
      <View style={styles.container}>
        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "likedMe" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("likedMe")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "likedMe" && styles.activeTabText,
              ]}
            >
              Liked You
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "iLiked" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("iLiked")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "iLiked" && styles.activeTabText,
              ]}
            >
              You Liked
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === "likedMe"
          ? renderList(likedMe)
          : renderList(iLiked)}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111827",
  },

  // Tabs
  tabs: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#1f2937",
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#ff69b4",
  },
  tabText: {
    color: "#aaa",
    fontSize: 16,
    fontWeight: "600",
  },
  activeTabText: {
    color: "white",
  },

  emptyText: {
    color: "#888",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
});
