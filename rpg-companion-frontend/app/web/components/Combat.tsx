import React, {useState} from 'react';
import {Text,View,TextInput,StyleSheet,Button,Alert,Platform,Image,Pressable} from "react-native";
import {Circle} from "lucide-react"

interface CombatProps {
  
}

const Combat = (props: CombatProps) => {
  const [deathSave, setDeathSave] = useState([0, 0, 0, 0, 0]);
  const colorOptions = [
    { color: "white", fill: "#121427" },
    { color: "green", fill: "green" },
    { color: "red", fill: "red" },
  ];

  const handlePress = (deathSave) => {
    setDeathSave((prevColor) => {
      //getting the previous color state
      const newColor = [...prevColor];
      //Setting the new color of the death save (+1)
      //% is so it wraps back to the beginning
      newColor[deathSave] = (newColor[deathSave] + 1) % colorOptions.length;
      return newColor;
    });
  };

  return (
    <View style={styles.flexBox}>
      <View style={[styles.actions, {marginBottom:2.5}]}>

      </View>
      <View style={[styles.actions, {marginTop:2.5}]}>

      </View>
      <View style={styles.savingThrows}>
        {/*deathSave.map gives you the current color (index of the area (0,1,2))*/}
        {/*colorIndex, i gives you the current circle being interacted with*/}
        {deathSave.map((colorIndex, i) => (
          <Pressable style={{alignContent:"center", justifyContent:"center"}} key={i} onPress={() => handlePress(i)}>
            <Circle
              strokeWidth={1}
              size={60}
              color={colorOptions[colorIndex].color}
              fill={colorOptions[colorIndex].fill}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default Combat;


const styles = StyleSheet.create({
  flexBox: {
    flex:1,
    backgroundColor:"rgb(9, 86, 0)",
    flexDirection:"column"
  },
  actions:{
    flex:.375,
    backgroundColor:"rgba(255, 0, 0, 0.5)",
    margin:5,
    
  },
  savingThrows:{
    flex:.25,
    backgroundColor:"rgba(0, 0, 0, 0.5)",
    margin:5,
    borderRadius:100,
    flexDirection:"row",
    alignContent:"center",
    justifyContent:"space-around"
  }
});
