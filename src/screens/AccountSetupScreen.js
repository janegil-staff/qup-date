import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function AccountSetupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValid = name && email.includes("@") && password.length >= 6;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create Your Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#9CA3AF"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#9CA3AF"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password (min 6 chars)"
        placeholderTextColor="#9CA3AF"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.nextButton, !isValid && styles.nextButtonDisabled]}
        disabled={!isValid}
        onPress={() =>
          navigation.navigate("OnboardingDetails", { name, email, password })
        }
      >
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
  nextButtonDisabled: {
    backgroundColor: "#6B7280",
  },
  nextText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
