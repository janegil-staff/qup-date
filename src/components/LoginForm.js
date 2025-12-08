import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

export default function LoginForm({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      // 1. Get CSRF token
      const csrfRes = await fetch("https://qup.dating/api/auth/csrf");
      const { csrfToken } = await csrfRes.json();

      // 2. Post credentials to NextAuth
      const response = await fetch(
        "https://qup.dating/api/auth/signin/credentials",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `csrfToken=${csrfToken}&email=${encodeURIComponent(
            email
          )}&password=${encodeURIComponent(password)}`,
        }
      );

      // 3. Handle response
      if (response.ok) {
        Alert.alert("Success", "Logged in successfully!");
        navigation.replace("MainTabs", { screen: "Home" });
      } else {
        const errorText = await response.text();
        Alert.alert("Login Failed", errorText || "Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("LandingScreen")}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.heading}>Login</Text>

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
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>
      </View>
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
  form: {
    width: "100%",
    maxWidth: 400,
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
  button: {
    backgroundColor: "#10b981",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: "#6B7280",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
