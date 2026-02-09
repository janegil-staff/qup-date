import React, { useState } from "react";
import GlassBackground from "../../components/GlassBackground";
import Step5Images from "./Step5Images";
import SafeBottomView from "../../components/SafeBottomView";

export default function ({ navigation }) {
  const [form, setForm] = useState({
    images: [], // start with empty array
  });

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <GlassBackground>
      <Step5Images
        form={form}
        setForm={setForm}
        setField={setField}
        navigation={navigation}
      />
      <SafeBottomView />
    </GlassBackground>
  );
}
