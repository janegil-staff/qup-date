import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

import Screen from "../components/Screen";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const currentDate = new Date();
  const [birthYear, setBirthYear] = useState(
    String(currentDate.getFullYear() - 18)
  );
  const [birthMonth, setBirthMonth] = useState(
    String(currentDate.getMonth() + 1)
  ); // months are 0-based
  const [birthDay, setBirthDay] = useState(String(currentDate.getDate()));
  const [birthdate, setBirthdate] = useState(new Date());
  const [gender, setGender] = useState("");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [showDatePicker, setShowDatePicker] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isFormValid =
    name.trim() &&
    emailRegex.test(email) &&
    password.trim() &&
    gender.trim() &&
    birthdate;

  const validateForm = () => {
    const errors = {};
    if (!name) errors.name = "Name is required";
    if (!email) errors.email = "Email is required";
    else if (!emailRegex.test(email)) errors.email = "Email format is invalid";
    if (!password) errors.password = "Password is required";
    if (!gender) errors.gender = "Please select a gender";
    if (!birthdate) errors.birthdate = "Complete birthdate is required";
    return errors;
  };

  // ✅ Pick image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImages([...images, result.assets[0]]);
    }
  };

  // ✅ Remove image
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Clear old token so iPhone doesn't reuse previous session
    //  await SecureStore.deleteItemAsync("authToken");

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);

    try {
      let uploadedImages = [];

      // 🔹 Only upload images if user selected any
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((img, i) => {
          formData.append("images", {
            uri: img.uri,
            type: "image/jpeg",
            name: `upload_${i}.jpg`,
          });
        });

        const uploadRes = await fetch("https://qup.dating/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });

        if (!uploadRes.ok) {
          const errText = await uploadRes.text();
          console.error("Upload failed:", errText);
          alert("Image upload failed");
          return;
        }

        const uploadData = await uploadRes.json();
        uploadedImages = uploadData.images || [];
      }

      // 🔹 Register user (always send array)
      const res = await fetch("https://qup.dating/api/mobile/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          birthdate: birthdate.toISOString(),
          gender,
          images: uploadedImages || [],
        }),
      });

      if (!res.ok) {
        const errText = await res.json();
        if (errText.error === "duplicate") {
          alert("This email is already registered. Please log in instead.");
          return;
        }
        alert("Something went wrong. Please try again.", errText);
        return;
      }

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      // 🔹 Backend does NOT return token → do NOT auto-login
      alert(
        "Register success, you can log in to your profile."
      );

      // Force user to login manually (prevents wrong user session)
      navigation.navigate("LoginForm");
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Screen style={{ backgroundColor: "#111827" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Create Profile</Text>

        {/* Name */}
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#6b7280"
          value={name}
          onChangeText={setName}
        />
        {errors.email && <Text style={styles.errorText}>{errors.name}</Text>}
        {/* Email */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#6b7280"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        {/* Password */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#6b7280"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
        <Text style={styles.birthdate}>Birthdate</Text>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>{birthdate.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={birthdate}
            mode="date"
            textColor="white"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            maximumDate={new Date(new Date().getFullYear() - 18, 11, 31)}
            minimumDate={new Date(1900, 0, 1)}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setBirthdate(selectedDate);
            }}
          />
        )}

        {/* Gender */}
        <View style={styles.genderRow}>
          {["male", "female"].map((g) => (
            <TouchableOpacity
              key={g}
              style={[
                styles.genderButton,
                gender === g && styles.genderSelected,
              ]}
              onPress={() => setGender(g)}
            >
              <Text style={styles.genderText}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

        {/* Image uploader */}
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick Image</Text>
        </TouchableOpacity>

        {/* ✅ Preview with remove option */}
        <View style={styles.previewRow}>
          {images.map((img, i) => (
            <View key={i} style={styles.previewWrapper}>
              <Image source={{ uri: img.uri }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(i)}
              >
                <Text style={styles.removeText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            !isFormValid && styles.submitButtonDisabled,
          ]}
          disabled={isLoading}
          onPress={handleSubmit}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footer}>
          Already a member?{" "}
          <Text
            style={{ color: "#ff69b4" }}
            onPress={() => navigation.navigate("LoginForm")}
          >
            Log in here
          </Text>
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  dateButton: {
    backgroundColor: "#1f2937",
    padding: 14,
    borderRadius: 8,
    marginBottom: 15,
  },
  dateButtonText: {
    color: "white",
    fontSize: 16,
  },

  errorText: {
    color: "#f87171", // red
    fontSize: 12,
    marginBottom: 10,
  },
  birthdate: {
    color: "#ffffff",
    padding: 5,
  },
  submitButton: {
    backgroundColor: "#ff69b4",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#9ca3af", // ✅ greyed out when disabled
  },

  pickerWrapper: {
    flex: 1,
    backgroundColor: "#1f2937",
    borderRadius: 6,
    marginHorizontal: 4,
    height: 55, // ⭐ increased height
  },

  picker: {
    color: "white", // ✅ Android text color
    height: 40,
  },

  genderRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },

  genderButton: {
    flex: 1, // ✅ each button takes equal width
    backgroundColor: "#1f2937",
    paddingVertical: 12,
    marginHorizontal: 5, // spacing between buttons
    borderRadius: 8,
    alignItems: "center", // center text horizontally
  },

  genderSelected: {
    backgroundColor: "#2563eb",
  },

  genderText: {
    color: "white",
    fontWeight: "600",
    textTransform: "capitalize",
    textAlign: "center",
  },

  container: {
    flexGrow: 1,
    backgroundColor: "#111827",
    padding: 20,
    paddingBottom: 80, // gives breathing room at bottom
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ff69b4",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#1f2937",
    color: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25, // ⭐ more spacing
  },

  genderButton: {
    backgroundColor: "#1f2937",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  genderSelected: { backgroundColor: "#2563eb" },
  genderText: { color: "white" },
  uploadButton: {
    backgroundColor: "#374151",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    marginTop: 10, // ⭐ new
    alignItems: "center",
  },

  previewRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 15 },
  previewWrapper: { position: "relative", marginRight: 10, marginBottom: 10 },
  previewImage: { width: 80, height: 80, borderRadius: 8 },
  removeButton: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#ff69b4",
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  removeText: { color: "white", fontWeight: "bold", fontSize: 12 },
  submitButton: {
    backgroundColor: "#ff69b4",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "600" },
  footer: { marginTop: 20, textAlign: "center", color: "#ccc" },
});

const pickerSelectStyles = {
  inputIOS: {
    color: "white",
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
    fontSize: 16,
  },
  inputAndroid: {
    color: "white",
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
    fontSize: 16,
  },
  placeholder: {
    color: "#9ca3af",
  },
};
