import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useState, useEffect } from "react";

export default function LandingScreen({ navigation }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    linkedinVerified: 0,
    verifiedPercent: 0,
  });

  useEffect(() => {
    fetch("https://qup.dating/api/mobile/public-stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* HERO SECTION */}
      <ImageBackground
        source={require("../../assets/couple-smiling.png")}
        style={styles.hero}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.9)"]}
          style={styles.overlay}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoBadge}>
              <Ionicons name="briefcase" size={32} color="#fff" />
            </View>
          </View>

          <Text style={styles.title}>QUP</Text>
          <Text style={styles.tagline}>
            Swipe with confidence.{"\n"}Date with ambition.
          </Text>

          {/* Trust Badges */}
          <View style={styles.trustRow}>
            <View style={styles.trustBadge}>
              <FontAwesome name="linkedin-square" size={14} color="#0A66C2" />
              <Text style={styles.trustText}>LinkedIn Verified</Text>
            </View>
            <View style={styles.trustBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#00D9A8" />
              <Text style={styles.trustText}>Email Verified</Text>
            </View>
          </View>

          {/* CTA BUTTONS */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.loginButton]}
              onPress={() => navigation.navigate("LoginForm")}
            >
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.registerButton]}
              onPress={() => navigation.navigate("RegisterScreen")}
            >
              <LinearGradient
                colors={["#e94560", "#ff6b9d"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.registerGradient}
              >
                <Text style={styles.registerButtonText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>

      {/* HOW IT WORKS */}
      <View style={styles.howSection}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <Text style={styles.sectionSubtitle}>
          Three steps to meaningful connections
        </Text>

        <View style={styles.stepsContainer}>
          <StepCard
            number="1"
            icon="person-add"
            title="Create Your Profile"
            description="Sign up and tell us about your career, interests, and what you're looking for"
          />
          <View style={styles.stepConnector} />
          <StepCard
            number="2"
            icon="logo-linkedin"
            title="Verify with LinkedIn"
            description="Connect your LinkedIn to prove you're a real professional — it takes 30 seconds"
          />
          <View style={styles.stepConnector} />
          <StepCard
            number="3"
            icon="heart"
            title="Start Matching"
            description="Discover verified professionals who share your values and ambitions"
          />
        </View>
      </View>

      {/* LINKEDIN VERIFICATION SECTION */}
      <View style={styles.linkedinSection}>
        <LinearGradient
          colors={["#0A66C2", "#004182"]}
          style={styles.linkedinGradient}
        >
          <FontAwesome name="linkedin-square" size={48} color="#fff" />
          <Text style={styles.linkedinTitle}>LinkedIn Verified Profiles</Text>
          <Text style={styles.linkedinDescription}>
            Every user can verify their identity through LinkedIn. No
            catfishing, no fake profiles — just real professionals looking for
            real connections.
          </Text>

          <View style={styles.linkedinFeatures}>
            <LinkedInFeature
              icon="checkmark-circle"
              text="Confirms real identity"
            />
            <LinkedInFeature
              icon="checkmark-circle"
              text="Proves professional background"
            />
            <LinkedInFeature
              icon="checkmark-circle"
              text="Verified badge on your profile"
            />
            <LinkedInFeature
              icon="checkmark-circle"
              text="Builds trust with matches"
            />
          </View>
        </LinearGradient>
      </View>

      {/* KEY FEATURES */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Built for Professionals</Text>
        <Text style={styles.sectionSubtitle}>
          Dating designed around your busy life
        </Text>

        <View style={styles.featureGrid}>
          <FeatureCard
            icon="briefcase"
            title="Career-Smart Matching"
            description="Filter by industry, education, and career goals to find someone who gets your lifestyle"
          />
          <FeatureCard
            icon="lock-closed"
            title="Privacy First"
            description="Your LinkedIn data stays private. We only show your verification badge — nothing else"
          />
          <FeatureCard
            icon="people"
            title="Serious Connections"
            description="A community focused on meaningful relationships, not endless swiping"
          />
          <FeatureCard
            icon="eye-off"
            title="Discreet & Safe"
            description="Block, report, and control who sees your profile. Your safety is our priority"
          />
        </View>
      </View>

      {/* STATISTICS */}
      <View style={styles.statsSection}>
        <LinearGradient
          colors={["rgba(233, 69, 96, 0.15)", "rgba(15, 52, 96, 0.15)"]}
          style={styles.statsGradient}
        >
          <Text style={styles.statsTitle}>Growing Every Day</Text>
          <View style={styles.statsRow}>
<StatItem number={`${stats.totalUsers}`} label="Professionals" icon="people" />
<StatItem number={`${stats.verifiedPercent}%`} label="LinkedIn Verified" icon="logo-linkedin" />
<StatItem number={`${stats.linkedinVerified}`} label="Verified Profiles" icon="shield-checkmark" />
          </View>
        </LinearGradient>
      </View>

      {/* SAFETY & PRIVACY */}
      <View style={styles.safetySection}>
        <Text style={styles.sectionTitle}>Your Safety Matters</Text>
        <Text style={styles.sectionSubtitle}>
          We take privacy and security seriously
        </Text>

        <SafetyItem
          icon="shield-checkmark"
          title="Double Verification"
          description="Email verification + LinkedIn verification for maximum trust"
        />
        <SafetyItem
          icon="hand-left"
          title="Instant Blocking"
          description="Block anyone instantly. They'll never know and can't contact you again"
        />
        <SafetyItem
          icon="flag"
          title="24-Hour Report Review"
          description="Every report is reviewed within 24 hours by our safety team"
        />
        <SafetyItem
          icon="eye-off"
          title="Data Privacy"
          description="Your personal data is encrypted and never sold to third parties"
        />
      </View>

      {/* FINAL CTA */}
      <View style={styles.finalCTA}>
        <LinearGradient
          colors={["#1a1a2e", "#16213e"]}
          style={styles.finalCTAGradientBg}
        >
          <Text style={styles.finalCTATitle}>
            Ready to Meet Someone{"\n"}Who Gets It?
          </Text>
          <Text style={styles.finalCTASubtitle}>
            Join thousands of verified professionals on QUP
          </Text>
          <TouchableOpacity
            style={styles.finalCTAButton}
            onPress={() => navigation.navigate("RegisterScreen")}
          >
            <LinearGradient
              colors={["#e94560", "#ff6b9d"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.finalCTAButtonGradient}
            >
              <Text style={styles.finalCTAButtonText}>Create Your Profile</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.finalCTANote}>
            Free to join. No credit card required.
          </Text>
        </LinearGradient>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
        <Text style={styles.footerCopyright}>© 2025 QUP</Text>
      </View>
    </ScrollView>
  );
}

// Step Card Component
function StepCard({ number, icon, title, description }) {
  return (
    <View style={styles.stepCard}>
      <View style={styles.stepNumberContainer}>
        <LinearGradient
          colors={["#e94560", "#ff6b9d"]}
          style={styles.stepNumberGradient}
        >
          <Text style={styles.stepNumber}>{number}</Text>
        </LinearGradient>
      </View>
      <View style={styles.stepIconContainer}>
        <Ionicons name={icon} size={28} color="#e94560" />
      </View>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepDescription}>{description}</Text>
    </View>
  );
}

// LinkedIn Feature Item
function LinkedInFeature({ icon, text }) {
  return (
    <View style={styles.linkedinFeatureItem}>
      <Ionicons name={icon} size={18} color="#fff" />
      <Text style={styles.linkedinFeatureText}>{text}</Text>
    </View>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description }) {
  return (
    <View style={styles.featureCard}>
      <View style={styles.featureIconContainer}>
        <LinearGradient
          colors={["rgba(233, 69, 96, 0.15)", "rgba(15, 52, 96, 0.15)"]}
          style={styles.featureIconBg}
        >
          <Ionicons name={icon} size={28} color="#e94560" />
        </LinearGradient>
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  );
}

// Stat Item Component
function StatItem({ number, label, icon }) {
  return (
    <View style={styles.statItem}>
      <Ionicons
        name={icon}
        size={24}
        color="#e94560"
        style={{ marginBottom: 8 }}
      />
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// Safety Item Component
function SafetyItem({ icon, title, description }) {
  return (
    <View style={styles.safetyItem}>
      <View style={styles.safetyIconContainer}>
        <Ionicons name={icon} size={24} color="#00D9A8" />
      </View>
      <View style={styles.safetyContent}>
        <Text style={styles.safetyTitle}>{title}</Text>
        <Text style={styles.safetyDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0f0f23",
  },

  // Hero Section
  hero: {
    height: 620,
    justifyContent: "flex-end",
  },
  overlay: {
    padding: 32,
    paddingBottom: 48,
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(233, 69, 96, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#e94560",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  title: {
    fontSize: 42,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 18,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 20,
    fontWeight: "500",
  },
  trustRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
  },
  trustBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  trustText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 14,
    overflow: "hidden",
  },
  loginButton: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerButton: {
    flex: 1,
  },
  registerGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  registerButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  // How It Works
  howSection: {
    padding: 24,
    paddingTop: 40,
    backgroundColor: "#111827",
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    marginBottom: 32,
  },
  stepsContainer: {
    alignItems: "center",
  },
  stepCard: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  stepNumberContainer: {
    position: "absolute",
    top: -16,
    borderRadius: 16,
    overflow: "hidden",
  },
  stepNumberGradient: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumber: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
  stepIconContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    lineHeight: 20,
  },
  stepConnector: {
    width: 2,
    height: 24,
    backgroundColor: "rgba(233, 69, 96, 0.3)",
  },

  // LinkedIn Section
  linkedinSection: {
    margin: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  linkedinGradient: {
    padding: 32,
    alignItems: "center",
  },
  linkedinTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 12,
  },
  linkedinDescription: {
    fontSize: 15,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  linkedinFeatures: {
    width: "100%",
    gap: 12,
  },
  linkedinFeatureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  linkedinFeatureText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },

  // Features Section
  featuresSection: {
    padding: 24,
    backgroundColor: "#111827",
  },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  featureCard: {
    width: "47%",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  featureIconContainer: {
    marginBottom: 12,
  },
  featureIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    lineHeight: 17,
  },

  // Stats Section
  statsSection: {
    padding: 20,
  },
  statsGradient: {
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: "rgba(233, 69, 96, 0.2)",
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
  },

  // Safety Section
  safetySection: {
    padding: 24,
    backgroundColor: "#111827",
  },
  safetyItem: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  safetyIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 217, 168, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  safetyContent: {
    flex: 1,
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  safetyDescription: {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    lineHeight: 19,
  },

  // Final CTA
  finalCTA: {
    padding: 20,
  },
  finalCTAGradientBg: {
    borderRadius: 24,
    padding: 36,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(233, 69, 96, 0.2)",
  },
  finalCTATitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 34,
  },
  finalCTASubtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    marginBottom: 28,
  },
  finalCTAButton: {
    width: "100%",
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#e94560",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginBottom: 16,
  },
  finalCTAButtonGradient: {
    flexDirection: "row",
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  finalCTAButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  finalCTANote: {
    fontSize: 13,
    color: "rgba(255,255,255,0.4)",
  },

  // Footer
  footer: {
    padding: 24,
    backgroundColor: "#0f0f23",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.3)",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 18,
  },
  footerCopyright: {
    fontSize: 12,
    color: "rgba(255,255,255,0.2)",
  },
});
