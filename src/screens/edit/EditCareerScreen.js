import React, { useState } from "react";
import Step1Career from "./Step1Career";
import GlassBackground from "../../components/GlassBackground";
import SafeBottomView from "../../components/SafeBottomView";

export default function EditCareerScreen({ navigation }) {
  const [form, setForm] = useState({
    occupation: "",
    company: "",
    industry: "",
    education: "",
  });

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <GlassBackground>
      <Step1Career
        form={form}
        setForm={setForm}
        setField={setField}
        navigation={navigation}
      />
      <SafeBottomView />
    </GlassBackground>
  );
}
