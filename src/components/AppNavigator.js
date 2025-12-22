import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

// Screens
import LandingScreen from "../screens/LandingScreen";
import LoginForm from "./LoginForm";

// Logged-in screens
import MatchesScreen from "../screens/MatchesScreen";
import DiscoverScreen from "../screens/DiscoverScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LogoutScreen from "../screens/LogoutScreen";
import HomeScreen from "../screens/HomeScreen";
import RegisterScreen from "../screens/RegisterScreen";
import Step0Basic from "../screens/edit/Step0Basic";
import Step1Appearance from "../screens/edit/Step1Appearance";
import Step2Lifestyle from "../screens/edit/Step2Lifestyle";
import Step3Details from "../screens/edit/Step3Details";
import Step4Location from "../screens/edit/Step4Location";
import Step5Images from "../screens/edit/Step5Images";
import EditBasicScreen from "../screens/edit/EditBasicScreen";
import EditAppearanceScreen from "../screens/edit/EditAppearanceScreen";
import EditLifestyleScreen from "../screens/edit/EditLifestyleScreen";
import EditHabitsScreen from "../screens/edit/EditHabitsScreen";
import EditDetailsScreen from "../screens/edit/EditDetailsScreen";
import EditImagesScreen from "../screens/edit/EditImagesScreen";
import ChatScreen from "../screens/ChatScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 👇 Bottom tab navigator for logged-in users
function MainTabs() {
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
      <Tab.Screen name="Edit" component={EditStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen
        name="Logout"
        component={LogoutScreen}
        options={{ tabBarLabel: "Logout" }}
      />
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
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />

        {/* Logged-in flow */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
