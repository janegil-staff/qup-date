import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import EnhancedImageViewing from "react-native-image-viewing";

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCarouselVisible, setCarouselVisible] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const loadOwnProfile = async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      const res = await fetch("https://qup.dating/api/mobile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProfile(data.user);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      loadOwnProfile();
    }, [])
  );
  if (loading) return <ActivityIndicator color="#ff69b4" />;
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
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri: profile.profileImage || "https://placehold.co/100x100",
          }}
          style={styles.avatar}
        />
        <View style={styles.headerText}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.status}>
            {profile.relationshipStatus || "Undefined status"}
          </Text>
          <Text style={styles.sub}>
            {age
              ? `${age} years • ${capitalize(profile.gender)}`
              : capitalize(profile.gender)}
          </Text>
          <Text style={styles.location}>
            {capitalize(profile.location?.name)}
          </Text>
        </View>
      </View>

      {/* Bio */}
      {profile.bio && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.sectionText}>{profile.bio}</Text>
        </View>
      )}

      {/* Gallery */}
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
          { label: "Appearance", value: capitalize(profile.appearance) },
          { label: "Body Type", value: capitalize(profile.bodyType) },
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
          { label: "Smoking", value: capitalize(profile.smoking) },
          { label: "Drinking", value: capitalize(profile.drinking) },
          { label: "Has Children", value: profile.hasChildren ? "Yes" : "No" },
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
          { label: "Religion", value: capitalize(profile.religion) },
          { label: "Occupation", value: capitalize(profile.occupation) },
          { label: "Education", value: capitalize(profile.education) },
          {
            label: "Relationship Status",
            value: capitalize(profile.relationshipStatus),
          },
        ]}
      />

      {/* Looking For */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What I'm Looking For</Text>
        <Text style={styles.sectionText}>
          {capitalize(profile.lookingFor) || "Not specified yet."}
        </Text>
      </View>

      {/* Tags */}
      {profile.tags?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Hashtags</Text>
          <View style={styles.tagsContainer}>
            {profile.tags.map((tag, i) => (
              <Text key={i} style={styles.tag}>
                {tag}
              </Text>
            ))}
          </View>
        </View>
      )}

      <EnhancedImageViewing
        images={profile.images.map((img) => ({
          uri: img.url || img.uri,
        }))}
        imageIndex={carouselIndex}
        visible={isCarouselVisible}
        onRequestClose={() => setCarouselVisible(false)}
      />
    </ScrollView>
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
          <Text style={styles.value}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: "#ff69b4",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 12,
  },
});
