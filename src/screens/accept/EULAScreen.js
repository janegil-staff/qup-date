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

export default function EULAScreen({ navigation }) {
  return (
    <Screen style={{ backgroundColor: "#0f0f23" }}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>End User License Agreement</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last updated: February 13, 2026</Text>

        <Text style={styles.intro}>
          This End User License Agreement ("EULA") is a legal agreement between
          you ("User") and QUP Dating ("QUP", "we", "us") for the use of the
          QUP Dating mobile application ("App"). By installing or using the App,
          you agree to be bound by this EULA.
        </Text>

        <Section title="1. License Grant">
          <Text style={styles.body}>
            We grant you a limited, non-exclusive, non-transferable, revocable
            license to download, install, and use the App on a device that you
            own or control, strictly in accordance with this EULA and our Terms
            of Service.
          </Text>
        </Section>

        <Section title="2. License Restrictions">
          <Text style={styles.body}>You agree not to:</Text>
          <BulletPoint text="Copy, modify, or distribute the App or any portion of it" />
          <BulletPoint text="Reverse engineer, decompile, disassemble, or attempt to derive the source code of the App" />
          <BulletPoint text="Rent, lease, lend, sell, sublicense, or transfer the App to any third party" />
          <BulletPoint text="Remove, alter, or obscure any proprietary notices in the App" />
          <BulletPoint text="Use the App for any purpose that is illegal or prohibited by this EULA" />
          <BulletPoint text="Use automated systems, bots, or scripts to interact with the App" />
        </Section>

        <Section title="3. Intellectual Property">
          <Text style={styles.body}>
            The App and all related content, features, and functionality
            (including but not limited to design, graphics, text, logos, and
            software) are owned by QUP and are protected by copyright,
            trademark, and other intellectual property laws. This EULA does not
            grant you any rights to our trademarks, logos, or brand features.
          </Text>
        </Section>

        <Section title="4. User Content">
          <Text style={styles.body}>
            You retain ownership of any content you create or upload through the
            App, including photos, text, and profile information. By uploading
            content, you grant us a license to use, display, and distribute it
            as described in our Terms of Service. You are solely responsible for
            the content you share and must ensure it does not violate any laws or
            third-party rights.
          </Text>
        </Section>

        <Section title="5. Privacy">
          <Text style={styles.body}>
            Your use of the App is also governed by our Privacy Policy, which
            describes how we collect, use, and protect your personal information.
            By using the App, you consent to the data practices described in our
            Privacy Policy.
          </Text>
        </Section>

        <Section title="6. Third-Party Services">
          <Text style={styles.body}>
            The App may integrate with or provide access to third-party services
            such as Apple Sign-In, Google Sign-In, LinkedIn, and Cloudinary. Your
            use of these services is subject to their respective terms and
            conditions. We are not responsible for the content, privacy policies,
            or practices of third-party services.
          </Text>
        </Section>

        <Section title="7. App Updates">
          <Text style={styles.body}>
            We may release updates, patches, or new versions of the App from
            time to time. Some updates may be required for continued use of the
            App. You agree that we may automatically update the App, and this
            EULA will apply to all updates unless a separate agreement is
            provided.
          </Text>
        </Section>

        <Section title="8. Disclaimers and Warranties">
          <Text style={styles.body}>
            THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF
            ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE APP WILL BE
            UNINTERRUPTED, ERROR-FREE, OR SECURE. WE DISCLAIM ALL LIABILITY FOR
            THE ACTIONS, CONTENT, AND CONDUCT OF OTHER USERS. USE THE APP AT
            YOUR OWN RISK.
          </Text>
        </Section>

        <Section title="9. Limitation of Liability">
          <Text style={styles.body}>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, QUP SHALL NOT BE LIABLE FOR
            ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
            DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, LOSS OF PROFITS,
            OR PERSONAL INJURY, ARISING FROM YOUR USE OF THE APP. OUR TOTAL
            LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID FOR THE APP OR
            IN-APP PURCHASES IN THE TWELVE MONTHS PRECEDING THE CLAIM.
          </Text>
        </Section>

        <Section title="10. Termination">
          <Text style={styles.body}>
            This EULA is effective until terminated. Your rights under this EULA
            will terminate automatically if you fail to comply with any of its
            terms. We may also terminate or suspend your access at any time
            without notice. Upon termination, you must cease all use of the App
            and delete it from your device.
          </Text>
        </Section>

        <Section title="11. Apple-Specific Terms">
          <Text style={styles.body}>
            If you downloaded the App from the Apple App Store, the following
            additional terms apply:
          </Text>
          <BulletPoint text="This EULA is between you and QUP only, not with Apple. Apple has no obligation to provide maintenance or support for the App." />
          <BulletPoint text="In the event of any failure of the App to conform to applicable warranties, you may notify Apple for a refund of the purchase price (if any). Apple has no other warranty obligation." />
          <BulletPoint text="Apple is not responsible for addressing any claims relating to the App, including product liability, legal compliance, or intellectual property claims." />
          <BulletPoint text="Apple and its subsidiaries are third-party beneficiaries of this EULA and may enforce it against you." />
        </Section>

        <Section title="12. Google Play-Specific Terms">
          <Text style={styles.body}>
            If you downloaded the App from Google Play, you acknowledge that
            Google has no obligation or liability with respect to the App or this
            EULA. Any claims, liabilities, or obligations are between you and
            QUP only.
          </Text>
        </Section>

        <Section title="13. Governing Law">
          <Text style={styles.body}>
            This EULA shall be governed by and construed in accordance with the
            laws of Norway, without regard to its conflict of law provisions.
          </Text>
        </Section>

        <Section title="14. Contact Us">
          <Text style={styles.body}>
            If you have questions about this EULA, please contact us at:
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
