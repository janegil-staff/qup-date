import React, { useState } from "react";
import { View, Text, TouchableOpacity, Linking, StyleSheet, ScrollView } from "react-native";

export default function TermsSafetyScreen({ navigation }) {
  const [agreed, setAgreed] = useState(false);

  const openTerms = () => {
    Linking.openURL("https://gist.github.com/janegil-staff/2c58e9f7baba9b7327f6ceba41636de7");
  };

  const openPrivacy = () => {
    Linking.openURL("https://gist.github.com/janegil-staff/70ae21183f3a9c48103dddfffea8c6f9");
  };

  const continueToApp = () => {
    if (agreed) {
      navigation.navigate("LandingScreen"); // or Login, depending on your flow
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Terms & Safety</Text>

      <Text style={styles.text}>
        By continuing, you agree to our Terms of Use and Privacy Policy.
        {"\n\n"}
        Qup Dating has zero tolerance for objectionable content, harassment,
        nudity, threats, or abusive behavior. Violations may result in immediate
        account removal.
      </Text>

      <TouchableOpacity style={styles.linkButton} onPress={openTerms}>
        <Text style={styles.linkText}>View Terms of Use</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={openPrivacy}>
        <Text style={styles.linkText}>View Privacy Policy</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.agreeButton, agreed && styles.agreeButtonActive]}
        onPress={() => setAgreed(!agreed)}
      >
        <Text style={styles.agreeText}>
          {agreed ? "✓ You Agree" : "Tap to Agree"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.continueButton, agreed && styles.continueButtonActive]}
        onPress={continueToApp}
        disabled={!agreed}
      >
        <Text style={styles.continueText}>I Agree and Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#111",
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: "#ccc",
    lineHeight: 22,
    marginBottom: 30,
  },
  linkButton: {
    marginBottom: 16,
  },
  linkText: {
    color: "#4da6ff",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  agreeButton: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#333",
    marginTop: 20,
    marginBottom: 20,
  },
  agreeButtonActive: {
    backgroundColor: "#4da6ff",
  },
  agreeText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  continueButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#333",
  },
  continueButtonActive: {
    backgroundColor: "#4da6ff",
  },
  continueText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
  },
});
