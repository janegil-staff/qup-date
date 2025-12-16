import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

export default function LocationAutocomplete({
  value, // string shown in input
  onChange, // (text) => void
  onSelect, // (locationObj) => void
}) {
  const [results, setResults] = useState([]);
  const [locked, setLocked] = useState(false);

  /** Lock suggestions if value is prefilled */
  useEffect(() => {
    if (value && value.length > 0) {
      setLocked(true);
      setResults([]);
    }
  }, [value]);

  const search = async (text) => {
    onChange(text);
    setLocked(false);

    if (text.length < 3) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
          text
        )}`
      );
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Location search failed", err);
      setResults([]);
    }
  };

  const handleSelect = (place) => {
    const location = {
      name: place.display_name,
      lat: Number(place.lat),
      lng: Number(place.lon),
      country: place.address?.country || "",
    };

    onChange(place.display_name); // fill text field
    onSelect(location); // store full object

    setResults([]);
    setLocked(true); // hide suggestions
  };

  return (
    <View style={styles.wrapper}>
      <TextInput
        value={value}
        onChangeText={search}
        placeholder="Search city or country"
        placeholderTextColor="#6b7280"
        style={styles.input}
      />

      {!locked && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.place_id.toString()}
          style={styles.list}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.text}>{item.display_name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 20,
  },
  input: {
    backgroundColor: "#1f2937",
    color: "white",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#374151",
  },
  list: {
    position: "absolute",
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: "#111827",
    borderRadius: 8,
    maxHeight: 220,
    borderWidth: 1,
    borderColor: "#374151",
    zIndex: 50,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
  },
  text: {
    color: "#d1d5db",
    fontSize: 14,
  },
});
