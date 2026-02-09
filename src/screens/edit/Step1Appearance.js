import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Progress from "react-native-progress";
import GlassCard from "../../components/GlassCard";
import GlassButton from "../../components/GlassButton";
import theme from "../../theme";

export default function Step1Appearance({ form, setForm, setField }) {
  const navigation = useNavigation();

  const appearanceOptions = [
    "Normal",
    "Pretty",
    "Cute",
    "Handsome",
    "Stylish",
    "Unique",
  ];
  const bodyTypeOptions = ["Slim", "Average", "Athletic", "Curvy", "Muscular"];

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

  const renderOptions = (label, options, field, emoji) => (
    <View style={styles.optionSection}>
      <Text style={styles.sectionLabel}>
        {emoji} {label}
      </Text>
      <View style={styles.optionsGrid}>
        {options.map((opt) => {
          const isSelected = form?.[field]?.toLowerCase() === opt.toLowerCase();
          return (
            <TouchableOpacity
              key={opt}
              style={styles.optionButton}
              onPress={() => setField(field, opt)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  isSelected
                    ? theme.gradients.primary
                    : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']
                }
                style={styles.optionGradient}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextActive,
                  ]}
                >
                  {opt}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

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
            progress={0.4}
            width={null}
            height={6}
            color={theme.colors.primary}
            unfilledColor="rgba(255,255,255,0.1)"
            borderWidth={0}
            borderRadius={3}
          />
          <Text style={styles.progressText}>Step 2 of 5</Text>
        </View>

        {/* Form Card */}
        <GlassCard>
          {/* Height Field */}
          <View style={styles.field}>
            <Text style={styles.label}>📏 Height (cm)</Text>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
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

          {/* Appearance Options */}
          {renderOptions("Appearance", appearanceOptions, "appearance", "👤")}

          {/* Body Type Options */}
          {renderOptions("Body Type", bodyTypeOptions, "bodyType", "💪")}
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

  // Header
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textMuted,
  },

  // Progress
  progressContainer: {
    marginBottom: 24,
  },
  progressText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },

  // Height Field
  field: {
    marginBottom: 24,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    marginBottom: 8,
    fontWeight: '600',
  },
  inputContainer: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
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

  // Options Section
  optionSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    marginBottom: 12,
    fontWeight: '600',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    width: '48%',
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  optionGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  optionText: {
    color: theme.colors.textMuted,
    fontWeight: '600',
    fontSize: 15,
  },
  optionTextActive: {
    color: theme.colors.text,
  },

  // Navigation
  navRow: {
    flexDirection: 'row',
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

  // Help Text
  helpText: {
    color: theme.colors.textDim,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
