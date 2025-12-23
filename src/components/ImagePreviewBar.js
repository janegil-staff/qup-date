import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function ImagePreviewBar({ images, remove }) {
  if (images.length === 0) return null;

  return (
    <View style={styles.container}>
      {images.map((img, i) => (
        <View key={i} style={styles.item}>
          <Image source={{ uri: img.uri }} style={styles.preview} />
          <TouchableOpacity style={styles.remove} onPress={() => remove(i)}>
            <Text style={styles.removeText}>×</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#1f2937",
  },
  item: {
    marginRight: 8,
    position: "relative",
  },
  preview: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  remove: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#DC2626",
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
});
