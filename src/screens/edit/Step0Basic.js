import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Progress from "react-native-progress";

export default function Step0Basic({ form,setForm, setField, navigation }) {
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
        setField("occupation", data.user.occupation || "");
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
      navigation.navigate("EditAppearance", { form, setForm, setField, navigation });
    } catch (err) {
      console.error("Failed to save profile", err);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#ff69b4"
        style={{ marginTop: 50 }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Progress.Bar
        progress={0}
        width={null}
        color="#ff69b4"
        style={styles.progress}
      />

      {/* Name */}
      <View style={styles.field}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          value={form?.name ?? ""}
          onChangeText={(val) => setField("name", val)}
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#6b7280"
        />
      </View>

      {/* Birthdate */}
      <View style={styles.field}>
        <Text style={styles.label}>Birthdate</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: form?.birthdate ? "white" : "#6b7280" }}>
            {form?.birthdate || "Select birthdate"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={form?.birthdate ? new Date(form.birthdate) : new Date()}
            mode="date"
            display="spinner"
            textColor="white" // iOS only
            themeVariant="dark" // Android dark theme
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) {
                setField("birthdate", date.toISOString().split("T")[0]);
              }
            }}
          />
        )}
      </View>

      {/* Gender */}
      <View style={styles.field}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderRow}>
          {["Male", "Female"].map((g) => (
            <TouchableOpacity
              key={g}
              style={[
                styles.genderButton,
                form?.gender?.toLowerCase() === g.toLowerCase() &&
                  styles.genderActive,
              ]}
              onPress={() => setField("gender", g)}
            >
              <Text
                style={[
                  styles.genderText,
                  form?.gender?.toLowerCase() === g.toLowerCase() &&
                    styles.genderTextActive,
                ]}
              >
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Occupation */}
      <View style={styles.field}>
        <Text style={styles.label}>Occupation</Text>
        <TextInput
          value={form?.occupation ?? ""}
          onChangeText={(val) => setField("occupation", val)}
          style={styles.input}
          placeholder="Your occupation"
          placeholderTextColor="#6b7280"
        />
      </View>

      {/* Next button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 16,
  },
  progress: {
    marginBottom: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#1f2937",
    color: "white",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#374151",
  },
  genderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genderButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#1f2937",
    borderWidth: 1,
    borderColor: "#374151",
    alignItems: "center",
  },
  genderActive: {
    backgroundColor: "#ff69b4",
    borderColor: "#ff69b4",
  },
  genderText: {
    color: "#9ca3af",
    fontWeight: "600",
  },
  genderTextActive: {
    color: "white",
  },
  nextButton: {
    marginTop: 30,
    backgroundColor: "#ff69b4",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  nextText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
