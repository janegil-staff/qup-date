import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { navigateWithParams } from "../utils/navigation";

// Reusable ButtonGroup
function ButtonGroup({ options, selected, onSelect }) {
  return (
    <View style={styles.buttonRow}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[
            styles.optionButton,
            selected === opt && styles.selectedButton,
          ]}
          onPress={() => onSelect(opt)}
        >
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function LifestyleBasicsScreen({ navigation, route }) {
  const [occupation, setOccupation] = useState("");
  const [education, setEducation] = useState("");
  const [religion, setReligion] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [appearance, setAppearance] = useState("");

  const handleNext = () => {
    navigateWithParams(navigation, "HabitsFamilyScreen", route, {
      occupation,
      education,
      religion,
      bodyType,
      appearance,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Lifestyle & Basics</Text>

      {/* Occupation */}
      <TextInput
        style={styles.input}
        placeholder="Occupation"
        placeholderTextColor="#9CA3AF"
        value={occupation}
        onChangeText={setOccupation}
      />

      {/* Education */}
      <TextInput
        style={styles.input}
        placeholder="Education"
        placeholderTextColor="#9CA3AF"
        value={education}
        onChangeText={setEducation}
      />

      {/* Religion */}
      <Text style={styles.label}>Religion</Text>
      <ButtonGroup
        options={[
          "Christianity",
          "Islam",
          "Judaism",
          "Hinduism",
          "Buddhism",
          "Atheist",
          "Other",
        ]}
        selected={religion}
        onSelect={setReligion}
      />

      {/* Body Type */}
      <Text style={styles.label}>Body Type</Text>
      <ButtonGroup
        options={["Slim", "Athletic", "Average", "Curvy", "Plus Size"]}
        selected={bodyType}
        onSelect={setBodyType}
      />

      {/* Appearance */}
      <Text style={styles.label}>Appearance</Text>
      <ButtonGroup
        options={["Casual", "Stylish", "Professional", "Trendy", "Other"]}
        selected={appearance}
        onSelect={setAppearance}
      />

      {/* Next Button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#111827",
    padding: 20,
    alignItems: "center",
  },
  heading: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#1F2937",
    color: "#FFFFFF",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#374151",
    marginBottom: 16,
  },
  label: {
    color: "#9CA3AF",
    fontSize: 16,
    marginTop: 12,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  optionButton: {
    flexGrow: 1,
    margin: 4,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#1F2937",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
  },
  selectedButton: {
    backgroundColor: "#10b981",
  },
  optionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  nextButton: {
    backgroundColor: "#10b981",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 30,
  },
  nextText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
