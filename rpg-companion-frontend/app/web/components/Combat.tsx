import React, { useState, } from 'react';
import { Text, View, TextInput, StyleSheet, Button, Alert, Platform, Image, Pressable, Dimensions, ImageBackground, ScrollView } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Sword, Wand, Axe, Circle, Zap } from "lucide-react-native";
import GlobalStyles from '@/app/globalstyles';
import { FlatList } from 'react-native-gesture-handler';
import { BowArrow } from 'lucide-react';

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


  function getActions(character) {
    //WILL BE DYNAMICALLY GENERATED ONCE WE PIN DOWN FORMATTING AND NAMING CONVENTIONS
    const data = [
      {
        type: "Shortbow",
        hit: "+5",
        damage: "1d6",
        description: "Here is a test description for all of these things"
      },
      {
        type: "Sword",
        hit: "+5",
        damage: "1d6",
        description: "Here is a test description for all of these things"
      },
      {
        type: "Healing Potion",
        hit: "+5",
        damage: "1d6",
        description: "Here is a test description for all of these things"
      },
      {
        type: "Shortbow",
        hit: "+5",
        damage: "1d6",
        description: "Here is a test description for all of these things"
      },
      {
        type: "Shortbow",
        hit: "+5",
        damage: "1d6",
        description: "Here is a test description for all of these things"
      },
      {
        type: "Shortbow",
        hit: "+5",
        damage: "1d6",
        description: "Here is a test description for all of these things"
      },
      {
        type: "Shortbow",
        hit: "+5",
        damage: "1d6",
        description: "Here is a test description for all of these things"
      },
      {
        type: "Shortbow",
        hit: "+5",
        damage: "1d6",
        description: "Here is a test description for all of these things"
      },
      {
        type: "Shortbow",
        hit: "+5",
        damage: "1d6",
        description: "Here is a test description for all of these things"
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
    console.log("The item in question" + item);
    item = item.type.toLowerCase()
    if (item.includes("sword") || item.includes("melee")) {
      return backgroundImages.sword;
    } else if (item.includes("bow")) {
      return backgroundImages.bow;
    } else if (item.includes("wand") || item.includes("scroll") || item.includes("spell") || item.includes("cast")) {
      return backgroundImages.wand;
    } else if (item.includes("potion")) {
      return backgroundImages.potion;
    }
    return backgroundImages.bag; // fallback if type doesn't match
  }

  const renderItem = ({ item }) => (

    <View style={styles.card}>
      <Text style={[styles.itemName, { textAlign: "center", backgroundColor: "rgba(0,0,0,0.2)", flex: 0.1, width: "100%", }]}>{item.type}</Text>
      <ImageBackground tintColor={"rgba(255,255,255,0.3"} blurRadius={12} style={[styles.background, { flex: 0.9 }]} source={getItemType(item)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.2)", }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.hitOrDamage}>Hit: {item.hit}</Text>
            <Text style={styles.hitOrDamage}>Damage: {item.damage}</Text>
            <Text style={[styles.hitOrDamage, {fontSize:12}]}>{item.description}</Text>

          </ScrollView>
        </View>
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


      <View style={[styles.actions, { marginBottom: 2.5 }]}>
        <Text style={styles.headText}>Actions</Text>
        <FlatList style={styles.actionScroll}
          key={"actions"}
          data={getActions(props.inventory)}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.type}-${index}`}
          horizontal />
      </View>

      <View style={[styles.actions, { marginTop: 2.5 }]}>
        <Text style={styles.headText}>Bonus Actions</Text>
        <FlatList style={styles.actionScroll}
          key={"bonusActions"}
          data={getActions(props.inventory)}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.type}-${index}`}
          horizontal />
      </View>


      <View style={styles.savingThrows}>
        {/*deathSave.map gives you the current color (index of the area (0,1,2))*/}
        {/*colorIndex, i gives you the current circle being interacted with*/}
        {deathSave.map((colorIndex, i) => (
          <Pressable style={{ alignContent: "center", justifyContent: "center", }} key={i} onPress={() => handlePress(i)}>
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
    flex: 1,
    backgroundColor: "#121427",
    flexDirection: "column"
  },
  actions: {
    flex: .45,
    backgroundColor: "#121427",
    margin: 5,

  },
  savingThrows: {
    flex: .10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    margin: 5,
    borderRadius: 100,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-around"
  },
  headText: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: "sora-regular",
    color: "white"
  },
  actionScroll: {
    flex: 1,
    backgroundColor: "#121427"
  },
  card: {
    width: 250,
    margin: 10,
    padding: 0,
    backgroundColor: "#3E4A59",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    overflow: "hidden",
  },
  itemName: {
    color: "white",
    fontSize: 20,
    fontFamily: "sora-regular",
    margin: 5
  },
  background: {
    height: 250,
    width: 250,
    filter: "",
    borderRadius: 15
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hitOrDamage: {
    color: "white",
    flex: 0.5,
    backgroundColor: "rgba(0,0,0,0.3)",
    margin: 2,
    padding:5,
    borderRadius: 15,
    fontSize: 30,

  }
});
