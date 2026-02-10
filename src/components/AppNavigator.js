import React from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useNavigationBarColor from "../hooks/useNavigationBarColor";

// Auth Screens
import TermsSafetyScreen from "../screens/TermsSafetyScreen";
import LandingScreen from "../screens/LandingScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LoginForm from "./LoginForm";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";

// Main Screens
import DashboardScreen from "../screens/DashboardScreen";
import DiscoverScreen from "../screens/DiscoverScreen";
import MatchesScreen from "../screens/MatchesScreen";
import LikesScreen from "../screens/LikesScreen";
import ProfileScreen from "../screens/ProfileScreen";

// Profile Edit Screens
import EditBasicScreen from "../screens/edit/EditBasicScreen";
import EditAppearanceScreen from "../screens/edit/EditAppearanceScreen";
import EditLifestyleScreen from "../screens/edit/EditLifestyleScreen";
import EditDetailsScreen from "../screens/edit/EditDetailsScreen";
import EditHabitsScreen from "../screens/edit/EditHabitsScreen";
import EditImagesScreen from "../screens/edit/EditImagesScreen";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Shared Screens
import ChatScreen from "../screens/ChatScreen-Android";
import UserProfileScreen from "../screens/UserProfileScreen";
import SafetyGuidelinesScreen from "../screens/SafetyGuidelinesScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardHome" component={DashboardScreen} />
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

function DiscoverStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DiscoverHome" component={DiscoverScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
}

function LikesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LikesMain" component={LikesScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
}

function EditStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="EditBasic"
    >
      <Stack.Screen name="EditBasic" component={EditBasicScreen} />
      <Stack.Screen name="EditAppearance" component={EditAppearanceScreen} />
      <Stack.Screen name="EditLifestyle" component={EditLifestyleScreen} />
      <Stack.Screen name="EditDetails" component={EditDetailsScreen} />
      <Stack.Screen name="EditHabits" component={EditHabitsScreen} />
      <Stack.Screen name="EditImages" component={EditImagesScreen} />
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />
      <Stack.Screen name="EditImages" component={EditImagesScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />

      <Stack.Screen
        name="SafetyGuidelines"
        component={SafetyGuidelinesScreen}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  const insets = useSafeAreaInsets();

  // Calculate dynamic tab bar height based on device safe area
  const tabBarHeight =
    Platform.OS === "ios" ? 88 : 50 + Math.max(insets.bottom, 20); // Base 85px + system bar height (min 20px)

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        // Tab Bar Styling
        tabBarStyle: {
          position: "absolute",
          borderTopWidth: 0,
          elevation: 0,
          height: tabBarHeight, // Dynamic height
          backgroundColor: "transparent",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          // Use actual inset with minimum fallback
          paddingBottom:
            Platform.OS === "android" ? Math.max(insets.bottom, 20) : 0,
          paddingTop: Platform.OS === "android" ? 8 : 0,
        },

        // Glassmorphic Background
        tabBarBackground: () => (
          <LinearGradient
            colors={["rgba(26, 26, 46, 0.95)", "rgba(22, 33, 62, 0.90)"]}
            style={{ flex: 1 }}
          />
        ),

        // Label Styling
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginBottom: Platform.OS === "ios" ? 0 : 2, // Reduced since we have paddingBottom
          letterSpacing: 0.5,
        },

        // Colors
        tabBarActiveTintColor: "#e94560",
        tabBarInactiveTintColor: "rgba(255,255,255,0.5)",

        // Icons
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case "Dashboard":
              iconName = "home";
              break;
            case "Matches":
              iconName = "heart";
              break;
            case "Discover":
              iconName = "search";
              break;
            case "Likes":
              iconName = "thumbs-up";
              break;
            case "Edit":
              iconName = "pencil";
              break;
            case "Profile":
              iconName = "user";
              break;
            default:
              iconName = "circle";
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Matches" component={MatchesStack} />
      <Tab.Screen name="Discover" component={DiscoverStack} />
      <Tab.Screen name="Likes" component={LikesStack} />
      <Tab.Screen name="Edit" component={EditStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  // Set Android navigation bar color to match theme
  useNavigationBarColor();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="TermsSafety"
          screenOptions={{ headerShown: false }}
        >
          {/* Auth Flow */}
          <Stack.Screen name="TermsSafety" component={TermsSafetyScreen} />
          <Stack.Screen name="LandingScreen" component={LandingScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="LoginForm" component={LoginForm} />
          <Stack.Screen
            name="ForgotPasswordScreen"
            component={ForgotPasswordScreen}
          />

          <Stack.Screen name="ProfileHome" component={ProfileScreen} />
          <Stack.Screen name="EditImages" component={EditImagesScreen} />
          {/* Main App */}
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
