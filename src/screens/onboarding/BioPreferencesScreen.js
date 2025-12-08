import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Slider from "@react-native-community/slider";
import { navigateWithParams } from "../../utils/navigation";

// Reusable ButtonGroup component
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

export default function BioPreferencesScreen({ navigation, route }) {
  const {
    name,
    email,
    password,
    gender,
    birthdate,
    location,
    occupation,
    education,
    religion,
    bodyType,
    appearance,
    smoking,
    drinking,
    hasChildren,
    wantsChildren,
    relationshipStatus,
    willingToRelocate,
  } = route.params;

  const [bio, setBio] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [preferredAgeMin, setPreferredAgeMin] = useState(20);
  const [preferredAgeMax, setPreferredAgeMax] = useState(40);

  const handleNext = () => {
    navigateWithParams(navigation, "ImageUploadScreen", route, {
      bio,
      lookingFor,
      preferredAgeMin,
      preferredAgeMax,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("LandingScreen")}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Bio & Preferences</Text>

      {/* Bio */}
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Write a short bio..."
        placeholderTextColor="#9CA3AF"
        value={bio}
        onChangeText={setBio}
        multiline
      />

      {/* Looking For */}
      <Text style={styles.label}>Looking For</Text>
      <ButtonGroup
        options={[
          "Friendship",
          "Casual Dating",
          "Long-term Relationship",
          "Marriage",
        ]}
        selected={lookingFor}
        onSelect={setLookingFor}
      />

      {/* Preferred Age Range */}
      <Text style={styles.label}>
        Preferred Age Range: {preferredAgeMin} - {preferredAgeMax}
      </Text>
      <Slider
        style={{ width: "100%", height: 40 }}
        minimumValue={18}
        maximumValue={60}
        step={1}
        value={preferredAgeMin}
        onValueChange={(val) => setPreferredAgeMin(val)}
        minimumTrackTintColor="#10b981"
        maximumTrackTintColor="#6B7280"
      />
      <Slider
        style={{ width: "100%", height: 40 }}
        minimumValue={18}
        maximumValue={60}
        step={1}
        value={preferredAgeMax}
        onValueChange={(val) => setPreferredAgeMax(val)}
        minimumTrackTintColor="#10b981"
        maximumTrackTintColor="#6B7280"
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
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  backText: {
    color: "#88C0D0",
    fontSize: 16,
    fontWeight: "600",
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
    backgroundColor: "#10b981", // highlight green
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
