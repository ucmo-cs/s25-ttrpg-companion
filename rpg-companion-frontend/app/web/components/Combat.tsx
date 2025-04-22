import React, {useState,} from 'react';
import {Text,View,TextInput,StyleSheet,Button,Alert,Platform,Image,Pressable, Dimensions, ImageBackground} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Sword, Wand, Axe, Circle, Zap } from "lucide-react-native";
import GlobalStyles from '@/app/globalstyles';
import { FlatList } from 'react-native-gesture-handler';
import { BowArrow } from 'lucide-react';
import {BlurView} from  "expo-blur"

interface CombatProps {
  inventory: JSON
}

const Combat = (props: CombatProps) => {
  const [deathSave, setDeathSave] = useState([0, 0, 0, 0, 0]);
  const colorOptions = [
    { color: "white", fill: "#121427" },
    { color: "green", fill: "green" },
    { color: "red", fill: "red" },
  ];


  function getActions(character){
    //WILL BE DYNAMICALLY GENERATED ONCE WE PIN DOWN FORMATTING AND NAMING CONVENTIONS
    const data = [
      {
        type: "Shortbow",
        hit: "+5",
        damage: "1d6",
      },
      {
        type: "Melee",
        hit: "+7",
        damage: "1d8",
      },
      {
        type: "Wand",
        hit: "+5",
        damage: "1d6",
      },
      {
        type: "Shortbow",
        hit: "+5",
        damage: "1d6",
      },
      {
        type: "potion",
        hit: "+7",
        damage: "1d8",
      },
      {
        type: "Shortsword",
        hit: "+5",
        damage: "1d6",
      },
      {
        type: "Shortbow",
        hit: "+5",
        damage: "1d6",
      },
      {
        type: "Melee",
        hit: "+7",
        damage: "1d8",
      },
      {
        type: "Shortsword",
        hit: "+5",
        damage: "1d6",
      },
    ];


    return data;
    
  }

  const backgroundImages = {
    sword: require("../../../assets/images/sword.svg"),
    bow: require("../../../assets/images/bow-arrow.svg"),
    wand: require("../../../assets/images/wand-sparkles.svg"),
    potion: require("../../../assets/images/flask-round.svg"),
    bag: require("../../../assets/images/box.svg")
  };

  function getItemType(item) {
    console.log("The item in question"+item);
    if (item.type.toLowerCase().includes("sword")) {
      return backgroundImages.sword;
    } else if (item.type.toLowerCase().includes("bow")) {
      return backgroundImages.bow;
    } else if (item.type.toLowerCase().includes("wand")) {
      return backgroundImages.wand;
    }else if (item.type.toLowerCase().includes("potion")) {
      return backgroundImages.potion;
    }
    return backgroundImages.bag; // fallback if type doesn't match
  }

  const renderItem = ({item}) => (
    
    <View style={styles.card}>
        <ImageBackground style={styles.background} source={getItemType(item)}>
          <Text style={[styles.itemName, {height:"100%"}]}>{item.type}</Text>
        </ImageBackground>
    </View>
      
    );

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
        <Text style={styles.headText}>Actions</Text>
        <FlatList style={styles.actionScroll}
          key={"actions"}
          data={getActions(props.inventory)}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.type}-${index}`}
          horizontal/>
      </View>

      <View style={[styles.actions, {marginTop:2.5}]}>
        <Text style={styles.headText}>Bonus Actions</Text>
        <FlatList style={styles.actionScroll}
          key={"bonusActions"}
          data={getActions(props.inventory)}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.type}-${index}`}
          horizontal/>
      </View>


      <View style={styles.savingThrows}>
        {/*deathSave.map gives you the current color (index of the area (0,1,2))*/}
        {/*colorIndex, i gives you the current circle being interacted with*/}
        {deathSave.map((colorIndex, i) => (
          <Pressable style={{alignContent:"center", justifyContent:"center", }} key={i} onPress={() => handlePress(i)}>
            <Circle
              strokeWidth={1}
              size={130}
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
  },
  headText: {
    fontSize: 30,
    textAlign:"center",
    fontFamily:"sora-regular",
  },
  actionScroll: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.5)"
  },
  card: {
    width: 250,
    margin:10,
    backgroundColor: "blue",
    alignItems:"center",
    justifyContent:"center"
  },
  itemName: {
    color:"white",
    fontSize: 20,
    fontFamily: "sora-regular"
  },
  background: {
    resizeMode:"contain",
    height:250,
    width:250,
    filter:""
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
});
