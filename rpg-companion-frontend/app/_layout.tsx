import { Stack } from "expo-router";
import { hide } from "expo-splash-screen";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Login",
          headerStyle: { backgroundColor: "black" },
          headerTitleStyle: { color: "white" },
        }}
      />
      <Stack.Screen
        name="homemobile"
        options={{
          headerShown: false,
          title: "Home",
          headerStyle: { backgroundColor: "black" },
          headerTitleStyle: { color: "white" },
        }}
      />
      <Stack.Screen
        name="homeweb"
        options={{
          headerShown: false,
          title: "Home",
          headerStyle: { backgroundColor: "black" },
          headerTitleStyle: { color: "white" },
        }}
      />
    </Stack>
    
  );
}
