import React, { useState } from "react";
import { router } from "expo-router";
import GlobalStyles from "./globalstyles";
import { useFonts } from "expo-font";

import {
  Text,
  View,
  TextInput,
  Button,
  Alert,
  Platform,
  StyleSheet,
  Pressable,
} from "react-native";

export default function CustomLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isHoveredRegister, setIsHoveredRegister] = useState(false);

  const [fontsLoaded] = useFonts({
    "Sora-Regular": require("../assets/fonts/Sora-Regular.ttf"),
  });
  const handleLogin = () => {
    // console.log(username);
    // console.log(password);
    if (username == "" && password == "") {
      console.log("Neither username or password present");
      setMessage("Please enter a valid username and password");
    } else if (username != "" && password == "") {
      console.log("No password present");
      setMessage("Please enter a valid password");
    } else if (username == "" && password != "") {
      console.log("No username present");
      setMessage("Please enter a valid username");
    } else {
      // console.log("Valid username and password");
      setMessage("");
      attemptLogin();
    }
  };

  const attemptLogin = async () => {
    try {
      const response = await fetch(
        "https://fmesof4kvl.execute-api.us-east-2.amazonaws.com/validate-user",
        {
          method: "POST",
          body: JSON.stringify({
            username: username.toLowerCase(),
            password: password,
          }),
        }
      );

      if (!response.ok) {
        console.log("!response.ok");
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Login Response", data);

      //This is how we can decide which code excutes per platform
      const nav = Platform.select({
        android: () => router.navigate("/mobile/(tabs)/HomeMobile"),
        ios: () => router.navigate("/mobile/HomeMobile"),
        default: () => router.navigate("/web/HomeWeb"),
      });
      nav();
    } catch (error) {
      console.log("Login Failed", error);
      setMessage("Invalid Username and Password");
    }
  };

  return (
    <View style={GlobalStyles.page}>
      <View>
        <Text style={styles.title}>TTRPG Companion App</Text>
      </View>
      <View>
        <Text style={styles.heading}>Welcome!</Text>
      </View>
      <View style={styles.loginContainer}>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.login}
          autoCapitalize="none"
          placeholder="Username"
          placeholderTextColor={"#888"}
          autoFocus={true}
        ></TextInput>
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.login}
          autoCapitalize="none"
          placeholder="Password"
          placeholderTextColor={"#888"}
          secureTextEntry={true}
        ></TextInput>
        <Text style={styles.warning}>{message}</Text>

        <Pressable
          style={({ hovered }) => [
            styles.button,
            hovered && styles.hoverStyle, // Apply hover style conditionally
          ]}
          onHoverIn={() => setIsHoveredRegister(true)}
          onHoverOut={() => setIsHoveredRegister(false)}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>

        <Pressable
          style={({ hovered }) => [
            styles.button,
            hovered && styles.hoverStyle, // Apply hover style conditionally
          ]}
          onHoverIn={() => setIsHoveredRegister(true)}
          onHoverOut={() => setIsHoveredRegister(false)}
          onPress={() => router.navigate("/register")}
        >
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    ...Platform.select({
      ios: {
        fontSize: 30,
      },
      android: {
        fontSize: 30,
      },
      default: {
        fontSize: 60,
      },
    }),

    alignSelf: "center",
    fontFamily: "Sora-Regular",
    fontWeight: "100",
    paddingBottom: 25,
    color: "white",
  },
  heading: {
    ...Platform.select({
      ios: {
        fontSize: 30,
      },
      android: {
        fontSize: 30,
      },
      default: {
        fontSize: 60,
      },
    }),
    alignSelf: "center",
    fontFamily: "Sora-Regular",
    fontWeight: "100",
    color: "white",
  },

  loginContainer: {
    //First section are 'global' and affect all platforms
    height: "40%",
    flexDirection: "column",
    alignSelf: "center",
    justifyContent: "center",
    fontFamily: "Sora-Regular",

    //Here is where it gets specific: iOS, Andriod, Default = Web
    ...Platform.select({
      ios: {
        width: "80%",
      },
      android: {
        width: "80%",
      },
      default: {
        width: "20%",
        minWidth: 300,
        maxWidth: 400,
      },
    }),
  },

  login: {
    color: "white",
    borderColor: "white",
    borderWidth: 2,
    padding: 5,
    margin: 5,
    borderRadius: 15,
    fontWeight: "200",
    fontFamily: "Sora-Regular",
    height: "12%",
  },

  hoverStyle: {
    backgroundColor: "#4B5563",
    borderColor: "#4B5563",
  },
  button: {
    backgroundColor: "#6B728C",
    borderColor: "#6B728C",
    textAlign: "center",
    color: "white",
    borderWidth: 2,
    margin: "2.5%",
    width: "95%",
    borderRadius: 25,
    fontFamily: "Sora-Regular",
    cursor: "pointer",
    transitionDelay: "background-color 0.3s ease",

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
        height: 50,
        marginTop: 15,
        fontSize: 32,
      },
    }),
  },

  buttonText: {
    color: "white",
    alignSelf: "center",
    fontSize: 22,
  },

  warning: {
    color: "red",
    textAlign: "center",
    padding: 10,
  },
});
