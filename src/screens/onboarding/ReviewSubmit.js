import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

// 🔧 Upload images first
const uploadImages = async (selectedImages) => {
  const formData = new FormData();

  selectedImages.forEach((uri, index) => {
    formData.append("images", {
      uri,
      type: "image/jpeg", // adjust if needed
      name: `image-${index}.jpg`,
    });
  });

  const response = await fetch("https://qup.dating/api/mobile/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return data.images; // array of { url, public_id }
};

export default function ReviewSubmit({ navigation, route }) {
  const {
    name,
    email,
    password,
    gender,
    birthdate,
    location,
    occupation,
    education,
    religion,
    bodyType,
    appearance,
    smoking,
    drinking,
    hasChildren,
    wantsChildren,
    relationshipStatus,
    willingToRelocate,
    bio,
    lookingFor,
    preferredAgeMin,
    preferredAgeMax,
    images, // local URIs from ImagePicker
    profileImage, // optional
  } = route.params || {};
  const handleSubmit = async () => {
    try {
      // Step 1: Upload images to Cloudinary
      const uploadedImages = await uploadImages(images);

      const today = new Date();
      const eighteenYearsAgo = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );
      // Instead of FormData, build a plain JSON payload
      const payload = {
        name,
        email,
        password,
        gender: gender || "male",
        birthdate: birthdate || eighteenYearsAgo,
        location,
        occupation: occupation || null,
        education: education || null,
        religion: religion || null,
        bodyType: bodyType || null,
        appearance: appearance || null,
        // ✅ Only send enums if they exist
        smoking: smoking || undefined,
        drinking: drinking || undefined,
        // ✅ Send proper booleans
        hasChildren: !!hasChildren,
        wantsChildren: !!wantsChildren,
        willingToRelocate: !!willingToRelocate,
        relationshipStatus: relationshipStatus || null,
        bio: bio || null,
        lookingFor: lookingFor || null,
        preferredAge: [preferredAgeMin, preferredAgeMax],
        images: uploadedImages,
        profileImage: uploadedImages[0]?.url || "",
      };

      // Step 3: Send to register API
      const response = await fetch("https://qup.dating/api/mobile/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        navigation.replace("MainTabs", { user: data.user });
      }
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("LandingScreen")}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Review Your Information</Text>

      {/* Summary */}
      <View style={styles.summaryBox}>
        <Text style={styles.label}>
          Name: <Text style={styles.value}>{name}</Text>
        </Text>
        <Text style={styles.label}>
          Email: <Text style={styles.value}>{email}</Text>
        </Text>
        <Text style={styles.label}>
          Gender: <Text style={styles.value}>{gender}</Text>
        </Text>
        <Text style={styles.label}>
          Birthdate:{" "}
          <Text style={styles.value}>
            <Text style={styles.value}>{birthdate}</Text>
          </Text>
        </Text>

        <Text style={styles.label}>
          Occupation: <Text style={styles.value}>{occupation}</Text>
        </Text>
        <Text style={styles.label}>
          Education: <Text style={styles.value}>{education}</Text>
        </Text>
        <Text style={styles.label}>
          Religion: <Text style={styles.value}>{religion}</Text>
        </Text>
        <Text style={styles.label}>
          Body Type: <Text style={styles.value}>{bodyType}</Text>
        </Text>
        <Text style={styles.label}>
          Appearance: <Text style={styles.value}>{appearance}</Text>
        </Text>
        <Text style={styles.label}>
          Smoking: <Text style={styles.value}>{smoking}</Text>
        </Text>
        <Text style={styles.label}>
          Drinking: <Text style={styles.value}>{drinking}</Text>
        </Text>
        <Text style={styles.label}>
          Has Children: <Text style={styles.value}>{hasChildren}</Text>
        </Text>
        <Text style={styles.label}>
          Wants Children: <Text style={styles.value}>{wantsChildren}</Text>
        </Text>
        <Text style={styles.label}>
          Relationship Status:{" "}
          <Text style={styles.value}>{relationshipStatus}</Text>
        </Text>
        <Text style={styles.label}>
          Willing to Relocate:{" "}
          <Text style={styles.value}>{willingToRelocate}</Text>
        </Text>
        <Text style={styles.label}>
          Bio: <Text style={styles.value}>{bio}</Text>
        </Text>
        <Text style={styles.label}>
          Location: <Text style={styles.value}>{location.toString()}</Text>
        </Text>
        <Text style={styles.label}>
          Looking For: <Text style={styles.value}>{lookingFor}</Text>
        </Text>
        <Text style={styles.label}>
          Preferred Age Range:{" "}
          <Text style={styles.value}>
            `${preferredAgeMin} - ${preferredAgeMax}`
          </Text>
        </Text>
        <Text style={styles.label}>
          Images:{" "}
          <Text style={styles.value}>{images?.length || 0} uploaded</Text>
        </Text>
        <Text style={styles.label}>
          Profile Image:{" "}
          <Text style={styles.value}>{profileImage || "Not set"}</Text>
        </Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    position: "relative",
    padding: 20,
    alignItems: "center",
  },
  backText: {
    color: "#88C0D0",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  heading: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  summaryBox: {
    width: "100%",
    backgroundColor: "#1F2937",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  label: {
    color: "#9CA3AF",
    fontSize: 14,
    marginBottom: 6,
  },
  value: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#10b981",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
