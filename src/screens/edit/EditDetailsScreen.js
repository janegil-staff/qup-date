import React, { useState } from "react";
import { View } from "react-native";
import Step3Details from "./Step3Details";
import Screen from "../../components/Screen";

export default function EditDetailsScreen({ navigation }) {
  const [form, setForm] = useState({
    education: "",
    religion: "",
    relationship: "",
    hasChildren: "",
  });

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Screen style={{ backgroundColor: "#111827" }}>
      <View style={{ flex: 1 }}>
        <Step3Details
          form={form}
          setForm={setForm}
          setField={setField}
          navigation={navigation}
        />
      </View>
    </Screen>
  );
}
