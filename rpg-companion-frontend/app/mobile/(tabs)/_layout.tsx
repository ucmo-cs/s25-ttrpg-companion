import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Background, HeaderBackButtonProps } from "@react-navigation/elements";
import { router } from 'expo-router';
import {
  Backpack,
  Swords,
  Notebook,
  House,
  Activity,
  FlaskConical,
} from "lucide-react-native";
import { Platform,  View, Text, TouchableWithoutFeedback, TouchableOpacity} from "react-native";
import SessionStorage from "react-native-session-storage";


export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
        headerStyle: {
          backgroundColor: "#25292e",
          ...Platform.select({
            ios: {
              gestureEnabled: false,
            },
          }),
        },
        headerShown: true,
        headerShadowVisible: false,
        headerTintColor: "#fff",
        headerLeft: () => (
          <TouchableWithoutFeedback onPress={() => {
            router.replace('/mobile/(tabs)/HomeMobile')
            router.back()
            }}>
            <Ionicons name="arrow-back" size={24} color="#fff" style={{ marginLeft: 10 }}/>
          </TouchableWithoutFeedback>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => SessionStorage.setItem('editBool', 'start')}>
              <Text style={{ color: "#fff", fontSize: 20, marginRight: 10 }}>Edit</Text>
          </TouchableOpacity>
        ),

        tabBarStyle: {
          backgroundColor: "#25292e",
        },
      }}
    >
      <Tabs.Screen
        name="HomeMobile"
        options={{
          // href: null,  //hides home tab
          headerTitle: '',
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <House color={color} strokeWidth={1.7} />
          ),
          ...Platform.select({
            ios: {
              gestureEnabled: false,
            },
          }),
        }}
      />
      <Tabs.Screen
        name="Notes"
        options={{
          headerTitle: '',
          tabBarIcon: ({ color, focused }) => (
            <Notebook color={color} strokeWidth={1.7} />
          ),
        }}
      />
      <Tabs.Screen
        name="Spells"
        options={{
          headerTitle: '',
          tabBarIcon: ({ color, focused }) => (
            <FlaskConical color={color} strokeWidth={1.7} />
          ),
        }}
      />
      <Tabs.Screen
        name="Combat"
        options={{
          headerTitle: '',
          tabBarIcon: ({ color, focused }) => (
            <Swords color={color} strokeWidth={1.7} />
          ),
        }}
      />
      <Tabs.Screen
        name="Status"
        options={{
          headerTitle: '',
          tabBarIcon: ({ color, focused }) => (
            <Activity color={color} strokeWidth={1.7} />
          ),
        }}
      />
      <Tabs.Screen
        name="Inventory"
        options={{
          headerTitle: '',
          tabBarIcon: ({ color, focused }) => (
            <Backpack size={24} color={color} strokeWidth={1.7} />
          ),
        }}
      />
    </Tabs>
  );
}