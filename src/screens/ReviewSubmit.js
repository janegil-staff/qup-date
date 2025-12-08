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

  const response = await fetch("http://localhost:3000/api/upload", {
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

      // Step 2: Build registration payload
      const birthDateObj = birthdate ? new Date(birthdate) : null;
      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("gender", gender);

      formData.append(
        "birthDay",
        birthDateObj ? birthDateObj.getDate().toString() : ""
      );
      formData.append(
        "birthMonth",
        birthDateObj ? (birthDateObj.getMonth() + 1).toString() : ""
      );
      formData.append(
        "birthYear",
        birthDateObj ? birthDateObj.getFullYear().toString() : ""
      );

      formData.append("location", JSON.stringify(location));
      formData.append("occupation", occupation || "");
      formData.append("education", education || "");
      formData.append("religion", religion || "");
      formData.append("bodyType", bodyType || "");
      formData.append("appearance", appearance || "");
      formData.append("smoking", smoking || "");
      formData.append("drinking", drinking || "");
      formData.append("hasChildren", hasChildren || "");
      formData.append("wantsChildren", wantsChildren || "");
      formData.append("relationshipStatus", relationshipStatus || "");
      formData.append("willingToRelocate", willingToRelocate || "");
      formData.append("bio", bio || "");
      formData.append("lookingFor", lookingFor || "");
      formData.append(
        "preferredAge",
        JSON.stringify([preferredAgeMin, preferredAgeMax])
      );

      // Use Cloudinary URLs
      formData.append("images", JSON.stringify(uploadedImages));
      formData.append("profileImage", uploadedImages[0]?.url || "");

      // Step 3: Send to register API
      const response = await fetch("http://localhost:3000/api/mobile", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Registration response:", data);

      if (response.ok) {
        navigation.replace("ProfileScreen", { user: data.user });
      }
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
            Birthdate: <Text style={styles.value}>{birthdate}</Text>
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
    flexGrow: 1,
    backgroundColor: "#111827",
    padding: 20,
    alignItems: "center",
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
