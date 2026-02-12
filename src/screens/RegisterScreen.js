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
  Alert,
  Modal,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

import Screen from "../components/Screen";

const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Marketing',
  'Sales',
  'Engineering',
  'Law',
  'Consulting',
  'Real Estate',
  'Media',
  'Other',
];

const EDUCATION_LEVELS = [
  'High School',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'MBA',
  'PhD',
  'Professional Degree (MD, JD, etc)',
];

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const currentDate = new Date();
  const [birthYear, setBirthYear] = useState(
    String(currentDate.getFullYear() - 18),
  );
  const [birthMonth, setBirthMonth] = useState(
    String(currentDate.getMonth() + 1),
  );
  const [birthDay, setBirthDay] = useState(String(currentDate.getDate()));
  const [birthdate, setBirthdate] = useState(new Date());
  const [gender, setGender] = useState("");
  
  // ⭐ NEW PROFESSIONAL FIELDS
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [showIndustryPicker, setShowIndustryPicker] = useState(false);
  const [showEducationPicker, setShowEducationPicker] = useState(false);
  
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreed, setAgreed] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isFormValid =
    name.trim() &&
    emailRegex.test(email) &&
    password.trim() &&
    gender.trim() &&
    jobTitle.trim() &&
    company.trim() &&
    industry.trim() &&
    educationLevel.trim() &&
    birthdate;

  const validateForm = () => {
    const errors = {};
    if (!name) errors.name = "Name is required";
    if (!email) errors.email = "Email is required";
    else if (!emailRegex.test(email)) errors.email = "Email format is invalid";
    if (!password) errors.password = "Password is required";
    if (!gender) errors.gender = "Please select a gender";
    if (!birthdate) errors.birthdate = "Complete birthdate is required";
    
    // ⭐ PROFESSIONAL VALIDATIONS
    if (!jobTitle) errors.jobTitle = "Job title is required";
    if (!company) errors.company = "Company is required";
    if (!industry) errors.industry = "Industry is required";
    if (!educationLevel) errors.educationLevel = "Education level is required";
    
    return errors;
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImages([...images, result.assets[0]]);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      Alert.alert('Missing Information', 'Please fill in all required professional fields');
      return;
    }
    if (!agreed) {
      Alert.alert("Terms Required", "You must agree to continue.");
      return;
    }

    setIsLoading(true);

    try {
      let uploadedImages = [];

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

      // ⭐ REGISTER WITH PROFESSIONAL FIELDS
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
          jobTitle,        // ⭐ NEW
          company,         // ⭐ NEW
          industry,        // ⭐ NEW
          educationLevel,  // ⭐ NEW
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

      alert("Register success, you can log in to your profile.");
      navigation.navigate("LoginForm");
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen style={{ backgroundColor: "#111827" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Create Professional Profile</Text>
        <Text style={styles.subtitle}>Join Norway's premier dating platform for professionals</Text>

        {/* Name */}
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#6b7280"
          value={name}
          onChangeText={setName}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

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
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        {/* Birthdate */}
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

        {/* ⭐ PROFESSIONAL SECTION */}
        <View style={styles.professionalSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="briefcase" size={24} color="#ff69b4" />
            <Text style={styles.sectionTitle}>Professional Information</Text>
          </View>

          {/* Job Title */}
          <View style={styles.inputWithIcon}>
            <Ionicons name="briefcase-outline" size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.inputWithPadding]}
              placeholder="Job Title (e.g. Senior Software Engineer)"
              placeholderTextColor="#6b7280"
              value={jobTitle}
              onChangeText={setJobTitle}
            />
          </View>
          {errors.jobTitle && <Text style={styles.errorText}>{errors.jobTitle}</Text>}

          {/* Company */}
          <View style={styles.inputWithIcon}>
            <Ionicons name="business-outline" size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.inputWithPadding]}
              placeholder="Company (e.g. Google, Microsoft)"
              placeholderTextColor="#6b7280"
              value={company}
              onChangeText={setCompany}
            />
          </View>
          {errors.company && <Text style={styles.errorText}>{errors.company}</Text>}

          {/* Industry Picker */}
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowIndustryPicker(true)}
          >
            <Ionicons name="globe-outline" size={20} color="#6b7280" />
            <Text style={[styles.selectText, !industry && styles.placeholder]}>
              {industry || 'Select Industry'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#6b7280" />
          </TouchableOpacity>
          {errors.industry && <Text style={styles.errorText}>{errors.industry}</Text>}

          {/* Education Picker */}
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowEducationPicker(true)}
          >
            <Ionicons name="school-outline" size={20} color="#6b7280" />
            <Text style={[styles.selectText, !educationLevel && styles.placeholder]}>
              {educationLevel || 'Select Education Level'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#6b7280" />
          </TouchableOpacity>
          {errors.educationLevel && <Text style={styles.errorText}>{errors.educationLevel}</Text>}

          {/* Verification Info */}
          <View style={styles.verificationInfo}>
            <Ionicons name="shield-checkmark" size={20} color="#ff69b4" />
            <Text style={styles.verificationText}>
              We verify all professional information to ensure quality matches
            </Text>
          </View>
        </View>

        {/* Image uploader */}
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick Image</Text>
        </TouchableOpacity>

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

        {/* Terms Agreement */}
        <View style={{ marginVertical: 20 }}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => setAgreed(!agreed)}
          >
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 4,
                borderWidth: 2,
                borderColor: agreed ? "#ff69b4" : "#6b7280",
                backgroundColor: agreed ? "#ff69b4" : "transparent",
                marginRight: 10,
              }}
            />
            <Text style={{ color: "#d1d5db", flex: 1 }}>
              I agree to the{" "}
              <Text
                style={{ color: "#ff69b4" }}
                onPress={() => navigation.navigate("TermsSafety")}
              >
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text
                style={{ color: "#ff69b4" }}
                onPress={() => navigation.navigate("TermsSafety")}
              >
                Privacy Policy
              </Text>
              . QUP Professional is for serious, career-focused dating only.
            </Text>
          </TouchableOpacity>

          {!agreed && (
            <Text style={{ color: "#f87171", marginTop: 6 }}>
              You must agree before creating an account.
            </Text>
          )}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            !isFormValid && styles.submitButtonDisabled,
          ]}
          disabled={isLoading || !isFormValid}
          onPress={handleSubmit}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Professional Profile</Text>
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

      {/* Industry Picker Modal */}
      <Modal
        visible={showIndustryPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowIndustryPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Industry</Text>
              <TouchableOpacity onPress={() => setShowIndustryPicker(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {INDUSTRIES.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.option}
                  onPress={() => {
                    setIndustry(item);
                    setShowIndustryPicker(false);
                  }}
                >
                  <Text style={styles.optionText}>{item}</Text>
                  {industry === item && (
                    <Ionicons name="checkmark" size={24} color="#ff69b4" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Education Picker Modal */}
      <Modal
        visible={showEducationPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEducationPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Education Level</Text>
              <TouchableOpacity onPress={() => setShowEducationPicker(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {EDUCATION_LEVELS.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.option}
                  onPress={() => {
                    setEducationLevel(item);
                    setShowEducationPicker(false);
                  }}
                >
                  <Text style={styles.optionText}>{item}</Text>
                  {educationLevel === item && (
                    <Ionicons name="checkmark" size={24} color="#ff69b4" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#111827",
    padding: 20,
    paddingBottom: 80,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ff69b4",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 20,
  },
  
  // Professional Section
  professionalSection: {
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#1f2937",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  inputWithPadding: {
    flex: 1,
    paddingLeft: 0,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#1f2937",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  selectText: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    marginLeft: 12,
  },
  placeholder: {
    color: '#6b7280',
  },
  verificationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 105, 180, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  verificationText: {
    flex: 1,
    color: '#d1d5db',
    fontSize: 12,
    marginLeft: 8,
    lineHeight: 18,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1f2937',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
  },

  // Existing styles...
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
    color: "#f87171",
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
    backgroundColor: "#9ca3af",
  },
  genderRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  genderButton: {
    flex: 1,
    backgroundColor: "#1f2937",
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
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
  input: {
    backgroundColor: "#1f2937",
    color: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  uploadButton: {
    backgroundColor: "#374151",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    marginTop: 10,
    alignItems: "center",
  },
  previewRow: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    marginBottom: 15 
  },
  previewWrapper: { 
    position: "relative", 
    marginRight: 10, 
    marginBottom: 10 
  },
  previewImage: { 
    width: 80, 
    height: 80, 
    borderRadius: 8 
  },
  removeButton: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#ff69b4",
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  removeText: { 
    color: "white", 
    fontWeight: "bold", 
    fontSize: 12 
  },
  buttonText: { 
    color: "white", 
    fontWeight: "600" 
  },
  footer: { 
    marginTop: 20, 
    textAlign: "center", 
    color: "#ccc" 
  },
});
