import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { testRegister } from "../api/testRegister";

import { registerUser } from "../api/auth";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Birthdate dropdowns
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  // Gender dropdown
  const [gender, setGender] = useState("");

  // Optional image
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
s
  const handleSubmit = async () => {
    try {
      const user = await registerUser({
        name,
        email,
        password,
        day,
        month,
        year,
        gender,
        image,
      });
      console.log("Registered:", user);
    } catch (err) {
      console.error("Register failed:", err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#111",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
    height: 48, // 👈 consistent height
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
    height: 48, // 👈 compact like inputs
  },
  imagePicker: { marginVertical: 16, alignItems: "center" },
  preview: { width: 100, height: 100, borderRadius: 50, marginBottom: 8 },
  button: {
    backgroundColor: "#88C0D0",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },
  buttonText: { color: "#000", fontWeight: "bold", fontSize: 16 },
});
