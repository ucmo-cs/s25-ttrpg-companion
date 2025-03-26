import React, { useState } from "react";
import { router } from "expo-router";
import GlobalStyles from "./globalstyles";

import {Text,View,TextInput,Button,Alert,Platform,StyleSheet} from "react-native";



export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const registerHandler = () => {
    console.log("Registered")
  }

  return (
    <View style={GlobalStyles.page}>
      <View style={styles.loginContainer}>
      <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.login}
          autoCapitalize="none"
          placeholder="Email"
          placeholderTextColor="darkgray"
        ></TextInput>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.login}
          placeholder="Username"
          placeholderTextColor="darkgray"
        ></TextInput>
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.login}
          autoCapitalize="none"
          placeholder="Password"
          placeholderTextColor="darkgray"
        ></TextInput>
        <Text style={styles.warning}>{message}</Text>
        <Text style={styles.button} onPress={registerHandler}>
          Sign Up
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
filler: {
  backgroundColor: "#121427",
  ...Platform.select({
    default: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      
    }
  })
},

  loginContainer: {
    //First section are 'global' and affect all platforms
    height: "40%",
    flexDirection: "column",
    alignSelf: "center",
    justifyContent: "center",

    //Here is where it gets specific: iOS, Andriod, Default = Web
    ...Platform.select({
      ios: {
        width: "80%",
      },
      android: {
        width: "80%"
      },
      default: {
        width: "20%",
      },
    }),
  },

  login: {
    color: "white",
    borderColor: "white",
    borderWidth: 1,
    padding: 5,
    margin: 5,
    borderRadius: 25,
  },

  button: {
    backgroundColor: "blue",
    borderColor: "darkblue",
    textAlign: "center",
    justifyContent: "center",
    color: "white",
    borderWidth: 2,
    margin: "2.5%",
    width: "95%",
    borderRadius: 25,

    ...Platform.select({
      ios: {
        height: "10%",
        marginTop: 10,
        fontSize: 20,
      },
      android: {
        height: "10%",
        marginTop: 10,
        fontSize: 20,
      },
      default: {
        height: "15%",
        marginTop: 15,
        fontSize: 32,
      },
    }),
  },

  warning: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});
