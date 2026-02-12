import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { FontAwesome } from "@expo/vector-icons";

export default function LoginForm({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [linkedinLoading, setLinkedinLoading] = useState(false);

  // Listen for LinkedIn callback deep link
  useEffect(() => {
    const handleDeepLink = async ({ url }) => {
      if (!url || !url.includes("linkedin-login-callback")) return;

      const params = new URL(url.replace("qupdating://", "https://dummy/"));
      const action = params.searchParams.get("action");
      const error = params.searchParams.get("error");

      if (error) {
        setLinkedinLoading(false);
        if (error === "banned") {
          Alert.alert("Account Banned", "Your account has been banned.");
        } else {
          Alert.alert("LinkedIn Error", error);
        }
        return;
      }

      if (action === "login") {
        // Existing user — save token and navigate
        const token = params.searchParams.get("token");
        const userId = params.searchParams.get("userId");
        const userEmail = params.searchParams.get("email");

        await SecureStore.setItemAsync("authToken", token);
        await SecureStore.setItemAsync("userId", userId);
        await SecureStore.setItemAsync("userEmail", userEmail);

        setLinkedinLoading(false);
        navigation.navigate("MainTabs", { screen: "Dashboard" });
      }

      if (action === "register") {
        // New user — navigate to register with LinkedIn data pre-filled
        const linkedinData = JSON.parse(
          decodeURIComponent(params.searchParams.get("linkedinData")),
        );

        setLinkedinLoading(false);
        navigation.navigate("RegisterScreen", { linkedinData });
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Check if app was opened via deep link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription?.remove();
  }, [navigation]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("https://qup.dating/api/mobile/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        await SecureStore.setItemAsync("authToken", data.token);
        await SecureStore.setItemAsync("userId", data.user._id);
        await SecureStore.setItemAsync("userEmail", data.user.email);
        navigation.navigate("MainTabs", { screen: "Dashboard" });
      } else {
        Alert.alert("Login Failed", data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      Alert.alert("Error", "Network error");
    } finally {
      setLoading(false);
    }
  };
  const handleLinkedInLogin = async () => {
    try {
      setLinkedinLoading(true);

      const res = await fetch(
        "https://qup.dating/api/mobile/linkedin/login-auth-url",
      );
      const data = await res.json();

      if (!data.url) {
        throw new Error("No URL returned");
      }

      if (Platform.OS === "android") {
        await Linking.openURL(data.url);
      } else {
        await WebBrowser.openBrowserAsync(data.url);
      }

      setLinkedinLoading(false);
    } catch (err) {
      console.error("LinkedIn login error:", err);
      Alert.alert("Error", "Could not open LinkedIn login");
      setLinkedinLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to your account</Text>

      {/* LinkedIn Sign In Button */}
      <TouchableOpacity
        style={styles.linkedinButton}
        onPress={handleLinkedInLogin}
        disabled={linkedinLoading}
        activeOpacity={0.8}
      >
        {linkedinLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <FontAwesome name="linkedin-square" size={22} color="#fff" />
            <Text style={styles.linkedinButtonText}>Sign in with LinkedIn</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Email / Password */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <View style={{ marginTop: 20 }}>
        <Text style={{ textAlign: "center", color: "#ccc" }}>
          Don't have an account?{" "}
          <Text
            style={{ color: "#ff69b4", fontWeight: "600" }}
            onPress={() => navigation.navigate("RegisterScreen")}
          >
            Register here
          </Text>
        </Text>
      </View>

      <Text
        style={styles.forgotPassword}
        onPress={() => navigation.navigate("ForgotPasswordScreen")}
      >
        Forgot your password?
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#888",
    textAlign: "center",
    marginBottom: 30,
  },

  // LinkedIn Button
  linkedinButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A66C2",
    padding: 15,
    borderRadius: 8,
    gap: 10,
    marginBottom: 20,
  },
  linkedinButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  // Divider
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#333",
  },
  dividerText: {
    color: "#888",
    paddingHorizontal: 12,
    fontSize: 14,
  },

  // Form
  input: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    backgroundColor: "#ff69b4",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  forgotPassword: {
    color: "#ff69b4",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
    fontWeight: "600",
  },
});
