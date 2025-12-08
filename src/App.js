import { StatusBar } from "react-native";
import AppNavigator from "./components/AppNavigator";

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      <AppNavigator />
    </>
  );
}
