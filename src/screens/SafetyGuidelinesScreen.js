import { View, Text, ScrollView, TouchableOpacity } from "react-native";

export default function SafetyGuidelinesScreen({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#000", paddingTop: 50 }}>
      
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          paddingVertical: 10,
          paddingHorizontal: 5,
          marginTop: 10,
          marginLeft: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 18, marginRight: 6 }}>‹</Text>
        <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
          Back
        </Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text
          style={{
            color: "white",
            fontSize: 28,
            fontWeight: "700",
            marginBottom: 20,
          }}
        >
          Safety Guidelines
        </Text>

        {/* Sections */}
        <Text style={styles.sectionTitle}>Respect & Kindness</Text>
        <Text style={styles.sectionText}>
          Treat others with respect. Harassment, threats, hate speech, or abusive
          behavior are not allowed on Qup Dating.
        </Text>

        <Text style={styles.sectionTitle}>No Minors</Text>
        <Text style={styles.sectionText}>
          You must be 18 or older to use this app. Do not interact with or
          represent yourself as a minor.
        </Text>

        <Text style={styles.sectionTitle}>Stay Private</Text>
        <Text style={styles.sectionText}>
          Keep personal information safe. Avoid sharing your home address, bank
          details, or other sensitive data with people you just met.
        </Text>

        <Text style={styles.sectionTitle}>Meet Safely</Text>
        <Text style={styles.sectionText}>
          If you choose to meet someone in person, meet in a public place and
          let a friend or family member know where you’re going.
        </Text>

        <Text style={styles.sectionTitle}>Report & Block</Text>
        <Text style={styles.sectionText}>
          If someone makes you uncomfortable, you can report or block them at
          any time. We take safety seriously and review all reports.
        </Text>

        <Text style={styles.sectionTitle}>Inappropriate Content</Text>
        <Text style={styles.sectionText}>
          Do not upload explicit, violent, or illegal content. Profiles
          violating these rules may be removed.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = {
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 6,
  },
  sectionText: {
    color: "#ccc",
    fontSize: 15,
    lineHeight: 22,
  },
};
