import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import GlassBackground from "../components/GlassBackground";
import LikesCard from "../components/LikesCard";
import theme from "../theme";

export default function LikesScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("likedMe");
  const [likedMe, setLikedMe] = useState([]);
  const [iLiked, setILiked] = useState([]);
  const [disliked, setDisliked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportedUsers, setReportedUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);

  const fetchLikes = async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      const res = await fetch("https://qup.dating/api/mobile/likes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLikedMe(data.likedMeUsers || []);
      setILiked(data.likedUsers || []);
      setDisliked(data.dislikedUsers || []);

      // Fetch reports created by this user
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

      // Fetch blocked users
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
      console.error("Likes fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchLikes();
    }, []),
  );

  const safeLikedMe = likedMe.filter(
    (u) => !reportedUsers.includes(u._id) && !blockedUsers.includes(u._id),
  );

  const safeILiked = iLiked.filter(
    (u) => !reportedUsers.includes(u._id) && !blockedUsers.includes(u._id),
  );

  const safeDisliked = disliked.filter(
    (u) => !reportedUsers.includes(u._id) && !blockedUsers.includes(u._id),
  );

  const getTabData = () => {
    if (activeTab === "likedMe") return { data: safeLikedMe, icon: "💕" };
    if (activeTab === "iLiked") return { data: safeILiked, icon: "👍" };
    return { data: safeDisliked, icon: "👎" };
  };

  const renderList = (data) => (
    <FlatList
      data={data}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={styles.cardWrapper}>
          <LikesCard
            user={item}
            navigation={navigation}
            showRemoveLike={activeTab === "iLiked"}
            showRestore={activeTab === "disliked"}
            onRemoveLike={(id) => {
              setILiked((prev) => prev.filter((u) => u._id !== id));
            }}
            onRestore={(id) => {
              setDisliked((prev) => prev.filter((u) => u._id !== id));
            }}
          />
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCard}>
            <LinearGradient
              colors={theme.gradients.glass}
              style={styles.emptyGradient}
            >
              <Text style={styles.emptyIcon}>{getTabData().icon}</Text>
              <Text style={styles.emptyTitle}>No Users Yet</Text>
              <Text style={styles.emptyText}>
                {activeTab === "likedMe" && "Nobody has liked you yet. Keep your profile updated!"}
                {activeTab === "iLiked" && "You haven't liked anyone yet. Start swiping!"}
                {activeTab === "disliked" && "You haven't disliked anyone yet."}
              </Text>
            </LinearGradient>
          </View>
        </View>
      }
    />
  );

  if (loading) {
    return (
      <GlassBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading likes...</Text>
        </View>
      </GlassBackground>
    );
  }

  return (
    <GlassBackground>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Likes 💗</Text>
          <Text style={styles.subtitle}>
            {getTabData().data.length} {getTabData().data.length === 1 ? 'user' : 'users'}
          </Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <LinearGradient
            colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.04)']}
            style={styles.tabsGradient}
          >
            <View style={styles.tabs}>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => setActiveTab("likedMe")}
                activeOpacity={0.8}
              >
                {activeTab === "likedMe" && (
                  <LinearGradient
                    colors={theme.gradients.primary}
                    style={styles.activeTabGradient}
                  />
                )}
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
                style={styles.tab}
                onPress={() => setActiveTab("iLiked")}
                activeOpacity={0.8}
              >
                {activeTab === "iLiked" && (
                  <LinearGradient
                    colors={theme.gradients.primary}
                    style={styles.activeTabGradient}
                  />
                )}
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "iLiked" && styles.activeTabText,
                  ]}
                >
                  You Liked
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tab}
                onPress={() => setActiveTab("disliked")}
                activeOpacity={0.8}
              >
                {activeTab === "disliked" && (
                  <LinearGradient
                    colors={theme.gradients.primary}
                    style={styles.activeTabGradient}
                  />
                )}
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "disliked" && styles.activeTabText,
                  ]}
                >
                  Disliked
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* List */}
        {renderList(getTabData().data)}
      </View>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.textSecondary,
    marginTop: 16,
    fontSize: 16,
  },

  // Header
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textMuted,
  },

  // Tabs
  tabsContainer: {
    marginBottom: 20,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  tabsGradient: {
    padding: 4,
  },
  tabs: {
    flexDirection: 'row',
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  activeTabGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabText: {
    color: theme.colors.textMuted,
    fontSize: 15,
    fontWeight: '600',
    zIndex: 1,
  },
  activeTabText: {
    color: theme.colors.text,
  },

  // List
  listContent: {
    paddingBottom: 100,
  },
  cardWrapper: {
    marginBottom: 16,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyCard: {
    width: '100%',
    maxWidth: 350,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  emptyGradient: {
    padding: 32,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
