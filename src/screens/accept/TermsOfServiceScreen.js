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

export default function TermsOfServiceScreen({ navigation }) {
  return (
    <Screen style={{ backgroundColor: "#0f0f23" }}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last updated: February 13, 2026</Text>

        <Text style={styles.intro}>
          Welcome to QUP Dating. By accessing or using our application, you
          agree to be bound by these Terms of Service. Please read them
          carefully before using our services.
        </Text>

        <Section title="1. Acceptance of Terms">
          <Text style={styles.body}>
            By creating an account or using QUP, you agree to these Terms of
            Service, our Privacy Policy, and our Community Guidelines. If you do
            not agree to any of these terms, you must not use our services.
          </Text>
        </Section>

        <Section title="2. Eligibility">
          <Text style={styles.body}>
            You must be at least 18 years old to use QUP. By creating an
            account, you represent and warrant that you are at least 18 years of
            age, have the legal capacity to enter into a binding agreement, and
            are not prohibited from using the service under any applicable laws.
          </Text>
        </Section>

        <Section title="3. Account Registration">
          <Text style={styles.body}>
            You agree to provide accurate, current, and complete information
            during registration and to update such information to keep it
            accurate. You are responsible for maintaining the confidentiality of
            your account credentials and for all activities that occur under your
            account. You must notify us immediately of any unauthorized use.
          </Text>
        </Section>

        <Section title="4. User Conduct">
          <Text style={styles.body}>You agree not to:</Text>
          <BulletPoint text="Impersonate any person or misrepresent your identity, age, or affiliation" />
          <BulletPoint text="Harass, bully, stalk, intimidate, or threaten any other user" />
          <BulletPoint text="Post content that is hateful, discriminatory, violent, sexually explicit, or otherwise offensive" />
          <BulletPoint text="Use the service for any commercial, promotional, or solicitation purposes" />
          <BulletPoint text="Send spam, unsolicited messages, or automated communications" />
          <BulletPoint text="Attempt to gain unauthorized access to other accounts or our systems" />
          <BulletPoint text="Use the service to facilitate illegal activities" />
          <BulletPoint text="Upload malicious code, viruses, or harmful content" />
          <BulletPoint text="Create multiple accounts or use the service after being banned" />
        </Section>

        <Section title="5. Content and Intellectual Property">
          <Text style={styles.body}>
            You retain ownership of content you upload to QUP. However, by
            posting content, you grant us a non-exclusive, worldwide,
            royalty-free license to use, display, and distribute your content
            within the service. You represent that you have the right to share
            any content you upload and that it does not infringe on third-party
            rights.
          </Text>
        </Section>

        <Section title="6. Matching and Interactions">
          <Text style={styles.body}>
            QUP provides a platform for meeting other users. We do not guarantee
            matches, compatibility, or the conduct of other users. You are solely
            responsible for your interactions with other users. We strongly
            recommend meeting in public places and informing a friend or family
            member about your plans.
          </Text>
        </Section>

        <Section title="7. Safety and Reporting">
          <Text style={styles.body}>
            We take user safety seriously. If you encounter inappropriate
            behavior, you can report users directly within the app. We reserve
            the right to investigate reports and take action including warnings,
            temporary suspensions, or permanent bans at our sole discretion.
          </Text>
        </Section>

        <Section title="8. Account Suspension and Termination">
          <Text style={styles.body}>
            We may suspend or terminate your account at any time if we
            reasonably believe you have violated these Terms, our Community
            Guidelines, or any applicable law. You may delete your account at
            any time through the app settings. Upon deletion, your profile and
            data will be removed in accordance with our Privacy Policy.
          </Text>
        </Section>

        <Section title="9. Disclaimers">
          <Text style={styles.body}>
            QUP is provided "as is" and "as available" without warranties of any
            kind, either express or implied. We do not warrant that the service
            will be uninterrupted, secure, or error-free. We disclaim all
            liability for the conduct of users both on and off the platform.
          </Text>
        </Section>

        <Section title="10. Limitation of Liability">
          <Text style={styles.body}>
            To the maximum extent permitted by law, QUP and its affiliates shall
            not be liable for any indirect, incidental, special, consequential,
            or punitive damages arising out of or relating to your use of the
            service. Our total liability shall not exceed the amount you have
            paid to us in the twelve months preceding the claim.
          </Text>
        </Section>

        <Section title="11. Indemnification">
          <Text style={styles.body}>
            You agree to indemnify and hold harmless QUP, its officers,
            directors, employees, and agents from any claims, damages, losses,
            or expenses arising from your use of the service, violation of these
            Terms, or infringement of any third-party rights.
          </Text>
        </Section>

        <Section title="12. Governing Law">
          <Text style={styles.body}>
            These Terms shall be governed by and construed in accordance with the
            laws of Norway, without regard to its conflict of law provisions.
          </Text>
        </Section>

        <Section title="13. Changes to Terms">
          <Text style={styles.body}>
            We reserve the right to modify these Terms at any time. We will
            notify you of material changes through the app or via email.
            Continued use of QUP after changes constitutes acceptance of the
            revised Terms.
          </Text>
        </Section>

        <Section title="14. Contact Us">
          <Text style={styles.body}>
            For questions about these Terms of Service, contact us at:
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
