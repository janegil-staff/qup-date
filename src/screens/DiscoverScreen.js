import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Dimensions,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import GlassBackground from "../components/GlassBackground";
import SafeBottomView from "../components/SafeBottomView";
import MatchCongrats from "../components/MatchCongrats";
import VerifiedBadge from "../components/VerifiedBadge";
import { getAgeFromDate } from "../utils/getAgeFromDate";
import theme from "../theme";

const { width } = Dimensions.get('window');

export default function DiscoverScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showCongrats, setShowCongrats] = useState(false);

  const fetchUsers = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    setLoading(true);

    try {
      const token = await SecureStore.getItemAsync("authToken");
      const url = `https://qup.dating/api/mobile/discover${
        !reset && cursor ? `?cursor=${cursor}` : ""
      }`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fetch failed");

      if (reset) {
        setUsers(data.users);
      } else {
        setUsers((prev) => {
          const map = new Map([...prev, ...data.users].map((u) => [u._id, u]));
          return Array.from(map.values());
        });
      }

      setCursor(data.nextCursor);
      setHasMore(data.users.length === 20);
    } catch (err) {
      console.error("Fetch users error:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setCursor(null);
      setHasMore(true);
      fetchUsers(true);
    }, []),
  );

  useEffect(() => {
    fetchUsers(true);
  }, []);

  const handleLike = async (id) => {
    const token = await SecureStore.getItemAsync("authToken");
    setUsers((prev) => prev.filter((u) => u._id !== id));

    const res = await fetch(`https://qup.dating/api/mobile/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ targetUserId: id }),
    });

    const data = await res.json();
    if (data.match === true) setShowCongrats(true);
  };

  const handleDislike = async (id) => {
    const token = await SecureStore.getItemAsync("authToken");
    setUsers((prev) => prev.filter((u) => u._id !== id));

    await fetch(`https://qup.dating/api/mobile/dislike`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ targetUserId: id }),
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("UserProfile", { userId: item._id })}
      activeOpacity={0.9}
    >
      <View style={styles.card}>
        <LinearGradient
          colors={theme.gradients.glass}
          style={styles.cardGradient}
        >
          {/* Verified Badge */}
          {item.isVerified && (
            <View style={styles.verifiedBadgeContainer}>
              <VerifiedBadge />
            </View>
          )}

          {/* LinkedIn Badge */}
          {item.linkedin?.isVerified && (
            <View style={styles.linkedinBadgeContainer}>
              <FontAwesome name="linkedin-square" size={14} color="#fff" />
              <Text style={styles.linkedinBadgeText}>LinkedIn</Text>
            </View>
          )}

          {/* Profile Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: item.profileImage ||
                  "https://res.cloudinary.com/dbcdsonhz/image/upload/v1769110864/dating-app/empty-profile-image_dlwotm.png",
              }}
              style={styles.image}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.imageOverlay}
            >
              {/* Name & Age on Image */}
              <View style={styles.imageInfo}>
                <Text style={styles.imageName}>
                  {item.name}, {getAgeFromDate(item.birthdate)}
                </Text>
                {item.location?.name && (
                  <View style={styles.locationRow}>
                    <Ionicons name="location" size={14} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.locationText}>
                      {item.location.name.split(',')[0]}
                    </Text>
                  </View>
                )}
              </View>
            </LinearGradient>
          </View>

          {/* Bio */}
          {item.bio && (
            <View style={styles.bioContainer}>
              <Text style={styles.bio} numberOfLines={2}>
                {item.bio}
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          {!item.isMatch && (
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleDislike(item._id);
                }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#ff4444', '#cc0000']}
                  style={styles.actionGradient}
                >
                  <Ionicons name="close" size={28} color="white" />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.likeButton]}
                onPress={(e) => {
                  e.stopPropagation();
                  handleLike(item._id);
                }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={theme.gradients.primary}
                  style={styles.actionGradient}
                >
                  <Ionicons name="heart" size={28} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Discover 🔍</Text>
      <Text style={styles.headerSubtitle}>
        {users.length} profiles available
      </Text>
    </View>
  );

  const renderFooter = () => {
    return (
      <View>
        {loading && (
          <View style={styles.footer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading more...</Text>
          </View>
        )}
        <SafeBottomView />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyCard}>
        <LinearGradient
          colors={theme.gradients.glass}
          style={styles.emptyGradient}
        >
          <Text style={styles.emptyIcon}>🎯</Text>
          <Text style={styles.emptyTitle}>No More Profiles</Text>
          <Text style={styles.emptyText}>
            You've seen all available profiles!
          </Text>
          <Text style={styles.emptySubtext}>
            Check back later for new matches.
          </Text>
        </LinearGradient>
      </View>
    </View>
  );

  return (
    <GlassBackground>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.container}>
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={!loading ? renderEmpty : null}
          onEndReached={() => fetchUsers()}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />

        {showCongrats && (
          <MatchCongrats onClose={() => setShowCongrats(false)} />
        )}
      </View>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  
  // Header
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.textMuted,
  },

  // Card
  card: {
    marginBottom: 20,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    ...theme.shadows.lg,
  },
  cardGradient: {
    padding: 16,
  },
  
  // Verified Badge
  verifiedBadgeContainer: {
    position: 'absolute',
    top: 24,
    right: 24,
    zIndex: 10,
  },

  // LinkedIn Badge
  linkedinBadgeContainer: {
    position: "absolute",
    top: 24,
    left: 24,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 102, 194, 0.9)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 5,
  },
  linkedinBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },

  // Image
  imageContainer: {
    position: 'relative',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 400,
    backgroundColor: theme.colors.backgroundDark,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    justifyContent: 'flex-end',
    padding: 16,
  },
  imageInfo: {
    // Info on image
  },
  imageName: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
  },

  // Bio
  bioContainer: {
    marginBottom: 16,
  },
  bio: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },

  // Actions
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  actionButton: {
    borderRadius: 35,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  likeButton: {
    ...theme.shadows.glow,
  },
  actionGradient: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Footer
  footer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.textMuted,
    marginTop: 12,
    fontSize: 14,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyCard: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    maxWidth: 300,
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
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
