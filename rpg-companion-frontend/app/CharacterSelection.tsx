import React, { useState } from "react";
import { router } from "expo-router";
import GlobalStyles from "./globalstyles";
import { useFonts } from "expo-font";
import SessionStorage from 'react-native-session-storage';


import {
  FlatList,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  Platform,
  StyleSheet,
  Pressable,
  TouchableHighlight,
} from "react-native";



export default function CharacterSelect(){
  //Uncomment next line once response messages are fixed and it should all work
  const characters = SessionStorage.getItem('characters');
  const userUid = SessionStorage.getItem('userUid');
  
    const nav = Platform.select({
      android: () => router.navigate("/mobile/(tabs)/HomeMobile"),
      ios: () => router.navigate("/mobile/HomeMobile"),
      default: () => router.navigate("/web/HomeWeb"),
     });

    const pressHandler = async (key) => {
      try {
 
        console.log("start of storeCharacterFromUID");
        console.log("user_uid: " + userUid);
        console.log("character_uid:" + key);

        const response = await fetch(
          "https://fmesof4kvl.execute-api.us-east-2.amazonaws.com/get-character",
          {
            method: "POST",
            body: JSON.stringify({
              user_uid: userUid,
              character_uid: key,
            }),
          }
        );
  
        if (!response.ok) {
          console.log("!response.ok");
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const character = await response.json();
        SessionStorage.setItem("selectedCharacterData", character);
        console.log("Character Recieved", character);
    }
    catch (error) {
        console.log("Could not recieve character: ", error);
    }
    }

    

    return (
        <View style={GlobalStyles.page}>
            <Text style = {styles.heading} onPress={pressHandler}>Select your character</Text>
            <FlatList
              data={characters}
              renderItem={({item}) => (
                <TouchableHighlight onPress={() => pressHandler(item.character_uid)}>
                  <View style={styles.item}>
                    <Text style = {styles.buttonText}>{item.character_name}</Text>
                  </View>
                </TouchableHighlight>
              )}
            />  
        </View>
    );
}


const styles = StyleSheet.create({
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
  item: {
    padding: 16,
    marginTop: 16,
    borderColor: '#bbb',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 10,
    flexDirection: 'row',
},
  hoverStyle: {
    backgroundColor: "#4B5563",
    borderColor: "#4B5563",
  },
  buttonText: {
    color: "white",
    alignSelf: "center",
    fontSize: 22,
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

  warning: {
    color: "red",
    textAlign: "center",
    padding: 10,
  },
});
