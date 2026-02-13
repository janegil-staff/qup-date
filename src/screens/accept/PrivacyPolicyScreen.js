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
import { LinearGradient } from "expo-linear-gradient";
import Screen from "../../components/Screen";

export default function PrivacyPolicyScreen({ navigation }) {
  return (
    <Screen style={{ backgroundColor: "#0f0f23" }}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last updated: February 13, 2026</Text>

        <Text style={styles.intro}>
          QUP Dating ("QUP", "we", "us", or "our") is committed to protecting
          your privacy. This Privacy Policy explains how we collect, use,
          disclose, and safeguard your information when you use our mobile
          application and related services.
        </Text>

        <Section title="1. Information We Collect">
          <Text style={styles.body}>
            We collect information you provide directly when creating and using
            your account:
          </Text>
          <BulletPoint text="Account information: name, email address, date of birth, gender, and password" />
          <BulletPoint text="Profile information: photos, bio, occupation, company, industry, education, appearance, lifestyle preferences, and interests" />
          <BulletPoint text="Social login data: when you sign in with Apple, Google, or LinkedIn, we receive your basic profile information (name, email, profile picture) from those services" />
          <BulletPoint text="Communications: messages you send to other users through our platform" />
          <BulletPoint text="Location data: with your permission, we collect your approximate location to help match you with nearby users" />
          <BulletPoint text="Usage data: how you interact with the app, including swipes, matches, and feature usage" />
          <BulletPoint text="Device information: device type, operating system, unique device identifiers, and network information" />
        </Section>

        <Section title="2. How We Use Your Information">
          <Text style={styles.body}>We use the information we collect to:</Text>
          <BulletPoint text="Create and manage your account" />
          <BulletPoint text="Provide matchmaking and dating services" />
          <BulletPoint text="Display your profile to other users" />
          <BulletPoint text="Enable communication between matched users" />
          <BulletPoint text="Verify your identity and prevent fraud" />
          <BulletPoint text="Improve and personalize your experience" />
          <BulletPoint text="Send you service-related notifications" />
          <BulletPoint text="Ensure safety and enforce our community guidelines" />
          <BulletPoint text="Comply with legal obligations" />
        </Section>

        <Section title="3. Information Sharing">
          <Text style={styles.body}>
            We do not sell your personal data. We may share your information in
            the following circumstances:
          </Text>
          <BulletPoint text="With other users: your profile information is visible to other QUP users as part of the matchmaking service" />
          <BulletPoint text="Service providers: we work with third-party services for hosting, analytics, and image storage (e.g., Cloudinary) that may process your data on our behalf" />
          <BulletPoint text="Legal requirements: we may disclose your information if required by law, court order, or governmental authority" />
          <BulletPoint text="Safety: we may share information to protect the safety of our users or the public" />
        </Section>

        <Section title="4. Data Storage and Security">
          <Text style={styles.body}>
            Your data is stored securely using industry-standard encryption and
            security measures. We use MongoDB for data storage and Cloudinary for
            image hosting. While we implement appropriate safeguards, no method
            of electronic storage is 100% secure, and we cannot guarantee
            absolute security.
          </Text>
        </Section>

        <Section title="5. Your Rights and Choices">
          <Text style={styles.body}>You have the right to:</Text>
          <BulletPoint text="Access and download your personal data" />
          <BulletPoint text="Update or correct your profile information" />
          <BulletPoint text="Delete your account and associated data" />
          <BulletPoint text="Opt out of non-essential communications" />
          <BulletPoint text="Withdraw consent for location tracking" />
          <Text style={styles.body}>
            To exercise these rights, use the in-app settings or contact us at
            qup.dating@gmail.com.
          </Text>
        </Section>

        <Section title="6. Data Retention">
          <Text style={styles.body}>
            We retain your personal data for as long as your account is active.
            When you delete your account, we will delete or anonymize your data
            within 30 days, except where we are required to retain it for legal
            or safety purposes.
          </Text>
        </Section>

        <Section title="7. Third-Party Services">
          <Text style={styles.body}>
            Our app may integrate with third-party services including Apple
            Sign-In, Google Sign-In, and LinkedIn. These services have their own
            privacy policies, and we encourage you to review them. We only
            receive the information you authorize these services to share with
            us.
          </Text>
        </Section>

        <Section title="8. Children's Privacy">
          <Text style={styles.body}>
            QUP is strictly for users aged 18 and older. We do not knowingly
            collect personal information from anyone under 18. If we discover
            that a user is under 18, we will immediately delete their account
            and associated data.
          </Text>
        </Section>

        <Section title="9. International Users">
          <Text style={styles.body}>
            If you are accessing QUP from the European Economic Area (EEA), you
            have additional rights under the General Data Protection Regulation
            (GDPR), including the right to data portability and the right to
            lodge a complaint with a supervisory authority.
          </Text>
        </Section>

        <Section title="10. Changes to This Policy">
          <Text style={styles.body}>
            We may update this Privacy Policy from time to time. We will notify
            you of any material changes by posting the new policy in the app and
            updating the "Last updated" date. Your continued use of QUP after
            changes constitutes acceptance of the updated policy.
          </Text>
        </Section>

        <Section title="11. Contact Us">
          <Text style={styles.body}>
            If you have any questions about this Privacy Policy or our data
            practices, please contact us at:
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
