import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { navigateWithParams } from "../../utils/navigation";
import LocationAutocomplete from "../../components/LocationAutocomplete";

<GooglePlacesAutocomplete
  placeholder="Enter Location"
  query={{
    key: "YOUR_GOOGLE_API_KEY",
    language: "en",
  }}
  onPress={(data, details = null) => {
    setLocation(data.description); // Save the selected location
  }}
  fetchDetails={true}
  styles={{
    textInput: {
      backgroundColor: "#1F2937",
      color: "#FFFFFF",
      borderRadius: 8,
      padding: 14,
      marginBottom: 16,
    },
    description: { color: "#FFFFFF" },
  }}
/>;

export default function OnboardingDetails({ navigation, route }) {
  const { name, email, password } = route.params;

  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [location, setLocation] = useState({});

  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );

  const handleNext = () => {
    navigateWithParams(navigation, "LifestyleBasicsScreen", route, {
      gender,
      birthdate: birthdate.toISOString(),
      location,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("LandingScreen")}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Personal Details</Text>
      {/* Gender */}
      <View style={styles.genderRow}>
        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === "male" && styles.selectedMale,
          ]}
          onPress={() => setGender("male")}
        >
          <Text style={styles.genderText}>Male</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === "female" && styles.selectedFemale,
          ]}
          onPress={() => setGender("female")}
        >
          <Text style={styles.genderText}>Female</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === "other" && styles.selectedOther,
          ]}
          onPress={() => setGender("other")}
        >
          <Text style={styles.genderText}>Other</Text>
        </TouchableOpacity>
      </View>
      {/* Birthdate */}
      <DateTimePicker
        value={birthdate}
        style={styles.input}
        mode="date"
        display="spinner"
        maximumDate={maxDate}
        themeVariant="light" // 👈 forces light theme on iOS
        textColor="#ffffff"
        onChange={(event, selectedDate) => {
          setShowPicker(false);
          if (selectedDate) setBirthdate(selectedDate);
        }}
      />
      {/* Location */}
      <LocationAutocomplete
        onSelect={(location) => {
          setLocation(location);
        }}
      />

      {/* Next Button */}
      <TouchableOpacity
        style={[styles.nextButton, !gender && styles.disabledButton]}
        onPress={handleNext}
        disabled={!gender} // 👈 disables until gender is selected
      >
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </View>
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
  nextButton: {
    backgroundColor: "#10b981", // green when active
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#6B7280", // 👈 gray when disabled
  },
  nextText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  genderRow: {
    flexDirection: "row", // 👈 puts buttons in a row
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },

  genderButton: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#1F2937", // default dark background
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
  },

  genderText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  selectedMale: {
    backgroundColor: "#3b82f6", // blue highlight
  },

  selectedFemale: {
    backgroundColor: "#ec4899", // pink highlight
  },

  selectedOther: {
    backgroundColor: "#10b981", // green highlight
  },

  container: {
    flex: 1,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
  nextButton: {
    backgroundColor: "#10b981",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
  },
  nextText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
