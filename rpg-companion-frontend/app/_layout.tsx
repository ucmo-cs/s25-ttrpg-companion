import { Stack } from "expo-router";
import Index from ".";
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
          headerShown: true,
          title: "Login",
          headerStyle: { backgroundColor: "black" },
          headerTitleStyle: { color: "white" },
        }}
      />
    </Stack>
  );
}
