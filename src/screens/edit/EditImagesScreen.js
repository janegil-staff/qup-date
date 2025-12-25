import React, { useState } from "react";
import { View } from "react-native";
import Step5Images from "./Step5Images"; // adjust path if needed
import Screen from "../../components/Screen";

export default function EditImagesScreen({ navigation }) {
  const [form, setForm] = useState({
    images: [], // start with empty array
  });

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Screen style={{ backgroundColor: "#111827" }}>
      <View style={{ flex: 1 }}>
        <Step5Images
          form={form}
          setForm={setForm}
          setField={setField}
          navigation={navigation}
        />
      </View>
    </Screen>
  );
}
