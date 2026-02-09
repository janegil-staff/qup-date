import React, { useState } from "react";
import GlassBackground from "../../components/GlassBackground";
import Step5Images from "./Step5Images";

export default function EditImagesScreen({ navigation }) {
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
    </GlassBackground>
  );
}
