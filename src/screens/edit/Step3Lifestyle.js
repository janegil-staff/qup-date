import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  StatusBar,
  ActivityIndicator,
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
import {
  normalizeValue,
  capitalizeWords,
} from "../../utils/normalizeAndCapitalize";

const EXERCISE_OPTIONS = ["Never", "Sometimes", "Regularly", "Daily"];
const DRINKING_OPTIONS = ["None", "Light / social drinker", "Heavy"];
const DIET_OPTIONS = ["Vegetarian", "Vegan", "Omnivore", "Other"];
const SMOKING_OPTIONS = ["Yes", "No"];

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
              const isSelected = selected === normalizeValue(item);
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.modalOption, isSelected && styles.modalOptionActive]}
                  onPress={() => onSelect(normalizeValue(item))}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.modalOptionText, isSelected && styles.modalOptionTextActive]}>
                    {capitalizeWords(item)}
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

export default function Step2Lifestyle({ form, setForm, setField }) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [showDrinkingPicker, setShowDrinkingPicker] = useState(false);
  const [showDietPicker, setShowDietPicker] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        const res = await fetch("https://qup.dating/api/mobile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        const user = data.user || data;
        setForm((prev) => ({
          ...prev,
          exercise: normalizeValue(user.exercise),
          smoking: normalizeValue(user.smoking),
          drinking: normalizeValue(user.drinking),
          diet: normalizeValue(user.diet),
        }));

        setLoading(false);
      } catch (err) {
        console.error("Failed to load profile", err);
        Alert.alert("Error", "Failed to load your profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setForm]);

  const handleSaveAndNext = async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");

      const res = await fetch("https://qup.dating/api/mobile/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          exercise: form.exercise,
          smoking: form.smoking,
          drinking: form.drinking,
          diet: form.diet,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Save failed: ${errText}`);
      }

      const updated = await res.json();
      navigation.navigate("EditDetails", { user: updated });
    } catch (err) {
      console.error("Failed to save lifestyle", err);
      Alert.alert("Error", "Failed to save your lifestyle info");
    }
  };

  const getDisplayValue = (field, options) => {
    if (!form?.[field]) return null;
    const match = options.find(
      (opt) => normalizeValue(opt) === form[field]
    );
    return match ? capitalizeWords(match) : capitalizeWords(form[field]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading your preferences...</Text>
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
          <Text style={styles.title}>Lifestyle 🌿</Text>
          <Text style={styles.subtitle}>Share your habits</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Progress.Bar
            progress={0.57}
            width={null}
            height={6}
            color={theme.colors.primary}
            unfilledColor="rgba(255,255,255,0.1)"
            borderWidth={0}
            borderRadius={3}
          />
          <Text style={styles.progressText}>Step 4 of 7</Text>
        </View>

        {/* Form Card */}
        <GlassCard>
          {/* Exercise - Dropdown */}
          <View style={styles.field}>
            <Text style={styles.label}>💪 Exercise</Text>
            <TouchableOpacity
              style={styles.dropdownContainer}
              onPress={() => setShowExercisePicker(true)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
                style={styles.dropdownGradient}
              >
                <Text style={[styles.dropdownText, !form?.exercise && styles.dropdownPlaceholder]}>
                  {getDisplayValue("exercise", EXERCISE_OPTIONS) || "Select Exercise Frequency"}
                </Text>
                <Ionicons name="chevron-down" size={20} color={theme.colors.textDim} />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Smoking - Buttons (Yes/No) */}
          <View style={styles.field}>
            <Text style={styles.label}>🚭 Smoking</Text>
            <View style={styles.buttonRow}>
              {SMOKING_OPTIONS.map((opt) => {
                const value = normalizeValue(opt);
                const isSelected = form?.smoking === value;
                return (
                  <TouchableOpacity
                    key={opt}
                    style={styles.toggleButton}
                    onPress={() => setField("smoking", value)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={
                        isSelected
                          ? theme.gradients.primary
                          : ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]
                      }
                      style={styles.toggleGradient}
                    >
                      <Text style={[styles.toggleText, isSelected && styles.toggleTextActive]}>
                        {capitalizeWords(opt)}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Drinking - Dropdown */}
          <View style={styles.field}>
            <Text style={styles.label}>🍷 Drinking</Text>
            <TouchableOpacity
              style={styles.dropdownContainer}
              onPress={() => setShowDrinkingPicker(true)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
                style={styles.dropdownGradient}
              >
                <Text style={[styles.dropdownText, !form?.drinking && styles.dropdownPlaceholder]}>
                  {getDisplayValue("drinking", DRINKING_OPTIONS) || "Select Drinking Habit"}
                </Text>
                <Ionicons name="chevron-down" size={20} color={theme.colors.textDim} />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Diet - Dropdown */}
          <View style={styles.field}>
            <Text style={styles.label}>🥗 Diet</Text>
            <TouchableOpacity
              style={styles.dropdownContainer}
              onPress={() => setShowDietPicker(true)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
                style={styles.dropdownGradient}
              >
                <Text style={[styles.dropdownText, !form?.diet && styles.dropdownPlaceholder]}>
                  {getDisplayValue("diet", DIET_OPTIONS) || "Select Diet"}
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
          />
        </View>

        {/* Help Text */}
        <Text style={styles.helpText}>
          Your lifestyle choices help us match you with compatible people
        </Text>
      </ScrollView>

      {/* Picker Modals */}
      <PickerModal
        visible={showExercisePicker}
        title="Exercise Frequency"
        options={EXERCISE_OPTIONS}
        selected={form?.exercise}
        onSelect={(val) => {
          setField("exercise", val);
          setShowExercisePicker(false);
        }}
        onClose={() => setShowExercisePicker(false)}
      />

      <PickerModal
        visible={showDrinkingPicker}
        title="Drinking Habit"
        options={DRINKING_OPTIONS}
        selected={form?.drinking}
        onSelect={(val) => {
          setField("drinking", val);
          setShowDrinkingPicker(false);
        }}
        onClose={() => setShowDrinkingPicker(false)}
      />

      <PickerModal
        visible={showDietPicker}
        title="Diet"
        options={DIET_OPTIONS}
        selected={form?.diet}
        onSelect={(val) => {
          setField("diet", val);
          setShowDietPicker(false);
        }}
        onClose={() => setShowDietPicker(false)}
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
    marginBottom: 24,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    marginBottom: 8,
    fontWeight: "600",
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

  // Toggle Buttons (Smoking Yes/No)
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  toggleGradient: {
    paddingVertical: 14,
    alignItems: "center",
  },
  toggleText: {
    color: theme.colors.textMuted,
    fontWeight: "600",
    fontSize: 16,
  },
  toggleTextActive: {
    color: theme.colors.text,
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
