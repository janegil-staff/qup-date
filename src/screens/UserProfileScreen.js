import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import EnhancedImageViewing from "react-native-image-viewing";
import Screen from "../components/Screen";
import SafeBottomView from "../components/SafeBottomView";
import MatchCongrats from "../components/MatchCongrats";
import MessageButton from "../components/MessageButton";
import ReportUserModal from "../components/ReportUserModal";
import BlockUserModal from "../components/BlockUserModal";
import getAge from "../utils/getAge";

const { width, height } = Dimensions.get('window');

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function UserProfileScreen({ route, navigation }) {
  const userId = route.params?.userId;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCarouselVisible, setCarouselVisible] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);
  const [likedUsers, setLikedUsers] = useState([]);
  const [likedMeUsers, setLikedMeUsers] = useState([]);
  const [reportVisible, setReportVisible] = useState(false);
  const [blockModalVisible, setBlockModalVisible] = useState(false);

  const fetchLikedUsers = async () => {
    const token = await SecureStore.getItemAsync("authToken");
    const res = await fetch("https://qup.dating/api/mobile/likes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setLikedUsers(data.likedUsers || []);
    setLikedMeUsers(data.likedMeUsers || []);
  };

  const isLikedByMe = likedUsers.some((u) => u._id === profile?._id);
  const isLikedMeBack = likedMeUsers.some((u) => u._id === profile?._id);
  const isMatched = isLikedByMe && isLikedMeBack;
  const canLike = !isLikedByMe || isMatched;

  const handleBlockUser = async () => {
    setBlockModalVisible(false);
    const token = await SecureStore.getItemAsync("authToken");

    try {
      const response = await fetch("https://qup.dating/api/mobile/block-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ blockedUser: profile._id }),
      });

      if (!response.ok) throw new Error("Failed to block user");
      Alert.alert("User Blocked", "You will not see this user again.");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", "Could not block user. Please try again.");
    }
  };

  const sendReportToBackend = async ({ reason }) => {
    const currentUserId = await SecureStore.getItemAsync("userId");

    try {
      const response = await fetch("https://qup.dating/api/mobile/report-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportedUser: userId,
          reporter: currentUserId,
          reason,
          timestamp: Date.now(),
        }),
      });

      if (!response.ok) throw new Error("Failed to submit report");
      Alert.alert(
        "Report submitted",
        "Thank you. We will review this within 24 hours."
      );
    } catch (error) {
      Alert.alert("Error", "Could not submit report. Please try again.");
    }
  };

  const toggleLike = async () => {
    const token = await SecureStore.getItemAsync("authToken");

    setLikedUsers((prev) => {
      const alreadyLiked = prev.some((u) => u._id === profile._id);
      return alreadyLiked
        ? prev.filter((u) => u._id !== profile._id)
        : [...prev, { _id: profile._id }];
    });

    const endpoint = isLikedByMe ? "/api/mobile/dislike" : "/api/mobile/like";
    const res = await fetch(`https://qup.dating${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ targetUserId: profile._id }),
    });

    const data = await res.json();
    if (data.match === true) {
      setShowCongrats(true);
    }
    fetchLikedUsers();
  };

  const fetchUser = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("authToken");
      const res = await fetch(`https://qup.dating/api/mobile/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("User fetch error:", data);
        return;
      }
      setProfile(data.user);
    } catch (err) {
      console.error("UserProfile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUser();
      fetchLikedUsers();
    }, [userId]),
  );

  if (loading) {
    return (
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#e94560" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </LinearGradient>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Profile not found.</Text>
      </View>
    );
  }

  const age = getAge(profile.birthdate);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Animated Background */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460', '#16213e']}
        style={styles.backgroundGradient}
      />

      {/* Floating Action Buttons */}
      <View style={styles.floatingActions}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate("DashboardHome");
            }
          }}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.4)']}
            style={styles.iconButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Message Button - Center */}
        {isMatched ? (
          <View style={styles.messageButtonWrapper}>
            <MessageButton otherUser={profile} />
          </View>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        {/* Like/Unlike Button */}
        {canLike && (
          <TouchableOpacity
            style={styles.likeButton}
            onPress={toggleLike}
          >
            <LinearGradient
              colors={isMatched ? ['#ff4444', '#cc0000'] : ['#e94560', '#ff6b9d']}
              style={styles.iconButton}
            >
              <Text style={styles.likeIcon}>{isMatched ? '✕' : '♥'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Card */}
        <View style={styles.headerCard}>
          <LinearGradient
            colors={['rgba(233, 69, 96, 0.1)', 'rgba(15, 52, 96, 0.1)']}
            style={styles.headerGradient}
          >
            <View style={styles.profileHeader}>
              {/* Avatar with Glow */}
              <View style={styles.avatarWrapper}>
                <View style={styles.avatarGlow} />
                <Image
                  source={{
                    uri: profile.profileImage ||
                      "https://res.cloudinary.com/dbcdsonhz/image/upload/v1769110864/dating-app/empty-profile-image_dlwotm.png",
                  }}
                  style={styles.avatar}
                />
                {isMatched && (
                  <View style={styles.matchBadge}>
                    <Text style={styles.matchBadgeText}>MATCH</Text>
                  </View>
                )}
              </View>

              {/* Profile Info */}
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{profile.name}</Text>
                
                <View style={styles.metaRow}>
                  {age && (
                    <View style={styles.metaChip}>
                      <Text style={styles.metaText}>{age} years</Text>
                    </View>
                  )}
                  <View style={styles.metaChip}>
                    <Text style={styles.metaText}>{capitalize(profile.gender)}</Text>
                  </View>
                </View>

                {profile.location?.name && (
                  <View style={styles.locationRow}>
                    <Text style={styles.locationIcon}>📍</Text>
                    <Text style={styles.locationText}>
                      {capitalize(profile.location.name)}
                    </Text>
                  </View>
                )}

                {profile.relationshipStatus && (
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>
                      {capitalize(profile.relationshipStatus)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Content Cards */}
        <View style={styles.contentContainer}>
          
          {/* About Me */}
          {profile.bio && (
            <GlassCard icon="💭" title="About">
              <Text style={styles.bioText}>{profile.bio}</Text>
            </GlassCard>
          )}

          {/* Photo Gallery */}
          {Array.isArray(profile.images) && profile.images.length > 0 && (
            <GlassCard 
              icon="🎨" 
              title="Gallery"
              badge={profile.images.length}
            >
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.gallery}
              >
                {profile.images.map((img, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setCarouselIndex(index);
                      setCarouselVisible(true);
                    }}
                    activeOpacity={0.9}
                    style={styles.galleryItem}
                  >
                    <Image
                      source={{ uri: img.url || img.uri }}
                      style={styles.galleryImage}
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.4)']}
                      style={styles.galleryOverlay}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </GlassCard>
          )}

          {/* Info Sections */}
          <InfoSection
            icon="✨"
            title="Appearance"
            items={[
              { key: "Style", value: capitalize(profile.appearance) },
              { key: "Build", value: capitalize(profile.bodyType) },
              { key: "Height", value: profile.height ? `${profile.height} cm` : null },
            ]}
          />

          <InfoSection
            icon="🌱"
            title="Lifestyle"
            items={[
              { key: "Smoking", value: capitalize(profile.smoking) },
              { key: "Drinking", value: capitalize(profile.drinking) },
              { key: "Children", value: profile.hasChildren ? "Has children" : "No children" },
              { key: "Future kids", value: profile.wantsChildren ? "Open to it" : "Not planning" },
              { key: "Relocation", value: profile.willingToRelocate ? "Flexible" : "Staying local" },
            ]}
          />

          <InfoSection
            icon="🎓"
            title="Background"
            items={[
              { key: "Faith", value: capitalize(profile.religion) },
              { key: "Career", value: capitalize(profile.occupation) },
              { key: "Education", value: capitalize(profile.education) },
            ]}
          />

          {/* Looking For */}
          {profile.lookingFor && (
            <GlassCard icon="🎯" title="Looking For">
              <Text style={styles.bioText}>
                {capitalize(profile.lookingFor)}
              </Text>
            </GlassCard>
          )}

          {/* Interests */}
          {profile.tags?.length > 0 && (
            <GlassCard icon="💫" title="Interests">
              <View style={styles.interestsGrid}>
                {profile.tags.map((tag, i) => (
                  <View key={i} style={styles.interestChip}>
                    <LinearGradient
                      colors={['rgba(233, 69, 96, 0.2)', 'rgba(15, 52, 96, 0.2)']}
                      style={styles.interestGradient}
                    >
                      <Text style={styles.interestText}>{String(tag)}</Text>
                    </LinearGradient>
                  </View>
                ))}
              </View>
            </GlassCard>
          )}

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setReportVisible(true)}
            >
              <LinearGradient
                colors={['rgba(255,107,157,0.2)', 'rgba(255,107,157,0.1)']}
                style={styles.actionGradient}
              >
                <Ionicons name="flag-outline" size={20} color="#ff6b9d" />
                <Text style={styles.actionText}>Report User</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setBlockModalVisible(true)}
            >
              <LinearGradient
                colors={['rgba(255,68,68,0.2)', 'rgba(255,68,68,0.1)']}
                style={styles.actionGradient}
              >
                <Ionicons name="ban-outline" size={20} color="#ff4444" />
                <Text style={styles.actionTextDanger}>Block User</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Safe bottom spacing for tab bar */}
        <SafeBottomView />
      </ScrollView>

      {/* Modals */}
      {showCongrats && (
        <MatchCongrats onClose={() => setShowCongrats(false)} />
      )}

      <ReportUserModal
        visible={reportVisible}
        onClose={() => setReportVisible(false)}
        userId={profile._id}
        onSubmit={(payload) => {
          setReportVisible(false);
          sendReportToBackend(payload);
        }}
      />

      <BlockUserModal
        visible={blockModalVisible}
        onClose={() => setBlockModalVisible(false)}
        onConfirm={handleBlockUser}
      />

      <EnhancedImageViewing
        images={profile.images.map((img) => ({
          uri: img.url || img.uri,
        }))}
        imageIndex={carouselIndex}
        visible={isCarouselVisible}
        onRequestClose={() => setCarouselVisible(false)}
      />
    </View>
  );
}

// Glass Card Component
function GlassCard({ icon, title, badge, children }) {
  return (
    <View style={styles.glassCard}>
      <LinearGradient
        colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
        style={styles.glassGradient}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardIcon}>{icon}</Text>
            <Text style={styles.cardTitle}>{title}</Text>
          </View>
          {badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>
        <View style={styles.cardContent}>
          {children}
        </View>
      </LinearGradient>
    </View>
  );
}

// Info Section Component
function InfoSection({ icon, title, items }) {
  const valid = items.filter((i) => i.value);
  if (valid.length === 0) return null;

  return (
    <GlassCard icon={icon} title={title}>
      {valid.map((item, i) => (
        <View 
          key={i} 
          style={[
            styles.infoRow,
            i === valid.length - 1 && styles.infoRowLast
          ]}
        >
          <Text style={styles.infoKey}>{item.key}</Text>
          <Text style={styles.infoValue}>{item.value}</Text>
        </View>
      ))}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: '#e94560',
    fontSize: 18,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Floating Actions
  floatingActions: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 100,
  },
  backButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  messageButtonWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // Vertically center with other buttons
    height: 48, // Match the icon button height
  },
  likeButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  iconButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeIcon: {
    fontSize: 24,
    color: '#fff',
  },

  // Header Card
  headerCard: {
    margin: 20,
    marginTop: 120,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  headerGradient: {
    padding: 24,
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  avatarGlow: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 80,
    backgroundColor: '#e94560',
    opacity: 0.3,
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  matchBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#22c55e',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  matchBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  metaChip: {
    backgroundColor: 'rgba(233, 69, 96, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.3)',
  },
  metaText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  locationIcon: {
    fontSize: 16,
  },
  locationText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    fontWeight: '500',
  },
  statusBadge: {
    backgroundColor: 'rgba(233, 69, 96, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.3)',
  },
  statusText: {
    color: '#e94560',
    fontSize: 13,
    fontWeight: '600',
    fontStyle: 'italic',
  },

  // Content
  contentContainer: {
    paddingHorizontal: 20,
  },
  glassCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  glassGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  badge: {
    backgroundColor: '#e94560',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    // Content wrapper
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.9)',
  },

  // Gallery
  gallery: {
    paddingRight: 20,
  },
  galleryItem: {
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  galleryImage: {
    width: 140,
    height: 180,
    borderRadius: 16,
  },
  galleryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },

  // Info Rows
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoKey: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },

  // Interests
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestChip: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.3)',
  },
  interestGradient: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  interestText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Actions
  actionsContainer: {
    marginTop: 24,
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 10,
  },
  actionText: {
    color: '#ff6b9d',
    fontSize: 16,
    fontWeight: '600',
  },
  actionTextDanger: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
  },
});
