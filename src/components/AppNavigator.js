import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Screens
import LandingScreen from "../screens/LandingScreen";
import LoginForm from "./LoginForm";
import AccountSetupScreen from "../screens/onboarding/AccountSetupScreen";
import OnboardingDetails from "../screens/onboarding/OnboardingDetails";
import LifestyleBasicsScreen from "../screens/onboarding/LifestyleBasicsScreen";
import HabitsFamilyScreen from "../screens/onboarding/HabitsFamilyScreen";
import BioPreferencesScreen from "../screens/onboarding/BioPreferencesScreen";
import ImageUploadScreen from "../screens/onboarding/ImageUploadScreen";
import ReviewSubmit from "../screens/onboarding/ReviewSubmit";

// Logged-in screens
import MatchesScreen from "../screens/MatchesScreen";
import DiscoverScreen from "../screens/DiscoverScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LogoutScreen from "../screens/LogoutScreen";
import HomeScreen from "../screens/HomeScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 👇 Bottom tab navigator for logged-in users
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#111827" },
        tabBarActiveTintColor: "#10b981",
        tabBarInactiveTintColor: "#9CA3AF",
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Matches" component={MatchesScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Logout" component={LogoutScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LandingScreen"
        screenOptions={{ headerShown: false }}
      >
        {/* Public flow */}
        <Stack.Screen name="LandingScreen" component={LandingScreen} />
        <Stack.Screen name="LoginForm" component={LoginForm} />
        <Stack.Screen name="AccountSetupScreen" component={AccountSetupScreen} />
        <Stack.Screen name="OnboardingDetails" component={OnboardingDetails} />
        <Stack.Screen name="LifestyleBasicsScreen" component={LifestyleBasicsScreen} />
        <Stack.Screen name="HabitsFamilyScreen" component={HabitsFamilyScreen} />
        <Stack.Screen name="BioPreferencesScreen" component={BioPreferencesScreen} />
        <Stack.Screen name="ImageUploadScreen" component={ImageUploadScreen} />
        <Stack.Screen name="ReviewSubmit" component={ReviewSubmit} />

        {/* Logged-in flow */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
