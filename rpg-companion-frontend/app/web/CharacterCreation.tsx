import { useState } from "react";
import {Text,View,TextInput,StyleSheet,Button,Alert,Platform,Image,Pressable} from "react-native";
import GlobalStyles from "../globalstyles";
import { FlipInEasyX } from "react-native-reanimated";

export default function HomeWeb() {


return (

    <View style={GlobalStyles.page}>
        <View style={styles.pageContainer}>
            <View style={styles.formHolder}></View>
        </View>
    </View>

    );
}

const styles = StyleSheet.create({

    pageContainer: {
        width:"100%",
        height:"100%",
        display: "flex",
        flex:1,
        flexDirection: "row",
        alignItems:"center",
        justifyContent:"center"

    },

    formHolder: {

        flex:0.5,
        height:"95%",
        margin:"2.5%",
        backgroundColor:"green"

    }

})
