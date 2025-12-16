import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import * as Progress from "react-native-progress";
import { saveProfile, prefillProfile } from "../../utils/profileService";
import { capitalizeLabel } from "../../utils/CapitalizeLabe";

export default function Step3Details({ form, setForm, setField }) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  const religionOptions = [
    "Christian",
    "Muslim",
    "Jewish",
    "Buddhist",
    "Ateist",
    "Other",
  ];
  const relationshipOptions = [
    "Single",
    "In a relationship",
    "Married",
    "Divorced",
  ];
  const childrenOptions = ["No children", "Has children"];

  /** ----------------------------------
   * Fetch and prefill profile
   * ---------------------------------- */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        const res = await fetch("https://qup.dating/api/mobile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();

        setForm(prefillProfile(data.user));
      } catch (err) {
        console.error("Failed to load profile", err);
        Alert.alert("Error", "Failed to load profile. Try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [setForm]);

  /** ----------------------------------
   * Save updates
   * ---------------------------------- */
  const handleSaveAndNext = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("authToken");

      const body = {
        education: form.education,
        religion: form.religion,
        relationshipStatus: form.relationship,
        hasChildren: form.children === "Has children",
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

      // Update local form to stay in sync
      setForm((prev) => ({ ...prev, ...updatedUser }));

      navigation.navigate("EditHabits", { user: updatedUser });
    } catch (err) {
      console.error("Failed to save profile:", err);
      Alert.alert("Error", "Failed to save your details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderOptions = (label, options, field) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.radioButton,
              form?.[field] === opt && styles.radioActive,
            ]}
            onPress={() => setField(field, opt)}
          >
            <Text
              style={[
                styles.radioText,
                form?.[field] === opt && styles.radioTextActive,
              ]}
            >
              {capitalizeLabel(opt)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#ccc" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Progress.Bar
        progress={0.6}
        width={null}
        color="#ff69b4"
        style={styles.progress}
      />

      <Text style={styles.label}>Education</Text>
      <TextInput
        value={form?.education ?? ""}
        onChangeText={(val) => setField("education", val)}
        style={styles.input}
        placeholder="Enter your education"
        placeholderTextColor="#6b7280"
      />

      {renderOptions("Religion", religionOptions, "religion")}
      {renderOptions("Relationship", relationshipOptions, "relationship")}
      {renderOptions("Children", childrenOptions, "children")}

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

const styles = StyleSheet.create({
  progress: { marginBottom: 20 },
  container: { flex: 1, backgroundColor: "#111827", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  label: { color: "#ccc", marginBottom: 6, fontWeight: "600" },
  input: {
    backgroundColor: "#1f2937",
    color: "white",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#374151",
  },
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
});
