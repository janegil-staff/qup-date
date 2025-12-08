import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { navigateWithParams } from "../utils/navigation";

function ButtonGroup({ options, selected, onSelect }) {
  return (
    <View style={styles.buttonRow}>
      {options.map((opt) => {
        const label = typeof opt === "string" ? opt : opt.label;
        const value = typeof opt === "string" ? opt : opt.value;

        return (
          <TouchableOpacity
            key={label}
            style={[
              styles.optionButton,
              selected === value && styles.selectedButton,
            ]}
            onPress={() => onSelect(value)}
          >
            <Text style={styles.optionText}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function HabitsFamilyScreen({ navigation, route }) {
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
  } = route.params;

  const [smoking, setSmoking] = useState("");
  const [drinking, setDrinking] = useState("");
  const [hasChildren, setHasChildren] = useState("");
  const [wantsChildren, setWantsChildren] = useState("");
  const [relationshipStatus, setRelationshipStatus] = useState("");
  const [willingToRelocate, setWillingToRelocate] = useState("");

  const handleNext = () => {
    navigateWithParams(navigation, "BioPreferencesScreen", route, {
      smoking,
      drinking,
      hasChildren,
      wantsChildren,
      relationshipStatus,
      willingToRelocate,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#111827" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Habits & Family</Text>

        {/* Smoking */}
        <Text style={styles.label}>Smoking</Text>
        <ButtonGroup
          options={["Yes", "No", "Occasionally"]}
          selected={smoking}
          onSelect={setSmoking}
        />

        {/* Drinking */}
        <Text style={styles.label}>Drinking</Text>
        <ButtonGroup
          options={["None", "Light / social drinker", "Heavy"]}
          selected={drinking}
          onSelect={setDrinking}
        />

        {/* Has Children */}
        <Text style={styles.label}>Has Children</Text>
        <ButtonGroup
          options={[
            { label: "Yes", value: true },
            { label: "No", value: false },
          ]}
          selected={hasChildren}
          onSelect={setHasChildren}
        />

        {/* Wants Children */}
        <Text style={styles.label}>Wants Children</Text>
        <ButtonGroup
          options={[
            { label: "Yes", value: true },
            { label: "No", value: false },
          ]}
          selected={wantsChildren}
          onSelect={setWantsChildren}
        />

        {/* Relationship Status */}
        <Text style={styles.label}>Relationship Status</Text>
        <ButtonGroup
          options={["Single", "In a relationship", "Married"]}
          selected={relationshipStatus}
          onSelect={setRelationshipStatus}
        />

        {/* Willing to Relocate */}
        <Text style={styles.label}>Willing to Relocate</Text>
        <ButtonGroup
          options={[
            { label: "Yes", value: true },
            { label: "No", value: false },
          ]}
          selected={willingToRelocate}
          onSelect={setWillingToRelocate}
        />

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
