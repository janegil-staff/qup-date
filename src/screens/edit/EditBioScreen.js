// EditBioScreen.js
import React, { useState } from "react";
import { View } from "react-native";
import Step5Bio from "./Step5Bio"; // adjust filename if different
import Screen from "../../components/Screen";

export default function EditBioScreen({ navigation }) {
  const [form, setForm] = useState({ bio: "" });

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Screen style={{ backgroundColor: "#111827" }}>
      <View style={{ flex: 1 }}>
        <Step5Bio
          form={form}
          setForm={setForm}
          setField={setField}
          navigation={navigation}
        />
      </View>
    </Screen>
  );
}
