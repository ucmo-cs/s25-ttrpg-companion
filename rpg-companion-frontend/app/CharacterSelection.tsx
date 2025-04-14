import React, { useState } from "react";
import { router } from "expo-router";
import GlobalStyles from "./globalstyles";
import { useFonts } from "expo-font";
import SessionStorage from 'react-native-session-storage';
import characters from './characters.json'//had to use this to test because of hyphens in the response message
import { storeCharacterFromUID } from "./globalCharacterFunctions";


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
  const characters = SessionStorage.getItem('characters');
  
    const nav = Platform.select({
      android: () => router.navigate("/mobile/(tabs)/HomeMobile"),
      ios: () => router.navigate("/mobile/HomeMobile"),
      default: () => router.navigate("/web/HomeWeb"),
     });

    const pressHandler = (key) => {
      SessionStorage.setItem("selectedCharacter", key);
      storeCharacterFromUID();
      nav();
    }

    

    return (
        <View style={GlobalStyles.page}>
            <Text style = {styles.heading} >Select your character</Text>
            <FlatList
              data={characters}
              renderItem={({item}) => (
                <Pressable onPress={() => pressHandler(item.character_uid)}>
                  <View style={styles.item}>
                    <Text style = {styles.buttonText}>{item.character_name}</Text>
                  </View>
                </Pressable>
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
