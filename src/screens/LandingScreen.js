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
      <ImageBackground
        source={require("../../assets/couple-smiling.png")}
        style={styles.hero}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Welcome to QupDate</Text>
          <Text style={styles.subtitle}>
            Love with Norwegian warmth and world-class UX
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("AccountSetupScreen")}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>About QupDate</Text>
        <Text style={styles.aboutText}>
          QupDate is a modern dating platform built for Norway — with dark
          theme, beautiful design, and real connection. We combine safety,
          style, and usability to give you an experience that feels like home.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#000" },
  hero: { height: 500, justifyContent: "flex-end" },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: { fontSize: 16, color: "#ccc", marginTop: 8, textAlign: "center" },
  button: {
    marginTop: 20,
    backgroundColor: "#88C0D0",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: { color: "#000", fontWeight: "bold", fontSize: 16 },
  aboutSection: { padding: 24, backgroundColor: "#111" },
  aboutTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#88C0D0",
    marginBottom: 12,
  },
  aboutText: { fontSize: 16, color: "#ccc", lineHeight: 22 },
});
