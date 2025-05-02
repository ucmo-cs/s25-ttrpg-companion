import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import React, { useEffect, useState } from "react";
import SessionStorage from "react-native-session-storage";
import { Circle } from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";
import GlobalStyles from "../globalstyles";
import * as ImagePicker from "expo-image-picker";

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
      proficiency_bonus: 2,
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
  const [image, setImage] = useState(
    new Blob([""], { type: "application/octet-stream" })
  );
  const [imageType, setImageType] = useState("");

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

  //Starting equipment
  const parseStartingEquipment = (equipmentString: string, allItems: any[]) => {
    const itemNames = equipmentString
      .replace(/;/g, "") // remove semicolons
      .split(",")
      .map((name) => name.trim());

    const matchedItems = itemNames
      .map((name) =>
        allItems.find((item) =>
          name.toLowerCase().includes(item.name.toLowerCase())
        )
      )
      .filter(Boolean);
    return matchedItems;
  };
  //Set session token and user uid from session storage
  const user_uid = SessionStorage.getItem("userUid");
  // console.log("Session token:", session_token);
  const [traitsKey, setTraitsKey] = useState<string | null>(null);
  //Character submission function
  //This function is called when the user presses the "Create Character" button
  const submitCharacter = async () => {
    try {
      const payload = buildPayload();
      console.log("🧾 PAYLOAD", JSON.stringify(payload, null, 2));
      //Filter inventory based on selected options
      const filteredInventory = items.filter((item) =>
        SelectedOptions.includes(item.name)
      );

      //Check selected species and set speed, creature type, size, and features
      const selectedSpecies = species.find(
        (species) => species.id === characterData.character.species_id
      );

      // const selectedSubspecies =
      //   selectedSpecies.features?.[
      //     characterData.character.subspecies_id
      //       ?.toLowerCase()
      //       .replace(/\s/g, "_") + "_traits"
      //   ];

      const response = await fetch(
        "https://fmesof4kvl.execute-api.us-east-2.amazonaws.com/create-character",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Session_Token: SessionStorage.getItem("token"),
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      console.log("📬 Server Response:", data);
      let currentCharacters = SessionStorage.getItem("characters");
      if (typeof currentCharacters === "string") {
        try {
          currentCharacters = JSON.parse(currentCharacters);
        } catch {
          currentCharacters = [];
          console.log(
            "Error parsing characters from session storage:",
            currentCharacters
          );
        }
      } else if (!Array.isArray(currentCharacters)) {
        currentCharacters = [];
        console.log(
          "Error parsing characters from session storage:",
          currentCharacters
        );
      }
      const newCharacter = {
        character_name: characterData.character.name,
        character_uid: data.character_uid,
      };
      const newCharacterList = [...(currentCharacters || []), newCharacter];
      console.log("New Character List:", newCharacterList);
      SessionStorage.setItem("characters", JSON.stringify(newCharacterList));
      uploadImage(data.character_uid);
      SessionStorage.setItem("token", data.session_token);
      console.log("Character List", SessionStorage.getItem("characters"));
      alert("Character created successfully!");
      console.log("Character Data:", characterData.character);
      SessionStorage.setItem(
        "selectedCharacterData",
        JSON.stringify(characterData.character)
      );
      router.replace("/mobile/(tabs)/HomeMobile");
      setCharacterData(initialCharacterData); // Reset the form after submission
    } catch (error) {
      console.error(error);
      // console.log("Data:", payload);
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

  //Set up for class features
  const [classFeatures, setClassFeatures] = useState<any>({});
  const [classData, setClassData] = useState<any>({});
  const [spellData, setSpellData] = useState<any>({});
  const [loadingSpells, setLoadingSpells] = useState(false);
  const fetchClassData = async () => {
    let ctype;
    if (Platform.OS === "ios" || Platform.OS === "android") {
      ctype = { "Content-Type": "application/json" };
      console.log("Ctype: ", ctype);
    } else {
      ctype = null;
      console.log("Ctype: ", ctype);
    }
    try {
      const response = await fetch(
        "https://fmesof4kvl.execute-api.us-east-2.amazonaws.com/get-classes",
        {
          method: "POST",
          headers: {
            ...(ctype || {}),
            Session_Token: SessionStorage.getItem("token"),
          },
          body: JSON.stringify({
            user_uid: user_uid,
          }),
        }
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
      }
      setClassData(data.classes || {});
      if (data.spells) {
        setSpellData(data.spells || {});
      }
      console.log("My Spell Data 1", data.spells);
      console.log("Fighter Class Data", data.classes.fighter);
      console.log("Wizard Class Data", data.classes.wizard);
      console.log("Class Data", classData);
    } catch (error) {
      console.error("Error fetching class features:", error);
    }
    fetchSpeciesData();
  };

  const fetchSpeciesData = async () => {
    try {
      const response = await fetch(
        "https://fmesof4kvl.execute-api.us-east-2.amazonaws.com/get-species",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Session_Token: SessionStorage.getItem("token"),
          },
          body: JSON.stringify({
            user_uid: user_uid,
          }),
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

  useEffect(() => {
    fetchClassData();
  }, []);

  //Handle class selection and set class features
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClassFeatures, setSelectedClassFeatures] = useState<any[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(
    null
  );

  const handleCloseModal = () => {
    const selectedEquipmentItems = extractEquipmentOptions(
      selectedClassFeatures["Starting Equipment"] || ""
    )?.find((opt) => opt.label === selectedEquipment)?.items;

    setCharacterData((prev) => {
      const updatedCharacter = {
        ...prev,
        character: {
          ...prev.character,
          starting_equipment: {
            option: selectedEquipment,
            items: selectedEquipmentItems,
          },
          skill_proficiencies: selectedSkills,
        },
      };

      console.log("Updated Character Data:", updatedCharacter);
      return updatedCharacter;
    });

    setModalVisible(false);
  };

  const extractEquipmentOptions = (
    text: string
  ): { label: string; items: string }[] => {
    const options: { label: string; items: string }[] = [];
    const regex = /\(([A-Z])\)\s*(.*?)(?=\s*(?:or\s*)?\([A-Z]\)|$)/g;

    let match;

    while ((match = regex.exec(text)) !== null) {
      options.push({
        label: match[1],
        items: match[2].replace(/^[:;]?\s*/, "").trim(), // trim leading colon or semicolon
      });
    }

    return options;
  };

  const selectedEquipmentItems = extractEquipmentOptions(
    selectedClassFeatures["Starting Equipment"]
  )?.find((opt) => opt.label === selectedEquipment)?.items;

  const extractSkills = (text) => {
    const match = text.match(/Choose \d+: (.*)/);
    return match ? match[1].split(",").map((s) => s.trim()) : [];
  };
  const [selectedSpells, setSelectedSpells] = useState<string[]>([]);
  const buildPayload = () => {
    const filteredInventory = items.filter((item) =>
      SelectedOptions.includes(item.name)
    );

    const currentClassId = characterData.character.class_id?.toLowerCase();
    const currentClassFeatures = classData?.[currentClassId]?.features || {};
    const isSpellcaster = currentClassFeatures.hasOwnProperty("Spellcasting");

    const selectedEquipmentItems = extractEquipmentOptions(
      currentClassFeatures["Starting Equipment"] || ""
    )?.find((opt) => opt.label === selectedEquipment)?.items;

    const selectedSpecies = species.find(
      (s) => s.id === characterData.character.species_id
    );

    const selectedSubspecies =
      selectedSpecies?.features?.[
        characterData.character.subspecies_id
          ?.toLowerCase()
          .replace(/\s/g, "_") + "_traits"
      ];

    return {
      user_uid: user_uid,
      character: {
        ...characterData.character,
        level: characterData.character.level,
        proficiency_bonus: parseInt(
          classData?.[currentClassId]?.features?.["Proficiency Bonus"]?.replace(
            /\D/g,
            ""
          ) || "2"
        ),

        skill_proficiencies: selectedSkills,
        inventory: filteredInventory,
        starting_equipment: {
          option: selectedEquipment,
          items: selectedEquipmentItems,
        },
        features: {
          classfeatures: [currentClassFeatures],
          subclassfeatures: [],
          speciesfeatures: [],
          // speciesfeatures: traitsKey ? selectedSpecies?.features[traitsKey] : [],
          // ...(selectedSubspecies ? { subspeciesfeatures: selectedSubspecies } : {}),
        },
        ...(isSpellcaster && {
          cantrips_known: currentClassFeatures["Cantrips Known"] || 0,
          spells: spellData || [],
          spell_slots: classData?.[currentClassId]?.spell_slots || [],
        }),
      },
    };
  };

  const handleClassSelection = (className) => {
    handleChange("class_id", className);

    const classFeatures = classData[className.toLowerCase()]?.features || {};
    console.log("Class Features", classFeatures);
    setSelectedClassFeatures(classFeatures);
    setModalVisible(true);
  };

      const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [3, 3],
          quality: 1,
          base64: true,
        });
    
        // console.log(result);
        if (!result.canceled) {
          const uri = result.assets[0].uri
          setImageType(result.assets[0].type + "/" + uri.split('.').pop());
          const response = await fetch(uri); // Fetch the file data
          const imageBlob = await response.blob(); // Convert the file to a binary blob
          console.log(imageType);
          setImage(imageBlob);
        }
      };
    
    
      const uploadImage = async (character_uid) => {
        //   file = await compressImage(file, 100)
    
          if(!image){
              console.log("No File Selected")
              return
          }
    
          fetch("https://fmesof4kvl.execute-api.us-east-2.amazonaws.com/save-image", {
              method: "POST",
              headers: {
                  "user_uid" : user_uid,
                  "character_uid" : character_uid,
                  "session_token" : "cooper_is_slow",
                  // "content-type" : imageType
              },
              body: image
          })
          .then(response => response.json())
          .then(data => console.log(data))
      }

  return (
    <View style={GlobalStyles.page}>
      <ScrollView style={styles.webWrapper}>
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
                      (key) =>
                        key.toLowerCase().includes(selected.id.toLowerCase())
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
              {/* <TextInput
                placeholder="Class"
                style={styles.formControl}
                placeholderTextColor="#ccc"
                value={characterData.character.class_id}
                onChangeText={(text) => handleChange("class_id", text)}
              /> */}
              <Picker
                selectedValue={characterData.character.class_id}
                onValueChange={(itemValue, itemIndex) =>
                  handleClassSelection(itemValue)
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

              {/* Modal for class features */}

              <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={handleCloseModal}
              >
                <ScrollView>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "rgba(0,0,0,0.6)",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#3E4A59",
                        padding: 20,
                        marginTop: 50,
                        borderRadius: 10,
                        width: "90%",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "sora",
                          fontSize: 24,
                          fontWeight: "bold",
                          color: "#FFFFFF",
                          marginBottom: 20,
                        }}
                      >
                        Class Features-{characterData.character.class_id}
                      </Text>

                      {Object.entries(selectedClassFeatures).map(
                        ([featureName, description], idx) => (
                          <View key={idx} style={{ marginBottom: 20 }}>
                            <Text style={styles.featureTitle}>
                              {featureName}
                            </Text>
                            {featureName === "Starting Equipment" ? (
                              // STARTING EQUIPMENT custom block
                              <>
                                <Text style={styles.featureDescription}>
                                  {description}
                                </Text>
                                {extractEquipmentOptions(description).map(
                                  (option) => (
                                    <TouchableOpacity
                                      key={option.label}
                                      onPress={() =>
                                        setSelectedEquipment(option.label)
                                      }
                                      style={{
                                        backgroundColor:
                                          selectedEquipment === option.label
                                            ? "#6B728C"
                                            : "#3E4A59",
                                        padding: 10,
                                        borderRadius: 5,
                                        marginVertical: 5,
                                      }}
                                    >
                                      <Text style={styles.featureDescription}>
                                        Option {option.label}: {option.items}
                                      </Text>
                                    </TouchableOpacity>
                                  )
                                )}
                                <Text
                                  style={{
                                    marginTop: 10,
                                    fontFamily: "Sora",
                                    color: "#FFFFFF",
                                  }}
                                >
                                  Selected:{" "}
                                  {selectedEquipment
                                    ? extractEquipmentOptions(description).find(
                                        (opt) => opt.label === selectedEquipment
                                      )?.items
                                    : "None"}
                                </Text>
                              </>
                            ) : featureName === "Skill Proficiencies" ? (
                              // SKILL PROFICIENCIES custom block
                              <>
                                <Text style={styles.featureDescription}>
                                  {description}
                                </Text>
                                {extractSkills(description).map((skill) => (
                                  <TouchableOpacity
                                    key={skill}
                                    onPress={() => {
                                      setSelectedSkills((prev) => {
                                        if (prev.includes(skill)) {
                                          return prev.filter(
                                            (s) => s !== skill
                                          );
                                        } else if (prev.length < 2) {
                                          return [...prev, skill];
                                        }
                                        return prev;
                                      });
                                    }}
                                    style={{
                                      backgroundColor: selectedSkills.includes(
                                        skill
                                      )
                                        ? "#6B728C"
                                        : "#3E4A59",
                                      padding: 10,
                                      borderRadius: 5,
                                      marginVertical: 5,
                                    }}
                                  >
                                    <Text style={styles.featureDescription}>
                                      {skill}
                                    </Text>
                                  </TouchableOpacity>
                                ))}
                                <Text
                                  style={{
                                    marginTop: 10,
                                    fontFamily: "sora",
                                    color: "#FFFFFF",
                                  }}
                                >
                                  Selected:{" "}
                                  {selectedSkills.length > 0
                                    ? selectedSkills.join(", ")
                                    : "None"}
                                </Text>
                              </>
                            ) : (
                              // DEFAULT fallback for all other featureNames
                              <Text style={styles.featureDescription}>
                                {description}
                              </Text>
                            )}
                          </View>
                        )
                      )}

                      <TouchableOpacity
                        onPress={handleCloseModal}
                        style={{ marginTop: 20 }}
                      >
                        <Text
                          style={{
                            color: "#FFFFFF",

                            borderWidth: 1,
                            borderRadius: 10,
                            fontFamily: "sora",
                            fontSize: 20,
                            backgroundColor: "#6B728C",

                            borderColor: "#fff",
                            textAlign: "center",
                          }}
                        >
                          Close
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </Modal>

              {/* <TouchableOpacity
                onPress={() => {
                  console.log("Button Press");
                }}
              >
                <Text style={styles.formControl}>Wizard</Text>
                <Text style={styles.formControl}>Fighter</Text>
              </TouchableOpacity> */}
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
                <TouchableOpacity
                  onPress={() => handleOptionPress("Shortsword")}
                >
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
                    color={
                      SelectedOptions.includes("Leather Armor") ? "#ccc" : ""
                    }
                    style={{ marginBottom: 5 }}
                    strokeWidth={1}
                    fill={
                      SelectedOptions.includes("Leather Armor") ? "#ccc" : ""
                    }
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
            <TouchableOpacity
              style={styles.button}
              onPress={() => submitCharacter()}
            >
              <Text style={styles.buttonText}>Create Character</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => pickImage()}>
              <Text style={styles.buttonText}>Upload Profile Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: "#4A5568", marginTop: 10 },
              ]}
              onPress={() => {
                console.log("Character Data:", characterData);
                console.log("Selected Options:", SelectedOptions);
                console.log("Class Features:", classFeatures);
                console.log("Class Data:", classData);
                console.log("Spell Data:", spellData);
                alert("Check console for payload data.");
              }}
            >
              <Text style={styles.buttonText}>Log Payload (Debug)</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  webWrapper: {
    ...Platform.select({
      ios: {},
      android: {},
      default: {
        width: "60%",
        alignSelf: "center",
      },
    }),
  },
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
  // featureWrapper: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   marginBottom: 10,
  // },
  featureTitle: {
    ...globalText,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FFFFFF",
  },
  featureDescription: {
    ...globalText,
    fontSize: 16,
    marginBottom: 10,
    color: "#A8FFFC",
  },
});
