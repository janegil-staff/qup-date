import React, { useState } from "react";
import GlassBackground from "../../components/GlassBackground";
import Step3Details from "./Step3Details";

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
      <Step3Details
        form={form}
        setForm={setForm}
        setField={setField}
        navigation={navigation}
      />
    </GlassBackground>
  );
}
