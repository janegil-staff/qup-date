import { View, Text } from "react-native";
import { Svg, Path } from "react-native-svg";

export default function VerifiedBadge({ style }) {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap: 4
        },
        style
      ]}
    >
      <Svg
        width={12}
        height={12}
        viewBox="0 0 20 20"
        fill="#ec4899" // pink-400
      >
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        />
      </Svg>

      <Text
        style={{
          color: "#ec4899", // pink-400
          fontSize: 12,
          fontWeight: "600"
        }}
      >
        Verified
      </Text>
    </View>
  );
}
