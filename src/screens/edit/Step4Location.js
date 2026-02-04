import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Progress from "react-native-progress";
import { saveProfile, fetchUser } from "../../utils/profileService";
import LocationAutocomplete from "../../components/LocationAutocomplete";
import normalizeCountry from "../../utils/normalizeCountry";
import AgeRangeSlider from "../../components/AgeRangeSlider";

export default function Step4Location({ form, setForm, setField }) {
  const navigation = useNavigation();
  const [tagsText, setTagsText] = useState("");
  const [ageRange, setAgeRange] = useState([18, 90]);

  // Load user data ONCE and prefill the form
  useEffect(() => {
    const load = async () => {
      try {
        const user = await fetchUser();

        setForm((prev) => ({
          ...prev,
          location: user.location || null,
          searchScope: user.searchScope || "worldwide",
          willingToRelocate: user.willingToRelocate ?? false,
          tags: user.tags || [],
          preferredAgeMin: user.preferredAgeMin ?? 18,
          preferredAgeMax: user.preferredAgeMax ?? 90,
        }));

        setTagsText((user.tags || []).join(" "));
      } catch (err) {
        console.error("Failed to load user", err);
      }
    };

    load();
  }, []);

  const handleSaveAndNext = async () => {
    try {
      const tags = tagsText
        .split(" ")
        .map((t) => t.trim())
        .filter((t) => t.startsWith("#") && t.length > 1);

      const updatedUser = await saveProfile({
        location: form.location?.name
          ? {
              name: form.location.name,
              lat: form.location.lat,
              lng: form.location.lng,
              country: normalizeCountry(form.location.country),
            }
          : null,
        tags,
        searchScope: form.searchScope || "worldwide",
        willingToRelocate: form.willingToRelocate ?? false,
        preferredAgeMin: form.preferredAgeMin ?? 18,
        preferredAgeMax: form.preferredAgeMax ?? 90,
      });

      setForm((prev) => ({
        ...prev,
        location: updatedUser.location,
      }));

      navigation.navigate("EditImages", { user: updatedUser });
    } catch (err) {
      console.error("SAVE ERROR:", err);
      Alert.alert("Error", "Failed to save");
    }
  };

  const searchOptions = [
    { key: "national", label: "Nearby" },
    { key: "worldwide", label: "Worldwide" },
  ];

  return (
    <View style={styles.container}>
      <Progress.Bar
        progress={0.8}
        width={null}
        color="#ff69b4"
        style={styles.progress}
      />

      <Text style={styles.label}>Location</Text>

      <LocationAutocomplete
        value={form.location?.name || ""}
        onChange={(text) =>
          setField("location", {
            ...(form.location || {}),
            name: text,
          })
        }
        onSelect={(location) =>
          setField("location", {
            name: location.name,
            lat: location.lat,
            lng: location.lng,
            country: normalizeCountry(location.country),
          })
        }
      />

      <Text style={styles.label}>Search Preference</Text>

      <View style={styles.row}>
        {searchOptions.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[
              styles.radioButton,
              form.searchScope === opt.key && styles.radioActive,
            ]}
            onPress={() => setField("searchScope", opt.key)}
          >
            <Text
              style={[
                styles.radioText,
                form.searchScope === opt.key && styles.radioTextActive,
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Willing to Relocate</Text>

      <View style={styles.row}>
        {[
          { key: true, label: "Yes" },
          { key: false, label: "No" },
        ].map((opt) => (
          <TouchableOpacity
            key={opt.label}
            style={[
              styles.radioButton,
              form.willingToRelocate === opt.key && styles.radioActive,
            ]}
            onPress={() => setField("willingToRelocate", opt.key)}
          >
            <Text
              style={[
                styles.radioText,
                form.willingToRelocate === opt.key && styles.radioTextActive,
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Tags</Text>
      <TextInput
        style={styles.input}
        placeholder="#hiking #coffee"
        placeholderTextColor="#666"
        value={tagsText}
        onChangeText={setTagsText}
      />
      <Text></Text>
      <AgeRangeSlider
        preferredAgeMin={form.preferredAgeMin}
        preferredAgeMax={form.preferredAgeMax}
        onChange={([min, max]) =>
          setForm((prev) => ({
            ...prev,
            preferredAgeMin: min,
            preferredAgeMax: max,
          }))
        }
      />

      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navButton, styles.backButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.navText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.nextButton]}
          onPress={handleSaveAndNext}
        >
          <Text style={styles.navText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  radioButton: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#1f2937",
    borderWidth: 1,
    borderColor: "#374151",
    alignItems: "center",
  },
  radioActive: {
    backgroundColor: "#ff69b4",
    borderColor: "#ff69b4",
  },
  radioText: {
    color: "#9ca3af",
    fontWeight: "600",
  },
  radioTextActive: {
    color: "white",
  },
  progress: { marginBottom: 20 },
  container: { flex: 1, backgroundColor: "#111827", padding: 20 },
  label: { color: "#ccc", marginBottom: 6, fontWeight: "600", marginTop: 20 },
  input: {
    backgroundColor: "#1f2937",
    color: "white",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#374151",
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  navButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 6,
  },
  backButton: { backgroundColor: "#374151" },
  nextButton: { backgroundColor: "#ff69b4" },
  navText: { color: "white", fontWeight: "700", fontSize: 16 },
});
