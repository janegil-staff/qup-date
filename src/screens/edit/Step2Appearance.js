import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
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

const APPEARANCE_OPTIONS = ["Normal", "Pretty", "Cute", "Handsome", "Stylish", "Unique"];
const BODY_TYPE_OPTIONS = ["Slim", "Average", "Athletic", "Curvy", "Muscular"];

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

export default function Step1Appearance({ form, setForm, setField }) {
  const navigation = useNavigation();
  const [showAppearancePicker, setShowAppearancePicker] = useState(false);
  const [showBodyTypePicker, setShowBodyTypePicker] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        const res = await fetch("https://qup.dating/api/mobile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        const normalize = (val) =>
          val ? val.charAt(0).toUpperCase() + val.slice(1).toLowerCase() : "";

        setForm((prev) => ({
          ...prev,
          height: data.user.height || "",
          appearance: normalize(data.user.appearance),
          bodyType: normalize(data.user.bodyType),
        }));
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchMe();
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
          height: form.height,
          appearance: form.appearance,
          bodyType: form.bodyType,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Save failed: ${errText}`);
      }

      const updated = await res.json();
      navigation.navigate("EditLifestyle", { user: updated });
    } catch (err) {
      console.error("Failed to save profile", err);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Appearance ✨</Text>
          <Text style={styles.subtitle}>Tell us how you look</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Progress.Bar
            progress={0.43}
            width={null}
            height={6}
            color={theme.colors.primary}
            unfilledColor="rgba(255,255,255,0.1)"
            borderWidth={0}
            borderRadius={3}
          />
          <Text style={styles.progressText}>Step 3 of 7</Text>
        </View>

        {/* Form Card */}
        <GlassCard>
          {/* Height Field */}
          <View style={styles.field}>
            <Text style={styles.label}>📏 Height (cm)</Text>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
                style={styles.inputGradient}
              >
                <TextInput
                  value={form?.height?.toString() ?? ""}
                  onChangeText={(val) => setField("height", val)}
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Enter your height"
                  placeholderTextColor={theme.colors.textDim}
                />
              </LinearGradient>
            </View>
          </View>

          {/* Appearance Dropdown */}
          <View style={styles.field}>
            <Text style={styles.label}>👤 Appearance</Text>
            <TouchableOpacity
              style={styles.dropdownContainer}
              onPress={() => setShowAppearancePicker(true)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
                style={styles.dropdownGradient}
              >
                <Text style={[styles.dropdownText, !form?.appearance && styles.dropdownPlaceholder]}>
                  {form?.appearance || "Select Appearance"}
                </Text>
                <Ionicons name="chevron-down" size={20} color={theme.colors.textDim} />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Body Type Dropdown */}
          <View style={styles.field}>
            <Text style={styles.label}>💪 Body Type</Text>
            <TouchableOpacity
              style={styles.dropdownContainer}
              onPress={() => setShowBodyTypePicker(true)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
                style={styles.dropdownGradient}
              >
                <Text style={[styles.dropdownText, !form?.bodyType && styles.dropdownPlaceholder]}>
                  {form?.bodyType || "Select Body Type"}
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
          Your appearance preferences help us show you to compatible matches
        </Text>
      </ScrollView>

      {/* Picker Modals */}
      <PickerModal
        visible={showAppearancePicker}
        title="Select Appearance"
        options={APPEARANCE_OPTIONS}
        selected={form?.appearance}
        onSelect={(val) => {
          setField("appearance", val);
          setShowAppearancePicker(false);
        }}
        onClose={() => setShowAppearancePicker(false)}
      />

      <PickerModal
        visible={showBodyTypePicker}
        title="Select Body Type"
        options={BODY_TYPE_OPTIONS}
        selected={form?.bodyType}
        onSelect={(val) => {
          setField("bodyType", val);
          setShowBodyTypePicker(false);
        }}
        onClose={() => setShowBodyTypePicker(false)}
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
