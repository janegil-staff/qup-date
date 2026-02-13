import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const FALLBACK_ITEMS = [
  { text: "Welcome to QUP Dating! Complete your profile to get more matches.", type: "tip" },
  { text: "Tip: Add more photos to increase your visibility by up to 70%.", type: "tip" },
  { text: "New: Sign in with Apple and Google for faster access.", type: "update" },
];

// We render the text TWICE side by side so when the first copy scrolls off,
// the second copy is already visible — creates seamless infinite scroll
export default function NewsTicker() {
  const [items, setItems] = useState(FALLBACK_ITEMS);
  const scrollX = useRef(new Animated.Value(0)).current;
  const animRef = useRef(null);

  // Fetch news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("https://qup.dating/api/mobile/news");
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          setItems(data.items);
        }
      } catch (err) {}
    };
    fetchNews();
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Build text
  const separator = "       ★       ";
  const fullText = items
    .map((item) => {
      const icon = item.type === "tip" ? "💡" : "📢";
      return `${icon} ${item.text}`;
    })
    .join(separator) + separator;

  // The trick: we use a fixed TEXT_BLOCK_WIDTH and render the text twice.
  // Animated.loop scrolls from 0 to -TEXT_BLOCK_WIDTH, then resets to 0.
  // Since there's an identical copy at +TEXT_BLOCK_WIDTH, it looks seamless.
  const TEXT_BLOCK_WIDTH = fullText.length * 7; // approximate width

  useEffect(() => {
    if (animRef.current) {
      animRef.current.stop();
    }

    scrollX.setValue(0);

    animRef.current = Animated.loop(
      Animated.timing(scrollX, {
        toValue: -TEXT_BLOCK_WIDTH,
        duration: TEXT_BLOCK_WIDTH * 18,
        useNativeDriver: true,
        isInteraction: false,
      })
    );

    animRef.current.start();

    return () => {
      if (animRef.current) {
        animRef.current.stop();
      }
    };
  }, [items, TEXT_BLOCK_WIDTH]);

  return (
    <View style={styles.container}>
      <View style={styles.liveIndicator}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>LIVE</Text>
      </View>

      <View style={styles.tickerWrapper}>
        <Animated.View
          style={[
            styles.textRow,
            { transform: [{ translateX: scrollX }] },
          ]}
        >
          <Text numberOfLines={1} style={styles.tickerText}>
            {fullText}
          </Text>
          <Text numberOfLines={1} style={styles.tickerText}>
            {fullText}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(233, 69, 96, 0.12)",
    paddingVertical: 8,
    paddingLeft: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(233, 69, 96, 0.15)",
    overflow: "hidden",
    height: 36,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(233, 69, 96, 0.25)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 10,
    zIndex: 1,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#e94560",
    marginRight: 4,
  },
  liveText: {
    color: "#e94560",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  tickerWrapper: {
    flex: 1,
    overflow: "hidden",
    height: 20,
    justifyContent: "center",
  },
  textRow: {
    flexDirection: "row",
    position: "absolute",
  },
  tickerText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: "500",
  },
});
