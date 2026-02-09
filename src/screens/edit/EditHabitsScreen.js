import React, { useState } from "react";
import GlassBackground from "../../components/GlassBackground";
import Step4Location from "./Step4Location";
import SafeBottomView from "../../components/SafeBottomView";

export default function EditHabitsScreen({ navigation }) {
  const [form, setForm] = useState({
    location: null,
    searchScope: "worldwide",
    willingToRelocate: false,
    tags: [],
    preferredAgeMin: 18,
    preferredAgeMax: 90,
  });

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <GlassBackground>
      <Step4Location
        form={form}
        setForm={setForm}
        setField={setField}
        navigation={navigation}
      />
      <SafeBottomView />
    </GlassBackground>
  );
}
