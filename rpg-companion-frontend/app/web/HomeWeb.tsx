import { useEffect, useState } from "react";
import { Text, View, TextInput, StyleSheet, Button, Alert, Platform, Image, Pressable, FlatList, Modal, ScrollView } from "react-native";
import GlobalStyles from "../globalstyles";
import Feather from "@expo/vector-icons/Feather";
import { Backpack, Swords, Notebook, House, Activity, FlaskConical, ChevronsUp } from "lucide-react";
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
  const [outofDate, setOutOfDate] = useState(false);
  const [levelUpModal, setLevelUpModal] = useState(false);
  const [abilityPointsUsed, setAbilityPointsUsed] = useState(0);
  const [tempScores, setTempScores] = useState<{ [key: string]: number }>({});
  const [subclass, setSubclass] = useState("");
  const [abilityScores, setAbilityScores] = useState<AbilityScore[]>([]);
  const [level, setLevel] = useState(-1);
  const userUID = SessionStorage.getItem("userUid")


  const isAbilityScoreLevel = character.level % 4 === 0;


  type AbilityScore = {
    title: string;
    modifier: string;
    score: number;
  };


  useEffect(() => {
    const loadCharacter = async () => {
      let data = await SessionStorage.getItem("selectedCharacterData");
      if (!data) {
        router.navigate("/+not-found");
      } //THIS IS JUST HERE TO ROUTE TO LOGIN IF THEY DONT HAVE A SELECTED CHARACTER
      else {
        setCharacter(data);
        setHp(character.hp);
        setSkillsData(initialSkillsData);
        calculateSkillsBonus();
        setInterval(shouldEditCharacter, 15000);
        setLevel(character.level);
      }
    };
    loadCharacter();
    const updated_ability_scores = [
      {
        title: "Str",
        modifier: calculateBonus(Number(character.ability_scores.str)),
        score: character.ability_scores.str,
      },
      {
        title: "Dex",
        modifier: calculateBonus(Number(character.ability_scores.dex)),
        score: character.ability_scores.dex,
      },
      {
        title: "Con",
        modifier: calculateBonus(Number(character.ability_scores.con)),
        score: character.ability_scores.con,
      },
      {
        title: "Int",
        modifier: calculateBonus(Number(character.ability_scores.int)),
        score: character.ability_scores.int,
      },
      {
        title: "Wis",
        modifier: calculateBonus(Number(character.ability_scores.wis)),
        score: character.ability_scores.wis,
      },
      {
        title: "Cha",
        modifier: calculateBonus(Number(character.ability_scores.cha)),
        score: character.ability_scores.cha,
      },
    ];
    setAbilityScores(updated_ability_scores);
  }
    , []);

  const calculateBonus = (score) => {
    const modifier = Math.floor((score - 10) / 2);
    return (modifier >= 0 ? "+" : "") + modifier.toString();
  };

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

  function shouldEditCharacter() {
    if (outofDate) {
      editCharacter();
    }
    else {

    }
  }

  const handleResetScores = () => {
    // Reset the temp scores to the original scores from the backend
    const initialScores = abilityScores.reduce((acc, ability) => {
      acc[ability.title] = ability.score;
      return acc;
    }, {});

    setTempScores(initialScores);
    setAbilityPointsUsed(0); // Reset ability points used to 0
  };

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
        console.log("Error submitting level-up changes.");
      }
    };
    editChar();
  }

  const handleIncreaseScore = (title: string) => {
    // Get the current score of the ability
    const originalScore =
      abilityScores.find((a) => a.title === title)?.score ?? 0;

    // Get the current temp score for the ability
    const currentTempScore = tempScores[title] ?? originalScore;

    // Check if the ability score can be increased (it can only increase by 1 or 2 total)
    if (currentTempScore >= originalScore + 2) return; // Already at max increase of +2

    // Calculate the proposed new score by increasing by 1
    const proposedNewScore = currentTempScore + 1;

    // Create a copy of the temp scores to modify
    const newTempScores = { ...tempScores, [title]: proposedNewScore };

    // Track the total points used for ability score increases
    const totalIncrease = Object.keys(newTempScores).reduce((total, key) => {
      const change =
        newTempScores[key] -
        (abilityScores.find((a) => a.title === key)?.score ?? 0);
      return change > 0 ? total + change : total;
    }, 0);

    // Don't allow more than 2 points total increase across all abilities
    if (totalIncrease > 2) return;

    setAbilityPointsUsed(totalIncrease);
    setTempScores(newTempScores); // Update the temp scores
  };

  function calculateSkillsBonus() {
    let count = 0;
    let character = SessionStorage.getItem("selectedCharacterData");
    while (initialSkillsData[count]) {
      let bon = 0;
      switch (initialSkillsData[count].ability) {
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
    character.hp = hp;
    console.log(hp);
  };

  const plusHP = () => {
    setHp(hp + 1);
    character.hp = hp;
    console.log(hp);
  }

  function handleLevelUp() {
    setLevel(level + 1);
    character.level = level;
    setLevelUpModal(true)
    console.log("Character.level:", character.level)
  }

  const renderTab = () => {
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

  const handleClose = () => {
    SessionStorage.setItem("editBool", "end");
    setLevelUpModal(false);
    submitLevelUp();
  };

  const [editedName, setEditedName] = character.name;

  const submitLevelUp = async () => {
    const payload: any = {
      user_uid: userUID,
      character_uid: character.character_uid,
      character: {
        level: (level),
        name: character.name,
        hp: character.hp,
        max_hp: character.max_hp,
        armor_class: character.armor_class,
        speed: character.speed,
        initiative: character.initiative,
        inventory: [
          {
            name: "Shortsword",
            type: "weapon",
            properties: "Simple Melee Weapon",
            damage_type: "1d6",
            attributes: ["Slashing", "Finess", "Vex"],
            description: "A simple shortsword",
          },
          {
            name: "Leather Armor",
            type: "armor",
            damage_type: "",
            armor_class: 11,
            attributes: ["Light"],
            description: "A simple set of leather armor",
          },
          {
            name: "Shield",
            type: "armor",
            damage_type: "",
            armor_class: 2,
            attributes: ["Shield"],
            description: "A simple shield",
          },
        ],
        proficiency_bonus: character.proficiency_bonus,
        class_id: character.class_id,
        species_id: character.species_id,
      },
    };

    //Send the name if it was edited
    if (editedName && editedName !== character.name) {
      character.name = editedName;
    }

    //Send the subclass if above level 3 (and they selected one)
    if (character.level >= 3 && subclass) {
      character.subclass = subclass;
    }

    //Send the updated ability scores if changed
    if (isAbilityScoreLevel) {
      payload.character.ability_scores = {
        str: tempScores["Str"],
        dex: tempScores["Dex"],
        con: tempScores["Con"],
        int: tempScores["Int"],
        wis: tempScores["Wis"],
        cha: tempScores["Cha"],
      };
    }

    //Always send the level up
    character.level++;

    try {
      const response = await fetch(
        "https://fmesof4kvl.execute-api.us-east-2.amazonaws.com/edit-character",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Session_Token: session_token,
            session_token: SessionStorage.getItem('token'),
          },
          body: JSON.stringify(character),
        }
      );

      console.log("Character LevelUp:", payload);
      console.log("Status:", response.status);
      // console.log("inventory", character.inventory);

      if (!response.ok) throw new Error("Failed to submit level-up changes");

      const data = await response.json();
      console.log("Level up submitted", data);
      alert("Level up submitted successfully!");
      setLevelUpModal(false);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error submitting level-up changes.");
    }
  };

  if (character === null) {
    return <View style={GlobalStyles.page}><Text>Loading...</Text></View>;
  }

  return (

    <View style={GlobalStyles.page}>
      <Modal
        transparent={true}
        animationType="slide"
        visible={levelUpModal}
        onRequestClose={() => setLevelUpModal(false)}
      >
        <View style={styles.modalView}>
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            <View style={styles.container}>
              <Text style={styles.pageHeader}>Edit Character</Text>
              <TextInput
                placeholder={`Name: ${character.name}`}
                style={styles.formControl}
                placeholderTextColor="#ccc"
              />
              <TextInput
                value={`Level: ${character.level}`}
                style={styles.formControl}
                placeholderTextColor="#ccc"
              />

              <Pressable style={styles.button} onPress={handleLevelUp}>
                <Text style={styles.buttonText}>Level Up!</Text>
              </Pressable>

              {levelUpModal && (
                <View style={styles.modalView}>
                  {/* <View style={styles.container}> */}
                  {character.level >= 3 && (
                    <TextInput
                      style={styles.formControl}
                      placeholder="Enter Subclass"
                      placeholderTextColor={"gray"}
                      value={subclass}
                      onChangeText={setSubclass}
                    ></TextInput>
                  )}
                </View>
              )}

              {isAbilityScoreLevel && (
                <View style={styles.abilityScoreWrapper} key={"isAbilityScoreLevel"}>
                  <Text style={styles.editheader}>Ability Score Improvement</Text>
                  <View style={styles.abilityRow}>
                    {abilityScores.map((ability) => (
                      <View key={ability.title} style={styles.abilityBox}>
                        <Text style={styles.abilityLabel}>
                          {ability.title}
                        </Text>
                        <Pressable
                          style={styles.abilityLabel}
                          onPress={() => handleIncreaseScore(ability.title)}
                        >
                          <View>
                            <Text style={styles.abilityScoreControl}>
                              {tempScores[ability.title] ?? ability.score}
                            </Text>
                          </View>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                  {abilityPointsUsed >= 2 && (
                    <Text style={styles.warningText}>
                      You've used all 2 ability score increases.
                    </Text>
                  )}
                  <Pressable onPress={handleResetScores}>
                    <Text style={styles.resetButton}>Reset Scores</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </ScrollView>
          <Pressable onPress={handleClose}>
            <Text style={styles.closeButton}>Save</Text>
          </Pressable>
        </View>

      </Modal>
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
            <View style={styles.dropDownContainer}>
              <Pressable style={[{ height: 100, flexDirection: "row", justifyContent: 'center', alignItems: "center" }]} onPress={() => { setLevelUpModal(true); console.log("Level up clicked") }}>
                <Text style={styles.levelup} numberOfLines={1}>Level Up</Text>
                <ChevronsUp size={100} color="black" strokeWidth={0.75} onClick={() => setTab("spells")}></ChevronsUp>
              </Pressable>
            </View>
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
                  <FlatList data={skillsData} keyExtractor={(item, index) => index.toString()} renderItem={({ item }) =>
                    <View style={styles.skillRow}>
                      <Text style={styles.skill}>{item.skill}</Text>
                      <Text style={styles.skill}>{item.ability}</Text>
                      <Text style={styles.skill}>{item.bonus}</Text>
                    </View>}>
                  </FlatList>
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
    </View >
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
  editheader: {
    color: "white",
    fontSize: 20,
    padding: 5,
    textAlign: "center",
  },
  buttonText: {
    color: "white",
    alignSelf: "center",
    fontSize: 22,
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
  formControl: {
    color: "white",
    padding: 10,
    margin: 10,
    fontSize: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    width: "95%",
    marginBottom: 24,
    textAlign: "left",
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#fff",
  },
  dropDownContainer: {
    alignSelf: "flex-end",
    flexDirection: "row",
    width: "50%",
    height: "50%",
    alignItems: "center",
    // backgroundColor: "green",
    justifyContent: "flex-end",
    alignContent: "center",
  },
  pfpHolder: {
    width: 80,
    height: 80,
    margin: 10,
  },
  abilityRow: {
    color: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
    flexWrap: "wrap",
  },
  pageHeader: {
    fontSize: 30,
    padding: 5,
    textAlign: "center",
    marginTop: 7,
    color: "white"
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
  abilityScoreControl: {
    fontSize: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#121427",
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: 100,
    textAlign: "center",
    color: "white"
  },
  resetButton: {
    color: "red",
    marginTop: 10,
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
  },
  body: {
    flex: 1,
    flexDirection: "row",
    overflowX: "scroll"
  },
  abilityScoreWrapper: {
    margin: 15,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 15,
    width: "80%",

  },
  split: {
    flex: 1,
    width: "50%",
    minWidth: 800,
    height: "100%",
  },
  abilityLabel: {
    fontSize: 24,
    marginBottom: 4,
    marginTop: 4,
    color: "white"
  },
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#121427",
  },
  abilitiesHolder: {
    flexDirection: "row",
    height: "auto",
    width: "100%",
    minHeight: 60,
    justifyContent: "space-around",
  },
  modalView: {
    alignSelf: "center",
    flex: 0.8,
    width: "80%",
    borderColor: "white",
    borderWidth: 2,
    backgroundColor: "#121427",
    padding: 15,
    marginTop: 50,
    borderRadius: 15
  },
  button: {
    backgroundColor: "#6B728C",
    borderColor: "#6B728C",
    alignSelf: "center",
    borderWidth: 2,
    borderRadius: 25,
    marginTop: 40,
    width: "75%",
  },
  abilityBox: {
    alignItems: "center",
    marginHorizontal: 8,
    color: "white"
  },
  ability: {
    color: "white",
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
  levelup: {
    fontSize: 32,

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
  warningText: {
    color: "#A8FFFC",
    fontWeight: "bold",
    marginTop: 10,
    alignSelf: "center",
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
    minWidth: 600,
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
  closeButton: {
    color: "#A8FFFC",
    width: 300,
    marginTop: 10,
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
    borderColor: "white",
    borderWidth: 2,
    alignSelf: "center"
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
