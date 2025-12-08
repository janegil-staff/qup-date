import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

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
  const navLinks = [
    {
      href: "/dashboard",
      label: "Home",
      icon: <Ionicons name="home" size={24} color="white" />,
    },
    {
      href: "/matches",
      label: "Matches",
      icon: <FontAwesome name="heart" size={24} color="white" />,
    },
    {
      href: "/discover",
      label: "Discover",
      icon: <Ionicons name="search" size={24} color="white" />,
    },
    {
      href: "/profile/edit",
      label: "Edit",
      icon: <FontAwesome name="pencil" size={24} color="white" />,
    },
  ];

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: "#111827" },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        headerStyle: { backgroundColor: "#111827" },
        headerTintColor: "white",
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case "Home":
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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Matches" component={MatchesScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Logout" component={LogoutScreen}  options={{ tabBarLabel: "Logout" }} />
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
        <Stack.Screen
          name="AccountSetupScreen"
          component={AccountSetupScreen}
        />
        <Stack.Screen name="OnboardingDetails" component={OnboardingDetails} />
        <Stack.Screen
          name="LifestyleBasicsScreen"
          component={LifestyleBasicsScreen}
        />
        <Stack.Screen
          name="HabitsFamilyScreen"
          component={HabitsFamilyScreen}
        />
        <Stack.Screen
          name="BioPreferencesScreen"
          component={BioPreferencesScreen}
        />
        <Stack.Screen name="ImageUploadScreen" component={ImageUploadScreen} />
        <Stack.Screen name="ReviewSubmit" component={ReviewSubmit} />

        {/* Logged-in flow */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
