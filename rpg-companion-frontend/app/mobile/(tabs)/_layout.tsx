import { Tabs } from "expo-router";

import Ionicons from "@expo/vector-icons/Ionicons";
import { Background } from "@react-navigation/elements";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  Backpack,
  Swords,
  Notebook,
  House,
  Activity,
  FlaskConical,
} from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
        headerStyle: {
          backgroundColor: "#25292e",
        },
        headerShown: false,
        headerShadowVisible: false,
        headerTintColor: "#fff",

        tabBarStyle: {
          backgroundColor: "#25292e",
        },
      }}
    >
      <Tabs.Screen
        name="HomeMobile"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <House color={color} strokeWidth={1.7} />
          ),
        }}
      />
      <Tabs.Screen
        name="Notes"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Notebook color={color} strokeWidth={1.7} />
          ),
        }}
      />
      <Tabs.Screen
        name="Spells"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <FlaskConical color={color} strokeWidth={1.7} />
          ),
        }}
      />
      <Tabs.Screen
        name="Combat"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Swords color={color} strokeWidth={1.7} />
          ),
        }}
      />
      <Tabs.Screen
        name="Status"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Activity color={color} strokeWidth={1.7} />
          ),
        }}
      />
      <Tabs.Screen
        name="Inventory"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Backpack size={24} color={color} strokeWidth={1.7} />
          ),
        }}
      />
    </Tabs>
  );
}
