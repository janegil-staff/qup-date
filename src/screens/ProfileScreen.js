import { View, Text, Image, StyleSheet } from "react-native";

export default function ProfileScreen({ route }) {
  const { user } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>

      {/* Avatar */}
      {user?.image && (
        <Image source={{ uri: user.image }} style={styles.avatar} />
      )}

      {/* Info */}
      <Text style={styles.info}>Name: {user?.name}</Text>
      <Text style={styles.info}>Email: {user?.email}</Text>
      <Text style={styles.info}>Gender: {user?.gender}</Text>
      <Text style={styles.info}>
        Birthdate:{" "}
        {user?.birthdate
          ? new Date(user.birthdate).toDateString()
          : "Not provided"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#111" },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 24,
    textAlign: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    alignSelf: "center",
  },
  info: { color: "#ccc", fontSize: 16, marginBottom: 8 },
});
