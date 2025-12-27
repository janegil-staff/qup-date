import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as SecureStore from "expo-secure-store";

import UserCard from "../components/UserCard";
import ProfileCompletion from "../components/ProfileCompletion";
import Screen from "../components/Screen";
import VerifyBanner from "../components/VerifyBanner";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState({
    profileViews: 0,
    newLikes: 0,
    newMatches: 0,
    newMessages: 0,
  });
  const [cards, setCards] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user
  useEffect(() => {
    async function fetchUser() {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/mobile/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data.user || data);
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    }
    fetchUser();
  }, []);

  // Fetch stats
  useEffect(() => {
    async function fetchStats() {
      try {
        const token = await SecureStore.getItemAsync("authToken");

        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/mobile/stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    }
    fetchStats();
  }, []);

  // Fetch swipe cards
  useEffect(() => {
    async function fetchCards() {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/mobile/users`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setCards(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching cards:", err);
        setCards([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCards();
  }, []);

  const handleSwipeApi = async (direction, card) => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      if (!token || !card?._id) return;

      const endpoint =
        direction === "right" ? "/api/mobile/like" : "/api/mobile/dislike";

      await fetch(`${process.env.EXPO_PUBLIC_API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUserId: card._id }),
      });
    } catch (err) {
      console.error("Swipe API error:", err);
    }
  };

  const handleSwipe = (direction, index) => {
    const card = cards[index];
    if (!card) return;

    handleSwipeApi(direction, card);

    // Remove from deck
    setCards((prev) => prev.filter((c) => c._id !== card._id));
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <Screen style={{ backgroundColor: "#111827" }}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome back 👋</Text>
            <Text style={styles.subtitle}>
              Here’s what’s happening on your profile
            </Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <StatCard
              icon={<Ionicons name="flame-sharp" size={28} color="white" />}
              label="Profile Views"
              value={stats.profileViews}
              colors={["#ec4899", "#8b5cf6"]}
            />
            <StatCard
              icon={<Feather name="heart" size={28} color="white" />}
              label="New Likes"
              value={stats.newLikes}
              colors={["#ef4444", "#f97316"]}
            />
            <StatCard
              icon={<Feather name="users" size={28} color="white" />}
              label="New Matches"
              value={stats.newMatches}
              colors={["#6366f1", "#3b82f6"]}
            />
            <StatCard
              icon={<Feather name="message-circle" size={28} color="white" />}
              label="New Messages"
              value={stats.newMessages}
              colors={["#10b981", "#22c55e"]}
            />
          </View>
          <View style={styles.swipeSection}>
            <Swiper
              cards={cards}
              renderCard={(card) => (
                <UserCard user={card} navigation={navigation} />
              )}
              onSwipedLeft={(i) => handleSwipe("left", i)}
              onSwipedRight={(i) => handleSwipe("right", i)}
              backgroundColor="transparent"
              stackSize={3}
              stackSeparation={15}
              animateCardOpacity
              verticalSwipe={false}
              horizontalThreshold={15}
              verticalThreshold={25}
              swipeBackCard={true}
              swipeAnimationDuration={90}
              cardVerticalMargin={0}
              containerStyle={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              cardStyle={{
                height: "100%",
                width: "100%",
                borderRadius: 20,
              }}
            />
          </View>

          {/* Profile Completion */}
          <ProfileCompletion user={user} />

          {/* Suggestions */}
          <View style={styles.suggestions}>
            <Text style={styles.suggestionsTitle}>Suggestions</Text>
            <Text style={styles.suggestion}>
              <Text style={styles.bullet}>• </Text>
              Add more photos to get 3× more matches
            </Text>
            <Text style={styles.suggestion}>
              <Text style={styles.bullet}>• </Text>
              Write a short bio to improve your profile
            </Text>
            <Text style={styles.suggestion}>
              <Text style={styles.bullet}>• </Text>
              Enable location for better matches
            </Text>
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
}

function StatCard({ icon, label, value, colors }) {
  return (
    <LinearGradient colors={colors} style={styles.statCard}>
      <View style={styles.statIcon}>{icon}</View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  swiperInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  cardStyle: {
    width: "100%",
    alignSelf: "center",
  },

  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
  loader: {
    flex: 1,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
  },
  subtitle: {
    color: "#9ca3af",
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    width: "48%",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
  },
  statLabel: {
    color: "white",
    opacity: 0.8,
    marginTop: 4,
  },
  swipeSection: {
    height: 460,
    width: "100%",
    marginBottom: 30,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  likeLabel: {
    backgroundColor: "transparent",
    color: "#22c55e",
    fontSize: 32,
    fontWeight: "800",
    borderWidth: 3,
    borderColor: "#22c55e",
    padding: 10,
    borderRadius: 8,
  },
  likeWrapper: {
    position: "absolute",
    top: 50,
    right: 20,
  },
  nopeLabel: {
    backgroundColor: "transparent",
    color: "#ef4444",
    fontSize: 32,
    fontWeight: "800",
    borderWidth: 3,
    borderColor: "#ef4444",
    padding: 10,
    borderRadius: 8,
  },
  nopeWrapper: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  noCards: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#374151",
    alignItems: "center",
    justifyContent: "center",
  },
  noCardsText: {
    color: "#9ca3af",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  suggestions: {
    backgroundColor: "#1f2937",
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
  },
  suggestionsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    marginBottom: 10,
  },
  suggestion: {
    color: "#d1d5db",
    marginBottom: 6,
  },
  bullet: {
    color: "#ec4899",
  },
});
