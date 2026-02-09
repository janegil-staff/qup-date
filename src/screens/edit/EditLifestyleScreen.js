import React, { useState } from "react";
import GlassBackground from "../../components/GlassBackground";
import Step2Lifestyle from "./Step2Lifestyle";

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
      <Step2Lifestyle
        form={form}
        setForm={setForm}
        setField={setField}
        navigation={navigation}
      />
    </GlassBackground>
  );
}
