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

export default function CommunityGuidelinesScreen({ navigation }) {
  return (
    <Screen style={{ backgroundColor: "#0f0f23" }}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Community Guidelines</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          QUP is built on respect, authenticity, and kindness. These guidelines
          help create a safe and welcoming space for everyone. Violations may
          result in warnings, suspensions, or permanent bans.
        </Text>

        <GuidelineCard
          icon="✅"
          title="Be Authentic"
          description="Use real, recent photos of yourself. Provide accurate information about who you are. Catfishing, impersonation, or misrepresentation of your identity is strictly prohibited."
        />

        <GuidelineCard
          icon="🤝"
          title="Be Respectful"
          description="Treat every person on QUP with dignity and respect. We are a diverse community, and discrimination based on race, ethnicity, religion, gender, sexual orientation, disability, or any other characteristic will not be tolerated."
        />

        <GuidelineCard
          icon="💬"
          title="Communicate Kindly"
          description="Be considerate in your messages. If someone isn't interested, accept it gracefully. Persistent unwanted contact, insults, or aggressive messaging is harassment and will result in account action."
        />

        <GuidelineCard
          icon="🔞"
          title="Keep It Appropriate"
          description="Do not share sexually explicit content, nudity, or graphic material in your profile or messages. QUP is a professional dating platform, and we expect users to maintain appropriate standards."
        />

        <GuidelineCard
          icon="🚫"
          title="No Harassment or Threats"
          description="Any form of harassment, bullying, intimidation, stalking, or threats of violence is strictly prohibited. This includes behavior both on and off the platform that originates from a QUP connection."
        />

        <GuidelineCard
          icon="💰"
          title="No Scams or Solicitation"
          description="Do not use QUP for commercial purposes, solicitation, promotion, or scamming. This includes asking users for money, promoting products or services, or directing users to external websites for commercial gain."
        />

        <GuidelineCard
          icon="👤"
          title="One Account Per Person"
          description="Each person may only have one active QUP account. Creating multiple accounts, or creating a new account after being banned, is prohibited."
        />

        <GuidelineCard
          icon="🔒"
          title="Respect Privacy"
          description="Do not share other users' personal information, photos, or conversations outside of QUP without their explicit consent. Screenshots shared publicly may result in account suspension."
        />

        <GuidelineCard
          icon="⚖️"
          title="Follow the Law"
          description="Do not use QUP to facilitate or promote any illegal activity. Users must comply with all applicable local, national, and international laws."
        />

        <GuidelineCard
          icon="📢"
          title="Report Violations"
          description="If you see behavior that violates these guidelines, please report it. Reports are confidential, and we investigate every one. You can report users directly from their profile or contact us at qup.dating@gmail.com."
        />

        <View style={styles.consequencesCard}>
          <Text style={styles.consequencesTitle}>Enforcement</Text>
          <Text style={styles.consequencesBody}>
            We take violations seriously. Depending on severity, consequences
            may include:
          </Text>
          <BulletPoint text="Warning and content removal" />
          <BulletPoint text="Temporary account suspension" />
          <BulletPoint text="Permanent account ban" />
          <BulletPoint text="Reporting to law enforcement if applicable" />
          <Text style={styles.consequencesBody}>
            We reserve the right to take action at our sole discretion to
            maintain a safe community.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </Screen>
  );
}

function GuidelineCard({ icon, title, description }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>{icon}</Text>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={styles.cardBody}>{description}</Text>
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
  intro: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },
  cardBody: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    lineHeight: 21,
  },
  consequencesCard: {
    backgroundColor: "rgba(233,69,96,0.1)",
    borderRadius: 16,
    padding: 18,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(233,69,96,0.25)",
  },
  consequencesTitle: {
    color: "#e94560",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
  },
  consequencesBody: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: "row",
    paddingLeft: 4,
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
});
