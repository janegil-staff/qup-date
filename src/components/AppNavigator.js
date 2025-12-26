import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

// Screens
import LandingScreen from "../screens/LandingScreen";
import LoginForm from "./LoginForm";
import RegisterScreen from "../screens/RegisterScreen";

import DashboardScreen from "../screens/DashboardScreen";
import DiscoverScreen from "../screens/DiscoverScreen";
import MatchesScreen from "../screens/MatchesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LogoutScreen from "../screens/LogoutScreen";

import EditBasicScreen from "../screens/edit/EditBasicScreen";
import EditAppearanceScreen from "../screens/edit/EditAppearanceScreen";
import EditLifestyleScreen from "../screens/edit/EditLifestyleScreen";
import EditDetailsScreen from "../screens/edit/EditDetailsScreen";
import EditHabitsScreen from "../screens/edit/EditHabitsScreen";
import EditImagesScreen from "../screens/edit/EditImagesScreen";

import ChatScreen from "../screens/ChatScreen";
import UserProfileScreen from "../screens/UserProfileScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function EditStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EditBasic" component={EditBasicScreen} />
      <Stack.Screen name="EditAppearance" component={EditAppearanceScreen} />
      <Stack.Screen name="EditLifestyle" component={EditLifestyleScreen} />
      <Stack.Screen name="EditDetails" component={EditDetailsScreen} />
      <Stack.Screen name="EditHabits" component={EditHabitsScreen} />
      <Stack.Screen name="EditImages" component={EditImagesScreen} />
    </Stack.Navigator>
  );
}

function DiscoverStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DiscoverHome" component={DiscoverScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
}

function MatchesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MatchesHome" component={MatchesScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
}

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardHome" component={DashboardScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: "#111827" },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case "Dashboard":
              return <Ionicons name="home" size={size} color={color} />;
            case "Matches":
              return <FontAwesome name="heart" size={size} color={color} />;
            case "Discover":
              return <Ionicons name="search" size={size} color={color} />;
            case "Edit":
              return <FontAwesome name="pencil" size={size} color={color} />;
            case "Profile":
              return (
                <Ionicons name="person-circle" size={size} color={color} />
              );
            case "Logout":
              return <Ionicons name="log-out" size={size} color={color} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} />

      <Tab.Screen name="Matches" component={MatchesStack} />
      <Tab.Screen name="Discover" component={DiscoverStack} />
      <Tab.Screen name="Edit" component={EditStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
      <Tab.Screen name="Logout" component={LogoutScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="LandingScreen" component={LandingScreen} />
          <Stack.Screen name="LoginForm" component={LoginForm} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
