import { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {Text,View,TextInput,StyleSheet,Button,Alert,Platform,Image,} from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GlobalStyles from "../globalstyles";

export default function HomeWeb() {
  return (
    <View style={GlobalStyles.page}>
        <Text style={GlobalStyles.page}>This is the web version!</Text>
    </View>
  );
}


const styles = StyleSheet.create({

      container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-start",
      },
      iconContainer: {
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        flex: 0.3,
        marginTop: 110,
        padding: 10,
      },
      icon: {
        marginRight: 25,
        width: 100,
        height: 100,
      },
      staticContainer: {
        backgroundColor: "#1e1e1e",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "75%",
        flex: 1,
        height: "15%",
      },
      header: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        padding: 5,
      },
      iconWrapper: {
        position: "relative",
        marginRight: 15,
        alignItems: "center",
      },
      iconText: {
        fontSize: 24,
        color: "white",
        fontWeight: "bold",
        position: "relative",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -75 }, { translateY: -375 }],
      }
});
