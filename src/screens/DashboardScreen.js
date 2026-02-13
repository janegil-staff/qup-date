import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import GlassBackground from "../components/GlassBackground";
import GlassCard from "../components/GlassCard";
import UserCard from "../components/UserCard";
import ProfileCompletion from "../components/ProfileCompletion";
import MatchCongrats from "../components/MatchCongrats";
import theme from "../theme";
import SafeBottomView from "../components/SafeBottomView";

const { height } = Dimensions.get("window");

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
  const swiperRef = useRef(null);
  const [swipeLabel, setSwipeLabel] = useState(null);
  const [showCongrats, setShowCongrats] = useState(false);

  const fetchCards = async () => {
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
  };

  useFocusEffect(
    useCallback(() => {
      fetchCards();
    }, [])
  );

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/mobile/me`,
          { headers: { Authorization: `Bearer ${token}` } }
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

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/mobile/stats`,
          { headers: { Authorization: `Bearer ${token}` } }
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

  const handleSwipeApi = async (direction, card) => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      if (!token || !card?._id) return;

      const endpoint =
        direction === "right" ? "/api/mobile/like" : "/api/mobile/dislike";

      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUserId: card._id }),
      });

      const data = await res.json();
      if (data.match === true) {
        setShowCongrats(true);
      }
    } catch (err) {
      console.error("Swipe API error:", err);
    }
  };

  const handleSwipe = (direction, index) => {
    const card = cards[index];
    if (!card) return;

    setSwipeLabel(direction === "right" ? "Liked ❤️" : "Passed");
    setTimeout(() => setSwipeLabel(null), 800);

    handleSwipeApi(direction, card);
    setCards((prev) => prev.filter((c) => c._id !== card._id));
  };

  if (loading) {
    return (
      <GlassBackground>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Finding matches...</Text>
        </View>
      </GlassBackground>
    );
  }

  return (
    <GlassBackground>
      <StatusBar barStyle="light-content" />
      
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Discover 🔥</Text>
          <Text style={styles.subtitle}>
            Find your perfect match
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            icon={<Ionicons name="flame-sharp" size={24} color="white" />}
            label="Views"
            value={stats.profileViews}
            colors={['rgba(236, 72, 153, 0.3)', 'rgba(139, 92, 246, 0.3)']}
          />
          <StatCard
            icon={<Feather name="heart" size={24} color="white" />}
            label="Likes"
            value={stats.newLikes}
            colors={['rgba(239, 68, 68, 0.3)', 'rgba(249, 115, 22, 0.3)']}
          />
          <StatCard
            icon={<Feather name="users" size={24} color="white" />}
            label="Matches"
            value={stats.newMatches}
            colors={['rgba(99, 102, 241, 0.3)', 'rgba(59, 130, 246, 0.3)']}
          />
          <StatCard
            icon={<Feather name="message-circle" size={24} color="white" />}
            label="Messages"
            value={stats.newMessages}
            colors={['rgba(16, 185, 129, 0.3)', 'rgba(34, 197, 94, 0.3)']}
          />
        </View>

        {/* Swiper Section */}
        <View style={styles.swipeSection}>
          {swipeLabel && (
            <View style={styles.swipeFeedback}>
              <LinearGradient
                colors={['rgba(233, 69, 96, 0.9)', 'rgba(15, 52, 96, 0.9)']}
                style={styles.swipeFeedbackGradient}
              >
                <Text style={styles.swipeFeedbackText}>{swipeLabel}</Text>
              </LinearGradient>
            </View>
          )}

          {cards.length > 0 ? (
            <Swiper
              key={cards.map((c) => c._id).join("-")}
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
              containerStyle={styles.swiperContainer}
              cardStyle={styles.cardStyle}
            />
          ) : (
            <View style={styles.noCardsContainer}>
              <GlassCard icon="🎯" title="No More Profiles">
                <Text style={styles.noCardsText}>
                  You've seen all available profiles!
                </Text>
                <Text style={[styles.noCardsText, { marginTop: 8 }]}>
                  Check back later for new matches.
                </Text>
              </GlassCard>
            </View>
          )}
        </View>

        {/* Profile Completion */}
        <ProfileCompletion user={user} />

        {/* Tips Card */}
        <GlassCard icon="💡" title="Pro Tips">
          <View style={styles.tipsContainer}>
            <TipItem text="Add more photos to get 3× more matches" />
            <TipItem text="Write a compelling bio to stand out" />
            <TipItem text="Enable location for better local matches" />
            <TipItem text="Be authentic and genuine in conversations" />
          </View>
        </GlassCard>
      </ScrollView>

      {showCongrats && (
        <MatchCongrats onClose={() => setShowCongrats(false)} />
      )}
      <SafeBottomView />
    </GlassBackground>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, colors }) {
  return (
    <View style={styles.statCard}>
      <LinearGradient colors={colors} style={styles.statGradient}>
        <View style={styles.statIconContainer}>{icon}</View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </LinearGradient>
    </View>
  );
}

// Tip Item Component
function TipItem({ text }) {
  return (
    <View style={styles.tipItem}>
      <View style={styles.tipBullet}>
        <Text style={styles.tipBulletText}>✓</Text>
      </View>
      <Text style={styles.tipText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.textSecondary,
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 16,
  },
  
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  statGradient: {
    padding: 16,
    alignItems: 'center',
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 4,
  },
  statLabel: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    opacity: 0.9,
  },

  // Swiper Section
  swipeSection: {
    height: 480,
    width: '100%',
    marginBottom: 24,
    position: 'relative',
  },
  swipeFeedback: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 999,
    alignItems: 'center',
  },
  swipeFeedbackGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  swipeFeedbackText: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.text,
  },
  swiperContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  noCardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCardsText: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Tips
  tipsContainer: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(233, 69, 96, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  tipBulletText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  tipText: {
    flex: 1,
    color: theme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
});