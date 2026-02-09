import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Platform } from "react-native";
import useNavigationBarColor from "../hooks/useNavigationBarColor";

// Screens
import LandingScreen from "../screens/LandingScreen";
import LoginForm from "./LoginForm";
import RegisterScreen from "../screens/RegisterScreen";

import DashboardScreen from "../screens/DashboardScreen";
import DiscoverScreen from "../screens/DiscoverScreen";
import MatchesScreen from "../screens/MatchesScreen";
import ProfileScreen from "../screens/ProfileScreen";

import EditBasicScreen from "../screens/edit/EditBasicScreen";
import EditAppearanceScreen from "../screens/edit/EditAppearanceScreen";
import EditLifestyleScreen from "../screens/edit/EditLifestyleScreen";
import EditDetailsScreen from "../screens/edit/EditDetailsScreen";
import EditHabitsScreen from "../screens/edit/EditHabitsScreen";
import EditImagesScreen from "../screens/edit/EditImagesScreen";

import ChatScreen from "../screens/ChatScreen";
import UserProfileScreen from "../screens/UserProfileScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import LikesScreen from "../screens/LikesScreen";
import TermsSafetyScreen from "../screens/TermsSafetyScreen";
import SafetyGuidelinesScreen from "../screens/SafetyGuidelinesScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const LikesStack = createNativeStackNavigator();

function LikesStackNavigator() {
  return (
    <LikesStack.Navigator screenOptions={{ headerShown: false }}>
      <LikesStack.Screen name="LikesMain" component={LikesScreen} />
      <LikesStack.Screen name="UserProfile" component={UserProfileScreen} />
      <LikesStack.Screen name="ChatScreen" component={ChatScreen} />
    </LikesStack.Navigator>
  );
}

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
      <Stack.Screen name="EditImagesScreen" component={EditImagesScreen} />
      <Stack.Screen name="EditBasic" component={EditBasicScreen} />
      <Stack.Screen name="EditAppearance" component={EditAppearanceScreen} />
      <Stack.Screen name="EditLifestyle" component={EditLifestyleScreen} />
      <Stack.Screen name="EditDetails" component={EditDetailsScreen} />
      <Stack.Screen name="EditHabits" component={EditHabitsScreen} />
      <Stack.Screen name="EditImages" component={EditImagesScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Likes" component={LikesScreen} />
      <Stack.Screen
        name="SafetyGuidelines"
        component={SafetyGuidelinesScreen}
      />
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
        
        // Tab bar styling
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 88 : 70,
          backgroundColor: 'transparent',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        
        // Tab bar background with gradient
        tabBarBackground: () => (
          <LinearGradient
            colors={[
              'rgba(26, 26, 46, 0.95)',
              'rgba(22, 33, 62, 0.90)',
            ]}
            style={{ flex: 1 }}
          />
        ),
        
        // Label styling
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: Platform.OS === 'ios' ? 0 : 8,
          letterSpacing: 0.5,
        },
        
        // Colors
        tabBarActiveTintColor: '#e94560',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',

      tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case "Dashboard":
              return <FontAwesome name="home" size={size} color={color} />;
            case "Matches":
              return <FontAwesome name="heart" size={size} color={color} />;
            case "Discover":
              return <FontAwesome name="search" size={size} color={color} />;
            case "Edit":
              return <FontAwesome name="pencil" size={size} color={color} />;
            case "Profile":
              return <FontAwesome name="user" size={size} color={color} />;
            case "Likes":
              return <FontAwesome name="thumbs-up" size={size} color={color} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Matches" component={MatchesStack} />
      <Tab.Screen name="Discover" component={DiscoverStack} />
      <Tab.Screen name="Likes" component={LikesStackNavigator} />
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
          <Stack.Screen name="TermsSafety" component={TermsSafetyScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="LandingScreen" component={LandingScreen} />
          <Stack.Screen name="LoginForm" component={LoginForm} />
          <Stack.Screen
            name="ForgotPasswordScreen"
            component={ForgotPasswordScreen}
          />

          <Stack.Screen name="MainTabs" component={MainTabs} />
          
          {/* Removed ChatScreen from here - it's in each nested stack */}
          {/* Removed MatchesHome from here - it's in MatchesStack */}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
