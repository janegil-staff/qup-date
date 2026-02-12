// src/screens/LinkedInVerifyScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";

export default function LinkedInVerifyScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("authToken");

      const res = await fetch(
        "https://qup.dating/api/mobile/linkedin/auth-url",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      if (!data.url) {
        throw new Error(data.error || "No auth URL returned");
      }

      // Open LinkedIn login in in-app browser
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        "qupdating://linkedin-callback",
      );

      if (result.type === "success" && result.url) {
        const url = new URL(result.url);
        const success = url.searchParams.get("success");
        const error = url.searchParams.get("error");

        if (success === "true") {
          Toast.show({
            type: "success",
            text1: "LinkedIn Verified! ✓",
            text2: "Your professional identity has been confirmed.",
          });
          navigation.goBack();
        } else if (error) {
          const messages = {
            denied: "You cancelled the verification.",
            already_linked:
              "This LinkedIn is already linked to another Qup account.",
            server_error: "Something went wrong. Please try again.",
            user_not_found: "Account not found. Please log in again.",
          };
          Toast.show({
            type: "error",
            text1: "Verification Failed",
            text2: messages[error] || "Unknown error occurred.",
          });
        }
      }
    } catch (err) {
      console.error("LinkedIn verify error:", err);
      Toast.show({
        type: "error",
        text1: "Connection Error",
        text2: "Could not connect to LinkedIn. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#0f0c29", "#1a1a2e", "#16213e"]}
      style={styles.container}
    >
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <FontAwesome name="arrow-left" size={20} color="#fff" />
      </TouchableOpacity>

      <View style={styles.content}>
        {/* LinkedIn icon */}
        <View style={styles.iconContainer}>
          <FontAwesome name="linkedin-square" size={64} color="#0A66C2" />
        </View>

        <Text style={styles.title}>Verify with LinkedIn</Text>
        <Text style={styles.subtitle}>
          Prove you're a real professional. Get a verified badge on your profile
          and boost trust with potential matches.
        </Text>

        {/* Benefits */}
        <View style={styles.benefits}>
          {[
            "Verified professional badge on your profile",
            "Higher visibility in Discover",
            "Build trust with quality matches",
          ].map((text, i) => (
            <View key={i} style={styles.benefitRow}>
              <FontAwesome
                name="check-circle"
                size={16}
                color="#10b981"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.benefitText}>{text}</Text>
            </View>
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={styles.linkedinButton}
          onPress={handleVerify}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <FontAwesome
                name="linkedin-square"
                size={22}
                color="#fff"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.linkedinButtonText}>
                Verify with LinkedIn
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Privacy note */}
        <Text style={styles.disclaimer}>
          We only access your basic profile info (name, email, photo).{"\n"}
          We never post on your behalf.
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(10, 102, 194, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.65)",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
    maxWidth: 320,
  },
  benefits: {
    alignSelf: "stretch",
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  benefitText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    flex: 1,
  },
  linkedinButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A66C2",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: "100%",
    shadowColor: "#0A66C2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  linkedinButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  disclaimer: {
    fontSize: 11,
    color: "rgba(255,255,255,0.35)",
    textAlign: "center",
    marginTop: 20,
    lineHeight: 18,
  },
});
