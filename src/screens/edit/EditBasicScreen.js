import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import * as SecureStore from "expo-secure-store";
import Step0Basic from "./Step0Basic";
import Screen from "../../components/Screen";

export default function EditBasicScreen({ navigation }) {
  const [form, setForm] = useState({
    name: "",
    birthdate: "",
    gender: "",
    occupation: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        const res = await fetch("https://qup.dating/api/mobile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setForm((prev) => ({ ...prev, ...data.user }));
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const setField = (field, value) => {
    if (field === "birthdate") {
      value = new Date(value).toISOString().split("T")[0];
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#ff69b4"
        style={{ marginTop: 50 }}
      />
    );
  }

  return (
    <Screen style={{ backgroundColor: "#111827" }}>
      <View style={{ flex: 1 }}>
        <Step0Basic
          form={form}
          setForm={setForm}
          setField={setField}
          navigation={navigation}
        />
      </View>
    </Screen>
  );
}
