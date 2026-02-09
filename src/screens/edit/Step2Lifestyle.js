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
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Progress from "react-native-progress";
import GlassCard from "../../components/GlassCard";
import GlassButton from "../../components/GlassButton";
import theme from "../../theme";
import {
  normalizeValue,
  capitalizeWords,
} from "../../utils/normalizeAndCapitalize";

export default function Step2Lifestyle({ form, setForm, setField }) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  const dietOptions = ["Vegetarian", "Vegan", "Omnivore", "Other"];
  const exerciseOptions = ["Never", "Sometimes", "Regularly", "Daily"];
  const smokingOptions = ["Yes", "No"];
  const drinkingOptions = ["None", "Light / social drinker", "Heavy"];

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

  const renderOptions = (label, options, field, emoji) => (
    <View style={styles.optionSection}>
      <Text style={styles.sectionLabel}>
        {emoji} {label}
      </Text>
      <View style={styles.optionsGrid}>
        {options.map((opt) => {
          const value = normalizeValue(opt);
          const isSelected = form?.[field] === value;
          return (
            <TouchableOpacity
              key={opt}
              style={styles.optionButton}
              onPress={() => setField(field, value)}
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
                  {capitalizeWords(opt)}
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
            progress={0.6}
            width={null}
            height={6}
            color={theme.colors.primary}
            unfilledColor="rgba(255,255,255,0.1)"
            borderWidth={0}
            borderRadius={3}
          />
          <Text style={styles.progressText}>Step 3 of 5</Text>
        </View>

        {/* Form Card */}
        <GlassCard>
          {renderOptions("Exercise", exerciseOptions, "exercise", "💪")}
          {renderOptions("Smoking", smokingOptions, "smoking", "🚭")}
          {renderOptions("Drinking", drinkingOptions, "drinking", "🍷")}
          {renderOptions("Diet", dietOptions, "diet", "🥗")}
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
