import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

export default function LocationAutocomplete({ value, onChange, onSelect }) {
  const [results, setResults] = useState([]);

  const fetchPlaces = async (text) => {
    onChange(text);

    if (text.length < 2) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          text
        )}&types=(cities)&key=${process.env.EXPO_PUBLIC_GOOGLE_ANDROID_KEY}`
      );

      const data = await res.json();
      setResults(data.predictions || []);
    } catch (err) {
      console.log("PLACES ERROR:", err);
    }
  };

  const fetchDetails = async (placeId) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_address,geometry,address_components&key=${process.env.EXPO_PUBLIC_GOOGLE_ANDROID_KEY}`
      );

      const data = await res.json();
      const details = data.result;

      // Extract country safely
      const countryComponent = details.address_components?.find((c) =>
        c.types.includes("country")
      );

      const country = countryComponent?.long_name || null;

      const location = {
        name: details.formatted_address,
        lat: details.geometry.location.lat,
        lng: details.geometry.location.lng,
        country,
      };

      onSelect(location);
      setResults([]);
    } catch (err) {
      console.log("DETAILS ERROR:", err);
    }
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={fetchPlaces}
        placeholder="Search for your city"
        placeholderTextColor="#666"
      />

      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.place_id}
          style={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => fetchDetails(item.place_id)}
            >
              <Text style={styles.text}>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#1f2937",
    color: "white",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#374151",
  },
  list: {
    backgroundColor: "#1f2937",
    marginTop: 4,
    borderRadius: 8,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  text: {
    color: "white",
  },
});
