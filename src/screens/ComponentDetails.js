import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const MIN_AGE = 18;
const MAX_AGE = 100;

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

export default function OnboardingDetails({ navigation, route }) {
  const [gender, setGender] = useState(null);

  const [birthdate, setBirthdate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [errors, setErrors] = useState({});

  const age = useMemo(
    () => (birthdate ? calculateAge(birthdate) : null),
    [birthdate]
  );
  const isValid = gender && age !== null && age >= MIN_AGE && age <= MAX_AGE;

  function calculateAge(date) {
    const now = new Date();
    let years = now.getFullYear() - date.getFullYear();
    const hadBirthday =
      now.getMonth() > date.getMonth() ||
      (now.getMonth() === date.getMonth() && now.getDate() >= date.getDate());
    if (!hadBirthday) years -= 1;
    return years;
  }

  function validate() {
    const nextErrors = {};
    if (!gender) nextErrors.gender = "Please select a gender.";
    if (!birthdate) nextErrors.age = "Please select your birthdate.";
    else if (age < MIN_AGE) nextErrors.age = "You must be at least 18.";
    else if (age > MAX_AGE) nextErrors.age = "Please enter a valid birthdate.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  return (
    <View style={styles.container}>
      {/* Gender selection */}
      <Text style={styles.heading}>Select Gender</Text>
      <View style={styles.optionsRow}>
        {genderOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              gender === option.value && styles.optionSelected,
            ]}
            onPress={() => setGender(option.value)}
          >
            <Text
              style={[
                styles.optionText,
                gender === option.value && styles.optionTextSelected,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

      {/* Birthdate selection */}
      <Text style={[styles.heading, styles.sectionSpacing]}>
        Select Birthdate
      </Text>

      <View style={styles.pickerWrapper}>
        <DateTimePicker
          value={birthdate || new Date(2000, 0, 1)}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "calendar"}
          maximumDate={new Date()}
          onChange={(_, date) => {
            setShowPicker(false);
            if (date) setBirthdate(date);
          }}
          textColor="#000000" // 👈 black text for visibility
        />
      </View>

      {age !== null && <Text style={styles.ageText}>Age: {age} years</Text>}
      {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}

      {/* Next button */}
      <View style={styles.footer}>
        <Button
          title="Next"
          color={isValid ? "#10b981" : "#6B7280"}
          disabled={!isValid}
          onPress={() => {
            if (validate()) {
              navigation.navigate("ImageUploadScreen", {
                gender,
                birthdate,
                name: route.params.name,
                email: route.params.email,
                password: route.params.email,
              });
            }
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerWrapper: {
    backgroundColor: "#D1D5DB", // light gray, softer than white
    borderRadius: 12,
    marginTop: 10,
    padding: 10,
    // shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    // elevation for Android
    elevation: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "#111827",
    paddingHorizontal: 20,
    justifyContent: "center", // 👈 centers vertically
  },
  heading: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#374151",
    backgroundColor: "#1F2937",
  },
  optionSelected: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  optionText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  optionTextSelected: {
    color: "#111827",
    fontWeight: "700",
  },
  sectionSpacing: {
    marginTop: 20,
  },
  optionError: {
    borderColor: "#F87171",
  },
  ageText: {
    color: "#9CA3AF",
    marginTop: 8,
    textAlign: "center",
  },
  errorText: {
    color: "#F87171",
    marginTop: 6,
    textAlign: "center",
  },
  footer: {
    marginTop: 30,
    alignItems: "center",
  },
});
