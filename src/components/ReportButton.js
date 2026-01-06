import { Linking, TouchableOpacity, Text } from "react-native";

export default function ReportButton() {
  const handlePress = () => {
    const email = "qup.dating@gmail.com";
    const subject = encodeURIComponent("Safety concern report");
    const body = encodeURIComponent(
      "Please describe the issue you want to report:\n\n"
    );

    const url = `mailto:${email}?subject=${subject}&body=${body}`;
    Linking.openURL(url);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={{ padding: 12 }}>
      <Text style={{ color: "#ff4d4d", fontSize: 16 }}>
        Report safety concern
      </Text>
    </TouchableOpacity>
  );
}
