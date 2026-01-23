import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import * as Progress from "react-native-progress";
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

  // -------------------- Fetch existing values --------------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        const res = await fetch("https://qup.dating/api/mobile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        const user = data.user || data; // adapt depending on API response
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

  // -------------------- Save updated values --------------------
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

  // -------------------- Render radio options --------------------
  const renderOptions = (label, options, field) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {options.map((opt) => {
          const value = normalizeValue(opt);
          return (
            <TouchableOpacity
              key={opt}
              style={[
                styles.radioButton,
                form?.[field] === value && styles.radioActive,
              ]}
              onPress={() => setField(field, value)}
            >
              <Text
                style={[
                  styles.radioText,
                  form?.[field] === value && styles.radioTextActive,
                ]}
              >
                {capitalizeWords(opt)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#ccc" }}>Loading…</Text>
      </View>
    );
  }

  // -------------------- Render component --------------------
  return (
    <View style={styles.container}>
      <Progress.Bar
        progress={0.4}
        width={null}
        color="#ff69b4"
        style={styles.progress}
      />

      {renderOptions("Exercise", exerciseOptions, "exercise")}
      {renderOptions("Smoking", smokingOptions, "smoking")}
      {renderOptions("Drinking", drinkingOptions, "drinking")}
      {renderOptions("Diet", dietOptions, "diet")}

      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navButton, styles.backButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.navText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.nextButton]}
          onPress={handleSaveAndNext}
        >
          <Text style={styles.navText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111827", padding: 20 },
  progress: { marginBottom: 20 },
  label: { color: "#ccc", marginBottom: 6, fontWeight: "600" },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    justifyContent: "space-between",
  },
  radioButton: {
    width: "48%",
    marginBottom: 10,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#1f2937",
    borderWidth: 1,
    borderColor: "#374151",
    alignItems: "center",
  },
  radioActive: { backgroundColor: "#ff69b4", borderColor: "#ff69b4" },
  radioText: { color: "#9ca3af", fontWeight: "600" },
  radioTextActive: { color: "white" },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  navButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 6,
  },
  backButton: { backgroundColor: "#374151" },
  nextButton: { backgroundColor: "#ff69b4" },
  navText: { color: "white", fontWeight: "700", fontSize: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
