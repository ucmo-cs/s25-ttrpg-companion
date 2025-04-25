import { View, Text, StyleSheet, TextInput, ScrollView, Platform, KeyboardAvoidingView, TouchableOpacity, } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import SessionStorage from "react-native-session-storage";
import GlobalStyles from "../globalstyles";
import { Circle } from "lucide-react-native";

const globalText = {
  color: "white",
  fontFamily: "Sora",
};

const items = [
  {
    name: "Shortsword",
    type: "weapon",
    properties: "Simple Melee Weapon",
    damage_type: "1d6",
    attributes: ["Slashing", "Finess", "Vex"],
    description: "A simple shortsword",
  },
  {
    name: "Shortbow",
    type: "weapon",
    properties: "Simple Ranged Weapon",
    damage_type: "1d6",
    attributes: ["Piercing", "Slow"],
    description: "A simple shortbow",
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
];
export default function CharacterCreation() {
  const initialCharacterData = {
    user_uid: "",
    character_uid: "",
    character: {
      name: "",
      class_id: "",
      subclass_id: "",
      species_id: "",
      level: 1,
      proficiency_bonus: 1,
      hp: 0,
      max_hp: 0,
      speed: 30,
      initiative: 0,
      armor_class: 10,
      features: {
        classfeatures: [],
        subclassfeatures: [],
        speciesfeatures: [],
      },
      ability_scores: {
        str: 10,
        dex: 10,
        con: 10,
        int: 10,
        wis: 10,
        cha: 10,
      },
      inventory: [],
      character_notes: "",
    },
  };
  const [characterData, setCharacterData] = useState(initialCharacterData);
  const [Class, setClass] = useState();
  const [Species, setSpecies] = useState();

  const handleChange = (key: string, value: string) => {
    if (["str", "dex", "con", "int", "wis", "cha"].includes(key)) {
      setCharacterData((prev) => ({
        ...prev,
        character: {
          ...prev.character,
          ability_scores: {
            ...prev.character.ability_scores,
            [key]: Number(value),
          },
        },
      }));
    } else {
      setCharacterData((prev) => ({
        ...prev,
        character: {
          ...prev.character,
          [key]: value,
        },
      }));
    }
  };


  function changeClass(Class) {
    setClass(Class)
    getClassData(Class);
  }

  function getClassData(Class) {
    // IMPLEMENT LOGIC TO REQUEST CLASS DATA FROM BACKEND HERE
  };


  function validClass() {
    if (Class != null && Class != undefined) {
      return (
        <Picker
          selectedValue={Class}
          mode="dropdown"
          style={styles.formControl}
          onValueChange={(itemValue) => setClass(itemValue)}>
          {getSubclasses()}
        </Picker>
      )
    }
  };


  function getSubclasses() {
    if (Class == null) {
      return (<Picker.Item label="Please select a class first" value="na" />)
    }
    else if (Class == "wizard") {
      return (
        <>

        </>
      )
    }
    else {
      return (<Picker.Item label="somthing selected" value="na" />)
    }
  };


  const getSpecies = async () => {
    try {
      console.log(SessionStorage.getItem("userUid"));
      console.log(SessionStorage.getItem("token"));
      const response = await fetch(
        "https://fmesof4kvl.execute-api.us-east-2.amazonaws.com/get-species",
        {
          method: "POST",
          headers: {
            session_token: SessionStorage.getItem("token"),
          },
          body: JSON.stringify({
            user_uid: SessionStorage.getItem("userUid"),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json();
      SessionStorage.setItem("speciesList", data);
      SessionStorage.setItem("token", data.session_token);
      console.log(SessionStorage.getItem("speciesList"));
      return (<Picker.Item label="Error occurred" value="error" />);
    }
    catch (error) {
      console.log("Couldnt retreive subClasses: " + error);
      return (<Picker.Item label="Error occurred" value="error" />);
    }
  }

  function inputSpecies() {
    getSpecies();
    console.log(SessionStorage.getItem("speciesList"));
    return (<Picker.Item label="Testing" value={"test"} />)
  }


  const user_uid = SessionStorage.getItem("userUid"); //Store UserUID
  const session_token = SessionStorage.getItem("token"); //Store Session_Token


  const submitCharacter = async () => {
    const filteredInventory = items.filter((item) =>
      SelectedOptions.includes(item.name)
    );
    const payload = {
      user_uid: user_uid,
      character: {
        ...characterData.character,
        inventory: [filteredInventory],
      },
    };
    try {
      const response = await fetch(
        "https://fmesof4kvl.execute-api.us-east-2.amazonaws.com/create-character",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Session_Token: session_token,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      console.log(data);
      alert("Character created successfully!");
      SessionStorage.setItem("token", data.session_token)
      setCharacterData(initialCharacterData); // Reset the form after submission
      setSelectedOptions([]); // Reset selected options
      router.navigate("../../CharacterSelection")
    } catch (error) {
      console.error(error);
      console.log("Data:", payload);
    }
  };


  const [SelectedOptions, setSelectedOptions] = useState<string[]>([]);
  const handleOptionPress = (option: string) => {
    setSelectedOptions(
      (prev) =>
        prev.includes(option)
          ? prev.filter((item) => item !== option) // remove if selected
          : [...prev, option] // add if not selected
    );
  };
  return (
    <View style={GlobalStyles.page}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.pageHeader}>Create Character</Text>
          <TextInput
            placeholder="Name"
            style={styles.formControl}
            placeholderTextColor="#ccc"
            value={characterData.character.name}
            onChangeText={(text) => handleChange("name", text)}
          />

          <Picker //Species Selection
            selectedValue={Species}
            mode="dropdown"
            style={styles.formControl}
            onValueChange={(itemValue) => changeClass(itemValue)}>
          </Picker>

          <Picker //Class selection
            selectedValue={Class}
            mode="dropdown"
            style={styles.formControl}
            onValueChange={(itemValue) => changeClass(itemValue)}>
            <Picker.Item label="Barbarian" value="barbarian" />
            <Picker.Item label="Bard" value="bard" />
            <Picker.Item label="Cleric" value="cleric" />
            <Picker.Item label="Druid" value="druid" />
            <Picker.Item label="Fighter" value="fighter" />
            <Picker.Item label="Monk" value="monk" />
            <Picker.Item label="Paladin" value="paladin" />
            <Picker.Item label="Ranger" value="ranger" />
            <Picker.Item label="Rogue" value="rogue" />
            <Picker.Item label="Sorcerer" value="sorcerer" />
            <Picker.Item label="Warlock" value="warlock" />
            <Picker.Item label="Wizard" value="wizard" />
            <Picker.Item label="Artificer" value="artificer" />
          </Picker>

          {/* <TextInput
            placeholder="Class"
            style={styles.formControl}
            placeholderTextColor="#ccc"
            value={characterData.character.class_id}
            onChangeText={(text) => handleChange("class_id", text)}
          /> */}


          <TextInput
            style={[styles.formControl, { height: 100 }]}
            placeholderTextColor="#ccc"
            multiline={true}
            value={characterData.character.character_notes}
            onChangeText={(text) => handleChange("character_notes", text)}
            placeholder="Notes"
          />
          <Text style={styles.AbilityScores}>Ability Scores</Text>
          <View style={styles.abilityScoreWrapper}>
            <View style={styles.abilityRow}>
              <View style={styles.abilityBox}>
                <Text style={styles.abilityLabel}>Str</Text>
                <TextInput
                  style={styles.abilityScoreControl}
                  placeholder="10"
                  placeholderTextColor="#ccc"
                  value={characterData.character.ability_scores.str.toString()}
                  onChangeText={(text) => handleChange("str", text)}
                />
              </View>
              <View style={styles.abilityBox}>
                <Text style={styles.abilityLabel}>Dex</Text>
                <TextInput
                  style={styles.abilityScoreControl}
                  placeholder="10"
                  placeholderTextColor="#ccc"
                  value={characterData.character.ability_scores.dex.toString()}
                  onChangeText={(text) => handleChange("dex", text)}
                />
              </View>
              <View style={styles.abilityBox}>
                <Text style={styles.abilityLabel}>Con</Text>
                <TextInput
                  style={styles.abilityScoreControl}
                  placeholder="10"
                  placeholderTextColor="#ccc"
                  value={characterData.character.ability_scores.con.toString()}
                  onChangeText={(text) => handleChange("con", text)}
                />
              </View>
            </View>
            <View style={styles.abilityRow}>
              <View style={styles.abilityBox}>
                <Text style={styles.abilityLabel}>Wis</Text>
                <TextInput
                  style={styles.abilityScoreControl}
                  placeholder="10"
                  placeholderTextColor="#ccc"
                  value={characterData.character.ability_scores.wis.toString()}
                  onChangeText={(text) => handleChange("wis", text)}
                />
              </View>

              <View style={styles.abilityBox}>
                <Text style={styles.abilityLabel}>Int</Text>
                <TextInput
                  style={styles.abilityScoreControl}
                  placeholder="10"
                  placeholderTextColor="#ccc"
                  value={characterData.character.ability_scores.int.toString()}
                  onChangeText={(text) => handleChange("int", text)}
                />
              </View>
              <View style={styles.abilityBox}>
                <Text style={styles.abilityLabel}>Cha</Text>
                <TextInput
                  style={styles.abilityScoreControl}
                  placeholder="10"
                  placeholderTextColor="#ccc"
                  value={characterData.character.ability_scores.cha.toString()}
                  onChangeText={(text) => handleChange("cha", text)}
                />
              </View>
            </View>
          </View>
          <Text style={styles.Inventory}>Inventory</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity onPress={() => handleOptionPress("Shortsword")}>
              <Circle
                size={25}
                color={SelectedOptions.includes("Shortsword") ? "#ccc" : ""}
                style={{ marginBottom: 5 }}
                strokeWidth={1}
                fill={SelectedOptions.includes("Shortsword") ? "#ccc" : ""}
              >
                {" "}
              </Circle>
            </TouchableOpacity>
            <Text style={styles.radioText}>Shortsword</Text>
          </View>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              onPress={() => handleOptionPress("Leather Armor")}
            >
              <Circle
                size={25}
                color={SelectedOptions.includes("Leather Armor") ? "#ccc" : ""}
                style={{ marginBottom: 5 }}
                strokeWidth={1}
                fill={SelectedOptions.includes("Leather Armor") ? "#ccc" : ""}
              >
                {" "}
              </Circle>
            </TouchableOpacity>
            <Text style={styles.radioText}>Leather Armor</Text>
          </View>
          <View style={styles.radioContainer}>
            <TouchableOpacity onPress={() => handleOptionPress("Shield")}>
              <Circle
                size={25}
                color={SelectedOptions.includes("Shield") ? "#ccc" : ""}
                style={{ marginBottom: 5 }}
                strokeWidth={1}
                fill={SelectedOptions.includes("Shield") ? "#ccc" : ""}
              >
                {" "}
              </Circle>
            </TouchableOpacity>
            <Text style={styles.radioText}>Shield</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={inputSpecies}>
          <Text style={styles.buttonText}>Create Character</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "50%",
    marginHorizontal: "25%",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "#121427",
    margin: 0
  },
  staticContainer: {
    alignSelf: "flex-end",
    width: "70%",
    height: "15%",
  },
  pageHeader: {
    ...globalText,
    fontSize: 30,
    padding: 5,
    textAlign: "center",
    marginTop: 7,
  },
  formControl: {
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
    backgroundColor: "#121427",
    color: "#ccc"
  },
  AbilityScores: {
    ...globalText,
    padding: 10,
    margin: 10,
    fontSize: 24,
    color: "#ccc",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    width: "100%",
    marginBottom: 24,
    textAlign: "left",
    marginTop: 10,
  },
  abilityScoreWrapper: {
    marginBottom: 5,
  },
  abilityRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  abilityScoreControl: {
    ...globalText,
    fontSize: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#121427",
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: 100,
    textAlign: "center",
  },
  abilityLabel: {
    ...globalText,
    fontSize: 24,
    marginBottom: 4,
    marginTop: 4,
  },
  abilityBox: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  button: {
    backgroundColor: "#6B728C",
    borderColor: "#6B728C",
    alignSelf: "center",
    borderWidth: 2,
    borderRadius: 25,
    marginTop: 40,
    width: "50%",
  },
  buttonText: {
    ...globalText,
    alignSelf: "center",
    fontSize: 22,
  },
  Inventory: {
    ...globalText,
    padding: 10,
    margin: 10,
    fontSize: 24,
    color: "#ccc",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    width: "100%",
    marginBottom: 24,
    textAlign: "left",
    marginTop: 10,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginStart: 20,
    marginBottom: 10,
  },
  radioText: {
    ...globalText,
    flex: 1,
    textAlign: "left",
    fontSize: 24,
    marginStart: 20,
  },
});
