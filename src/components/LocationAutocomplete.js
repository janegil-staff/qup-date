import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

export default function LocationAutocomplete({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const searchPlaces = async (text) => {
    setQuery(text);
    if (text.length < 3) {
      setResults([]);
      return;
    }

    try {
      // OpenStreetMap Nominatim API (free, no key required)
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        text
      )}&addressdetails=1&limit=5`;
      const res = await fetch(url);
      const data = await res.json();

      const formatted = data.map((place) => ({
        name: place.display_name,
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon),
        country: place.address?.country || "",
      }));

      setResults(formatted);
    } catch (err) {
      console.error("Location search error:", err);
    }
  };
  const handleSelect = (item) => {
    onSelect(item); // send object {name, lat, lng, country}
    setQuery(item.name); // show chosen location in input
    setResults([]); // 👈 clear results so list closes
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter location"
        placeholderTextColor="#9CA3AF"
        value={query}
        onChangeText={searchPlaces}
      />

      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() => handleSelect(item)}
          >
            <Text style={styles.resultText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%", // full width
    paddingHorizontal: 20,
    backgroundColor: "#111827",
  },
  input: {
    backgroundColor: "#1F2937",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  resultText: {
    color: "#fff",
  },
});
