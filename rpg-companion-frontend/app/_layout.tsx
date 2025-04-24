import { Stack } from "expo-router";
import { hide } from "expo-splash-screen";
// import { View, Text, TouchableOpacity } from "react-native";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#25292e",
        },
        title: "",
        headerShown: true,
        headerShadowVisible: false,
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          gestureEnabled: false,
          title: "Login",
          headerStyle: { backgroundColor: "black" },
          headerTitleStyle: { color: "white" },
        }}
      />
      <Stack.Screen
        name="/mobile/HomeMobile" //Despite it being name it needs the relative path
        options={{
          headerShown: false,
          title: "Home",
          gestureEnabled: false,
          headerStyle: { backgroundColor: "black" },
          headerTitleStyle: { color: "white" },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="web/HomeWeb"
        options={{
          headerShown: false,
          title: "Home",
          headerStyle: { backgroundColor: "black" },
          headerTitleStyle: { color: "white" },
        }}
      />
      <Stack.Screen
        name="web/CharacterCreation"
        options={{
          headerShown: false,
          gestureEnabled: false,
          title: "Login",
          headerStyle: { backgroundColor: "black" },
          headerTitleStyle: { color: "white" },
        }}
      />
    </Stack>
  );
}
