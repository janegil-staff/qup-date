import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

export default function AgeRangeSlider({
  preferredAgeMin,
  preferredAgeMax,
  onChange,
}) {
  // Hard limits
  const MIN = 18;
  const MAX = 90;

  // Normalize backend values
  const [minVal, maxVal] = useMemo(() => {
    const safeMin =
      typeof preferredAgeMin === "number" && preferredAgeMin >= MIN
        ? preferredAgeMin
        : MIN;

    const safeMax =
      typeof preferredAgeMax === "number" && preferredAgeMax <= MAX
        ? preferredAgeMax
        : MAX;

    return [safeMin, safeMax];
  }, [preferredAgeMin, preferredAgeMax]);

  const handleMinChange = (newMin) => {
    if (newMin > maxVal) {
      onChange([maxVal, maxVal]);
    } else {
      onChange([newMin, maxVal]);
    }
  };

  const handleMaxChange = (newMax) => {
    if (newMax < minVal) {
      onChange([minVal, minVal]);
    } else {
      onChange([minVal, newMax]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Preferred Age Range</Text>

      <View style={styles.sliderGroup}>
        <Slider
          minimumValue={MIN}
          maximumValue={MAX}
          value={minVal}
          onValueChange={handleMinChange}
          minimumTrackTintColor="#ec4899"
          maximumTrackTintColor="#555"
          thumbTintColor="#ec4899"
        />

        <Slider
          minimumValue={MIN}
          maximumValue={MAX}
          value={maxVal}
          onValueChange={handleMaxChange}
          minimumTrackTintColor="#ec4899"
          maximumTrackTintColor="#555"
          thumbTintColor="#ec4899"
        />
      </View>

      <Text style={styles.rangeText}>
        From <Text style={styles.highlight}>{minVal.toFixed(0)}</Text> to{" "}
        <Text style={styles.highlight}>{maxVal.toFixed(0)}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  label: { color: "#d1d5db", marginBottom: 8, fontSize: 16 },
  sliderGroup: { flexDirection: "column", gap: 12 },
  rangeText: { color: "#9ca3af", marginTop: 8 },
  highlight: { color: "#ec4899", fontWeight: "bold" },
});
