import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

export function useReportUser(userId) {
  const [reportVisible, setReportVisible] = useState(false);

  const submitReport = async (payload) => {
    if (!userId) {
      console.error("❌ No userId provided");
      Alert.alert("Error", "Cannot report user");
      return;
    }

    try {
      console.log("📝 Submitting report for user:", userId);
      const token = await SecureStore.getItemAsync("authToken");

      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(
        `https://qup.dating/api/mobile/report/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`Report failed: ${response.status}`);
      }

      console.log("✅ Report submitted successfully");
      Alert.alert("Success", "Report submitted. Thank you for helping keep our community safe.");
    } catch (error) {
      console.error("💥 Report error:", error);
      Alert.alert("Error", "Failed to submit report. Please try again.");
    }
  };

  return {
    reportVisible,
    setReportVisible,
    submitReport,
  };
}