import React, { useState } from "react";
import Step6Preferences from "./Step6Preferences";
import GlassBackground from "../../components/GlassBackground";
import SafeBottomView from "../../components/SafeBottomView";

export default function EditPreferencesScreen({ navigation }) {
  const [form, setForm] = useState({
    tags: [],
    preferredAgeMin: 18,
    preferredAgeMax: 90,
    lookingFor: "",
  });

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <GlassBackground>
      <Step6Preferences
        form={form}
        setForm={setForm}
        setField={setField}
        navigation={navigation}
      />
      <SafeBottomView />
    </GlassBackground>
  );
}
