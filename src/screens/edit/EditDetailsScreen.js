import React, { useState } from "react";
import GlassBackground from "../../components/GlassBackground";
import Step4Details from "./Step4Details";
import SafeBottomView from "../../components/SafeBottomView";

export default function EditDetailsScreen({ navigation }) {
  const [form, setForm] = useState({
    education: "",
    religion: "",
    relationship: "",
    hasChildren: false,
  });

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <GlassBackground>
      <Step4Details
        form={form}
        setForm={setForm}
        setField={setField}
        navigation={navigation}
      />
      <SafeBottomView />
    </GlassBackground>
  );
}
