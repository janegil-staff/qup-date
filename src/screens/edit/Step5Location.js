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
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Progress from "react-native-progress";
import GlassCard from "../../components/GlassCard";
import GlassButton from "../../components/GlassButton";
import theme from "../../theme";
import { saveProfile, fetchUser } from "../../utils/profileService";
import LocationAutocomplete from "../../components/LocationAutocomplete";
import normalizeCountry from "../../utils/normalizeCountry";

export default function Step4Location({ form, setForm, setField }) {
  const navigation = useNavigation();
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
        }));
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
      const updatedUser = await saveProfile({
        location: form.location?.name
          ? {
              name: form.location.name,
              lat: form.location.lat,
              lng: form.location.lng,
              country: normalizeCountry(form.location.country),
            }
          : null,
        searchScope: form.searchScope || "worldwide",
        willingToRelocate: form.willingToRelocate ?? false,
      });

      setForm((prev) => ({
        ...prev,
        location: updatedUser.location,
      }));

      navigation.navigate("EditPreferences", { user: updatedUser });
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

  const renderOptions = (options, field) => (
    <View style={styles.buttonRow}>
      {options.map((opt) => {
        const isSelected = form[field] === opt.key;
        return (
          <TouchableOpacity
            key={opt.label}
            style={styles.toggleButton}
            onPress={() => setField(field, opt.key)}
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
              <Text
                style={[
                  styles.toggleText,
                  isSelected && styles.toggleTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading location...</Text>
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
          <Text style={styles.title}>Location 🌍</Text>
          <Text style={styles.subtitle}>Where are you looking for love?</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Progress.Bar
            progress={0.75}
            width={null}
            height={6}
            color={theme.colors.primary}
            unfilledColor="rgba(255,255,255,0.1)"
            borderWidth={0}
            borderRadius={3}
          />
          <Text style={styles.progressText}>Step 6 of 8</Text>
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
          Your location helps us find matches near you
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
});
