// src/components/VerifyBanner.js
// REPLACES your existing VerifyBanner.js
// Now handles both email verification AND LinkedIn verification

import { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

export default function VerifyBanner({ user }) {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Hide if both are verified
  if (user.isVerified && user.linkedin?.isVerified) return null;

  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://qup.dating/api/auth/resend-verification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        Toast.show({ type: "success", text1: "Verification email sent!" });
      } else {
        Toast.show({ type: "error", text1: data.error || "Resend failed" });
      }
    } catch (err) {
      Toast.show({ type: "error", text1: "Server error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ marginBottom: 10, gap: 8 }}>
      {/* Email verification banner (existing) */}
      {!user.isVerified && (
        <View
          style={{
            backgroundColor: "#78350f",
            padding: 12,
            borderRadius: 8,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fef3c7", flex: 1 }}>
            Your profile isn't verified yet.{" "}
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
      )}

      {/* LinkedIn verification banner (NEW) */}
      {!user.linkedin?.isVerified && (
        <TouchableOpacity
          style={{
            backgroundColor: "rgba(10, 102, 194, 0.15)",
            borderWidth: 1,
            borderColor: "rgba(10, 102, 194, 0.3)",
            padding: 12,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => navigation.navigate("LinkedInVerify")}
          activeOpacity={0.8}
        >
          <FontAwesome
            name="linkedin-square"
            size={20}
            color="#93c5fd"
            style={{ marginRight: 10 }}
          />
          <Text style={{ color: "#dbeafe", flex: 1, fontSize: 13 }}>
            <Text style={{ fontWeight: "700", color: "#93c5fd" }}>
              Verify with LinkedIn
            </Text>{" "}
            to prove you're a real professional and get a verified badge.
          </Text>
          <FontAwesome name="chevron-right" size={14} color="#93c5fd" />
        </TouchableOpacity>
      )}
    </View>
  );
}
