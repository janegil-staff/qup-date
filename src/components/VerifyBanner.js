import { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";

export default function VerifyBanner({ user }) {
  const [loading, setLoading] = useState(false);

  if (user.isVerified) return null;

  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://qup.dating/api/auth/resend-verification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        Toast.show({
          type: "success",
          text1: "Verification email sent!",
        });
      } else {
        Toast.show({
          type: "error",
          text1: data.error || "Resend failed",
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Server error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        backgroundColor: "#78350f",
        padding: 12,
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      <Text style={{ color: "#fef3c7", flex: 1 }}>
        Your profile isn’t verified yet.{" "}
        <Text style={{ color: "#fcd34d", fontWeight: "600" }}>
          Verify to earn a badge and boost trust.
        </Text>
        <Text> (check your spam folder)</Text>
      </Text>

      <TouchableOpacity
        onPress={handleResend}
        disabled={loading}
        style={{
          backgroundColor: "#ec4899",
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 6,
          marginLeft: 10,
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={{ color: "white", fontSize: 12, fontWeight: "600" }}>
            Resend link
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
