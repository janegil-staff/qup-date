import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function MessageBubble({ item, isSender, onImagePress }) {
  return (
    <View style={[styles.bubble, isSender ? styles.outgoing : styles.incoming]}>
      {item.content ? <Text style={styles.text}>{item.content}</Text> : null}

      {item.images?.length > 0 && (
        <View style={{ marginTop: 6 }}>
          {item.images.map((img, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => onImagePress(img.url)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: img.url }}
                style={styles.image}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.time}>
        {new Date(item.createdAt).toLocaleTimeString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: "80%",
    marginBottom: 8,
    padding: 10,
    borderRadius: 16,
  },
  outgoing: {
    backgroundColor: "#22c55e",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  incoming: {
    backgroundColor: "#374151",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  text: { color: "#fff", fontSize: 15 },
  time: {
    fontSize: 10,
    color: "#d1d5db",
    marginTop: 4,
    textAlign: "right",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 6,
  },
});
