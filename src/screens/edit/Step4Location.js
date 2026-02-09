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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Progress from "react-native-progress";
import GlassCard from "../../components/GlassCard";
import GlassButton from "../../components/GlassButton";
import theme from "../../theme";
import { saveProfile, fetchUser } from "../../utils/profileService";
import LocationAutocomplete from "../../components/LocationAutocomplete";
import normalizeCountry from "../../utils/normalizeCountry";
import AgeRangeSlider from "../../components/AgeRangeSlider";

export default function Step4Location({ form, setForm, setField }) {
  const navigation = useNavigation();
  const [tagsText, setTagsText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const user = await fetchUser();

        setForm((prev) => ({
          ...prev,
          location: user.location || null,
          searchScope: user.searchScope || "worldwide",
          willingToRelocate: user.willingToRelocate ?? false,
          tags: user.tags || [],
          preferredAgeMin: user.preferredAgeMin ?? 18,
          preferredAgeMax: user.preferredAgeMax ?? 90,
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

  const handleSaveAndNext = async () => {
    try {
      const tags = tagsText
        .split(" ")
        .map((t) => t.trim())
        .filter((t) => t.startsWith("#") && t.length > 1);

      const updatedUser = await saveProfile({
        location: form.location?.name
          ? {
              name: form.location.name,
              lat: form.location.lat,
              lng: form.location.lng,
              country: normalizeCountry(form.location.country),
            }
          : null,
        tags,
        searchScope: form.searchScope || "worldwide",
        willingToRelocate: form.willingToRelocate ?? false,
        preferredAgeMin: form.preferredAgeMin ?? 18,
        preferredAgeMax: form.preferredAgeMax ?? 90,
      });

      setForm((prev) => ({
        ...prev,
        location: updatedUser.location,
      }));

      navigation.navigate("EditImages", { user: updatedUser });
    } catch (err) {
      console.error("SAVE ERROR:", err);
      Alert.alert("Error", "Failed to save location preferences");
    }
  };

  const searchOptions = [
    { key: "national", label: "Nearby" },
    { key: "worldwide", label: "Worldwide" },
  ];

  const relocateOptions = [
    { key: true, label: "Yes" },
    { key: false, label: "No" },
  ];

  const renderOptions = (options, field, emoji) => (
    <View style={styles.optionSection}>
      <View style={styles.optionsGrid}>
        {options.map((opt) => {
          const isSelected = form[field] === opt.key;
          return (
            <TouchableOpacity
              key={opt.label}
              style={styles.optionButton}
              onPress={() => setField(field, opt.key)}
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
          <Text style={styles.title}>Location & Preferences 🌍</Text>
          <Text style={styles.subtitle}>Where are you looking?</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Progress.Bar
            progress={1.0}
            width={null}
            height={6}
            color={theme.colors.primary}
            unfilledColor="rgba(255,255,255,0.1)"
            borderWidth={0}
            borderRadius={3}
          />
          <Text style={styles.progressText}>Step 5 of 5 - Final Step!</Text>
        </View>

        {/* Form Card */}
        <GlassCard>
          {/* Location Field */}
          <View style={styles.field}>
            <Text style={styles.label}>📍 Your Location</Text>
            <LocationAutocomplete
              value={form.location?.name || ""}
              onChange={(text) =>
                setField("location", {
                  ...(form.location || {}),
                  name: text,
                })
              }
              onSelect={(location) =>
                setField("location", {
                  name: location.name,
                  lat: location.lat,
                  lng: location.lng,
                  country: normalizeCountry(location.country),
                })
              }
            />
          </View>

          {/* Search Preference */}
          <View style={styles.field}>
            <Text style={styles.label}>🔍 Search Preference</Text>
            {renderOptions(searchOptions, "searchScope")}
          </View>

          {/* Willing to Relocate */}
          <View style={styles.field}>
            <Text style={styles.label}>✈️ Willing to Relocate</Text>
            {renderOptions(relocateOptions, "willingToRelocate")}
          </View>

          {/* Tags */}
          <View style={styles.field}>
            <Text style={styles.label}>🏷️ Interests (Tags)</Text>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
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
            <Text style={styles.hint}>
              Add hashtags separated by spaces
            </Text>
          </View>

          {/* Age Range */}
          <View style={styles.field}>
            <Text style={styles.label}>
              🎯 Preferred Age Range: {form.preferredAgeMin} - {form.preferredAgeMax}
            </Text>
            <AgeRangeSlider
              preferredAgeMin={form.preferredAgeMin}
              preferredAgeMax={form.preferredAgeMax}
              onChange={([min, max]) =>
                setForm((prev) => ({
                  ...prev,
                  preferredAgeMin: min.toFixed(0),
                  preferredAgeMax: max.toFixed(0),
                }))
              }
            />
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
            title="Finish 🎉"
            variant="primary"
            onPress={handleSaveAndNext}
            style={styles.nextButton}
          />
        </View>

        {/* Help Text */}
        <Text style={styles.helpText}>
          Almost done! These preferences help us find the best matches for you
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
    color: theme.colors.primary,
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
  },

  // Fields
  field: {
    marginBottom: 24,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    marginBottom: 12,
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
  hint: {
    color: theme.colors.textDim,
    fontSize: 12,
    marginTop: 6,
    fontStyle: 'italic',
  },

  // Options
  optionSection: {
    // Section wrapper
  },
  optionsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  optionButton: {
    flex: 1,
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
