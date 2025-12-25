// EditHabitsScreen.js
import React, { useState } from "react";
import { View } from "react-native";
import Step4Location from "./Step4Location";
import Screen from "../../components/Screen";

export default function EditHabitsScreen({ navigation }) {
  const [form, setForm] = useState({
    sleep: "",
    hobbies: "",
    pets: "",
    // add other habit fields here
  });

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Screen style={{ backgroundColor: "#111827" }}>
      <View style={{ flex: 1 }}>
        <Step4Location
          form={form}
          setForm={setForm}
          setField={setField}
          navigation={navigation}
        />
      </View>
    </Screen>
  );
}
