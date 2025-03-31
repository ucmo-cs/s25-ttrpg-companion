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

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordTwo, setPasswordTwo] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const [fontsLoaded] = useFonts({
    "Sora-Regular": require("../assets/fonts/Sora-Regular.ttf"),
  });
  const handleRegistration = () => {
    if (username == "" || password == "" || email == "") {
      setMessage("Please fill out all fields");
    } else if (password != passwordTwo) {
      setMessage("Please ensure passwords match");
      setPassword("");
      setPasswordTwo("");
    } else if (
      password == passwordTwo &&
      (username != "" || password != "" || email != "")
    ) {
      attemptRegistration();
    }
  };

  const attemptRegistration = async () => {
    try {
      const response = await fetch(
        "https://fmesof4kvl.execute-api.us-east-2.amazonaws.com/create-user",
        {
          method: "POST",
          body: JSON.stringify({
            username: username,
            email: email,
            password: password,
            characters: {},
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
      console.log("Registration failed", error);
      setMessage("Sorry an error has occurred");
    }
  };

  return (
    <View style={GlobalStyles.page}>
      <View style={styles.loginContainer}>
        <Text style={styles.title}>TTRPG Companion App</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.login}
          autoCapitalize="none"
          placeholder="Email"
        ></TextInput>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.login}
          placeholder="Username"
        ></TextInput>
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.login}
          autoCapitalize="none"
          placeholder="Password"
        ></TextInput>
        <TextInput
          value={passwordTwo}
          onChangeText={setPasswordTwo}
          style={styles.login}
          autoCapitalize="none"
          placeholder="Confirm Password"
        ></TextInput>
        <Text style={styles.warning}>{message}</Text>
        <Pressable
          style={({ hovered }) => [
            styles.button,
            hovered && styles.hoverStyle, // Apply hover style conditionally
          ]}
          onHoverIn={() => setIsHovered(true)}
          onHoverOut={() => setIsHovered(false)}
          onPress={handleRegistration}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>
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
      },
    }),
  },
  title: {
    fontSize: 50,
    alignSelf: "center",
    fontFamily: "Sora-Regular",
    fontWeight: "100",
    paddingTop: 50,
    paddingBottom: 25,
    textAlign: "center",
    flexWrap: "wrap",
    color: "white",
  },
  loginContainer: {
    //First section are 'global' and affect all platforms
    height: "40%",
    flexDirection: "column",
    alignSelf: "center",
    justifyContent: "center",
    minHeight: 800,

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
    borderWidth: 2.5,
    margin: 10,
    borderRadius: 15,
    fontWeight: "200",
    fontFamily: "Sora-Regular",
    height: "5%",
    paddingLeft: 10,
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
        height: "5%",
        // marginTop: 10,
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
    // textAlign: "center",
    // justifyContent: "center",
    paddingTop: 3,
  },
  warning: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});
