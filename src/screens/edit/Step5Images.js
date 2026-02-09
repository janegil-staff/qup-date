import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Progress from "react-native-progress";
import GlassCard from "../../components/GlassCard";
import GlassButton from "../../components/GlassButton";
import theme from "../../theme";
import { fetchUser, saveProfile } from "../../utils/profileService";

export default function Step5Images({ form, setForm, setField, navigation }) {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const user = await fetchUser();
        setForm((prev) => ({
          ...prev,
          images: user.images || [],
        }));
      } catch (err) {
        console.error("Failed to load images", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photos to upload images."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 0.8,
        aspect: [4, 5],
      });

      if (!result.canceled && result.assets[0]) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (err) {
      console.error("Pick image error:", err);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const uploadImage = async (uri) => {
    try {
      setUploading(true);

      // Create FormData
      const formData = new FormData();
      formData.append("images", {
        uri,
        type: "image/jpeg",
        name: "photo.jpg",
      });

      // Upload to your backend
      const token = await SecureStore.getItemAsync("authToken");
      const response = await fetch("https://qup.dating/api/mobile/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      
      // Add uploaded image to form
      const newImages = [...(form.images || []), ...data.images];
      setField("images", newImages);

      Alert.alert("Success", "Image uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      Alert.alert("Error", "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const setAsProfilePicture = async (index) => {
    try {
      const selectedImage = form.images[index];
      
      // Reorder images so selected one is first
      const newImages = [
        selectedImage,
        ...form.images.filter((_, i) => i !== index)
      ];
      
      setField("images", newImages);
      
      // Update profile picture on backend
      const token = await SecureStore.getItemAsync("authToken");
      await fetch("https://qup.dating/api/mobile/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profileImage: selectedImage.url,
          images: newImages,
        }),
      });
      
      Alert.alert("Success", "Profile picture updated!");
    } catch (err) {
      console.error("Set profile picture error:", err);
      Alert.alert("Error", "Failed to set profile picture");
    }
  };

  const removeImage = (index) => {
    Alert.alert(
      "Remove Image",
      "Are you sure you want to remove this image?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            const newImages = form.images.filter((_, i) => i !== index);
            setField("images", newImages);
          },
        },
      ]
    );
  };

  const handleSaveAndFinish = async () => {
    try {
      if (form.images.length === 0) {
        Alert.alert(
          "No Images",
          "Please upload at least one image before finishing.",
          [{ text: "OK" }]
        );
        return;
      }

      setLoading(true);

      await saveProfile({
        images: form.images,
      });

      Alert.alert(
        "Profile Complete! 🎉",
        "Your profile is ready. Start finding matches!",
        [
          {
            text: "Let's Go!",
            onPress: () => navigation.navigate("Dashboard"),
          },
        ]
      );
    } catch (err) {
      console.error("Save error:", err);
      Alert.alert("Error", "Failed to save images");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading your photos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Photos 📸</Text>
          <Text style={styles.subtitle}>
            Upload {6 - form.images.length} more {form.images.length === 5 ? 'photo' : 'photos'}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Progress.Bar
            progress={1.0}
            width={null}
            height={6}
            color={theme.colors.primary}
            unfilledColor="rgba(255,255,255,0.1)"
            borderWidth={0}
            borderRadius={3}
          />
          <Text style={styles.progressText}>Final Step - Add Photos!</Text>
        </View>

        {/* Images Grid */}
        <GlassCard>
          <Text style={styles.instruction}>
            📷 Add at least 1 photo (up to 6 total)
          </Text>
          
          <View style={styles.imageGrid}>
            {/* Existing Images */}
            {form.images.map((img, index) => (
              <TouchableOpacity
                key={index}
                style={styles.imageContainer}
                onLongPress={() => {
                  if (index !== 0) {
                    Alert.alert(
                      "Set as Profile Picture",
                      "Make this your main profile photo?",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Set as Main",
                          onPress: () => setAsProfilePicture(index),
                        },
                      ]
                    );
                  }
                }}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: img.url || img.uri }}
                  style={styles.image}
                />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(index)}
                >
                  <LinearGradient
                    colors={['#ff4444', '#cc0000']}
                    style={styles.removeGradient}
                  >
                    <Ionicons name="close" size={18} color="white" />
                  </LinearGradient>
                </TouchableOpacity>
                {index === 0 && (
                  <View style={styles.primaryBadge}>
                    <Text style={styles.primaryText}>Profile Picture</Text>
                  </View>
                )}
                {index !== 0 && (
                  <TouchableOpacity
                    style={styles.setPrimaryButton}
                    onPress={() => setAsProfilePicture(index)}
                  >
                    <LinearGradient
                      colors={['rgba(233, 69, 96, 0.9)', 'rgba(255, 107, 157, 0.9)']}
                      style={styles.setPrimaryGradient}
                    >
                      <Ionicons name="star-outline" size={16} color="white" />
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}

            {/* Add Image Buttons */}
            {form.images.length < 6 &&
              Array.from({ length: 6 - form.images.length }).map((_, i) => (
                <TouchableOpacity
                  key={`add-${i}`}
                  style={styles.addImageButton}
                  onPress={pickImage}
                  disabled={uploading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={theme.gradients.glass}
                    style={styles.addImageGradient}
                  >
                    {uploading ? (
                      <ActivityIndicator color={theme.colors.primary} />
                    ) : (
                      <>
                        <Ionicons
                          name="add-circle-outline"
                          size={40}
                          color={theme.colors.primary}
                        />
                        <Text style={styles.addText}>Add Photo</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              ))}
          </View>

          <Text style={styles.hint}>
            💡 Tip: Tap the ⭐ button to set any photo as your profile picture
          </Text>
        </GlassCard>

        {/* Navigation Buttons */}
        <View style={styles.navRow}>
          <GlassButton
            title="← Back"
            variant="ghost"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />

          <GlassButton
            title={form.images.length === 0 ? "Skip for Now" : "Finish 🎉"}
            variant="primary"
            onPress={handleSaveAndFinish}
            style={styles.nextButton}
            disabled={loading}
          />
        </View>

        {/* Help Text */}
        <Text style={styles.helpText}>
          {form.images.length === 0
            ? "You can add photos now or skip and add them later"
            : `${form.images.length} of 6 photos uploaded`}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
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
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textMuted,
  },

  // Progress
  progressContainer: {
    marginBottom: 24,
  },
  progressText: {
    color: theme.colors.primary,
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
  },

  // Instructions
  instruction: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },

  // Image Grid
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  imageContainer: {
    width: '30.5%',
    aspectRatio: 0.8,
    position: 'relative',
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.backgroundDark,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 15,
    overflow: 'hidden',
  },
  removeGradient: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  setPrimaryButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    borderRadius: 15,
    overflow: 'hidden',
  },
  setPrimaryGradient: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: theme.colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  primaryText: {
    color: theme.colors.text,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Add Image Button
  addImageButton: {
    width: '30.5%',
    aspectRatio: 0.8,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  addImageGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 8,
    fontWeight: '600',
  },

  // Hint
  hint: {
    color: theme.colors.textDim,
    fontSize: 13,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Navigation
  navRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 16,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
  },

  // Help Text
  helpText: {
    color: theme.colors.textDim,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
