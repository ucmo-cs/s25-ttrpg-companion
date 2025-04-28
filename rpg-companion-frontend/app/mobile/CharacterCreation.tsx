import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import SessionStorage from "react-native-session-storage";
import { Circle } from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";

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
  //Initialize the character data with default values
  const initialCharacterData = {
    user_uid: "",
    character_uid: "",
    character: {
      name: "",
      class_id: "",
      subclass_id: "",
      species_id: "",
      subspecies_id: "",
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
  const [characterData, setCharacterData] = useState<any>(initialCharacterData);

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

  //Set session token and user uid from session storage
  const user_uid = SessionStorage.getItem("userUid");
  let session_token = SessionStorage.getItem("token");
  // console.log("Session token:", session_token);
  const [traitsKey, setTraitsKey] = useState<string | null>(null);
  //Character submission function
  //This function is called when the user presses the "Create Character" button
  const submitCharacter = async () => {
    //Filter inventory based on selected options
    const filteredInventory = items.filter((item) =>
      SelectedOptions.includes(item.name)
    );

    //Check selected species and set speed, creature type, size, and features
    const selectedSpecies = species.find(
      (species) => species.id === characterData.character.species_id
    );
    if (!selectedSpecies) {
      alert("Please select a valid species.");
      return;
    }
    if (loadingSpells) {
      alert("Loading spells, please wait...");
      return;
    }
    if (classFeatures.Spellcasting) {
      if (!spellData || Object.keys(spellData).length === 0) {
        alert("Please select a valid spellcasting class.");
        return;
      }
    }

    const selectedSubspecies =
      selectedSpecies.features?.[
        characterData.character.subspecies_id
          ?.toLowerCase()
          .replace(/\s/g, "_") + "_traits"
      ];

    const payload = {
      user_uid: user_uid,
      character: {
        ...characterData.character,
        speed: selectedSpecies.features.Speed,
        creature_type: selectedSpecies.features.Creature_Type,
        size: selectedSpecies.features.Size,
        level: characterData.character.level,
        proficiency_bonus: classData.info.proficiency,

        inventory: [filteredInventory],
        features: {
          classfeatures: [classFeatures],
          subclassfeatures: [],
          speciesfeatures: traitsKey ? selectedSpecies.features[traitsKey] : [],
          ...(selectedSubspecies
            ? { subspeciesfeatures: selectedSubspecies }
            : {}),
        },
        ...(classFeatures.Spellcasting && classData?.info
          ? {
              cantrips_known: classData.info.cantrips_known,
              spell_slots: classData.info.spell_slots?.[0] || 0,
            }
          : {}),
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
      const data = await response.text();
      console.log(data);
      console.log("Character data:", payload);
      alert("Character created successfully!");
      setCharacterData(initialCharacterData); // Reset the form after submission
      setSelectedOptions([]); // Reset selected options
      setClassFeatures({}); // Reset class features
      setClassData({}); // Reset class data
      setSpellData({}); // Reset spell data
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
  const [species, setSpecies] = useState<any[]>([]);
  const [availableSubspecies, setAvailableSubspecies] = useState<any[]>([]);
  //Get species data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://fmesof4kvl.execute-api.us-east-2.amazonaws.com/get-species",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Session_Token: session_token,
            },
            body: JSON.stringify({ user_uid: user_uid }),
          }
        );
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error fetching species:", errorText);
          return;
        }
        const data = await response.json();
        const speciesData = data.species;
        console.log("Species data:", speciesData);
        const newSessionToken = data.session_token;
        console.log("New session token:", newSessionToken);
        if (newSessionToken) {
          SessionStorage.setItem("token", newSessionToken);
        }
        const speciesArray = Object.keys(speciesData).map((key) => ({
          id: key,
          name: key,
          ...speciesData[key],
        }));
        console.log("species Array:", speciesArray);
        setSpecies(speciesArray);
        SessionStorage.setItem("species", JSON.stringify(speciesArray));
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  //Set up for class features
  const [classFeatures, setClassFeatures] = useState<any>({});
  const [classData, setClassData] = useState<any>({});
  const [spellData, setSpellData] = useState<any>({});
  const [loadingSpells, setLoadingSpells] = useState(false);
  const fetchClassData = async () => {
    setLoadingSpells(true);
    if (!characterData.character.class_id) return;
    try {
      const response = await fetch(
        "https://fmesof4kvl.execute-api.us-east-2.amazonaws.com/level-up",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Session_Token: session_token,
          },
          body: JSON.stringify({
            user_uid: user_uid,
            class: characterData.character.class_id,
            level: characterData.character.level,
            subspecies: "",
          }),
        }
      );
      console.log(
        user_uid,
        characterData.character.level,
        characterData.character.class_id
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error fetching classData:", errorText);
        return;
      }
      //setting data and resetting session token
      const data = await response.json();
      console.log("Class Features Data", data);
      const newSessionToken = data.session_token;
      console.log("New session token:", newSessionToken);
      if (newSessionToken) {
        SessionStorage.setItem("token", newSessionToken);
        session_token = newSessionToken;
      }
      setClassFeatures(data.features || {});
      setClassData(data.info || {});
      if (data.spells) {
        setSpellData(data.spells || {});
      }
      console.log("My Spell Data", spellData);
    } catch (error) {
      console.error("Error fetching class features:", error);
    } finally {
      setLoadingSpells(false);
    }
  };

  useEffect(() => {
    if (characterData.character.class_id) {
      fetchClassData();
    }
  }, [characterData.character.class_id, characterData.character.level]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#121427" }}
      behavior="padding"
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.container}>
          <Text style={styles.pageHeader}>Create Character</Text>
          <TextInput
            placeholder="Name"
            style={styles.formControl}
            placeholderTextColor="#ccc"
            value={characterData.character.name}
            onChangeText={(text) => handleChange("name", text)}
          />
          <TextInput
            placeholder="Species"
            style={styles.formControl}
            placeholderTextColor="#ccc"
            value={characterData.character.species_id}
            onChangeText={(text) => handleChange("species_id", text)}
          />
          <Picker
            selectedValue={characterData.character.species_id}
            onValueChange={(itemValue) => {
              handleChange("species_id", itemValue);

              const selected = species.find((s) => s.id === itemValue);
              if (selected) {
                const baseTraitsKey = Object.keys(selected.features).find(
                  (key) => key.toLowerCase().includes(selected.id.toLowerCase())
                );

                if (baseTraitsKey) {
                  setTraitsKey(baseTraitsKey); // <--- SAVE it here

                  const subspeciesList =
                    selected.features[baseTraitsKey]?.subspecies || [];
                  setAvailableSubspecies(subspeciesList);
                } else {
                  setTraitsKey(null);
                  setAvailableSubspecies([]);
                }
              }
            }}
            itemStyle={{
              color: "#fff",
              fontSize: 24,
              fontFamily: "Sora",
            }}
          >
            {species.map((species) => (
              <Picker.Item
                label={species.name}
                value={species.id}
                key={species.id}
              />
            ))}
          </Picker>
          {availableSubspecies.length > 0 && (
            <Picker
              selectedValue={characterData.character.subspecies_id}
              onValueChange={(itemValue) =>
                handleChange("subspecies_id", itemValue)
              }
              itemStyle={{
                color: "#fff",
                fontSize: 24,
                fontFamily: "Sora",
              }}
            >
              {availableSubspecies.map((sub) => (
                <Picker.Item label={sub} value={sub} key={sub} />
              ))}
            </Picker>
          )}
          <TextInput
            placeholder="Class"
            style={styles.formControl}
            placeholderTextColor="#ccc"
            value={characterData.character.class_id}
            onChangeText={(text) => handleChange("class_id", text)}
          />
          <Picker
            selectedValue={characterData.character.class_id}
            onValueChange={(itemValue, itemIndex) =>
              handleChange("class_id", itemValue)
            }
            itemStyle={{
              color: "#fff",
              fontSize: 24,
              fontFamily: "Sora",
            }}
          >
            <Picker.Item label="Fighter" value="Fighter" key="Fighter" />
            <Picker.Item label="Wizard" value="Wizard" key="Wizard" />
          </Picker>
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
        <TouchableOpacity style={styles.button} onPress={submitCharacter}>
          <Text style={styles.buttonText}>Create Character</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  globalContainer: {
    ...globalText,
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#121427",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#121427",
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
    ...globalText,
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
    justifyContent: "space-between",
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
    width: "75%",
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
