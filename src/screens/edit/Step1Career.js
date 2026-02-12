import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Progress from "react-native-progress";
import GlassCard from "../../components/GlassCard";
import GlassButton from "../../components/GlassButton";
import theme from "../../theme";
import { capitalizeLabel } from "../../utils/CapitalizeLabe";

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

function PickerModal({ visible, title, options, selected, onSelect, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
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
            {options.map((item) => {
              const isSelected = selected?.toLowerCase() === item.toLowerCase();
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.modalOption, isSelected && styles.modalOptionActive]}
                  onPress={() => onSelect(item)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.modalOptionText, isSelected && styles.modalOptionTextActive]}>
                    {item}
                  </Text>
                  {isSelected && <Ionicons name="checkmark-circle" size={22} color={theme.colors.primary} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function Step1Career({ form, setForm, setField }) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [showIndustryPicker, setShowIndustryPicker] = useState(false);
  const [showEducationPicker, setShowEducationPicker] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        const res = await fetch("https://qup.dating/api/mobile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();

        setForm({
          occupation: data.user.occupation || "",
          company: data.user.company || "",
          industry: data.user.industry || "",
          education: data.user.education || "",
        });
      } catch (err) {
        console.error("Failed to load profile", err);
        Alert.alert("Error", "Failed to load profile. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveAndNext = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("authToken");

      const body = {
        occupation: form.occupation,
        company: form.company,
        industry: form.industry,
        education: form.education,
      };

      const res = await fetch("https://qup.dating/api/mobile/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }

      const updatedUser = await res.json();
      navigation.navigate("EditAppearance", { user: updatedUser });
    } catch (err) {
      console.error("Failed to save career info:", err);
      Alert.alert("Error", "Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading your career info...</Text>
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
          <Text style={styles.title}>Career & Education 💼</Text>
          <Text style={styles.subtitle}>
            Help matches understand your professional life
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Progress.Bar
            progress={0.28}
            width={null}
            height={6}
            color={theme.colors.primary}
            unfilledColor="rgba(255,255,255,0.1)"
            borderWidth={0}
            borderRadius={3}
          />
          <Text style={styles.progressText}>Step 2 of 7</Text>
        </View>

        {/* Form Card */}
        <GlassCard>
          {/* Occupation - Text Input */}
          <View style={styles.field}>
            <Text style={styles.label}>💼 Job Title</Text>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
                style={styles.inputGradient}
              >
                <TextInput
                  value={form.occupation}
                  onChangeText={(val) => setField("occupation", val)}
                  style={styles.input}
                  placeholder="e.g. Software Engineer, Lawyer"
                  placeholderTextColor={theme.colors.textDim}
                />
              </LinearGradient>
            </View>
          </View>

          {/* Company - Text Input */}
          <View style={styles.field}>
            <Text style={styles.label}>🏢 Company</Text>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
                style={styles.inputGradient}
              >
                <TextInput
                  value={form.company}
                  onChangeText={(val) => setField("company", val)}
                  style={styles.input}
                  placeholder="e.g. Google, DNB, Equinor"
                  placeholderTextColor={theme.colors.textDim}
                />
              </LinearGradient>
            </View>
          </View>

          {/* Industry - Dropdown */}
          <View style={styles.field}>
            <Text style={styles.label}>🌐 Industry</Text>
            <TouchableOpacity
              style={styles.dropdownContainer}
              onPress={() => setShowIndustryPicker(true)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
                style={styles.dropdownGradient}
              >
                <Text style={[styles.dropdownText, !form.industry && styles.dropdownPlaceholder]}>
                  {form.industry ? capitalizeLabel(form.industry) : "Select Industry"}
                </Text>
                <Ionicons name="chevron-down" size={20} color={theme.colors.textDim} />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Education - Dropdown */}
          <View style={styles.field}>
            <Text style={styles.label}>🎓 Education</Text>
            <TouchableOpacity
              style={styles.dropdownContainer}
              onPress={() => setShowEducationPicker(true)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
                style={styles.dropdownGradient}
              >
                <Text style={[styles.dropdownText, !form.education && styles.dropdownPlaceholder]}>
                  {form.education ? capitalizeLabel(form.education) : "Select Education Level"}
                </Text>
                <Ionicons name="chevron-down" size={20} color={theme.colors.textDim} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
            title="Next →"
            variant="primary"
            onPress={handleSaveAndNext}
            style={styles.nextButton}
            disabled={loading}
          />
        </View>

        {/* Help Text */}
        <Text style={styles.helpText}>
          This helps you match with professionals in similar fields 🤝
        </Text>
      </ScrollView>

      {/* Picker Modals */}
      <PickerModal
        visible={showIndustryPicker}
        title="Select Industry"
        options={INDUSTRIES}
        selected={form.industry}
        onSelect={(val) => {
          setField("industry", val);
          setShowIndustryPicker(false);
        }}
        onClose={() => setShowIndustryPicker(false)}
      />

      <PickerModal
        visible={showEducationPicker}
        title="Select Education Level"
        options={EDUCATION_LEVELS}
        selected={form.education}
        onSelect={(val) => {
          setField("education", val);
          setShowEducationPicker(false);
        }}
        onClose={() => setShowEducationPicker(false)}
      />
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
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: theme.colors.textSecondary,
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textMuted,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
  field: {
    marginBottom: 20,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    marginBottom: 8,
    fontWeight: "600",
  },
  inputContainer: {
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  inputGradient: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  input: {
    color: theme.colors.text,
    fontSize: 16,
  },

  // Dropdown
  dropdownContainer: {
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  dropdownGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  dropdownText: {
    color: theme.colors.text,
    fontSize: 16,
    flex: 1,
  },
  dropdownPlaceholder: {
    color: theme.colors.textDim,
  },

  // Navigation
  navRow: {
    flexDirection: "row",
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
  helpText: {
    color: theme.colors.textDim,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },

  // Modal
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
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
  },
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
  modalOptionText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  modalOptionTextActive: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
});
