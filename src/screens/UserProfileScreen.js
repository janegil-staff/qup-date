import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import EnhancedImageViewing from "react-native-image-viewing";
import Screen from "../components/Screen";
import MatchCongrats from "../components/MatchCongrats";
import MessageButton from "../components/MessageButton";
import ReportUserModal from "../components/ReportUserModal";
import BlockUserModal from "../components/BlockUserModal";

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

  const icon = isMatched ? "✕" : "♥";
  const buttonStyle = isMatched ? styles.dislikeBtn : styles.likeBtn;
  const canLike = !isLikedByMe || isMatched;

  const handleBlockUser = async () => {
 
    setBlockModalVisible(false);
   const token = await SecureStore.getItemAsync("authToken");

console.log(token);
    try {
      const response = await fetch("https://qup.dating/api/mobile/block-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          blockedUser: profile._id,
        }),
      });
      console.log(response.ok);

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

      Alert.alert("User Blocked", "You will not see this user again.");
    } catch (err) {
      console.log("Block error:", err);
    }
  };

  const sendReportToBackend = async ({ reason }) => {
    const currentUserId = await SecureStore.getItemAsync("userId");

    try {
      const response = await fetch(
        "https://qup.dating/api/mobile/report-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reportedUser: userId,
            reporter: currentUserId,
            reason,
            timestamp: Date.now(),
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }
      Alert.alert(
        "Report submitted",
        "Thank you. We will review this within 24 hours.",
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
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff69b4" />
        <Text style={styles.loading}>Loading profile…</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Profile not found.</Text>
      </View>
    );
  }

  const age = profile.birthdate
    ? new Date().getFullYear() - new Date(profile.birthdate).getFullYear()
    : null;

  return (
    <Screen style={{ backgroundColor: "#111827" }}>
      <View style={styles.topContainer}>
        {isMatched && <MessageButton otherUser={profile} />}

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
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <ScrollView
          contentContainerStyle={[styles.container, { paddingTop: 80 }]}
        >
          <View style={styles.actionButton}>
            <TouchableOpacity
              disabled={!canLike}
              style={[buttonStyle, !canLike && { opacity: 0.5 }]}
              onPress={toggleLike}
            >
              <Text style={styles.btnText}>{icon}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => setReportVisible(true)}>
            <Text style={styles.rightAligned}>Report</Text>
          </TouchableOpacity>

          <ReportUserModal
            visible={reportVisible}
            onClose={() => setReportVisible(false)}
            userId={profile._id}
            onSubmit={(payload) => {
              setReportVisible(false);
              sendReportToBackend(payload);
            }}
          />
          <TouchableOpacity onPress={() => setBlockModalVisible(true)}>
            <Text style={styles.rightAligned}>Block User</Text>
          </TouchableOpacity>

          <BlockUserModal
            visible={blockModalVisible}
            onClose={() => setBlockModalVisible(false)}
            onConfirm={handleBlockUser}
          />

          {/* Header */}
          <View style={styles.header}>
            <Image
              source={{
                uri:
                  profile.profileImage ||
                  "https://res.cloudinary.com/dbcdsonhz/image/upload/v1769110864/dating-app/empty-profile-image_dlwotm.png",
              }}
              style={styles.avatar}
            />
            <View style={styles.headerText}>
              <Text style={styles.name}>{profile.name}</Text>

              <Text style={styles.status}>
                {profile.relationshipStatus || "Undefined status"}
              </Text>

              <Text style={styles.sub}>
                {age ? `${age} years • ${profile.gender}` : profile.gender}
              </Text>

              <Text style={styles.location}>
                {profile.location?.name || profile.location?.country}
              </Text>
            </View>
          </View>

          {/* Bio */}
          {profile.bio ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About Me</Text>
              <Text style={styles.sectionText}>{profile.bio}</Text>
            </View>
          ) : null}

          {/* Photos Section */}
          {Array.isArray(profile.images) && profile.images.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Photos</Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {profile.images.map((img, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setCarouselIndex(index);
                      setCarouselVisible(true);
                    }}
                  >
                    <Image
                      source={{ uri: img.url || img.uri }}
                      style={styles.galleryImage}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
          {/* Appearance */}
          <SimpleSection
            title="Appearance"
            items={[
              { label: "Appearance", value: profile.appearance },
              { label: "Body Type", value: profile.bodyType },
              {
                label: "Height",
                value: profile.height ? `${profile.height} cm` : null,
              },
            ]}
          />

          {/* Lifestyle */}
          <SimpleSection
            title="Lifestyle"
            items={[
              { label: "Smoking", value: profile.smoking },
              { label: "Drinking", value: profile.drinking },
              {
                label: "Has Children",
                value: profile.hasChildren ? "Yes" : "No",
              },
              {
                label: "Wants Children",
                value: profile.wantsChildren ? "Yes" : "No",
              },
              {
                label: "Willing to Relocate",
                value: profile.willingToRelocate ? "Yes" : "No",
              },
            ]}
          />

          {/* Personal Info */}
          <SimpleSection
            title="Personal Info"
            items={[
              { label: "Religion", value: profile.religion },
              { label: "Occupation", value: profile.occupation },
              { label: "Education", value: profile.education },
              {
                label: "Relationship Status",
                value: profile.relationshipStatus,
              },
            ]}
          />

          {/* Looking For */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What I'm Looking For</Text>
            <Text style={styles.sectionText}>
              {profile.lookingFor || "Not specified yet."}
            </Text>
          </View>

          {/* Tags */}
          {Array.isArray(profile.tags) && profile.tags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>My Hashtags</Text>
              <View style={styles.tagsContainer}>
                {profile.tags.map((tag, i) => (
                  <Text key={i} style={styles.tag}>
                    {String(tag)}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
        {showCongrats && (
          <MatchCongrats onClose={() => setShowCongrats(false)} />
        )}

        <EnhancedImageViewing
          images={profile.images.map((img) => ({
            uri: img.url || img.uri,
          }))}
          imageIndex={carouselIndex}
          visible={isCarouselVisible}
          onRequestClose={() => setCarouselVisible(false)}
        />
      </View>
    </Screen>
  );
}

function SimpleSection({ title, items }) {
  const valid = items.filter((i) => i.value);
  if (valid.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {valid.map((item, i) => (
        <View key={i} style={styles.row}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.value}>{String(item.value)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  rightAligned: {
    alignSelf: "flex-end",
    color: "#ff6666",
    fontSize: 16,
  },
  actionButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 999,
  },

  likeBtn: {
    backgroundColor: "#ec4899",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 50,
    elevation: 6,
  },

  dislikeBtn: {
    backgroundColor: "#ef4444",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 50,
    elevation: 6,
  },

  btnText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  backButton: {
    position: "absolute",
    top: 10,
    left: 20,
    zIndex: 999,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 30,
  },
  topContainer: {
    flex: 1,
    position: "relative",
  },
  container: { padding: 20, backgroundColor: "#111" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  loading: { color: "#ccc", marginTop: 10 },
  error: { color: "red", fontSize: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#ff69b4",
  },
  headerText: { marginLeft: 15 },
  name: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  status: { fontStyle: "italic", color: "#ff69b4" },
  sub: { color: "#ccc" },
  location: { color: "#888", fontSize: 12 },
  section: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ff69b4",
    marginBottom: 8,
  },
  sectionText: { color: "#ddd", lineHeight: 20 },
  galleryImage: { width: 120, height: 120, borderRadius: 8, marginRight: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: { color: "#aaa", width: 140 },
  value: { color: "#fff", flex: 1 },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  tag: {
    backgroundColor: "#be185d",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 12,
  },
});
