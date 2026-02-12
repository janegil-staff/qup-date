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
import { capitalizeLabel } from "../../utils/CapitalizeLabe";

const RELIGION_OPTIONS = [
  "Christian",
  "Muslim",
  "Jewish",
  "Buddhist",
  "Ateist",
  "Other",
];

const RELATIONSHIP_OPTIONS = [
  "Single",
  "In a relationship",
  "Married",
  "Divorced",
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
                  onPress={() => onSelect(item.toLowerCase())}
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

export default function Step3Details({ form, setForm, setField }) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [showReligionPicker, setShowReligionPicker] = useState(false);
  const [showRelationshipPicker, setShowRelationshipPicker] = useState(false);

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
          religion: data.user.religion || "",
          relationship: data.user.relationshipStatus || "",
          hasChildren: data.user.hasChildren ?? false,
          wantsChildren: data.user.wantsChildren ?? false,
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
        religion: form.religion,
        relationshipStatus: form.relationship,
        hasChildren: form.hasChildren,
        wantsChildren: form.wantsChildren,
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
      setForm((prev) => ({ ...prev, ...updatedUser }));
      navigation.navigate("EditHabits", { user: updatedUser });
    } catch (err) {
      console.error("Failed to save profile:", err);
      Alert.alert("Error", "Failed to save your details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading your details...</Text>
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
          <Text style={styles.title}>Personal Details 📋</Text>
          <Text style={styles.subtitle}>Tell us more about you</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Progress.Bar
            progress={0.71}
            width={null}
            height={6}
            color={theme.colors.primary}
            unfilledColor="rgba(255,255,255,0.1)"
            borderWidth={0}
            borderRadius={3}
          />
          <Text style={styles.progressText}>Step 5 of 7</Text>
        </View>

        {/* Form Card */}
        <GlassCard>
          {/* Religion - Dropdown */}
          <View style={styles.field}>
            <Text style={styles.label}>🙏 Religion</Text>
            <TouchableOpacity
              style={styles.dropdownContainer}
              onPress={() => setShowReligionPicker(true)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
                style={styles.dropdownGradient}
              >
                <Text style={[styles.dropdownText, !form.religion && styles.dropdownPlaceholder]}>
                  {form.religion ? capitalizeLabel(form.religion) : "Select Religion"}
                </Text>
                <Ionicons name="chevron-down" size={20} color={theme.colors.textDim} />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Relationship Status - Dropdown */}
          <View style={styles.field}>
            <Text style={styles.label}>💑 Relationship Status</Text>
            <TouchableOpacity
              style={styles.dropdownContainer}
              onPress={() => setShowRelationshipPicker(true)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
                style={styles.dropdownGradient}
              >
                <Text style={[styles.dropdownText, !form.relationship && styles.dropdownPlaceholder]}>
                  {form.relationship ? capitalizeLabel(form.relationship) : "Select Status"}
                </Text>
                <Ionicons name="chevron-down" size={20} color={theme.colors.textDim} />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Has Children - Buttons */}
          <View style={styles.field}>
            <Text style={styles.label}>👶 Children</Text>
            <View style={styles.buttonRow}>
              {[
                { label: "No children", value: false },
                { label: "Has children", value: true },
              ].map((opt) => {
                const isSelected = form.hasChildren === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.label}
                    style={styles.toggleButton}
                    onPress={() => setField("hasChildren", opt.value)}
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
                        {opt.label}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Wants Children - Buttons */}
          <View style={styles.field}>
            <Text style={styles.label}>🍼 Wants Children</Text>
            <View style={styles.buttonRow}>
              {[
                { label: "Open to it", value: true },
                { label: "Not planning", value: false },
              ].map((opt) => {
                const isSelected = form.wantsChildren === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.label}
                    style={styles.toggleButton}
                    onPress={() => setField("wantsChildren", opt.value)}
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
                        {opt.label}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </View>
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
          These details help us find your perfect match
        </Text>
      </ScrollView>

      {/* Picker Modals */}
      <PickerModal
        visible={showReligionPicker}
        title="Select Religion"
        options={RELIGION_OPTIONS}
        selected={form.religion}
        onSelect={(val) => {
          setField("religion", val);
          setShowReligionPicker(false);
        }}
        onClose={() => setShowReligionPicker(false)}
      />

      <PickerModal
        visible={showRelationshipPicker}
        title="Relationship Status"
        options={RELATIONSHIP_OPTIONS}
        selected={form.relationship}
        onSelect={(val) => {
          setField("relationship", val);
          setShowRelationshipPicker(false);
        }}
        onClose={() => setShowRelationshipPicker(false)}
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

  // Toggle Buttons
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
    fontSize: 14,
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
