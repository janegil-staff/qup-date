import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function LandingScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* HERO SECTION */}
      <ImageBackground
        source={require("../../assets/couple-smiling.png")}
        style={styles.hero}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Welcome to QupDate</Text>
          <Text style={styles.subtitle}>
            Modern, safe, and ad‑free dating for real connections
          </Text>

          {/* CTA BUTTONS */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.loginButton]}
              onPress={() => navigation.navigate("LoginForm")}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.registerButton]}
              onPress={() => navigation.navigate("RegisterScreen")}
            >
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* WHAT MAKES QUP DIFFERENT */}
      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>What Makes Qup Different</Text>

        <Text style={styles.featureText}>
          • A clean, ad‑free dating experience — no subscriptions, no paywalls.
        </Text>

        <Text style={styles.featureText}>
          • Safety‑first design with instant blocking, fast moderation, and clear community rules.
        </Text>

        <Text style={styles.featureText}>
          • Real profiles only — strict content rules and zero tolerance for abusive behavior.
        </Text>

        <Text style={styles.featureText}>
          • A modern, minimal, dark interface built for comfort and privacy.
        </Text>

        <Text style={styles.featureText}>
          • An international community built around respect, authenticity, and meaningful connections.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#000" },

  hero: { height: 500, justifyContent: "flex-end" },

  overlay: {
    backgroundColor: "rgba(0,0,0,0.55)",
    padding: 24,
    alignItems: "center",
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#ccc",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 20,
  },

  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
    width: "100%",
  },

  button: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
  },

  loginButton: { backgroundColor: "#88C0D0" },
  registerButton: { backgroundColor: "#A3BE8C" },

  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },

  aboutSection: {
    padding: 24,
    backgroundColor: "#111",
  },

  aboutTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#88C0D0",
    marginBottom: 12,
    textAlign: "center",
  },

  featureText: {
    color: "#d1d5db",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
    textAlign: "center",
  },
});
