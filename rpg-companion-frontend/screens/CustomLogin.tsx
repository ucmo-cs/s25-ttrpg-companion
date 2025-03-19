import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  Platform,
} from "react-native";

export default function CustomLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = () => {
    console.log(username);
    console.log(password);
    if (username == "" && password == "") {
      console.log("Neither username or password present");
      setMessage("Please enter a valid username and password");
    } else if (username != "" && password == "") {
      console.log("No password present");
      setMessage("Please enter a valid password");
    } else if (username == "" && password != "") {
      console.log("No username present");
      setMessage("Please enter a valid username");
    }
  };

  return (
    <View style={styles.loginContainer}>
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
        placeholder="Password"
        placeholderTextColor="darkgray"
      ></TextInput>
      <Text style={styles.warning}>{message}</Text>
      <Text style={styles.button} onPress={handleLogin}>
        Login
      </Text>

      <Text
        style={styles.button}
        onPress={() => console.log("Register Clicked")}
      >
        Register
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    //First section are 'global' and affect all platforms
    height: "40%",

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
