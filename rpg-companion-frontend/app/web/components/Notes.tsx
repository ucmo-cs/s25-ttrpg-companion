import React from 'react';
import {Text,View,TextInput,StyleSheet,Button,Alert,Platform,Image,Pressable, FlatList} from "react-native";
import GlobalStyles from '@/app/globalstyles';
import { useState } from "react";
import { Background } from '@react-navigation/elements';
import SessionStorage from 'react-native-session-storage';

interface NotesProps {

}


const Notes = (props: NotesProps) => {

    const [note, setNote] = useState(SessionStorage.getItem("selectedCharacterData").character_notes);
    const [submitColor, setColor] = useState("gray");

    
    

    const saveNoteChange = () => {
        console.log("note stored")
        console.log("Note: "+note)
        setColor("gray")
        const updatedChar = SessionStorage.getItem("selectedCharacterData").character_notes = note;
        SessionStorage.setItem("selectedCharacterData", SessionStorage.getItem("selectedCharacterData"));
    };

    const sendCharacterToServer = async () => {
        saveNoteChange();
        const payload =  SessionStorage.getItem("selectedCharacterData");
        const userUid = SessionStorage.getItem("userUid");
        const characterUid = payload.character_uid;
        console.log(characterUid);

        try {
            const response = await fetch(
              "https://fmesof4kvl.execute-api.us-east-2.amazonaws.com/edit-character",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Session_Token: SessionStorage.getItem("token"),
                },
                body: JSON.stringify({
                    user_uid: userUid,
                    character_uid: characterUid,
                    character: payload
                  }),
              }
            );
            const data = await response.json();
            console.log("response from sendCharacterToServer: \n" + data + "\n\n");
            SessionStorage.setItem("token", data.session_token)
          } catch (error) {
            console.log("Payload" + payload)
            console.error(error);
          }
    }

  return(

  


     <View style={GlobalStyles.dynamicHolder}>
        <View style={styles.noteHolder}>
            <TextInput onChangeText={(text) => {setNote(text); setColor("darkblue")}} value={note} scrollEnabled={true} textAlign='left' multiline={true} style={styles.textArea} placeholder='note here...' placeholderTextColor={"gray"}></TextInput>
            <Pressable onPress={sendCharacterToServer} style={styles.submit}>
                <Text style={[styles.submitText, {backgroundColor: submitColor}]}>Save Note</Text>
            </Pressable>
        </View>
     </View>
  );
};

export default Notes;

const styles = StyleSheet.create({
    noteHolder:{
        flex:1,
        flexDirection:"column",
        backgroundColor:"#12141C",
    },
    title: {
        flex:0.05,
        backgroundColor:"#121427",
        marginBottom:5,
        margin:10,
        color:"white",
        fontSize:18
    },
    textArea: {
        flex:0.9,
        backgroundColor:"#121427",
        color:"white",
        fontSize: 18,
        margin:10,
        padding:1
    },
    submit: {
        flex:0.1,
        margin:10,
        marginTop:0,
        
    },
    submitText: {
        flex:1,
        textAlign:"center",
        alignContent:"center",
        color:"white",
        fontSize:36,
        borderRadius: 15
    },
    green: {
        flex:1,
        backgroundColor:"green"
    }

});