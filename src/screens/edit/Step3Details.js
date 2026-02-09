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
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Progress from "react-native-progress";
import GlassCard from "../../components/GlassCard";
import GlassButton from "../../components/GlassButton";
import theme from "../../theme";
import { capitalizeLabel } from "../../utils/CapitalizeLabe";

export default function Step3Details({ form, setForm, setField }) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  const religionOptions = [
    "christian",
    "muslim",
    "jewish",
    "buddhist",
    "ateist",
    "other",
  ];

  const relationshipOptions = [
    "single",
    "in a relationship",
    "married",
    "divorced",
  ];

  const childrenOptions = [
    { label: "No children", value: false },
    { label: "Has children", value: true },
  ];

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
          education: data.user.education || "",
          religion: data.user.religion || "",
          relationship: data.user.relationshipStatus || "",
          hasChildren: data.user.hasChildren ?? false,
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
        education: form.education,
        religion: form.religion,
        relationshipStatus: form.relationship,
        hasChildren: form.hasChildren,
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

  const renderOptions = (label, options, field, emoji) => (
    <View style={styles.optionSection}>
      <Text style={styles.sectionLabel}>
        {emoji} {label}
      </Text>
      <View style={styles.optionsGrid}>
        {options.map((opt) => {
          const isSelected = form[field] === opt.value;
          return (
            <TouchableOpacity
              key={opt.value?.toString() || opt.label}
              style={styles.optionButton}
              onPress={() => setField(field, opt.value)}
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
                  {opt.label}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

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
            progress={0.8}
            width={null}
            height={6}
            color={theme.colors.primary}
            unfilledColor="rgba(255,255,255,0.1)"
            borderWidth={0}
            borderRadius={3}
          />
          <Text style={styles.progressText}>Step 4 of 5</Text>
        </View>

        {/* Form Card */}
        <GlassCard>
          {/* Education Field */}
          <View style={styles.field}>
            <Text style={styles.label}>🎓 Education</Text>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                style={styles.inputGradient}
              >
                <TextInput
                  value={form.education}
                  onChangeText={(val) => setField("education", val)}
                  style={styles.input}
                  placeholder="Enter your education"
                  placeholderTextColor={theme.colors.textDim}
                />
              </LinearGradient>
            </View>
          </View>

          {/* Religion Options */}
          {renderOptions(
            "Religion",
            religionOptions.map((r) => ({
              label: capitalizeLabel(r),
              value: r,
            })),
            "religion",
            "🙏"
          )}

          {/* Relationship Options */}
          {renderOptions(
            "Relationship Status",
            relationshipOptions.map((r) => ({
              label: capitalizeLabel(r),
              value: r,
            })),
            "relationship",
            "💑"
          )}

          {/* Children Options */}
          {renderOptions("Children", childrenOptions, "hasChildren", "👶")}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.textSecondary,
    marginTop: 16,
    fontSize: 16,
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

  // Education Field
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
    fontSize: 14,
    textAlign: 'center',
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
