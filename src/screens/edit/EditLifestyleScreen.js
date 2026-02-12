import React, { useState } from "react";
import GlassBackground from "../../components/GlassBackground";
import Step3Lifestyle from "./Step3Lifestyle";
import SafeBottomView from "../../components/SafeBottomView";

export default function EditLifestyleScreen({ navigation }) {
  const [form, setForm] = useState({
    diet: "",
    exercise: "",
    smoking: "",
    drinking: "",
  });

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <GlassBackground>
      <Step3Lifestyle
        form={form}
        setForm={setForm}
        setField={setField}
        navigation={navigation}
      />
      <SafeBottomView />
    </GlassBackground>
  );
}
