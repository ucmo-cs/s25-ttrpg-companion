import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text } from 'react-native';
import Home from '@/app/HomeMobile'
import Notes from '@/screens/Notes'
import Inventory from '@/screens/Inventory'
import Spells from '@/screens/Spells'
import Status from '@/screens/Status'
import Combat from '@/screens/Combat'

// import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


// Dummy Screens
// const HomeScreen = () => <View><Text>Home</Text></View>;
// const NotesScreen = () => <View><Text>Notes</Text></View>;
// const SpellsScreen = () => <View><Text>Spells</Text></View>;
// const CombatScreen = () => <View><Text>Combat</Text></View>;
// const StatusScreen = () => <View><Text>Status</Text></View>;
// const InventoryScreen = () => <View><Text>Inventory</Text></View>;

// Create Bottom Tabs
const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
        //   tabBarIcon: ({ color, size }) => {
        //     let iconName;
        //     if (route.name === 'Home') iconName = 'home';
        //     else if (route.name === 'Notes') iconName = 'notes';
        //     else if (route.name === 'Spells') iconName = 'spells';
        //     else if (route.name === 'Combat') iconName = 'combat';
        //     else if (route.name === 'Status') iconName = 'status';
        //     else if (route.name === 'Inventory') iconName = 'inventory';

        //     return <Icon name={iconName} size={size} color={color} />;
        //   },
          tabBarStyle: { backgroundColor: '#111', paddingBottom: 5 },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Notes" component={Notes} />
        <Tab.Screen name="Spells" component={Spells} />
        <Tab.Screen name="Combat" component={Combat} />
        <Tab.Screen name="Status" component={Status} />
        <Tab.Screen name="Inventory" component={Inventory} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
