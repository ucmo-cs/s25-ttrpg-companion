import React, { useState } from "react";
import { router } from "expo-router";
import GlobalStyles from "./globalstyles";

import {Text,View,TextInput,Button,Alert,Platform,StyleSheet} from "react-native";



export default function CustomLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

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
    } else{
      // console.log("Valid username and password");
      setMessage("");
      attemptLogin();
    }
  };


  const attemptLogin = async () => {
    try{
    const response = await fetch('https://fmesof4kvl.execute-api.us-east-2.amazonaws.com/validate-user', {
      method: 'POST',
      body: JSON.stringify({
        username: username.toLowerCase(),
        password: password,
      }),
    });
    
        if (!response.ok) {
            console.log("!response.ok");
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Login Response", data);

       
          const nav = Platform.select({
            
            android: () => router.navigate("/mobile/(tabs)/HomeMobile"),
            ios: () => router.navigate("/mobile/HomeMobile"),
            default: () => router.navigate("/web/HomeWeb"),
          })
          nav();
        }
        catch (error){
          console.log('Login Failed', error);
          setMessage("Invalid Username and Password");
        }  
};


  return (
    <View style={GlobalStyles.page}>
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
          autoCapitalize="none"
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
