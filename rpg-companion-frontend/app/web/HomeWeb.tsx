import { useState } from "react";
import {Text,View,TextInput,StyleSheet,Button,Alert,Platform,Image,Pressable} from "react-native";
import GlobalStyles from "../globalstyles";
import Feather from "@expo/vector-icons/Feather";
import {Backpack,Swords,Notebook,House,Activity,FlaskConical,} from "lucide-react-native";
import Notes from "./components/Notes";
import Spells from "./components/Spells";
import Combat from "./components/Combat";
import Status from "./components/Status";
import Inventory from "./components/Inventory";
 

export default function HomeWeb() {

  const [hp,setHp] = useState(10);
  const [tab, setTab] = useState("notes");


  const minusHP = () => {
    if (hp <= 0) {
      setHp(0);
      return;
    }
    setHp(hp - 1);
    console.log(hp);
  };

  const plusHP = () => {
    setHp(hp + 1);
    console.log(hp);
  }


  const renderTab = () => {
    switch (tab) {
      case "notes":
        return <Notes title="enterTitle of last used or first note here" note="same with the note"/>;
      case "spells":
        return <Spells test="test" />;
      case "combat":
        return <Combat test="test" />;
      case "status":
        return <Status test="test" />;
      case "inventory":
        return <Inventory test="test" />;
    }
  }



  return (
    <View style={GlobalStyles.page}>
      <View style={styles.home}>
        <View style={styles.header}>
          <View style={styles.pfpHolder}>
            <Image
              source={require("../../assets/images/placeholderDND.png")}
              style={styles.pfp}
              resizeMode="cover"
            />
            {/* Needs to have character sheets pfp used, placeholder for now */}
          </View>
          <View style={styles.charHeader}>
            {/* Character Name */}
            <Text style={styles.headName}>Legolas</Text>
            {/* Character Species */}
            <Text style={styles.headSpecies}>Elf</Text>
            {/* Character Class */}
            <Text
              style={styles.headClass}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
            >
              Ranger
            </Text>
          </View>
          <View style={styles.dropDownContainerHolder}>
            <View style={styles.dropDownContainer}></View>
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.split}>
            <View style={styles.abilitiesHolder}>
              <View style={styles.ability}>
                <Text
                  style={styles.abilityLev}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                >
                  Strength
                </Text>
                <View style={styles.abilityName}>10</View>
              </View>
              <View style={styles.ability}>
                <Text
                  style={styles.abilityLev}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                >
                  Dexterity
                </Text>
                <View style={styles.abilityName}>10</View>
              </View>
              <View style={styles.ability}>
                <Text
                  style={styles.abilityLev}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                >
                  Constitution
                </Text>
                <View style={styles.abilityName}>10</View>
              </View>
              <View style={styles.ability}>
                <Text
                  style={styles.abilityLev}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                >
                  Intelligence
                </Text>
                <View style={styles.abilityName}>10</View>
              </View>
              <View style={styles.ability}>
                <Text
                  style={styles.abilityLev}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                >
                  Wisdom
                </Text>
                <View style={styles.abilityName}>10</View>
              </View>
              <View style={styles.ability}>
                <Text
                  style={styles.abilityLev}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                >
                  Charisma
                </Text>
                <View style={styles.abilityName}>10</View>
              </View>
            </View>
            <View style={styles.skillsHolder}>
              <View style={styles.skillsTop}>
                <Text style={styles.skill}>Skill</Text>
                <Text style={styles.skill}>Ability</Text>
                <Text style={styles.skill}>Bonus</Text>
              </View>
              <View style={styles.skillsBody}>
                {/* Will call a component to populate this table with the values of the correct character 
            for now populated with dummy values*/}

                <View style={styles.skillRow}>
                  <Text style={styles.skill}>Investigation</Text>
                  <Text style={styles.skill}>Intelligence</Text>
                  <Text style={styles.skill}>+2</Text>
                </View>

                <View style={styles.skillRow}>
                  <Text style={styles.skill}>Arcana</Text>
                  <Text style={styles.skill}>Intelligence</Text>
                  <Text style={styles.skill}>+0</Text>
                </View>
                <View style={styles.skillRow}>
                  <Text style={styles.skill}>Deception</Text>
                  <Text style={styles.skill}>Charisma</Text>
                  <Text style={styles.skill}>+1</Text>
                </View>
                <View style={styles.skillRow}>
                  <Text style={styles.skill}>Perception</Text>
                  <Text style={styles.skill}>Wisdom</Text>
                  <Text style={styles.skill}>+3</Text>
                </View>
                <View style={styles.skillRow}>
                  <Text style={styles.skill}>Persuasion</Text>
                  <Text style={styles.skill}>Charisma</Text>
                  <Text style={styles.skill}>-1</Text>
                </View>
              </View>
            </View>
          
        </View>
          <View style={styles.split}>
            <View style={styles.iconContainer}>
              <View style={styles.featherWrapper}>
                <Feather
                  name="circle"
                  size={100}
                  color="white"
                  style={styles.feather}
                />
                <Text style={styles.skill}>5</Text>
              </View>
              <View style={styles.featherWrapper}>
                <Feather
                  name="square"
                  size={100}
                  color="white"
                  style={styles.feather}
                />
                <Text style={styles.skill}>5</Text>
              </View>
              <View style={styles.featherWrapper}>
                <Feather
                  name="shield"
                  size={100}
                  color="white"
                  style={styles.feather}
                />
                <Text style={styles.skill}>5</Text>
              </View>

              <View style={styles.healthContainer}>
                <View style={styles.healthItem}>
                  <Pressable onPress={minusHP} style={styles.feather}>
                    <Feather name="minus" size={80} color="red" />
                  </Pressable>
                </View>
                <View style={styles.healthItem}>
                  <Text style={styles.healthNum}>{hp}</Text>
                </View>
                <View style={styles.healthItem}>
                  <Pressable onPress={plusHP} style={styles.feather}>
                    <Feather
                      name="plus"
                      size={80}
                      color="green"
                      style={styles.feather}
                    />
                  </Pressable>
                </View>
              </View>
            </View>
            <View style={styles.dynamicSelector}> 
            <View style={styles.tabOption}>
              <Notebook size={100} strokeWidth={0.75} onPress={() => setTab("notes")}></Notebook>
            </View>
            <View style={styles.tabOption}>
              <FlaskConical size={100} strokeWidth={0.75} onPress={() => setTab("spells")}></FlaskConical>
            </View>
            <View style={styles.tabOption}>
              <Swords size={100} strokeWidth={0.75} onPress={() => setTab("combat")}></Swords>
            </View>
            <View style={styles.tabOption}>
              <Activity size={100} strokeWidth={0.75} onPress={() => setTab("status")}></Activity>
            </View>
            <View style={styles.tabOption}>
              <Backpack size={100} strokeWidth={0.75} onPress={() => setTab("inventory")}></Backpack>
            </View>
            
          </View>
          <View style={styles.dynamicHolder}>
            
          
          {renderTab()}
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
    width: "100%",
  },
  headName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headClass: {
    fontSize: 16,
    color: "#505C50",
  },
  headSpecies: {
    fontSize: 16,
    color: "#505C50",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    alignItems: "flex-start",
    height: 100,
    width: "100%",
    backgroundColor: "white",
    color: "black",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  charHeader: {
    flexDirection: "column",
    alignContent: "space-around",
    justifyContent: "space-around",
    height: 80,
    width: "20%",
    color: "green",
    marginTop: 10,
    paddingLeft: 10,
  },
  dropDownContainerHolder: {
    flex: 1,
  },
  dropDownContainer: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
    width: 80,
    height: 80,
    margin: 10,
    backgroundColor: "green",
    justifyContent: "center",
    alignContent: "center",
  },
  pfpHolder: {
    width: 80,
    height: 80,
    margin: 10,
  },
  pfp: {
    height: 80,
    width: 80,
    alignSelf: "center",
    borderRadius: 10,
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 5,
  },
  body: {
    flex: 1,
    flexDirection: "row",
  },
  split: {
    flex: 1,
    width: "50%",
    height: "100%",
  },
  abilitiesHolder: {
    flexDirection: "row",
    height: "auto",
    width: "100%",
    minHeight: 60,
    justifyContent: "space-around",
  },
  ability: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
    height: 100,
    minHeight: 60,
    width: 100,
    minWidth: 80,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "white",
    margin: 15,
    borderRadius: 10,
  },
  abilityLev: {

    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    fontFamily: "sans-serif",
    width: "100%",
    height: "30%",
    textAlign: "center",
    justifyContent: "center",
    borderColor: "white",
    borderBottomWidth: 2,
    borderStyle: "dashed",
    margin: 1,
  },
  abilityName: {
    fontWeight: "bold",
    fontFamily: "sans-serif",
    textAlign: "center",
    justifyContent: "center",
    fontSize: 26,
    height: "70%",
    width: "100%",
  },
  skillsHolder: {
    flex: 1,
    margin: 15,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "white",
    borderRadius: 10,
    height: "100%",
  },
  skillsTop: {
    flexDirection: "row",
    height: 36,
    borderStyle: "dashed",
    borderBottomWidth: 2,
    borderColor: "white",
    justifyContent: "space-evenly",
  },
  skillRow: {
    flexDirection: "row",
    height: 36,
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderColor: "gray",
    justifyContent: "space-evenly",
  },
  skill: {
    flex: 1,
    fontSize: 24,
    textAlign: "center",
    color: "white",
  },
  skillsBody: {
    flex: 1,
  },
  featherHolder: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    margin: 10,
  },
  feather: {
    flex: 1,
    position: "absolute",
    alignContent: "center",
    justifyContent: "center",
    height: 100,
    minHeight: 80,
    width: 100,
    minWidth: 80,
  },
  featherWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  iconContainer: {
    height: 130,
    justifyContent: "space-evenly",
    textAlignVertical: "center",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    minWidth:300,
    overflow:"hidden"
  },
  healthContainer: {
    flexDirection: "row",
    width: 225,
    height: 100,
    justifyContent: "flex-start",
    alignContent: "center",
  },
  healthItem: {
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
  },
  healthNum: {
    fontSize:36,
    height:50,
    width:75,
    color:"white",
    textAlign:"center",
    justifyContent:"center"
  },
  dynamicSelector: {
    flex:0.15,
    flexDirection:"row",
    // backgroundColor:"green",
    margin: "1%",
    borderRadius: 10,
    height:"15%",
    minHeight: 100,
    justifyContent:"space-around",
    alignContent:"space-around",
    borderColor: "white",
    borderWidth:2
  },
  dynamicHolder: {
    flex:0.85,
    height:"85%",
  },
  tabOption: {
    flex:0.15,
    marginVertical: "0.5%",
    // backgroundColor:"red",
    justifyContent:"center",
    alignItems:"center"
  }

});
