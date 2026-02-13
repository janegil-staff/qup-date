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
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import * as AppleAuthentication from "expo-apple-authentication";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Screen from "../components/Screen";

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_WEB_CLIENT_ID =
  "170048399186-5v85djbb6ebivvlbs1volnkcaauoeuv9.apps.googleusercontent.com";

const GOOGLE_IOS_CLIENT_ID =
  "170048399186-fj4u4plti98u0b9hahct28v88db7gvdp.apps.googleusercontent.com";

// ─── GOOGLE NATIVE MODULE (safe import for Expo Go) ───
let GoogleSignin, statusCodes;
try {
  const module = require("@react-native-google-signin/google-signin");
  GoogleSignin = module.GoogleSignin;
  statusCodes = module.statusCodes;
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
  });
} catch (e) {
  // Native module not available (Expo Go) — Google login disabled
}

export default function LoginForm({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [linkedinLoading, setLinkedinLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // ─── LINKEDIN DEEP LINK HANDLER ───
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
        const linkedinData = JSON.parse(
          decodeURIComponent(params.searchParams.get("linkedinData")),
        );
        setLinkedinLoading(false);
        navigation.navigate("RegisterScreen", { linkedinData });
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription?.remove();
  }, [navigation]);

  // ─── EMAIL/PASSWORD LOGIN ───
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

  // ─── LINKEDIN LOGIN ───
  const handleLinkedInLogin = async () => {
    try {
      setLinkedinLoading(true);
      const res = await fetch(
        "https://qup.dating/api/mobile/linkedin/login-auth-url",
      );
      const data = await res.json();

      if (!data.url) throw new Error("No URL returned");

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

  // ─── APPLE LOGIN ───
  const handleAppleLogin = async () => {
    try {
      setAppleLoading(true);
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const res = await fetch("https://qup.dating/api/mobile/apple/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identityToken: credential.identityToken,
          authorizationCode: credential.authorizationCode,
          fullName: credential.fullName,
          email: credential.email,
          user: credential.user,
        }),
      });

      const data = await res.json();

      if (res.ok && data.action === "login") {
        await SecureStore.setItemAsync("authToken", data.token);
        await SecureStore.setItemAsync("userId", data.user._id);
        await SecureStore.setItemAsync("userEmail", data.user.email);
        navigation.navigate("MainTabs", { screen: "Dashboard" });
      } else if (res.ok && data.action === "register") {
        navigation.navigate("RegisterScreen", {
          appleData: {
            appleUserId: credential.user,
            name:
              credential.fullName?.givenName && credential.fullName?.familyName
                ? `${credential.fullName.givenName} ${credential.fullName.familyName}`
                : "",
            email: credential.email || data.email || "",
          },
        });
      } else {
        Alert.alert("Login Failed", data.error || "Apple sign-in failed");
      }
    } catch (err) {
      if (err.code === "ERR_REQUEST_CANCELED") {
        // User cancelled — do nothing
      } else {
        console.error("Apple login error:", err);
        Alert.alert("Error", "Apple sign-in failed. Please try again.");
      }
    } finally {
      setAppleLoading(false);
    }
  };

  // ─── GOOGLE LOGIN (Native) ───
  const handleGooglePress = async () => {
    if (!GoogleSignin) {
      Alert.alert(
        "Not Available",
        "Google Sign-In is only available in production builds.",
      );
      return;
    }

    try {
      setGoogleLoading(true);
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      await handleGoogleLogin(tokens.accessToken);
    } catch (err) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled — do nothing
      } else if (err.code === statusCodes.IN_PROGRESS) {
        // Sign in already in progress
      } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Error", "Google Play Services is not available.");
      } else {
        console.error("Google sign-in error:", err);
        Alert.alert("Error", "Google sign-in failed. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleLogin = async (accessToken) => {
    try {
      const res = await fetch("https://qup.dating/api/mobile/google/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken }),
      });

      const data = await res.json();

      if (res.ok && data.action === "login") {
        await SecureStore.setItemAsync("authToken", data.token);
        await SecureStore.setItemAsync("userId", data.user._id);
        await SecureStore.setItemAsync("userEmail", data.user.email);
        navigation.navigate("MainTabs", { screen: "Dashboard" });
      } else if (res.ok && data.action === "register") {
        navigation.navigate("RegisterScreen", {
          googleData: {
            googleId: data.googleId,
            name: data.name || "",
            email: data.email || "",
            picture: data.picture || "",
          },
        });
      } else {
        Alert.alert("Login Failed", data.error || "Google sign-in failed");
      }
    } catch (err) {
      console.error("Google login error:", err);
      Alert.alert("Error", "Google sign-in failed. Please try again.");
    }
  };

  return (
    <Screen style={{ backgroundColor: "#0f0f23" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>

          {/* ── SOCIAL LOGIN BUTTONS ── */}
          <View style={styles.socialSection}>
            {/* LinkedIn */}
            <TouchableOpacity
              style={styles.linkedinBtn}
              onPress={handleLinkedInLogin}
              disabled={linkedinLoading}
              activeOpacity={0.8}
            >
              {linkedinLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <FontAwesome name="linkedin-square" size={22} color="#fff" />
                  <Text style={styles.socialBtnText}>
                    Continue with LinkedIn
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Apple (iOS only) */}
            {Platform.OS === "ios" && (
              <TouchableOpacity
                style={styles.appleBtn}
                onPress={handleAppleLogin}
                disabled={appleLoading}
                activeOpacity={0.8}
              >
                {appleLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="logo-apple" size={22} color="#fff" />
                    <Text style={styles.socialBtnText}>
                      Continue with Apple
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}

            {/* Google */}
            <TouchableOpacity
              style={styles.googleBtn}
              onPress={handleGooglePress}
              disabled={googleLoading}
              activeOpacity={0.8}
            >
              {googleLoading ? (
                <ActivityIndicator color="#333" />
              ) : (
                <>
                  <FontAwesome name="google" size={20} color="#4285F4" />
                  <Text style={styles.googleBtnText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or sign in with email</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* ── EMAIL / PASSWORD ── */}
          <View style={styles.inputField}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#888"
              style={{ marginRight: 10 }}
            />
            <TextInput
              style={styles.inputText}
              placeholder="Email Address"
              placeholderTextColor="#555"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputField}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#888"
              style={{ marginRight: 10 }}
            />
            <TextInput
              style={styles.inputText}
              placeholder="Password"
              placeholderTextColor="#555"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPasswordScreen")}
            activeOpacity={0.7}
          >
            <Text style={styles.forgotPassword}>Forgot your password?</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.ctaBtn, loading && { opacity: 0.6 }]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#e94560", "#ff6b9d"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.ctaText}>Sign In</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Register Link */}
          <Text style={styles.registerLink}>
            Don't have an account?{" "}
            <Text
              style={{ color: "#e94560", fontWeight: "600" }}
              onPress={() => navigation.navigate("RegisterScreen")}
            >
              Register here
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    position: "absolute",
    top: Platform.OS === "ios" ? 56 : 30,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 110 : 90,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 32,
    lineHeight: 21,
  },
  socialSection: {
    gap: 12,
    marginBottom: 24,
  },
  linkedinBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A66C2",
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  appleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  socialBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  googleBtnText: {
    color: "#333",
    fontWeight: "700",
    fontSize: 16,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  dividerText: {
    color: "#555",
    paddingHorizontal: 12,
    fontSize: 13,
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 16 : 12,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 14,
  },
  inputText: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  forgotPassword: {
    color: "#e94560",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
    marginBottom: 24,
  },
  ctaBtn: {
    borderRadius: 14,
    overflow: "hidden",
  },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 8,
  },
  ctaText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  registerLink: {
    textAlign: "center",
    color: "rgba(255,255,255,0.5)",
    marginTop: 24,
    fontSize: 14,
  },
});
