import { Stack } from "expo-router";
import { hide } from "expo-splash-screen";
<<<<<<< HEAD
import { View, Text, TouchableOpacity } from "react-native";
=======
import { View, Text, } from "react-native";
>>>>>>> 0d336a1610e7b6680f9a1e13a1ab40953a384b3c
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditCharacterButton from "../app/mobile/editCharacterButton"; // adjust the path as needed

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
<<<<<<< HEAD
        name="/mobile/HomeMobile" //Despite it being name it needs the relative path
=======
        name="mobile/(tabs)" //Despite it being name it needs the relative path
>>>>>>> 0d336a1610e7b6680f9a1e13a1ab40953a384b3c
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
