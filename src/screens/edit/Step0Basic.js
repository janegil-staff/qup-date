import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import * as Progress from "react-native-progress";
import GlassCard from "../../components/GlassCard";
import GlassButton from "../../components/GlassButton";
import theme from "../../theme";

export default function Step0Basic({ form, setForm, setField, navigation }) {
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchMe = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        const res = await fetch("https://qup.dating/api/mobile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setField("name", data.user.name || "");
        setField("birthdate", data.user.birthdate || "");
        setField("gender", data.user.gender || "");
        setField("bio", data.user.bio || "");
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const handleNext = async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      await fetch("https://qup.dating/api/mobile/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      // Navigate to next step
      navigation.navigate("EditCareer", {
        form,
        setForm,
        setField,
        navigation,
      });
    } catch (err) {
      console.error("Failed to save profile", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading your profile...</Text>
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
          <Text style={styles.title}>Basic Info 📝</Text>
          <Text style={styles.subtitle}>Tell us about yourself</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Progress.Bar
            progress={0.2}
            width={null}
            height={6}
            color={theme.colors.primary}
            unfilledColor="rgba(255,255,255,0.1)"
            borderWidth={0}
            borderRadius={3}
          />
          <Text style={styles.progressText}>Step 1 of 5</Text>
        </View>

        {/* Form Card */}
        <GlassCard>
          {/* Name Field */}
          <View style={styles.field}>
            <Text style={styles.label}>Name</Text>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                style={styles.inputGradient}
              >
                <TextInput
                  value={form?.name ?? ""}
                  onChangeText={(val) => setField("name", val)}
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor={theme.colors.textDim}
                />
              </LinearGradient>
            </View>
          </View>

          {/* Birthdate Field */}
          <View style={styles.field}>
            <Text style={styles.label}>Birthdate</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setShowDatePicker(true)}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                style={styles.inputGradient}
              >
                <Text style={[
                  styles.dateText,
                  !form?.birthdate && styles.placeholderText
                ]}>
                  {form?.birthdate || "Select birthdate"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={form?.birthdate ? new Date(form.birthdate) : new Date()}
                mode="date"
                display="spinner"
                textColor="white"
                themeVariant="dark"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) {
                    setField("birthdate", date.toISOString().split("T")[0]);
                  }
                }}
              />
            )}
          </View>

          {/* Gender Field */}
          <View style={styles.field}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderRow}>
              {["Male", "Female"].map((g) => (
                <TouchableOpacity
                  key={g}
                  style={styles.genderButtonContainer}
                  onPress={() => setField("gender", g)}
                >
                  <LinearGradient
                    colors={
                      form?.gender?.toLowerCase() === g.toLowerCase()
                        ? theme.gradients.primary
                        : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']
                    }
                    style={styles.genderButton}
                  >
                    <Text style={[
                      styles.genderText,
                      form?.gender?.toLowerCase() === g.toLowerCase() &&
                        styles.genderTextActive
                    ]}>
                      {g}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Bio Field */}
          <View style={styles.field}>
            <Text style={styles.label}>Bio</Text>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                style={styles.inputGradient}
              >
                <TextInput
                  value={form?.bio ?? ""}
                  onChangeText={(val) => setField("bio", val)}
                  style={[styles.input, styles.textArea]}
                  placeholder="Tell us a bit about yourself"
                  placeholderTextColor={theme.colors.textDim}
                  multiline
                  numberOfLines={4}
                />
              </LinearGradient>
            </View>
          </View>
        </GlassCard>

        {/* Next Button */}
        <GlassButton
          title="Next →"
          variant="primary"
          onPress={handleNext}
          style={styles.nextButton}
        />

        {/* Help Text */}
        <Text style={styles.helpText}>
          Your information is private and secure 🔒
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

  // Form Fields
  field: {
    marginBottom: 20,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateText: {
    color: theme.colors.text,
    fontSize: 16,
  },
  placeholderText: {
    color: theme.colors.textDim,
  },

  // Gender Buttons
  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButtonContainer: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  genderButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  genderText: {
    color: theme.colors.textMuted,
    fontWeight: '600',
    fontSize: 16,
  },
  genderTextActive: {
    color: theme.colors.text,
  },

  // Next Button
  nextButton: {
    marginTop: 24,
    marginBottom: 16,
  },

  // Help Text
  helpText: {
    color: theme.colors.textDim,
    fontSize: 14,
    textAlign: 'center',
  },
});
