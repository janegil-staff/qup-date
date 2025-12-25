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
} from "react-native";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";

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
  const [gender, setGender] = useState("");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isFormValid =
    name.trim() &&
    emailRegex.test(email) &&
    password.trim() &&
    gender.trim() &&
    birthDay &&
    birthMonth &&
    birthYear;

  const validateForm = () => {
    const errors = {};
    if (!name) errors.name = "Name is required";
    if (!email) errors.email = "Email is required";
    else if (!emailRegex.test(email)) errors.email = "Email format is invalid";
    if (!password) errors.password = "Password is required";
    if (!gender) errors.gender = "Please select a gender";
    if (!birthDay || !birthMonth || !birthYear)
      errors.birthdate = "Complete birthdate is required";
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

  // ✅ Submit registration
  const handleSubmit = async (e) => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors); // ✅ show hints
      return; // stop submission
    }
    setIsLoading(true);

    try {
      // 1. Upload images
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
        body: formData, // ⚠️ don't set Content-Type manually
      });

      if (!uploadRes.ok) {
        const errText = await uploadRes.text();
        console.error("Upload failed:", errText);
        alert("Image upload failed");
        return;
      }

      const { images: uploadedImages } = await uploadRes.json();

      // 2. Register user
      const res = await fetch("https://qup.dating/api/mobile/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ✅ set header
        },
        body: JSON.stringify({
          name,
          email,
          password,
          birthDay,
          birthMonth,
          birthYear,
          gender,
          images: uploadedImages,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Register failed:", errText);
        alert("Registration failed");
        return;
      }

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      // 3. Save token locally
      if (data.token) {
        await SecureStore.setItemAsync("authToken", data.token);
      }

      alert("Please check your email to verify your profile.");
      navigation.navigate("MainTabs", { screen: "Edit" });
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
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
      {errors.email && <Text style={styles.errorText}>{errors.password}</Text>}
      <Text style={styles.birthdate}>Birthdate</Text>
      <View style={styles.row}>
        {/* Day */}
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={birthDay}
            onValueChange={(val) => setBirthDay(val)}
            style={styles.picker}
            itemStyle={{ color: "white" }}
            dropdownIconColor="white"
          >
            <Picker.Item label="Day" value="" color="white" />
            {[...Array(31)].map((_, i) => (
              <Picker.Item
                key={i + 1}
                label={`${i + 1}`}
                value={`${i + 1}`}
                color="white"
              />
            ))}
          </Picker>
        </View>

        {/* Month */}
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={birthMonth}
            onValueChange={(val) => setBirthMonth(val)}
            style={styles.picker}
            itemStyle={{ color: "white" }}
            dropdownIconColor="white"
          >
            <Picker.Item label="Month" value="" />
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((month, i) => (
              <Picker.Item
                key={month}
                label={month}
                value={`${i + 1}`}
                color="white"
              />
            ))}
          </Picker>
        </View>

        {/* Year */}

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={birthYear}
            onValueChange={(val) => setBirthYear(val)}
            style={styles.picker}
            dropdownIconColor="white"
            itemStyle={{ color: "white" }} // iOS text color
          >
            <Picker.Item label="Year" value="" color="white" />
            {[...Array(100)].map((_, i) => {
              const currentYear = new Date().getFullYear();
              const maxYear = currentYear - 18; // ✅ must be at least 18
              const year = maxYear - i; // go backwards
              if (year < 1900) return null; // optional cutoff
              return (
                <Picker.Item
                  key={year}
                  label={`${year}`}
                  value={`${year}`}
                  color="white"
                />
              );
            })}
          </Picker>
        </View>
      </View>

      {/* Gender */}
      <View style={styles.genderRow}>
        {["male", "female", "other"].map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.genderButton, gender === g && styles.genderSelected]}
            onPress={() => setGender(g)}
          >
            <Text style={styles.genderText}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.email && <Text style={styles.errorText}>{errors.gender}</Text>}

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
          onPress={() => navigation.navigate("LoginScreen")}
        >
          Log in here
        </Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    marginTop: 150,
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
