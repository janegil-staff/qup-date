import React, { useState, useRef } from "react";
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
  Animated,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Screen from "../components/Screen";

const { width } = Dimensions.get("window");
const TOTAL_STEPS = 4;

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing",
  "Sales",
  "Engineering",
  "Law",
  "Consulting",
  "Real Estate",
  "Media",
  "Other",
];

const EDUCATION_LEVELS = [
  "High School",
  "Bachelor's Degree",
  "Master's Degree",
  "MBA",
  "PhD",
  "Professional Degree (MD, JD, etc)",
];

function InputField({
  icon,
  placeholder,
  value,
  onChangeText,
  error,
  rightIcon,
  ...props
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <View style={[styles.inputField, error && styles.inputFieldError]}>
        <Ionicons
          name={icon}
          size={20}
          color="#888"
          style={{ marginRight: 10 }}
        />
        <TextInput
          style={styles.inputText}
          placeholder={placeholder}
          placeholderTextColor="#555"
          value={value}
          onChangeText={onChangeText}
          {...props}
        />
        {rightIcon}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

function PickerModal({ visible, title, options, selected, onSelect, onClose }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={28} color="#555" />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.modalOption,
                  selected === item && styles.modalOptionActive,
                ]}
                onPress={() => onSelect(item)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    selected === item && styles.modalOptionTextActive,
                  ]}
                >
                  {item}
                </Text>
                {selected === item && (
                  <Ionicons name="checkmark-circle" size={22} color="#e94560" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function RegisterScreen({ navigation, route }) {
  const linkedinData = route?.params?.linkedinData || null;
  const googleData = route?.params?.googleData || null;
  const appleData = route?.params?.appleData || null;

  const isSocialSignup = !!(linkedinData || googleData || appleData);
  const socialProvider = linkedinData
    ? "linkedin"
    : googleData
      ? "google"
      : appleData
        ? "apple"
        : null;

  // Get pre-filled data from whichever provider
  const prefillName =
    linkedinData?.name || googleData?.name || appleData?.name || "";
  const prefillEmail =
    linkedinData?.email || googleData?.email || appleData?.email || "";

  const [currentStep, setCurrentStep] = useState(1);
  const progressAnim = useRef(new Animated.Value(1)).current;

  const [name, setName] = useState(prefillName);
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const twentyYearsAgo = new Date();
  twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() - 20);
  const [birthdate, setBirthdate] = useState(twentyYearsAgo);
  const [gender, setGender] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [occupation, setOccupation] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [education, setEducation] = useState("");
  const [showIndustryPicker, setShowIndustryPicker] = useState(false);
  const [showEducationPicker, setShowEducationPicker] = useState(false);

  const [images, setImages] = useState([]);
  const [bio, setBio] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const animateProgress = (step) => {
    Animated.spring(progressAnim, {
      toValue: step,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();
  };

  const goToStep = (step) => {
    setCurrentStep(step);
    animateProgress(step);
  };
  const handleBack = () => {
    if (currentStep > 1) goToStep(currentStep - 1);
  };

  const validateStep = (step) => {
    const e = {};
    if (step === 1) {
      if (!name.trim()) e.name = "Name is required";
      if (!isSocialSignup) {
        if (!email.trim()) e.email = "Email is required";
        else if (!emailRegex.test(email)) e.email = "Invalid email format";
        if (!password) e.password = "Password is required";
        else if (password.length < 6) e.password = "Minimum 6 characters";
        if (password !== confirmPassword)
          e.confirmPassword = "Passwords don't match";
      }
    }
    if (step === 2) {
      if (!gender) e.gender = "Please select your gender";
      const age = new Date().getFullYear() - birthdate.getFullYear();
      if (age < 18) e.birthdate = "You must be at least 18 years old";
      if (age > 100) e.birthdate = "Please enter a valid birthdate";
    }
    if (step === 3) {
      if (!occupation.trim()) e.occupation = "Job title is required";
      if (!company.trim()) e.company = "Company is required";
      if (!industry) e.industry = "Please select an industry";
      if (!education) e.education = "Please select education level";
    }
    if (step === 4) {
      if (!agreed) e.agreed = "You must agree to the terms";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) goToStep(currentStep + 1);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsMultipleSelection: true,
    });
    if (!result.canceled) setImages([...images, ...result.assets].slice(0, 6));
  };

  const removeImage = (index) =>
    setImages(images.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
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
          headers: { "Content-Type": "multipart/form-data" },
          body: formData,
        });
        if (!uploadRes.ok) {
          Alert.alert("Error", "Image upload failed.");
          return;
        }
        const uploadData = await uploadRes.json();
        uploadedImages = uploadData.images || [];
      }

      // ── Shared registration payload ──
      const sharedPayload = {
        name,
        gender,
        birthdate: birthdate.toISOString(),
        occupation,
        company,
        industry,
        education,
        bio,
        images: uploadedImages,
      };

      let res;

      if (linkedinData) {
        // ── LinkedIn registration ──
        res = await fetch("https://qup.dating/api/mobile/linkedin/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...sharedPayload,
            linkedinId: linkedinData.linkedinId,
            linkedinName: linkedinData.name,
            linkedinEmail: linkedinData.email,
            linkedinPicture: linkedinData.picture,
            linkedinGivenName: linkedinData.givenName,
            linkedinFamilyName: linkedinData.familyName,
          }),
        });
      } else if (googleData) {
        // ── Google registration ──
        res = await fetch("https://qup.dating/api/mobile/google/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...sharedPayload,
            googleId: googleData.googleId,
            email: googleData.email,
            picture: googleData.picture,
          }),
        });
      } else if (appleData) {
        // ── Apple registration ──
        res = await fetch("https://qup.dating/api/mobile/apple/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...sharedPayload,
            appleUserId: appleData.appleUserId,
            email: appleData.email,
          }),
        });
      } else {
        // ── Email/password registration ──
        res = await fetch("https://qup.dating/api/mobile/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...sharedPayload,
            email,
            password,
          }),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        Alert.alert(
          "Error",
          data.error === "duplicate"
            ? "Email already registered."
            : data.error || "Something went wrong.",
        );
        return;
      }

      // Social sign-ups get logged in immediately
      if (isSocialSignup) {
        await SecureStore.setItemAsync("authToken", data.token);
        await SecureStore.setItemAsync("userId", data.user._id);
        await SecureStore.setItemAsync("userEmail", data.user.email);
        navigation.navigate("MainTabs", { screen: "Dashboard" });
      } else {
        Alert.alert("Welcome to QUP!", "Account created. Please log in.", [
          { text: "Log In", onPress: () => navigation.navigate("LoginForm") },
        ]);
      }
    } catch (err) {
      console.error("Registration failed:", err);
      Alert.alert("Error", "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [1, TOTAL_STEPS],
    outputRange: ["25%", "100%"],
  });

  const stepTitles = ["Account", "Personal", "Professional", "Finish"];
  const stepIcons = ["person", "heart", "briefcase", "camera"];

  // ── Banner config for social providers ──
  const socialBanner = {
    linkedin: {
      icon: <FontAwesome name="linkedin-square" size={20} color="#0A66C2" />,
      label: "Signing up with LinkedIn",
      color: "rgba(10,102,194,0.12)",
      border: "rgba(10,102,194,0.25)",
    },
    google: {
      icon: <FontAwesome name="google" size={20} color="#4285F4" />,
      label: "Signing up with Google",
      color: "rgba(66,133,244,0.12)",
      border: "rgba(66,133,244,0.25)",
    },
    apple: {
      icon: <Ionicons name="logo-apple" size={20} color="#fff" />,
      label: "Signing up with Apple",
      color: "rgba(255,255,255,0.08)",
      border: "rgba(255,255,255,0.15)",
    },
  };

  return (
    <Screen style={{ backgroundColor: "#0f0f23" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            {currentStep > 1 ? (
              <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backBtn}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            )}
            <Text style={styles.headerTitle}>
              Step {currentStep} of {TOTAL_STEPS}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.stepIndicators}>
            {stepTitles.map((title, i) => {
              const step = i + 1;
              const isActive = step === currentStep;
              const isDone = step < currentStep;
              return (
                <View key={i} style={styles.stepIndicator}>
                  <View
                    style={[
                      styles.stepDot,
                      isActive && styles.stepDotActive,
                      isDone && styles.stepDotDone,
                    ]}
                  >
                    {isDone ? (
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    ) : (
                      <Ionicons
                        name={stepIcons[i]}
                        size={14}
                        color={isActive ? "#fff" : "#555"}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      isActive && styles.stepLabelActive,
                      isDone && styles.stepLabelDone,
                    ]}
                  >
                    {title}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.progressBar}>
            <Animated.View
              style={[styles.progressFill, { width: progressWidth }]}
            >
              <LinearGradient
                colors={["#e94560", "#ff6b9d"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
              />
            </Animated.View>
          </View>
        </View>

        {/* ── CONTENT ── */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Social provider banner */}
          {isSocialSignup &&
            currentStep === 1 &&
            socialBanner[socialProvider] && (
              <View
                style={[
                  styles.socialBanner,
                  {
                    backgroundColor: socialBanner[socialProvider].color,
                    borderColor: socialBanner[socialProvider].border,
                  },
                ]}
              >
                {socialBanner[socialProvider].icon}
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.bannerTitle}>
                    {socialBanner[socialProvider].label}
                  </Text>
                  <Text style={styles.bannerSub}>{prefillEmail}</Text>
                </View>
                <Ionicons name="checkmark-circle" size={22} color="#00D9A8" />
              </View>
            )}

          {/* ── STEP 1 ── */}
          {currentStep === 1 && (
            <View>
              <Text style={styles.stepTitle}>Create Your Account</Text>
              <Text style={styles.stepSub}>
                {isSocialSignup
                  ? "Confirm your name to get started"
                  : "Enter your details to get started"}
              </Text>

              {!isSocialSignup && (
                <>
                  <View style={styles.socialRow}>
                    <TouchableOpacity
                      style={styles.socialIconBtn}
                      onPress={() => navigation.navigate("LoginForm")}
                      activeOpacity={0.8}
                    >
                      <FontAwesome
                        name="linkedin-square"
                        size={24}
                        color="#0A66C2"
                      />
                    </TouchableOpacity>

                    {Platform.OS === "ios" && (
                      <TouchableOpacity
                        style={styles.socialIconBtn}
                        onPress={() => navigation.navigate("LoginForm")}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="logo-apple" size={24} color="#fff" />
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={styles.socialIconBtn}
                      onPress={() => navigation.navigate("LoginForm")}
                      activeOpacity={0.8}
                    >
                      <FontAwesome name="google" size={22} color="#4285F4" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>
                      or register with email
                    </Text>
                    <View style={styles.dividerLine} />
                  </View>
                </>
              )}

              <InputField
                icon="person-outline"
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                error={errors.name}
                autoCapitalize="words"
              />

              {!isSocialSignup && (
                <>
                  <InputField
                    icon="mail-outline"
                    placeholder="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    error={errors.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <InputField
                    icon="lock-closed-outline"
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    error={errors.password}
                    secureTextEntry={!showPassword}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Ionicons
                          name={
                            showPassword ? "eye-off-outline" : "eye-outline"
                          }
                          size={20}
                          color="#666"
                        />
                      </TouchableOpacity>
                    }
                  />
                  <InputField
                    icon="lock-closed-outline"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    error={errors.confirmPassword}
                    secureTextEntry={!showPassword}
                  />
                  {password.length > 0 && (
                    <View style={styles.strengthRow}>
                      <View style={styles.strengthBars}>
                        <View
                          style={[
                            styles.bar,
                            {
                              backgroundColor:
                                password.length >= 6 ? "#00D9A8" : "#333",
                            },
                          ]}
                        />
                        <View
                          style={[
                            styles.bar,
                            {
                              backgroundColor:
                                password.length >= 8 ? "#00D9A8" : "#333",
                            },
                          ]}
                        />
                        <View
                          style={[
                            styles.bar,
                            {
                              backgroundColor:
                                password.length >= 10 &&
                                /[!@#$%]/.test(password)
                                  ? "#00D9A8"
                                  : "#333",
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.strengthLabel}>
                        {password.length < 6
                          ? "Too short"
                          : password.length < 8
                            ? "Fair"
                            : password.length >= 10 && /[!@#$%]/.test(password)
                              ? "Strong"
                              : "Good"}
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>
          )}

          {/* ── STEP 2 ── */}
          {currentStep === 2 && (
            <View>
              <Text style={styles.stepTitle}>About You</Text>
              <Text style={styles.stepSub}>Tell us a bit about yourself</Text>

              <Text style={styles.fieldLabel}>I am</Text>
              <View style={styles.genderRow}>
                {[
                  { value: "male", icon: "male", label: "Male" },
                  { value: "female", icon: "female", label: "Female" },
                ].map((g) => (
                  <TouchableOpacity
                    key={g.value}
                    style={[
                      styles.genderCard,
                      gender === g.value && styles.genderActive,
                    ]}
                    onPress={() => setGender(g.value)}
                    activeOpacity={0.8}
                  >
                    {gender === g.value && (
                      <LinearGradient
                        colors={["rgba(233,69,96,0.2)", "rgba(233,69,96,0.05)"]}
                        style={StyleSheet.absoluteFill}
                      />
                    )}
                    <Ionicons
                      name={g.icon}
                      size={32}
                      color={gender === g.value ? "#e94560" : "#555"}
                    />
                    <Text
                      style={[
                        styles.genderLabel,
                        gender === g.value && { color: "#e94560" },
                      ]}
                    >
                      {g.label}
                    </Text>
                    {gender === g.value && (
                      <View style={styles.genderCheck}>
                        <Ionicons name="checkmark" size={14} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              {errors.gender && (
                <Text style={styles.errorText}>{errors.gender}</Text>
              )}

              <Text style={styles.fieldLabel}>Date of Birth</Text>
              <TouchableOpacity
                style={styles.dateBtn}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="calendar-outline" size={20} color="#888" />
                <Text style={styles.dateBtnText}>
                  {birthdate.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#888" />
              </TouchableOpacity>
              {errors.birthdate && (
                <Text style={styles.errorText}>{errors.birthdate}</Text>
              )}
              {showDatePicker && (
                <DateTimePicker
                  value={birthdate}
                  mode="date"
                  textColor="white"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  maximumDate={new Date(new Date().getFullYear() - 18, 11, 31)}
                  minimumDate={new Date(1900, 0, 1)}
                  onChange={(e, d) => {
                    setShowDatePicker(false);
                    if (d) setBirthdate(d);
                  }}
                />
              )}

              <View style={styles.infoCard}>
                <Ionicons name="information-circle" size={18} color="#e94560" />
                <Text style={styles.infoText}>
                  You must be at least 18 years old to use QUP
                </Text>
              </View>
            </View>
          )}

          {/* ── STEP 3 ── */}
          {currentStep === 3 && (
            <View>
              <Text style={styles.stepTitle}>Your Career</Text>
              <Text style={styles.stepSub}>
                Help us match you with like-minded professionals
              </Text>

              <InputField
                icon="briefcase-outline"
                placeholder="Job Title (e.g. Software Engineer)"
                value={occupation}
                onChangeText={setOccupation}
                error={errors.occupation}
              />
              <InputField
                icon="business-outline"
                placeholder="Company (e.g. Google)"
                value={company}
                onChangeText={setCompany}
                error={errors.company}
              />

              <TouchableOpacity
                style={[
                  styles.selectField,
                  errors.industry && styles.selectError,
                ]}
                onPress={() => setShowIndustryPicker(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="globe-outline" size={20} color="#888" />
                <Text
                  style={[styles.selectText, !industry && { color: "#555" }]}
                >
                  {industry || "Select Industry"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#888" />
              </TouchableOpacity>
              {errors.industry && (
                <Text style={styles.errorText}>{errors.industry}</Text>
              )}

              <TouchableOpacity
                style={[
                  styles.selectField,
                  errors.education && styles.selectError,
                ]}
                onPress={() => setShowEducationPicker(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="school-outline" size={20} color="#888" />
                <Text
                  style={[styles.selectText, !education && { color: "#555" }]}
                >
                  {education || "Select Education Level"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#888" />
              </TouchableOpacity>
              {errors.education && (
                <Text style={styles.errorText}>{errors.education}</Text>
              )}

              <View style={styles.infoCard}>
                <Ionicons name="shield-checkmark" size={18} color="#00D9A8" />
                <Text style={styles.infoText}>
                  You can verify with LinkedIn later for a trust badge
                </Text>
              </View>
            </View>
          )}

          {/* ── STEP 4 ── */}
          {currentStep === 4 && (
            <View>
              <Text style={styles.stepTitle}>Final Touches</Text>
              <Text style={styles.stepSub}>
                Add photos and a bio to stand out
              </Text>

              <Text style={styles.fieldLabel}>Photos (optional)</Text>
              <View style={styles.photoGrid}>
                {images.map((img, i) => (
                  <View key={i} style={styles.photoItem}>
                    <Image source={{ uri: img.uri }} style={styles.photoImg} />
                    <TouchableOpacity
                      style={styles.photoX}
                      onPress={() => removeImage(i)}
                    >
                      <Ionicons name="close" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
                {images.length < 6 && (
                  <TouchableOpacity
                    style={styles.photoAdd}
                    onPress={pickImage}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="add" size={32} color="#e94560" />
                    <Text style={styles.photoAddLabel}>Add Photo</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.fieldLabel}>Bio (optional)</Text>
              <View style={styles.bioBox}>
                <TextInput
                  style={styles.bioInput}
                  placeholder="Tell potential matches about yourself..."
                  placeholderTextColor="#555"
                  value={bio}
                  onChangeText={(t) => setBio(t.slice(0, 300))}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <Text style={styles.bioCount}>{bio.length}/300</Text>
              </View>

              <TouchableOpacity
                style={styles.termsRow}
                onPress={() => setAgreed(!agreed)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, agreed && styles.checkboxOn]}>
                  {agreed && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <Text style={styles.termsText}>
                  I agree to the{" "}
                  <Text
                    style={styles.termsLink}
                    onPress={() => navigation.navigate("TermsSafety")}
                  >
                    Terms of Service
                  </Text>{" "}
                  and{" "}
                  <Text
                    style={styles.termsLink}
                    onPress={() => navigation.navigate("TermsSafety")}
                  >
                    Privacy Policy
                  </Text>
                </Text>
              </TouchableOpacity>
              {errors.agreed && (
                <Text style={styles.errorText}>{errors.agreed}</Text>
              )}
            </View>
          )}

          {/* ── NAV BUTTONS ── */}
          <View style={{ marginTop: 8, paddingBottom: 20 }}>
            {currentStep < TOTAL_STEPS ? (
              <TouchableOpacity
                style={styles.ctaBtn}
                onPress={handleNext}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#e94560", "#ff6b9d"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.ctaGradient}
                >
                  <Text style={styles.ctaText}>Continue</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.ctaBtn, !agreed && { opacity: 0.5 }]}
                onPress={handleSubmit}
                disabled={isLoading || !agreed}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#e94560", "#ff6b9d"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.ctaGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.ctaText}>
                        {isSocialSignup
                          ? "Create Profile & Sign In"
                          : "Create Account"}
                      </Text>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#fff"
                      />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            )}
            {currentStep === 1 && !isSocialSignup && (
              <Text style={styles.loginLink}>
                Already a member?{" "}
                <Text
                  style={{ color: "#e94560", fontWeight: "600" }}
                  onPress={() => navigation.navigate("LoginForm")}
                >
                  Log in here
                </Text>
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <PickerModal
        visible={showIndustryPicker}
        title="Select Industry"
        options={INDUSTRIES}
        selected={industry}
        onSelect={(v) => {
          setIndustry(v);
          setShowIndustryPicker(false);
        }}
        onClose={() => setShowIndustryPicker(false)}
      />
      <PickerModal
        visible={showEducationPicker}
        title="Select Education Level"
        options={EDUCATION_LEVELS}
        selected={education}
        onSelect={(v) => {
          setEducation(v);
          setShowEducationPicker(false);
        }}
        onClose={() => setShowEducationPicker(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  socialRow: {
  flexDirection: "row",
  justifyContent: "center",
  gap: 16,
  marginBottom: 20,
},
socialIconBtn: {
  width: 56,
  height: 56,
  borderRadius: 16,
  backgroundColor: "rgba(255,255,255,0.08)",
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 1.5,
  borderColor: "rgba(255,255,255,0.1)",
},
  appleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 12,
    gap: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    gap: 10,
    marginBottom: 20,
  },
  socialBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  googleBtnText: {
    color: "#333",
    fontWeight: "700",
    fontSize: 16,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#0f0f23",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    fontWeight: "600",
  },
  stepIndicators: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  stepIndicator: { alignItems: "center", flex: 1 },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    borderWidth: 2,
    borderColor: "transparent",
  },
  stepDotActive: {
    backgroundColor: "rgba(233,69,96,0.2)",
    borderColor: "#e94560",
  },
  stepDotDone: { backgroundColor: "#e94560" },
  stepLabel: { color: "#555", fontSize: 11, fontWeight: "600" },
  stepLabelActive: { color: "#e94560" },
  stepLabelDone: { color: "rgba(255,255,255,0.6)" },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 2, overflow: "hidden" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  stepTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 6,
  },
  stepSub: {
    fontSize: 15,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 28,
    lineHeight: 21,
  },
  socialBanner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
  },
  bannerTitle: { color: "#fff", fontSize: 14, fontWeight: "700" },
  bannerSub: { color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 2 },
  linkedinBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A66C2",
    padding: 16,
    borderRadius: 12,
    gap: 10,
    marginBottom: 20,
  },
  linkedinBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  divider: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.1)" },
  dividerText: { color: "#555", paddingHorizontal: 12, fontSize: 13 },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 16 : 12,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.08)",
  },
  inputFieldError: { borderColor: "#e94560" },
  inputText: { flex: 1, color: "#fff", fontSize: 16 },
  errorText: {
    color: "#e94560",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    marginBottom: 4,
  },
  strengthRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  strengthBars: { flexDirection: "row", gap: 4, flex: 1 },
  bar: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { color: "#888", fontSize: 12, fontWeight: "600" },
  fieldLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  genderRow: { flexDirection: "row", gap: 14, marginBottom: 14 },
  genderCard: {
    flex: 1,
    height: 110,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  genderActive: { borderColor: "#e94560" },
  genderLabel: { color: "#888", fontSize: 15, fontWeight: "600", marginTop: 8 },
  genderCheck: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#e94560",
    justifyContent: "center",
    alignItems: "center",
  },
  dateBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 14,
  },
  dateBtnText: { flex: 1, color: "#fff", fontSize: 16, marginLeft: 10 },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(233,69,96,0.08)",
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    gap: 8,
  },
  infoText: {
    flex: 1,
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    lineHeight: 18,
  },
  selectField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.08)",
  },
  selectError: { borderColor: "#e94560" },
  selectText: { flex: 1, color: "#fff", fontSize: 16, marginLeft: 10 },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  photoItem: {
    width: (width - 64) / 3,
    height: (width - 64) / 3,
    borderRadius: 12,
    overflow: "hidden",
  },
  photoImg: { width: "100%", height: "100%" },
  photoX: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  photoAdd: {
    width: (width - 64) / 3,
    height: (width - 64) / 3,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(233,69,96,0.3)",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(233,69,96,0.05)",
  },
  photoAddLabel: {
    color: "#e94560",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },
  bioBox: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 24,
    overflow: "hidden",
  },
  bioInput: {
    color: "#fff",
    fontSize: 15,
    padding: 14,
    minHeight: 100,
    lineHeight: 22,
  },
  bioCount: {
    color: "#555",
    fontSize: 12,
    textAlign: "right",
    padding: 8,
    paddingTop: 0,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  checkboxOn: { backgroundColor: "#e94560", borderColor: "#e94560" },
  termsText: {
    flex: 1,
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    lineHeight: 20,
  },
  termsLink: { color: "#e94560", fontWeight: "600" },
  ctaBtn: { borderRadius: 14, overflow: "hidden" },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 8,
  },
  ctaText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  loginLink: {
    textAlign: "center",
    color: "rgba(255,255,255,0.5)",
    marginTop: 20,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1a1a2e",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "70%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: "800", color: "#fff" },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  modalOptionActive: {
    backgroundColor: "rgba(233,69,96,0.08)",
    marginHorizontal: -4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  modalOptionText: { fontSize: 16, color: "rgba(255,255,255,0.8)" },
  modalOptionTextActive: { color: "#e94560", fontWeight: "600" },
});
