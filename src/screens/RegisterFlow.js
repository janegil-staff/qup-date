import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { registerUser } from "../api/auth";

export default function RegisterFlow({ navigation }) {
  const [step, setStep] = useState(0);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [gender, setGender] = useState("");
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    try {
      const birthdate = year && month && day ? `${year}-${month}-${day}` : null;
      const payload = { name, email, password, birthdate, gender, image };

      const user = await registerUser(payload); // ✅ calls API and stores token

      navigation.replace("Profile", { user });
    } catch (err) {
      console.error(err);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View
          style={[styles.progressFill, { width: `${((step + 1) / 3) * 100}%` }]}
        />
      </View>

      {/* Step content */}
      {step === 0 && (
        <View style={styles.page}>
          <Text style={styles.title}>Step 1: Account Info</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
      )}

      {step === 1 && (
        <View style={styles.page}>
          <Text style={styles.title}>Step 2: Personal Info</Text>
          <Text style={styles.label}>Birthdate</Text>
          <View style={styles.row}>
            <Picker
              selectedValue={year}
              style={styles.smallPicker}
              onValueChange={setYear}
              dropdownIconColor="#fff"
            >
              <Picker.Item label="Year" value="" />
              {Array.from({ length: 100 }, (_, i) => {
                const y = new Date().getFullYear() - i;
                return (
                  <Picker.Item key={y} label={String(y)} value={String(y)} />
                );
              })}
            </Picker>
            <Picker
              selectedValue={month}
              style={styles.smallPicker}
              onValueChange={setMonth}
              dropdownIconColor="#fff"
            >
              <Picker.Item label="Month" value="" />
              {Array.from({ length: 12 }, (_, i) => (
                <Picker.Item
                  key={i + 1}
                  label={String(i + 1)}
                  value={String(i + 1).padStart(2, "0")}
                />
              ))}
            </Picker>
            <Picker
              selectedValue={day}
              style={styles.smallPicker}
              onValueChange={setDay}
              dropdownIconColor="#fff"
            >
              <Picker.Item label="Day" value="" />
              {Array.from({ length: 31 }, (_, i) => (
                <Picker.Item
                  key={i + 1}
                  label={String(i + 1)}
                  value={String(i + 1).padStart(2, "0")}
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Gender</Text>
          <Picker
            selectedValue={gender}
            style={styles.input}
            onValueChange={setGender}
            dropdownIconColor="#fff"
          >
            <Picker.Item label="Select gender" value="" />
            <Picker.Item label="Man" value="male" />
            <Picker.Item label="Woman" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
      )}

      {step === 2 && (
        <View style={styles.page}>
          <Text style={styles.title}>Step 3: Profile Image</Text>
          {image && <Image source={{ uri: image }} style={styles.preview} />}
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Pick an image (optional)</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Navigation controls */}
      <View style={styles.navControls}>
        {step > 0 && (
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setStep(step - 1)}
          >
            <Text style={styles.navText}>Back</Text>
          </TouchableOpacity>
        )}
        {step < 2 ? (
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setStep(step + 1)}
          >
            <Text style={styles.navText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.navButton} onPress={handleSubmit}>
            <Text style={styles.navText}>Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", padding: 24 },
  progressBar: {
    height: 6,
    backgroundColor: "#333",
    borderRadius: 3,
    marginBottom: 16,
  },
  progressFill: {
    height: 6,
    backgroundColor: "#88C0D0",
    borderRadius: 3,
  },
  page: { flex: 1, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 16 },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
    height: 48,
  },
  label: { color: "#ccc", marginTop: 12, marginBottom: 4 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  smallPicker: {
    flex: 1,
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 8,
    marginHorizontal: 4,
    height: 48,
  },
  preview: { width: 100, height: 100, borderRadius: 50, marginBottom: 8 },
  button: {
    backgroundColor: "#88C0D0",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },
  buttonText: { color: "#000", fontWeight: "bold", fontSize: 16 },
  navControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  navButton: {
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  navText: { color: "#fff", fontSize: 16 },
});
