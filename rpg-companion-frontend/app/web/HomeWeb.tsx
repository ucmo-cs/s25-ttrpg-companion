import { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {Text,View,TextInput,StyleSheet,Button,Alert,Platform,Image,} from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GlobalStyles from "../globalstyles";
import { Assets } from "react-navigation-stack";

export default function HomeWeb() {
  return (
    <View style={GlobalStyles.page}>
      <View style={styles.home}>
        <header style={styles.header}>
          <View style={styles.pfpHolder}>
            <Image source={require("../../assets/images/placeholderDND.png")} style={styles.pfp} resizeMode="contain" /> 
            {/* Needs to have character sheets pfp used, placeholder for now */}
          </View>
        </header>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  home: {
    justifyContent: "flex-start",
    height: "100%",
    width: "100%"
  },
  header: {
    height: "10%",
    width: "100%",
    backgroundColor: "White",
    color: "black",
  },
  pfpHolder: {
    height: "100%",
    width: "10%",
    justifyContent: "center",
    margin: 0,
  },
  pfp: {
    position: "absolute",
    height: "80%",
    alignSelf: "center",
    borderRadius: 10,
    margin: 50
  },
  iconContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    flex: 0.3,
    marginTop: 110,
    padding: 10,
  },
});
