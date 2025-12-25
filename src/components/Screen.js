// components/Screen.js
import { SafeAreaView } from "react-native-safe-area-context";

export default function Screen({ children, style }) {
  return (
    <SafeAreaView style={[{ flex: 1, paddingTop: 10 }, style]}>
      {children}
    </SafeAreaView>
  );
}
