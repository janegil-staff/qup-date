import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LandingScreen from "./screens/LandingScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import ImageUploadScreen from "./screens/ImageUploadScreen";
import PreferencesScreen from "./screens/PreferencesScreen";
import AccountSetupScreen from "./screens/AccountSetupScreen";
import OnboardingDetails from "./screens/OnboardingDetails";
import LifestyleBasicsScreen from "./screens/LifestyleBasicsScreen";
import HabitsFamilyScreen from "./screens/HabitsFamilyScreen";
import BioPreferencesScreen from "./screens/BioPreferencesScreen";
import ReviewSubmit from "./screens/ReviewSubmit";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#111827" }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="LandingPage"
          screenOptions={{
            headerShown: true, // 👈 shows default back arrow
            headerStyle: { backgroundColor: "#111827" },
            headerTintColor: "#FFFFFF",
          }}
        >
          <Stack.Screen name="LandingPage" component={LandingScreen} />

          <Stack.Screen
            name="AccountSetupScreen"
            component={AccountSetupScreen}
          />
          <Stack.Screen
            name="OnboardingDetails"
            component={OnboardingDetails}
          />
          <Stack.Screen
            name="LifestyleBasicsScreen"
            component={LifestyleBasicsScreen}
          />
          {/* Step 2 */}
          <Stack.Screen
            name="HabitsFamilyScreen"
            component={HabitsFamilyScreen}
          />
          {/* Step 3 */}
          <Stack.Screen
            name="BioPreferencesScreen"
            component={BioPreferencesScreen}
          />
          {/* Step 4 */}

          <Stack.Screen
            name="ImageUploadScreen"
            component={ImageUploadScreen}
          />

          <Stack.Screen
            name="PreferencesScreen"
            component={PreferencesScreen}
          />

          <Stack.Screen name="ReviewSubmit" component={ReviewSubmit} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
