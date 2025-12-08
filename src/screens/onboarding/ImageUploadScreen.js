import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { navigateWithParams } from "../../utils/navigation";

export default function ImageUploadScreen({ navigation, route }) {
  const { gender, birthdate, name, email, password } = route.params; // carry data forward
  const [images, setImages] = useState([]); // up to 6
  const [profileImage, setProfileImage] = useState(null);

  const pickImage = async () => {
    if (images.length >= 6) return; // limit to 6
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handleNext = () => {
    navigateWithParams(navigation, "ReviewSubmit", route, {
      images,
      profileImage,
    });
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("LandingScreen")}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <View style={styles.contentBlock}>
        <Text style={styles.heading}>Upload up to 6 Photos</Text>

        <View style={styles.imageGrid}>
          {images.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.imageBox,
                profileImage === item && styles.profileSelected,
              ]}
              onPress={() => setProfileImage(item)}
            >
              <Image source={{ uri: item }} style={styles.preview} />
              {profileImage === item && (
                <Text style={styles.profileLabel}>Profile</Text>
              )}
            </TouchableOpacity>
          ))}

          {images.length < 6 && (
            <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
              <Text style={styles.uploadText}>+</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    justifyContent: "center", // centers the block vertically
    alignItems: "center", // centers the block horizontally
    padding: 20,
  },
  contentBlock: {
    alignItems: "center", // centers children horizontally
  },
  heading: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 30,
  },
  imageBox: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#374151",
    backgroundColor: "#1F2937",
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
    position: "relative",
  },
  preview: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  uploadText: {
    color: "#9CA3AF",
    fontSize: 32,
    fontWeight: "700",
  },
  profileSelected: {
    borderColor: "#10b981",
  },
  profileLabel: {
    position: "absolute",
    bottom: 4,
    left: 4,
    backgroundColor: "#10b981",
    color: "#111827",
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  nextButton: {
    backgroundColor: "#10b981",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
  },
  nextButtonDisabled: {
    backgroundColor: "#6B7280",
  },
  nextText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  backText: {
    color: "#88C0D0",
    fontSize: 16,
    fontWeight: "600",
  },
});
