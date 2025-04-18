import React, { useState } from "react";
import { router } from "expo-router";
import GlobalStyles from "./globalstyles";
import SessionStorage from 'react-native-session-storage';

import {
  Trash2
} from "lucide-react-native";

import {
  FlatList,
  Text,
  View,
  Platform,
  StyleSheet,
  TouchableHighlight,
  Pressable,
  Alert,
} from "react-native";



export default function CharacterSelect(){
  //Uncomment next line once response messages are fixed and it should all work
  const [characters, setCharacters] = useState(SessionStorage.getItem('characters'));
  const userUid = SessionStorage.getItem('userUid');
  const [trashColor, setTrashColor] = useState('#af1f31');
  
    const nav = Platform.select({
      android: () => router.navigate("/mobile/(tabs)/HomeMobile"),
      ios: () => router.navigate("/mobile/HomeMobile"),
      default: () => router.navigate("/web/HomeWeb"),
     });

    const deleteCharacterMobileHandler = (key) => {
      Alert.alert('Delete Character', 'Are you sure you want to delete this character?', [
        {text: 'Yes', onPress: () => deleteCharacter(key)},
        {
          text: 'No',
          onPress: () => console.log('Character not deleted - uid: ' + key),
          style: 'cancel',
        },
      ]);
    }

    const deleteCharacterWebHandler = (key, name) => {
      const userClick = confirm("Are you sure you want to delete " + name);
      if (userClick){
        deleteCharacter(key);
      }
      else{
        console.log('Character not deleted');
      }
    }
    const deleteCharacter = async (key) => {
      try {
        console.log("user_uid: " + userUid);
        console.log("character_uid:" + key);

        const response =  await fetch(
          "https://fmesof4kvl.execute-api.us-east-2.amazonaws.com/delete-character",
          {
            method: "DELETE",
            headers: {
              'session_token': SessionStorage.getItem("token")
            }, 
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
        const data = await response.json()
        SessionStorage.setItem("token", data.session_token);
    }
    catch (error) {
        console.log("Could not delete character: ", error);
    }
    console.log('Character Deleted')
    //removing the character from current object
    setCharacters((prevCharacters) => {
      return prevCharacters.filter(characters => characters.character_uid != key)
    })
    sessionStorage.setItem("characters", characters)
    console.log(characters)
    }

    const pressHandler = async (key) => {
      try {
 
        console.log("start of storeCharacterFromUID");
        console.log("user_uid: " + userUid);
        console.log("character_uid:" + key);

        const response = await fetch(
          "https://fmesof4kvl.execute-api.us-east-2.amazonaws.com/get-character",
          {
            method: "POST",
            headers: {
              'session_token': SessionStorage.getItem("token")
            },
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
  
        const data = await response.json();
        SessionStorage.setItem("selectedCharacterData", data.character);
        SessionStorage.setItem("token", data.session_token);
        SessionStorage.setItem("charInventory", data.character.inventory);
        console.log("Character Recieved", data.character);
        console.log("Session Token Recieved: " + data.session_token);
        nav();
    }
    catch (error) {
        console.log("Could not recieve character: ", error);
    }
    }

    

    return (
        <View style={GlobalStyles.page}>
            <Text style = {styles.heading}>Select your character</Text>
            <FlatList
              data={characters}
              renderItem={({item}) => (
                <TouchableHighlight onPress={() => pressHandler(item.character_uid)}>
                  <View style={styles.item}>
                    <Text style = {styles.buttonText}>{item.character_name}</Text>
                    <Pressable
                      onHoverIn={() => setTrashColor('#cf1f11')}
                      onHoverOut={() => setTrashColor('#af1f31')}
                      onPress={Platform.select({
                        ios: () => deleteCharacterMobileHandler(item.character_uid),
                        android: () => deleteCharacterMobileHandler(item.character_uid),
                        web: () => deleteCharacterWebHandler(item.character_uid, item.character_name)
                        })
                      }
                      >
                            
                      <Trash2 color={trashColor} strokeWidth={1.7}/>
                    </Pressable>
                  </View>
                </TouchableHighlight>
              )}
            />
          <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={
              Platform.select({
                android: () => router.navigate("/mobile/CharacterCreation"),
                ios: () => router.navigate("/mobile/CharacterCreation"),
                default: () => router.navigate("/web/CharacterCreation"),//This will be up to nick how we do this
              })
            }
            >
              <Text style={styles.buttonText}>Create Character</Text>
            </Pressable>
          </View>  
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
    justifyContent: 'space-between',
    alignItems: 'center'
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
        height: "20%",
        marginTop: 10,
        fontSize: 20,
      },
      android: {
        height: "20%",
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
  buttonContainer: {
    height: "20%",
    flexDirection: "column",
    alignSelf: "center",
    justifyContent: "center",
    fontFamily: "Sora-Regular",
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
});
