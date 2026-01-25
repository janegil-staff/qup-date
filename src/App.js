import { StatusBar, Platform } from "react-native";
import AppNavigator from "./components/AppNavigator";
import { ToastProvider } from "./components/ToastProvider";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setVisibilityAsync("hidden");
      NavigationBar.setBehaviorAsync("overlay-swipe");
    }
  }, []);
  return (
    <ToastProvider>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      <AppNavigator />
    </ToastProvider>
  );
}
