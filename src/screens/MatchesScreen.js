import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import GlassBackground from "../components/GlassBackground";
import VerifiedBadge from "../components/VerifiedBadge";
import UnreadBadge from "../components/UnreadBadge";
import SafeBottomView from "../components/SafeBottomView";
import theme from "../theme";

export default function MatchesScreen({ route, navigation }) {
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
      console.error("Fetch matches error:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardWrapper}>
      <View style={styles.card}>
        <LinearGradient
          colors={theme.gradients.glass}
          style={styles.cardGradient}
        >
          {/* Profile Image */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate("UserProfile", { userId: item._id })}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: item.profileImage ||
                    "https://res.cloudinary.com/dbcdsonhz/image/upload/v1769110864/dating-app/empty-profile-image_dlwotm.png",
                }}
                style={styles.image}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.6)']}
                style={styles.imageOverlay}
              />
            </View>
          </TouchableOpacity>

          {/* Name & Verified Badge */}
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            {item.isVerified && (
              <View style={styles.verifiedWrapper}>
                <VerifiedBadge />
              </View>
            )}
          </View>

          {/* Bio */}
          <Text style={styles.bio} numberOfLines={2}>
            {item.bio || "No bio yet"}
          </Text>

          {/* Chat Button */}
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() =>
              navigation.navigate("ChatScreen", { userId: item._id, user: item })
            }
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={theme.gradients.primary}
              style={styles.chatGradient}
            >
              <Ionicons name="chatbubble" size={16} color="white" />
              <Text style={styles.chatText}>Chat</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Unread Badge */}
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadgeContainer}>
              <UnreadBadge count={item.unreadCount} />
            </View>
          )}
        </LinearGradient>
      </View>
    </View>
  );

  const renderFooter = () => <SafeBottomView />;

  if (loading) {
    return (
      <GlassBackground>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading your matches...</Text>
        </View>
      </GlassBackground>
    );
  }

  const safeMatches = matches.filter(
    (m) => !reportedUsers.includes(m._id) && !blockedUsers.includes(m._id),
  );

  return (
    <GlassBackground>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Matches 💕</Text>
          <Text style={styles.subtitle}>
            {safeMatches.length} {safeMatches.length === 1 ? 'match' : 'matches'}
          </Text>
        </View>

        {safeMatches.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyCard}>
              <LinearGradient
                colors={theme.gradients.glass}
                style={styles.emptyGradient}
              >
                <Text style={styles.emptyIcon}>💔</Text>
                <Text style={styles.emptyTitle}>No Matches Yet</Text>
                <Text style={styles.emptyText}>
                  Keep swiping to find your perfect match!
                </Text>
                <TouchableOpacity
                  style={styles.discoverButton}
                  onPress={() => navigation.navigate("Discover")}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={theme.gradients.primary}
                    style={styles.discoverGradient}
                  >
                    <Ionicons name="heart" size={20} color="white" />
                    <Text style={styles.discoverText}>Start Swiping</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        ) : (
          <FlatList
            data={safeMatches}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  loader: {
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

  // List
  columnWrapper: {
    gap: 12,
  },
  listContent: {
    paddingBottom: 16, // Small padding, SafeBottomView handles the rest
  },

  // Card
  cardWrapper: {
    flex: 1,
  },
  card: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    marginBottom: 12,
  },
  cardGradient: {
    padding: 12,
  },

  // Image
  imageContainer: {
    position: 'relative',
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.backgroundDark,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },

  // Name
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  verifiedWrapper: {
    // Wrapper for verified badge
  },

  // Bio
  bio: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 10,
    lineHeight: 18,
  },

  // Chat Button
  chatButton: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  chatGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  chatText: {
    color: theme.colors.text,
    fontWeight: '700',
    fontSize: 14,
  },

  // Unread Badge
  unreadBadgeContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
    padding: 40,
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
    marginBottom: 24,
    lineHeight: 22,
  },
  discoverButton: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    width: '100%',
  },
  discoverGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  discoverText: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
});
