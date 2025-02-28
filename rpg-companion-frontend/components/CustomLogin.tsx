import React, { useState } from "react";
import {Text, View, TextInput, StyleSheet, Button, Alert} from 'react-native'


export default function CustomLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        console.log(username);
        console.log(password);
        if (username == "" || password == "" ){
            console.log("Neither username or password present");
            console.log("USERNAME: "+username);
            console.log("PASSWORD: "+password);
        }
        else if (username != "" || password == "" ){
            console.log("No password present")
        }
        else if (username == "" || password != "" ){
            console.log("No username present");
    }
}

    
    return (
        <View style = {style.loginContainer}>
            <TextInput value= {username} onChangeText={setUsername} style={style.login} placeholder="Username" placeholderTextColor='darkgray'></TextInput>
            <TextInput value= {password} onChangeText={setPassword} style={style.login} placeholder="Password" placeholderTextColor='darkgray'></TextInput>
            <Text style={style.button} onPress={handleLogin}>Login</Text>
            <Text style={style.button} onPress={ () => console.log("Register Clicked")}>Register</Text>

        </View>
    );

}



const style = StyleSheet.create ({
    loginContainer: {
        height: "40%",
        width: "20%"
    },
    login: {
        color: "white",
        borderColor: "white",       //Will need platform specific formatting, looks terrible on Mobile
        borderWidth: 1,
        padding: 5,
        margin: 5,
        borderRadius: 25,
    },
    button: {
        backgroundColor:"blue",
        color: "white",
        height: "15%",
        width: "95%",
        borderWidth: 2,
        borderRadius: 25,
        borderColor: "darkblue",
        textAlign: "center",
        justifyContent: "center",
        marginTop:15,
        margin: "2.5%",
        fontSize: 32,
    }
})
