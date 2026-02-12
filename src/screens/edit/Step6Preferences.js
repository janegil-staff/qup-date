import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Progress from "react-native-progress";
import GlassCard from "../../components/GlassCard";
import GlassButton from "../../components/GlassButton";
import theme from "../../theme";
import { saveProfile, fetchUser } from "../../utils/profileService";
import AgeRangeSlider from "../../components/AgeRangeSlider";

const LOOKING_FOR_OPTIONS = [
  "Relationship",
  "Casual",
  "Friendship",
  "Marriage",
  "Not sure yet",
];

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
            {options.map((item) => {
              const isSelected = selected?.toLowerCase() === item.toLowerCase();
              return (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.modalOption,
                    isSelected && styles.modalOptionActive,
                  ]}
                  onPress={() => onSelect(item.toLowerCase())}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      isSelected && styles.modalOptionTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={theme.colors.primary}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function Step5Preferences({ form, setForm, setField }) {
  const navigation = useNavigation();
  const [tagsText, setTagsText] = useState("");
  const [loading, setLoading] = useState(true);
  const [showLookingForPicker, setShowLookingForPicker] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const user = await fetchUser();

        setForm((prev) => ({
          ...prev,
          tags: user.tags || [],
          preferredAgeMin: user.preferredAgeMin ?? 18,
          preferredAgeMax: user.preferredAgeMax ?? 90,
          lookingFor: user.lookingFor || "",
        }));

        setTagsText((user.tags || []).join(" "));
      } catch (err) {
        console.error("Failed to load user", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  const handleSaveAndNext = async () => {
    try {
      const tags = tagsText
        .split(" ")
        .map((t) => t.trim())
        .filter((t) => t.startsWith("#") && t.length > 1);

      const updatedUser = await saveProfile({
        tags,
        preferredAgeMin: form.preferredAgeMin ?? 18,
        preferredAgeMax: form.preferredAgeMax ?? 90,
        lookingFor: form.lookingFor || "",
      });

      navigation.navigate("EditImages", { user: updatedUser });
    } catch (err) {
      console.error("SAVE ERROR:", err);
      Alert.alert("Error", "Failed to save preferences");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading preferences...</Text>
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
          <Text style={styles.title}>Preferences 🎯</Text>
          <Text style={styles.subtitle}>What are you looking for?</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Progress.Bar
            progress={0.875}
            width={null}
            height={6}
            color={theme.colors.primary}
            unfilledColor="rgba(255,255,255,0.1)"
            borderWidth={0}
            borderRadius={3}
          />
          <Text style={styles.progressText}>Step 7 of 8</Text>
        </View>

        {/* Form Card */}
        <GlassCard>
          {/* Looking For - Dropdown */}
          <View style={styles.field}>
            <Text style={styles.label}>💕 Looking For</Text>
            <TouchableOpacity
              style={styles.dropdownContainer}
              onPress={() => setShowLookingForPicker(true)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
                style={styles.dropdownGradient}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    !form.lookingFor && styles.dropdownPlaceholder,
                  ]}
                >
                  {form.lookingFor
                    ? capitalize(form.lookingFor)
                    : "Select what you're looking for"}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={theme.colors.textDim}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Age Range */}
          <View style={styles.field}>
            <Text style={styles.label}>
              🎂 Preferred Age Range: {form.preferredAgeMin} -{" "}
              {form.preferredAgeMax}
            </Text>
            <AgeRangeSlider
              preferredAgeMin={form.preferredAgeMin}
              preferredAgeMax={form.preferredAgeMax}
              onChange={([min, max]) =>
                setForm((prev) => ({
                  ...prev,
                  preferredAgeMin: Math.round(min),
                  preferredAgeMax: Math.round(max),
                }))
              }
            />
          </View>

          {/* Tags */}
          <View style={styles.field}>
            <Text style={styles.label}>🏷️ Interests (Tags)</Text>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
                style={styles.inputGradient}
              >
                <TextInput
                  style={styles.input}
                  placeholder="#hiking #coffee #travel"
                  placeholderTextColor={theme.colors.textDim}
                  value={tagsText}
                  onChangeText={setTagsText}
                />
              </LinearGradient>
            </View>
            <Text style={styles.hint}>Add hashtags separated by spaces</Text>
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
          Almost done! One more step to complete your profile 🎉
        </Text>
      </ScrollView>

      {/* Looking For Picker */}
      <PickerModal
        visible={showLookingForPicker}
        title="Looking For"
        options={LOOKING_FOR_OPTIONS}
        selected={form.lookingFor}
        onSelect={(val) => {
          setField("lookingFor", val);
          setShowLookingForPicker(false);
        }}
        onClose={() => setShowLookingForPicker(false)}
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
    marginBottom: 12,
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

  // Input
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
  hint: {
    color: theme.colors.textDim,
    fontSize: 12,
    marginTop: 6,
    fontStyle: "italic",
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
