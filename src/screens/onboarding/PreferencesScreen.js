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

export default function PreferencesScreen({ navigation, route }) {
  const { name, email, password, gender, birthdate, images, profileImage } =
    route.params;

  const [occupation, setOccupation] = useState("");
  const [education, setEducation] = useState("");
  const [religion, setReligion] = useState("");
  const [location, setLocation] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [appearance, setAppearance] = useState("");
  const [smoking, setSmoking] = useState("");
  const [drinking, setDrinking] = useState("");
  const [hasChildren, setHasChildren] = useState("");
  const [wantsChildren, setWantsChildren] = useState("");
  const [relationshipStatus, setRelationshipStatus] = useState("");
  const [willingToRelocate, setWillingToRelocate] = useState("");
  const [bio, setBio] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [preferredAge, setPreferredAge] = useState([20, 40]); // min/max age

  const handleNext = () => {
    navigation.navigate("ReviewSubmit", {
      name,
      email,
      password,
      gender,
      birthdate,
      images,
      profileImage,
      occupation,
      education,
      religion,
      location,
      bodyType,
      appearance,
      smoking,
      drinking,
      hasChildren,
      wantsChildren,
      relationshipStatus,
      willingToRelocate,
      bio,
      lookingFor,
      preferredAge,
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
      <Text style={styles.heading}>Tell Us More About You</Text>

      <TextInput
        style={styles.input}
        placeholder="Occupation"
        placeholderTextColor="#9CA3AF"
        value={occupation}
        onChangeText={setOccupation}
      />
      <TextInput
        style={styles.input}
        placeholder="Education"
        placeholderTextColor="#9CA3AF"
        value={education}
        onChangeText={setEducation}
      />
      <TextInput
        style={styles.input}
        placeholder="Religion"
        placeholderTextColor="#9CA3AF"
        value={religion}
        onChangeText={setReligion}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        placeholderTextColor="#9CA3AF"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Body Type"
        placeholderTextColor="#9CA3AF"
        value={bodyType}
        onChangeText={setBodyType}
      />
      <TextInput
        style={styles.input}
        placeholder="Appearance"
        placeholderTextColor="#9CA3AF"
        value={appearance}
        onChangeText={setAppearance}
      />
      <TextInput
        style={styles.input}
        placeholder="Smoking (Yes/No)"
        placeholderTextColor="#9CA3AF"
        value={smoking}
        onChangeText={setSmoking}
      />
      <TextInput
        style={styles.input}
        placeholder="Drinking (Yes/No)"
        placeholderTextColor="#9CA3AF"
        value={drinking}
        onChangeText={setDrinking}
      />
      <TextInput
        style={styles.input}
        placeholder="Has Children (Yes/No)"
        placeholderTextColor="#9CA3AF"
        value={hasChildren}
        onChangeText={setHasChildren}
      />
      <TextInput
        style={styles.input}
        placeholder="Wants Children (Yes/No)"
        placeholderTextColor="#9CA3AF"
        value={wantsChildren}
        onChangeText={setWantsChildren}
      />
      <TextInput
        style={styles.input}
        placeholder="Relationship Status"
        placeholderTextColor="#9CA3AF"
        value={relationshipStatus}
        onChangeText={setRelationshipStatus}
      />
      <TextInput
        style={styles.input}
        placeholder="Willing to Relocate (Yes/No)"
        placeholderTextColor="#9CA3AF"
        value={willingToRelocate}
        onChangeText={setWillingToRelocate}
      />
      <TextInput
        style={styles.input}
        placeholder="Bio"
        placeholderTextColor="#9CA3AF"
        value={bio}
        onChangeText={setBio}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Looking For in a Relationship"
        placeholderTextColor="#9CA3AF"
        value={lookingFor}
        onChangeText={setLookingFor}
      />

      <Text style={styles.label}>
        Preferred Age Range: {preferredAge[0]} - {preferredAge[1]}
      </Text>
      <Slider
        style={{ width: "100%", height: 40 }}
        minimumValue={18}
        maximumValue={60}
        step={1}
        value={preferredAge[0]}
        onValueChange={(val) => setPreferredAge([val, preferredAge[1]])}
        minimumTrackTintColor="#10b981"
        maximumTrackTintColor="#6B7280"
      />
      <Slider
        style={{ width: "100%", height: 40 }}
        minimumValue={18}
        maximumValue={60}
        step={1}
        value={preferredAge[1]}
        onValueChange={(val) => setPreferredAge([preferredAge[0], val])}
        minimumTrackTintColor="#10b981"
        maximumTrackTintColor="#6B7280"
      />

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 4,
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
