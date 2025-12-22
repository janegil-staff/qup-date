// EditBioScreen.js
import React, { useState } from "react";
import { View } from "react-native";
import Step5Bio from "./Step5Bio"; // adjust filename if different

export default function EditBioScreen({ navigation }) {
  const [form, setForm] = useState({ bio: "" });

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <View style={{ flex: 1 }}>
      <Step5Bio
        form={form}
        setForm={setForm}
        setField={setField}
        navigation={navigation}
      />
    </View>
  );
}
