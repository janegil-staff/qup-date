import React, { useState } from "react";
import { View } from "react-native";
import GlassBackground from "../../components/GlassBackground";
import Step1Appearance from "./Step1Appearance";
import SafeBottomView from "../../components/SafeBottomView";

export default function EditAppearanceScreen({ navigation }) {
  const [form, setForm] = useState({
    height: "",
    appearance: "",
    bodyType: "",
  });

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <GlassBackground>
      <Step1Appearance
        form={form}
        setForm={setForm}
        setField={setField}
        navigation={navigation}
      />
      <SafeBottomView />
    </GlassBackground>
  );
}
