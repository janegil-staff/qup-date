import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import Step0Basic from "./Step0Basic";
import Step1Career from "./Step1Career";
import Step2Appearance from "./Step2Appearance";
import Step3Lifestyle from "./Step3Lifestyle";
import Step4Habits from "./Step3Habits";
import Step5Bio from "./Step4Bio";
import Step6Images from "./Step7Images";
import { useToast } from "../components/ToastProvider";

export default function EditProfileNavigator() {
  const { showToast } = useToast();

  const [step, setStep] = useState(0);
  const totalSteps = 7;
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    birthdate: "",
    gender: "",
    occupation: "",
    company: "",
    industry: "",
    education: "",
    appearance: "",
    lifestyle: "",
    habits: "",
    bio: "",
    images: [],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        setForm((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveStepData = async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Save failed");

      showToast("Step data saved successfully", "success");
    } catch (err) {
      showToast("Failed to save step data", "error");
    }
  };

  const next = async () => {
    await saveStepData();
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    }
  };

  const prev = () => {
    if (step > 0) {
      setStep((s) => s - 1);
    }
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

  const stepLabels = [
    "Basic Info",
    "Career",
    "Appearance",
    "Lifestyle",
    "Habits",
    "Bio",
    "Photos",
  ];

  const steps = [
    <Step0Basic form={form} setField={setField} />,
    <Step1Career form={form} setField={setField} />,
    <Step2Appearance form={form} setField={setField} />,
    <Step3Lifestyle form={form} setField={setField} />,
    <Step4Habits form={form} setField={setField} />,
    <Step5Bio form={form} setField={setField} />,
    <Step6Images form={form} setField={setField} />,
  ];

  return (
    <View style={{ flex: 1 }}>
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${((step + 1) / totalSteps) * 100}%` },
          ]}
        />
      </View>
      <Text style={styles.progressText}>
        {stepLabels[step]} — Step {step + 1} of {totalSteps}
      </Text>

      {/* Step content */}
      {steps[step]}

      {/* Navigation buttons */}
      <View style={styles.navRow}>
        {step > 0 && (
          <TouchableOpacity onPress={prev} style={styles.backButton}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        )}
        {step < totalSteps - 1 ? (
          <TouchableOpacity onPress={next} style={styles.nextButton}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={saveStepData} style={styles.saveButton}>
            <Text style={styles.saveText}>Save Profile</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    height: 10,
    backgroundColor: "#374151",
    borderRadius: 5,
    marginHorizontal: 20,
    marginTop: 10,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#ff69b4",
  },
  progressText: {
    color: "#ccc",
    fontSize: 12,
    textAlign: "center",
    marginTop: 6,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  backButton: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  backText: { color: "#374151", fontWeight: "600" },
  nextButton: {
    backgroundColor: "#ff69b4",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  nextText: { color: "white", fontWeight: "600" },
  saveButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveText: { color: "white", fontWeight: "600" },
});
