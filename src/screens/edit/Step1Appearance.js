import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import * as Progress from "react-native-progress";

export default function Step1Appearance({ form, setForm, setField }) {
  const navigation = useNavigation();

  // Expanded options
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
        method: "PATCH", // or PUT depending on backend
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

  const renderOptions = (label, options, field) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.radioButton,
              form?.[field]?.toLowerCase() === opt.toLowerCase() &&
                styles.radioActive,
            ]}
            onPress={() => setField(field, opt)}
          >
            <Text
              style={[
                styles.radioText,
                form?.[field]?.toLowerCase() === opt.toLowerCase() &&
                  styles.radioTextActive,
              ]}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <Progress.Bar
        progress={0.2}
        width={null}
        color="#ff69b4"
        style={styles.progress}
      />
      {/* Height */}
      <Text style={styles.label}>Height (cm)</Text>
      <TextInput
        value={form?.height?.toString() ?? ""}
        onChangeText={(val) => setField("height", val)}
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter height"
        placeholderTextColor="#6b7280"
      />

      {renderOptions("Appearance", appearanceOptions, "appearance")}
      {renderOptions("Body Type", bodyTypeOptions, "bodyType")}

      {/* Navigation buttons */}
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
  container: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 20,
  },
  label: {
    color: "#ccc",
    marginBottom: 6,
    fontWeight: "600",
  },
  progress: {
    marginBottom: 20,
  },
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
    width: "48%", // two per row
    marginBottom: 10,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#1f2937",
    borderWidth: 1,
    borderColor: "#374151",
    alignItems: "center",
  },
  radioActive: {
    backgroundColor: "#ff69b4",
    borderColor: "#ff69b4",
  },
  radioText: {
    color: "#9ca3af",
    fontWeight: "600",
  },
  radioTextActive: {
    color: "white",
  },
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
  backButton: {
    backgroundColor: "#374151",
  },
  nextButton: {
    backgroundColor: "#ff69b4",
  },
  navText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
