import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import * as Progress from "react-native-progress";
import * as SecureStore from "expo-secure-store";

// --- API helpers ---
async function uploadImages(uris) {
  if (!uris.length) return [];
  const formData = new FormData();
  uris.forEach((uri, idx) => {
    formData.append("images", {
      uri,
      name: `image_${idx}.jpg`,
      type: "image/jpeg",
    });
  });

  const res = await fetch("https://qup.dating/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.images; // [{ url, public_id }]
}

async function saveProfile(payload) {
  const token = await SecureStore.getItemAsync("authToken");
  const res = await fetch("https://qup.dating/api/mobile/me", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

// --- Component ---
export default function Step5Images({ form, setForm, setField }) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [uploading, setUploading] = useState(false);

  // --- Prefill images when opening the screen ---
  useEffect(() => {
    if (!isFocused) return;

    const loadProfile = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        const res = await fetch("https://qup.dating/api/mobile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const slots = Array(6).fill(null);
        (data.user.images || []).forEach((img, idx) => {
          if (idx < 6) slots[idx] = { url: img.url, public_id: img.public_id };
        });
        setField("images", slots);
        setField("profileImage", data.user.profileImage);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    loadProfile();
  }, [isFocused]);

  // --- Pick image from library ---
  const pickImage = async () => {
    if ((form.images || []).filter(Boolean).length >= 6) {
      Alert.alert("Limit reached", "You can upload a maximum of 6 images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const next = [...form.images];
      const firstEmpty = next.findIndex((i) => !i);
      if (firstEmpty === -1) return;
      next[firstEmpty] = { uri };
      setField("images", next);
    }
  };

  // --- Delete image ---
  const deleteImage = (index) => {
    Alert.alert("Remove image?", "", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          const next = [...form.images];
          next[index] = null;
          // If deleted image was profileImage, unset it
          if (
            form.profileImage === next[index]?.url ||
            form.profileImage === next[index]?.uri
          ) {
            setField("profileImage", null);
          }
          setField("images", next);
        },
      },
    ]);
  };

  // --- Set profile image ---
  const setProfileImage = (img) => {
    const uri = img.url || img.uri;
    setField("profileImage", uri);
  };

  // --- Save ---
  const handleSave = async () => {
    try {
      setUploading(true);

      // Separate new local images vs already uploaded
      const existingImages = form.images.filter((i) => i?.url);
      const newImages = form.images.filter((i) => i?.uri);

      // Upload new images
      const uploaded = await uploadImages(newImages.map((i) => i.uri));

      // Combine
      const finalImages = [...existingImages, ...uploaded].slice(0, 6);

      // Ensure profileImage is valid
      let profileImage = form.profileImage;
      if (
        !finalImages.find(
          (i) => i.url === profileImage || i.uri === profileImage,
        )
      ) {
        profileImage = finalImages[0]?.url || null;
      }

      // Persist to backend
      await saveProfile({ images: finalImages, profileImage });

      // Update form
      setField("images", finalImages);
      setField("profileImage", profileImage);

      setUploading(false);
      Alert.alert("Success", "Images updated!");
      navigation.navigate("Profile"); // or refresh
    } catch (err) {
      setUploading(false);
      console.error("Failed to save images", err);
      Alert.alert("Error", "Failed to save images.");
    }
  };

  return (
    <View style={styles.container}>
      <Progress.Bar
        progress={1.0}
        width={null}
        color="#ff69b4"
        style={styles.progress}
      />

      <Text style={styles.label}>Profile Images (max 6)</Text>

      <ScrollView horizontal style={styles.scrollRow}>
        {(form.images || []).map((img, idx) => {
          if (!img) return null;
          const uri = img.url || img.uri;
          return (
            <TouchableOpacity
              key={idx}
              onPress={() => setProfileImage(img)}
              onLongPress={() => deleteImage(idx)}
              disabled={uploading}
            >
              <Image
                source={{ uri }}
                style={[
                  styles.imagePreview,
                  form.profileImage === uri && styles.profileSelected,
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <Text style={styles.label}>* Long press to remove an image</Text>
      <Text style={styles.label}>* Click to select profile image</Text>

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={pickImage}
        disabled={uploading}
      >
        <Text style={styles.uploadText}>Upload Image</Text>
      </TouchableOpacity>

      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navButton, styles.backButton]}
          onPress={() => navigation.goBack()}
          disabled={uploading}
        >
          <Text style={styles.navText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.nextButton]}
          onPress={handleSave}
          disabled={uploading}
        >
          <Text style={styles.navText}>
            {uploading ? "Uploading..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      {uploading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#ff69b4" />
        </View>
      )}
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111827", padding: 20 },
  progress: { marginBottom: 20 },
  label: { color: "#ccc", marginBottom: 12, fontWeight: "600" },
  scrollRow: { marginBottom: 16 },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  profileSelected: { borderColor: "#ff69b4" },
  uploadButton: {
    backgroundColor: "#374151",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  uploadText: { color: "white", fontWeight: "600" },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  navButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 6,
  },
  backButton: { backgroundColor: "#374151" },
  nextButton: { backgroundColor: "#ff69b4" },
  navText: { color: "white", fontWeight: "700", fontSize: 16 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    elevation: 10,
  },
});
