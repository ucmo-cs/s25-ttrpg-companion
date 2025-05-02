import { useEffect, useState } from "react";
import { Text, View, TextInput, StyleSheet, Button, Alert, Platform, Image, Pressable, FlatList } from "react-native";
import GlobalStyles from "../globalstyles";
import Feather from "@expo/vector-icons/Feather";
import { Backpack, Swords, Notebook, House, Activity, FlaskConical, } from "lucide-react";
import SessionStorage from "react-native-session-storage";
import Notes from "./components/Notes";
import Spells from "./components/Spells";
import Combat from "./components/Combat";
import Status from "./components/Status";
import Inventory from "./components/Inventory";
import { router } from "expo-router";

export default function HomeWeb() {

  const [character, setCharacter] = useState(SessionStorage.getItem("selectedCharacterData"));
  const [hp, setHp] = useState(0);
  const [tab, setTab] = useState("notes");
  const [note, setNote] = useState(null);


  useEffect(() => {
    const loadCharacter = async () => {
      const data = await SessionStorage.getItem("selectedCharacterData");
      if (!data) {
        router.navigate("/+not-found");
      } else {
        setCharacter(data);
        setHp(data.hp);
        setSkillsData(initialSkillsData);
        calculateSkillsBonus();
        setInterval(editCharacter , 15000)
      }
    };
    loadCharacter();
  }, []);

  const initialSkillsData = [
    {
      skill: "Acrobatics",
      ability: "Dex",
      bonus: "+0",
      favorite: false,
      proficient: false,
    },
    {
      skill: "Arcana",
      ability: "Int",
      bonus: "+0",
      favorite: false,
      proficient: false,
    },
    {
      skill: "Athletics",
      ability: "Str",
      bonus: "+0",
      favorite: false,
      proficient: false,
    },
    {
      skill: "Deception",
      ability: "Cha",
      bonus: "+0",
      favorite: false,
      proficient: false,
    },
    {
      skill: "History",
      ability: "Int",
      bonus: "+0",
      favorite: false,
      proficient: false,
    },
    {
      skill: "Insight",
      ability: "Wis",
      bonus: "+0",
      favorite: false,
      proficient: false,
    },
    {
      skill: "Intimidation",
      ability: "Cha",
      bonus: "+0",
      favorite: false,
      proficient: false,
    },
    {
      skill: "Investigation",
      ability: "Int",
      bonus: "+0",
      favorite: false,
      proficient: false,
    },
    {
      skill: "Medicine",
      ability: "Wis",
      bonus: "+0",
      favorite: false,
      proficient: false,
    },
    {
      skill: "Nature",
      ability: "Int",
      bonus: "+0",
      favorite: false,
      proficient: false,
    },
    {
      skill: "Perception",
      ability: "Wis",
      bonus: "+0",
      favorite: false,
      proficient: false,
    },
    {
      skill: "Religion",
      ability: "Int",
      bonus: "+0",
      favorite: false,
      proficient: false,
    },
    {
      skill: "Stealth",
      ability: "Dex",
      bonus: "+0",
      favorite: false,
      proficient: false,
    },
    {
      skill: "Sleight of Hand",
      ability: "Dex",
      bonus: "+0",
      favorite: false,
      proficient: false,
    },
    {
      skill: "Animal Handling",
      ability: "Wis",
      bonus: "+0",
      favorite: false,
      proficient: false,
    },
  ];

 

  function editCharacter() {
    console.log("inside editCharacter");
    const editChar = async () => {
      try {
        const response = await fetch(
          "https://fmesof4kvl.execute-api.us-east-2.amazonaws.com/edit-character",
          {
            method: "POST",
            headers: {
              session_token: SessionStorage.getItem("token"),
            },
            body: JSON.stringify(SessionStorage.getItem("selectedCharacterData")),
          }
        );
  
        console.log("Status:", response.status);
        // console.log("inventory", character.inventory);
  
        if (!response.ok) throw new Error("Failed to submit level-up changes");
  
        const data = await response.json();
        console.log("Character in SessionStorage: ", data);
        alert("Character Edit Submitted");
      } catch (error) {
        console.error("Submission error:", error);
        alert("Error submitting level-up changes.");
      }
    };
  }

  function calculateSkillsBonus(){
    let count = 0;
    let character = SessionStorage.getItem("selectedCharacterData");
    while (initialSkillsData[count]){
      let bon = 0;
      switch(initialSkillsData[count].ability){
        case "Str":
          bon = Math.floor((character.ability_scores.str - 10) / 2)
          break;
        case "Dex":
          bon = Math.floor((character.ability_scores.dex - 10) / 2)
          break;
        case "Int":
          bon = Math.floor((character.ability_scores.int - 10) / 2)
          break;
        case "Wis":
          bon = Math.floor((character.ability_scores.wis - 10) / 2)
          break;
        case "Cha":
          bon = Math.floor((character.ability_scores.con - 10) / 2)
          break;
        case "Con":
          bon = Math.floor((character.ability_scores.cha - 10) / 2)
          break;
      }
      if (bon > -1)
      initialSkillsData[count].bonus = "+" + bon.toString();
      else
      initialSkillsData[count].bonus = bon.toString();
      count++;
    }
    setSkillsData(initialSkillsData);
    console.log(skillsData);
  }

  const [skillsData, setSkillsData] = useState(initialSkillsData);


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
    console.log(character);
    switch (tab) {
      case "notes":
        return <Notes key="notes" />;
      case "spells":
        return <Spells key="spells" />;
      case "combat":
        if (character != null)
          return <Combat key="combat" inventory={character.inventory} />;
      case "status":
        return <Status key="status" />;
      case "inventory":
        return <Inventory key="inventory" />;
    }
  }

  if (character === null) {
    return <View style={GlobalStyles.page}><Text>Loading...</Text></View>;
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
          </View>
          <View style={styles.charHeader}>
            <Text style={styles.headName}>{character!.name}</Text>
            <Text style={styles.headSpecies}>{character!.species_id}</Text>
            <Text style={styles.headClass} numberOfLines={1} adjustsFontSizeToFit={true}>{character!.class_id}</Text>
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
                <View style={styles.abilityName}>{character.ability_scores.str}</View>
              </View>
              <View style={styles.ability}>
                <Text
                  style={styles.abilityLev}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                >
                  Dexterity
                </Text>
                <View style={styles.abilityName}>{character.ability_scores.dex}</View>
              </View>
              <View style={styles.ability}>
                <Text
                  style={styles.abilityLev}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                >
                  Constitution
                </Text>
                <View style={styles.abilityName}>{character.ability_scores.con}</View>
              </View>
              <View style={styles.ability}>
                <Text
                  style={styles.abilityLev}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                >
                  Intelligence
                </Text>
                <View style={styles.abilityName}>{character.ability_scores.int}</View>
              </View>
              <View style={styles.ability}>
                <Text
                  style={styles.abilityLev}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                >
                  Wisdom
                </Text>
                <View style={styles.abilityName}>{character.ability_scores.wis}</View>
              </View>
              <View style={styles.ability}>
                <Text
                  style={styles.abilityLev}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                >
                  Charisma
                </Text>
                <View style={styles.abilityName}>{character.ability_scores.cha}</View>
              </View>
            </View>
            <View style={styles.skillsHolder}>
              <View style={styles.skillsTop}>
                <Text style={styles.skill}>Skill</Text>
                <Text style={styles.skill}>Ability</Text>
                <Text style={styles.skill}>Bonus</Text>
              </View>
              <View style={styles.skillsBody}>
                <View style={{ flex: 1, maxHeight: "100%" }}>
                  <FlatList data={skillsData} keyExtractor={(item, index) => index.toString()} renderItem={({item}) => 
                    <View style={styles.skillRow}>
                      <Text style={styles.skill}>{item.skill}</Text>
                      <Text style={styles.skill}>{item.ability}</Text>
                      <Text style={styles.skill}>{item.bonus}</Text>
                    </View>}>
                  </FlatList>
                </View>
                {/* Dynamically render skills here */}

                {/* <View style={styles.skillRow}>
                  <Text style={styles.skill}>Investigation</Text>
                  <Text style={styles.skill}>Intelligence</Text>
                  <Text style={styles.skill}>+2</Text>
                </View>
                 */}

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
                <Text style={styles.skill}>{character.proficiency_bonus}</Text>
              </View>
              <View style={styles.featherWrapper}>
                <Feather
                  name="square"
                  size={100}
                  color="white"
                  style={styles.feather}
                />
                <Text style={styles.skill}>{character.speed}</Text>
              </View>
              <View style={styles.featherWrapper}>
                <Feather
                  name="shield"
                  size={100}
                  color="white"
                  style={styles.feather}
                />
                <Text style={styles.skill}>{character.armor_class}</Text>
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
                <Notebook size={100} strokeWidth={0.75} onClick={() => setTab("notes")}></Notebook>
              </View>
              <View style={styles.tabOption}>
                <FlaskConical size={100} strokeWidth={0.75} onClick={() => setTab("spells")}></FlaskConical>
              </View>
              <View style={styles.tabOption}>
                <Swords size={100} strokeWidth={0.75} onClick={() => setTab("combat")}></Swords>
              </View>
              <View style={styles.tabOption}>
                <Activity size={100} strokeWidth={0.75} onClick={() => setTab("status")}></Activity>
              </View>
              <View style={styles.tabOption}>
                <Backpack size={100} strokeWidth={0.75} onClick={() => setTab("inventory")}></Backpack>
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
    backgroundColor: "rgb(255, 255, 255)",
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
    height: "50%",
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
    overflowX:"scroll"
 
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
    minWidth: 400,
    overflow: "hidden"
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
    fontSize: 36,
    height: 50,
    width: 75,
    color: "white",
    textAlign: "center",
    justifyContent: "center"
  },
  dynamicSelector: {
    flex: 0.15,
    flexDirection: "row",
    margin: "1%",
    borderRadius: 10,
    height: "15%",
    minHeight: 100,
    justifyContent: "space-around",
    alignContent: "space-around",
    borderColor: "white",
    borderWidth: 2
  },
  dynamicHolder: {
    flex: 0.85,
    height: "85%",
  },
  tabOption: {
    flex: 0.15,
    marginVertical: "0.5%",
    justifyContent: "center",
    alignItems: "center"
  }

});
