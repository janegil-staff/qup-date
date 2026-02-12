import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  Dimensions,
  StatusBar,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import EnhancedImageViewing from "react-native-image-viewing";
import Screen from "../components/Screen";
import VerifyBanner from "../components/VerifyBanner";
import DeleteProfileButton from "../components/DeleteProfileButton";
import getAge from "../utils/getAge";
import SafeBottomView from "../components/SafeBottomView";
import LinkedInVerifiedBadge from "../components/LinkedInVerifiedBadge";

const { width, height } = Dimensions.get("window");

const handleReport = async () => {
  const email = "qup.dating@gmail.com";
  const subject = encodeURIComponent("Safety concern report");
  const body = encodeURIComponent("Please describe the issue:\n\n");
  const url = `mailto:${email}?subject=${subject}&body=${body}`;

  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    Linking.openURL(url);
  } else {
    Alert.alert(
      "Email app not available",
      "Please send your report to qup.dating@gmail.com",
    );
  }
};

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [isCarouselVisible, setCarouselVisible] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const loadOwnProfile = async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      const res = await fetch("https://qup.dating/api/mobile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setIsVerified(data.user.isVerified);
      setProfile(data.user);
      console.log("LinkedIn:", JSON.stringify(data.user.linkedin));
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOwnProfile();
    }, []),
  );

  if (loading) {
    return (
      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f3460"]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#e94560" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
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

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await SecureStore.deleteItemAsync("authToken");
          navigation.reset({
            index: 0,
            routes: [{ name: "LoginForm" }],
          });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Animated Background */}
      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f3460", "#16213e"]}
        style={styles.backgroundGradient}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Floating Header Card */}
        <View style={styles.headerCard}>
          <LinearGradient
            colors={["rgba(233, 69, 96, 0.1)", "rgba(15, 52, 96, 0.1)"]}
            style={styles.headerGradient}
          >
            {!isVerified && (
              <View style={styles.verifyBannerWrapper}>
                <VerifyBanner user={profile} />
              </View>
            )}

            <View style={styles.profileHeader}>
              {/* Avatar with Glow Effect */}
              <TouchableOpacity
                style={styles.avatarWrapper}
                onPress={() => navigation.navigate("EditImages")}
                activeOpacity={0.8}
              >
                <View style={styles.avatarGlow} />
                <Image
                  source={{
                    uri:
                      profile.profileImage ||
                      "https://res.cloudinary.com/dbcdsonhz/image/upload/v1769110864/dating-app/empty-profile-image_dlwotm.png",
                  }}
                  style={styles.avatar}
                />
                {/* Camera Icon Overlay */}
                <View style={styles.cameraIconContainer}>
                  <LinearGradient
                    colors={[
                      "rgba(233, 69, 96, 0.9)",
                      "rgba(255, 107, 157, 0.9)",
                    ]}
                    style={styles.cameraIconGradient}
                  >
                    <Text style={styles.cameraIcon}>📷</Text>
                  </LinearGradient>
                </View>
              </TouchableOpacity>

              {/* Name & Info */}
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{profile.name}</Text>
                {profile.linkedin?.isVerified && (
                  <View style={{ marginBottom: 10 }}>
                    <LinkedInVerifiedBadge size="md" />
                  </View>
                )}
                <View style={styles.metaRow}>
                  {age && (
                    <View style={styles.metaChip}>
                      <Text style={styles.metaText}>{age} years</Text>
                    </View>
                  )}
                  <View style={styles.metaChip}>
                    <Text style={styles.metaText}>
                      {capitalize(profile.gender)}
                    </Text>
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
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Content Cards */}
        <View style={styles.contentContainer}>
          {/* About Me Glass Card */}
          {profile.bio && (
            <GlassCard
              icon="💭"
              title="About Me"
              onEdit={() =>
                navigation.navigate("Edit", { screen: "EditBasic" })
              }
            >
              <Text style={styles.bioText}>{profile.bio}</Text>
            </GlassCard>
          )}

          {/* Photo Gallery */}
          {Array.isArray(profile.images) && profile.images.length > 0 && (
            <GlassCard icon="🎨" title="Gallery" badge={profile.images.length}>
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
                      colors={["transparent", "rgba(0,0,0,0.4)"]}
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
            onEdit={() =>
              navigation.navigate("Edit", { screen: "EditAppearance" })
            }
            items={[
              { key: "Style", value: capitalize(profile.appearance) },
              { key: "Build", value: capitalize(profile.bodyType) },
              {
                key: "Height",
                value: profile.height ? `${profile.height} cm` : null,
              },
            ]}
          />

          <InfoSection
            icon="🌱"
            title="Lifestyle"
            onEdit={() =>
              navigation.navigate("Edit", { screen: "EditLifestyle" })
            }
            items={[
              { key: "Smoking", value: capitalize(profile.smoking) },
              { key: "Drinking", value: capitalize(profile.drinking) },
              {
                key: "Children",
                value: profile.hasChildren ? "Has children" : "No children",
              },
              {
                key: "Future kids",
                value: profile.wantsChildren ? "Open to it" : "Not planning",
              },
              {
                key: "Relocation",
                value: profile.willingToRelocate ? "Flexible" : "Staying local",
              },
            ]}
          />

          <InfoSection
            icon="🎓"
            title="Background"
            onEdit={() =>
              navigation.navigate("Edit", { screen: "EditDetails" })
            }
            items={[
              { key: "Faith", value: capitalize(profile.religion) },
              { key: "Career", value: capitalize(profile.occupation) },
              { key: "Education", value: capitalize(profile.education) },
              { key: "Status", value: capitalize(profile.relationshipStatus) },
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
            <GlassCard
              icon="💫"
              title="Interests"
              onEdit={() =>
                navigation.navigate("Edit", { screen: "EditHabits" })
              }
            >
              <View style={styles.interestsGrid}>
                {profile.tags.map((tag, i) => (
                  <View key={i} style={styles.interestChip}>
                    <LinearGradient
                      colors={[
                        "rgba(233, 69, 96, 0.2)",
                        "rgba(15, 52, 96, 0.2)",
                      ]}
                      style={styles.interestGradient}
                    >
                      <Text style={styles.interestText}>{tag}</Text>
                    </LinearGradient>
                  </View>
                ))}
              </View>
            </GlassCard>
          )}

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#e94560", "#d63447"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.logoutText}>Logout</Text>
              </LinearGradient>
            </TouchableOpacity>

            <DeleteProfileButton userId={profile._id} navigation={navigation} />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={handleReport}
              style={styles.footerButton}
            >
              <Text style={styles.footerIcon}>🛡️</Text>
              <Text style={styles.footerText}>Report Safety Concern</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("SafetyGuidelines")}
              style={styles.footerButton}
            >
              <Text style={styles.footerIcon}>📋</Text>
              <Text style={styles.footerTextSecondary}>Safety Guidelines</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <EnhancedImageViewing
        images={profile.images.map((img) => ({
          uri: img.url || img.uri,
        }))}
        imageIndex={carouselIndex}
        visible={isCarouselVisible}
        onRequestClose={() => setCarouselVisible(false)}
      />
      <SafeBottomView />
    </View>
  );
}

// Glass Card Component
function GlassCard({ icon, title, badge, children, onEdit }) {
  return (
    <View style={styles.glassCard}>
      <LinearGradient
        colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]}
        style={styles.glassGradient}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardIcon}>{icon}</Text>
            <Text style={styles.cardTitle}>{title}</Text>
          </View>
          <View style={styles.cardHeaderRight}>
            {badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            )}
            {onEdit && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={onEdit}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={[
                    "rgba(233, 69, 96, 0.3)",
                    "rgba(255, 107, 157, 0.3)",
                  ]}
                  style={styles.editButtonGradient}
                >
                  <Text style={styles.editIcon}>✏️</Text>
                  <Text style={styles.editText}>Edit</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.cardContent}>{children}</View>
      </LinearGradient>
    </View>
  );
}

// Info Section Component
function InfoSection({ icon, title, items, onEdit }) {
  const valid = items.filter((i) => i.value);
  if (valid.length === 0) return null;

  return (
    <GlassCard icon={icon} title={title} onEdit={onEdit}>
      {valid.map((item, i) => (
        <View
          key={i}
          style={[styles.infoRow, i === valid.length - 1 && styles.infoRowLast]}
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
    backgroundColor: "#1a1a2e",
  },
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
  },
  errorText: {
    color: "#e94560",
    fontSize: 18,
    fontWeight: "600",
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Header Card
  headerCard: {
    margin: 20,
    marginTop: 60,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  headerGradient: {
    padding: 24,
  },
  verifyBannerWrapper: {
    marginBottom: 16,
  },
  profileHeader: {
    alignItems: "center",
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 20,
  },
  avatarGlow: {
    position: "absolute",
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 80,
    backgroundColor: "#e94560",
    opacity: 0.3,
    shadowColor: "#e94560",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#fff",
  },
  cameraIconGradient: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    fontSize: 20,
  },
  profileInfo: {
    alignItems: "center",
  },
  profileName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  metaChip: {
    backgroundColor: "rgba(233, 69, 96, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(233, 69, 96, 0.3)",
  },
  metaText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationIcon: {
    fontSize: 16,
  },
  locationText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 15,
    fontWeight: "500",
  },

  // Content
  contentContainer: {
    paddingHorizontal: 20,
  },
  glassCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  glassGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  badge: {
    backgroundColor: "#e94560",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  cardContent: {
    // Content wrapper
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: "rgba(255,255,255,0.9)",
  },

  // Gallery
  gallery: {
    paddingRight: 20,
  },
  galleryItem: {
    marginRight: 12,
    borderRadius: 16,
    overflow: "hidden",
  },
  galleryImage: {
    width: 140,
    height: 180,
    borderRadius: 16,
  },
  galleryOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },

  // Info Rows
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoKey: {
    fontSize: 15,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },

  // Edit Button
  editButton: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(233, 69, 96, 0.4)",
  },
  editButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  editIcon: {
    fontSize: 12,
  },
  editText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  // Interests
  interestsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  interestChip: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(233, 69, 96, 0.3)",
  },
  interestGradient: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  interestText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  // Actions
  actionsContainer: {
    marginTop: 24,
    marginBottom: 24,
    gap: 12,
  },
  logoutButton: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#e94560",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    padding: 18,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  // Footer
  footer: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 16,
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerIcon: {
    fontSize: 18,
  },
  footerText: {
    color: "#e94560",
    fontSize: 16,
    fontWeight: "600",
  },
  footerTextSecondary: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 15,
    fontWeight: "500",
  },
});
