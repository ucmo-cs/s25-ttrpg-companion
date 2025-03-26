import { useState } from "react";
import {Text,View,TextInput,StyleSheet,Button,Alert,Platform,Image,} from "react-native";
import { Drawer } from 'expo-router/drawer';
import GlobalStyles from "../globalstyles";

export default function HomeWeb() {
  return (
    <View style={GlobalStyles.page}>
      <View style={styles.home}>
        <View style={styles.header}>
          <View style={styles.pfpHolder}>
            <Image source={require("../../assets/images/placeholderDND.png")} style={styles.pfp} resizeMode="cover" /> 
            {/* Needs to have character sheets pfp used, placeholder for now */}
          </View>
          <View style={styles.charHeader}>
            <Text style={styles.headName}>
            Tareces
            </Text>
            <Text style={styles.headSpecies}>
            Elf
            </Text>
            <Text style={styles.headClass}>
            Ranger
            </Text>
          </View>
          <View style={styles.dropDownContainerHolder}>
            <View style={styles.dropDownContainer}>

            </View>
          </View>
          
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  home: {
    flex: 1,
    height: "100%",
    width: "100%"
  },
  headName: {
    fontSize:20,
    fontWeight: "bold",
  },
  headClass: {
    fontSize:16,
    color:"#505C50",
  },
  headSpecies: {
    fontSize:16,
    color:"#505C50",
  },
  header: {
    flexDirection:"row",
    justifyContent:"flex-start",
    alignContent:"flex-start",
    alignItems:"flex-start",
    height: 100,
    width: "100%",
    backgroundColor: "white",
    color: "black",
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10
  },
  charHeader:{
    flexDirection:"column",
    alignContent:"space-around",
    justifyContent:"space-around",
    height:80,
    width:"20%",
    color:"green",
    marginTop:10,
    paddingLeft:10

  },
  dropDownContainerHolder:{
    flex:1
  },
  dropDownContainer: {
    alignSelf: "flex-end",
    flexDirection:"row-reverse",
    width:80,
    height:80,
    margin: 10,
    backgroundColor:"green",
    justifyContent:"center",
    alignContent:"center"
  },
  pfpHolder: {
    width:80,
    height:80,
    margin: 10,
  },
  pfp: {
    height: 80,
    width: 80,
    alignSelf: "center",
    borderRadius: 10,
    borderColor:"black",
    borderStyle:"solid",
    borderWidth:5
  },
});
