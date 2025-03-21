import { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {Text,View,TextInput,StyleSheet,Button,Alert,Platform,Image,} from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export default function Home() {
  return (
    <View style={styles.container}>
      {/* Existing Content */}
      <View style={styles.iconContainer}>
        <View style={styles.iconWrapper}>
          <Feather name="circle" size={100} color="white" style={styles.icon} />
          <Text style={styles.iconText}>1</Text>
        </View>

        <View style={styles.iconWrapper}>
          <Feather name="square" size={100} color="white" style={styles.icon} strokeWidth={0}/>
          <Text style={styles.iconText}>2</Text>
        </View>

        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons
            name="shield-outline"
            size={100}
            color="white"
            style={styles.icon}
          />
          <Text style={styles.iconText}>3</Text>
        </View>
      </View>

      <View style={styles.staticContainer}>
        <Text style={styles.header}>Character Name</Text>
        <Text style={styles.header}>Species</Text>
        <Text style={styles.header}>Class (SubClass)</Text>
      </View>

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
    ...Platform.select({
      ios: {
        height: "15%",
      },
      default: {
        height: "18%",
      },
    }),
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

    ...Platform.select({
      ios: {
        position: "relative",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -75 }, { translateY: -375 }],

      },
      default: {
        position: "relative",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -75 }, { translateY: -65 }],
      },
    }),
  },
});
