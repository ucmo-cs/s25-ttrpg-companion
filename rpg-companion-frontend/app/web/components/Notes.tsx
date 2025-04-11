import React from 'react';
import {Text,View,TextInput,StyleSheet,Button,Alert,Platform,Image,Pressable} from "react-native";
import GlobalStyles from '@/app/globalstyles';
import { useState } from "react";

interface NotesProps {
    title: string;
    note: String;
}

const [title, setTitle] = useState("");
const [note, setNote] = useState("");

const Notes = (props: NotesProps) => {


    

    const submitNoteChange = () => {
        console.log(title +": "+note)
    };

  return(

  


     <View style={GlobalStyles.dynamicHolder}>
        <View style={styles.noteHolder}>
            <TextInput textAlign='left' multiline={true} style={styles.title} maxFontSizeMultiplier={2} onChangeText={setTitle}></TextInput>
            <TextInput scrollEnabled={true} textAlign='left' multiline={true} style={styles.textArea} onChangeText={setNote}></TextInput>
            <Pressable onPress={submitNoteChange}>
                <View style={styles.submit}></View>
            </Pressable>
        </View>
        <View>

        </View>
     </View>
  );
};

export default Notes;

const styles = StyleSheet.create({
    noteHolder:{
        flex:1,
        width: "50%",
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
        flex:0.85,
        backgroundColor:"#121427",
        color:"white",
        fontSize: 18,
        margin:10,
    },
    submit: {
        flex:0.1,
        backgroundColor: "blue",
        margin:10,
        marginTop:0
    }

});