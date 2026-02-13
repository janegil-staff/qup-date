import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Screen from "../../components/Screen";

export default function CookiePolicyScreen({ navigation }) {
  return (
    <Screen style={{ backgroundColor: "#0f0f23" }}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cookie Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last updated: February 13, 2026</Text>

        <Text style={styles.intro}>
          This Cookie Policy explains how QUP Dating ("QUP", "we", "us")
          uses cookies and similar technologies when you use our application and
          website.
        </Text>

        <Section title="1. What Are Cookies?">
          <Text style={styles.body}>
            Cookies are small text files stored on your device when you visit a
            website or use an application. They help us recognize your device,
            remember your preferences, and improve your experience. Similar
            technologies include local storage, session storage, and device
            identifiers.
          </Text>
        </Section>

        <Section title="2. How We Use Cookies">
          <Text style={styles.body}>We use cookies and similar technologies for:</Text>
          <BulletPoint text="Essential functionality: keeping you logged in, maintaining your session, and ensuring the app works properly" />
          <BulletPoint text="Authentication: remembering your login status so you don't have to sign in each time" />
          <BulletPoint text="Security: protecting your account from unauthorized access and detecting suspicious activity" />
          <BulletPoint text="Preferences: remembering your settings and preferences to personalize your experience" />
          <BulletPoint text="Analytics: understanding how users interact with our app to improve our services" />
        </Section>

        <Section title="3. Types of Data We Store">
          <Text style={styles.body}>
            In our mobile application, we use secure device storage (such as
            Secure Store on iOS and Android) to store:
          </Text>
          <BulletPoint text="Authentication tokens to keep you logged in" />
          <BulletPoint text="Your user ID for quick access to your profile" />
          <BulletPoint text="Basic preferences and settings" />
          <Text style={styles.body}>
            This data is stored securely on your device and is not accessible to
            other applications.
          </Text>
        </Section>

        <Section title="4. Third-Party Services">
          <Text style={styles.body}>
            Some third-party services we integrate with may use their own
            cookies or tracking technologies:
          </Text>
          <BulletPoint text="Apple Sign-In: Apple's authentication services" />
          <BulletPoint text="Google Sign-In: Google's authentication and identity services" />
          <BulletPoint text="LinkedIn: LinkedIn's authentication and verification services" />
          <BulletPoint text="Cloudinary: our image hosting provider" />
          <Text style={styles.body}>
            These third parties have their own privacy and cookie policies. We
            encourage you to review their respective policies.
          </Text>
        </Section>

        <Section title="5. Your Choices">
          <Text style={styles.body}>You can manage cookies and stored data by:</Text>
          <BulletPoint text="Logging out of the app, which removes your authentication token" />
          <BulletPoint text="Deleting your account, which removes all associated data" />
          <BulletPoint text="Clearing your device's app data through your device settings" />
          <BulletPoint text="Adjusting your device's privacy settings for location and tracking" />
          <Text style={styles.body}>
            Note that disabling essential cookies or clearing app data may
            require you to log in again and could affect app functionality.
          </Text>
        </Section>

        <Section title="6. Updates to This Policy">
          <Text style={styles.body}>
            We may update this Cookie Policy from time to time to reflect
            changes in our practices or for other operational, legal, or
            regulatory reasons. We will notify you of material changes by
            updating the "Last updated" date.
          </Text>
        </Section>

        <Section title="7. Contact Us">
          <Text style={styles.body}>
            If you have questions about our use of cookies, please contact us
            at:
          </Text>
          <Text style={styles.contactInfo}>qup.dating@gmail.com</Text>
        </Section>

        <View style={{ height: 40 }} />
      </ScrollView>
    </Screen>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function BulletPoint({ text }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#0f0f23",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  lastUpdated: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 13,
    marginBottom: 16,
  },
  intro: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#e94560",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 10,
  },
  body: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: "row",
    paddingLeft: 8,
    marginBottom: 6,
  },
  bullet: {
    color: "#e94560",
    fontSize: 15,
    marginRight: 8,
    marginTop: 1,
  },
  bulletText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    lineHeight: 21,
    flex: 1,
  },
  contactInfo: {
    color: "#e94560",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 4,
  },
});
