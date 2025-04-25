import { useState, useEffect } from "react";
import {
  Circle,
  Square,
  Shield,
  PanelTopDashed,
  RectangleHorizontal,
  AlignJustify,
  Minus,
  Plus,
} from "lucide-react-native";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Modal,
  Switch,
  ScrollView,
} from "react-native";
// import CheckBox from "@react-native-community/checkbox";
import SessionStorage from "react-native-session-storage";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { useRouter } from "expo-router";

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

const abilityData = [
  {
    title: "Str",
    modifier: "+10",
    score: 10,
  },
  {
    title: "Dex",
    modifier: "+10",
    score: 10,
  },
  {
    title: "Con",
    modifier: "+10",
    score: 10,
  },
  {
    title: "Int",
    modifier: "+10",
    score: 10,
  },
  {
    title: "Wis",
    modifier: "+10",
    score: 10,
  },
  {
    title: "Cha",
    modifier: "+10",
    score: 10,
  },
];

const globalText = {
  color: "white",
  fontFamily: "Sora",
};

const calculateBonus = (score) => {
  const modifier = Math.floor((score - 10) / 2);
  return (modifier >= 0 ? "+" : "") + modifier.toString();
};

export default function HomeMobile() {
  const character = SessionStorage.getItem("selectedCharacterData");

  type AbilityScore = {
    title: string;
    modifier: string;
    score: number;
  };
  const [abilityScores, setAbilityScores] = useState<AbilityScore[]>([]);
  const [skillsData, setSkillsData] = useState(initialSkillsData);
  const [calculatedSkills, setCalculatedSkills] = useState(initialSkillsData);
  useEffect(() => {
    const rawData = character.ability_scores;
    const updated_ability_scores = [
      {
        title: "Str",
        modifier: calculateBonus(Number(rawData.str)),
        score: rawData.str,
      },
      {
        title: "Dex",
        modifier: calculateBonus(Number(rawData.dex)),
        score: rawData.dex,
      },
      {
        title: "Con",
        modifier: calculateBonus(Number(rawData.con)),
        score: rawData.con,
      },
      {
        title: "Int",
        modifier: calculateBonus(Number(rawData.int)),
        score: rawData.int,
      },
      {
        title: "Wis",
        modifier: calculateBonus(Number(rawData.wis)),
        score: rawData.wis,
      },
      {
        title: "Cha",
        modifier: calculateBonus(Number(rawData.cha)),
        score: rawData.cha,
      },
    ];
    setAbilityScores(updated_ability_scores);
  }, []);
  useEffect(() => {
    if (!abilityScores.length) return;
    const abilityModMap = {};
    abilityScores.forEach((ability) => {
      abilityModMap[ability.title] = parseInt(
        ability.modifier.replace("+", ""),
        10
      );
    });

    const updatedSkills = skillsData.map((skill) => {
      const baseMod = abilityModMap[skill.ability] || 0;
      const profBonus = skill.proficient ? character.proficiency_bonus : 0;
      const total = baseMod + profBonus;
      return {
        ...skill,
        bonus: (total >= 0 ? "+" : "") + total,
      };
    });
    setCalculatedSkills(updatedSkills);
  }, [skillsData, abilityScores, character.proficiency_bonus]);
  //Adjusting HP

  ///////////Need something that allows us to import their max hp and make that adjustable.//////////
  ///////////Possibly similar to the edit skills option that is just an edit character///////////////
  const [hp, setHp] = useState(0);
  const [customHp, setCustomHp] = useState("");
  const [editHp, setEditHp] = useState(false);
  const [charPfp, setCharPfp] = useState(SessionStorage.getItem("passImage"));

  const getCustomHp = () => {
    const num = parseInt(customHp);
    //isNaN (is not a number) if not a number return 1 otherwise return num
    return isNaN(num) ? 1 : num;
  };

  //Skill preferences like proficient and favorites

  const [filter, setFilter] = useState("all");
  const [menuVisible, setMenuVisible] = useState(false);
  const [editSkillsListVisible, setEditSkillsListVisible] = useState(false);
  const [editCharListVisible, setEditCharListVisible] = useState(false);

  const filteredSkills = calculatedSkills.filter((skill) => {
    if (filter === "favorites") return skill.favorite;
    if (filter === "proficient") return skill.proficient;
    return true;
  });

  const handleHp = (type) => {
    const amount = getCustomHp();
    setHp((prev) => (type === "add" ? prev + amount : prev - amount));
    setCustomHp("");
    setEditHp(false);
    Keyboard.dismiss(); // Hide the keyboard after clicking plus/minus
    setCharPfp(SessionStorage.getItem("passImage"));
  };

  /////////Level Up
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [level, setLevel] = useState(character.level);
  const [editedName, setEditedName] = useState(character.name);
  const [subclass, setSubclass] = useState("");
  const [tempScores, setTempScores] = useState<{ [key: string]: number }>({});
  const [abilityPointsUsed, setAbilityPointsUsed] = useState(0);
  // const [maxPoints, setMaxPoints] = useState(0);
  const [points, setPoints] = useState(0);
  const isAbilityScoreLevel = level % 4 === 0;
  const [ability_score, set_ability_score] = useState(character.ability_score);
  const maxPoints = 2;

  // const getTotalPoints = () => {
  //   if (isAbilityScoreLevel) {
  //     let points =
  //       character.abilityScores.str +
  //       character.abilityScores.dex +
  //       character.abilityScores.con +
  //       character.abilityScores.int +
  //       character.abilityScores.wis +
  //       character.abilityScores.cha;
  //     setPoints(points);
  //     setMaxPoints(points + 2);
  //     console.log(maxPoints);
  //   }
  // };

  const handleLevelUp = () => {
    const leveledUp = level + 1;
    setLevel(leveledUp);
    setShowLevelUp(true);
  };

  // const handleIncreaseScore = (title: number) => {
  //   if (points > maxPoints) {
  //     character.ability_scores.title += 1;
  //   }
  // };

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

  const handleResetScores = () => {
    // Reset the temp scores to the original scores from the backend
    const initialScores = abilityScores.reduce((acc, ability) => {
      acc[ability.title] = ability.score;
      return acc;
    }, {});

    setTempScores(initialScores);
    setAbilityPointsUsed(0); // Reset ability points used to 0
  };

  useEffect(() => {
    if (isAbilityScoreLevel) {
      // Pull updated ability scores from backend, or passed-in props
      const freshScores = abilityScores.reduce((acc, ability) => {
        acc[ability.title] = ability.score;
        return acc;
      }, {} as { [key: string]: number });

      setTempScores(freshScores);
      setAbilityPointsUsed(0); // Reset limit for this level
    }
  }, [level, abilityScores]);

  // const handleLevelUpChange = (key: string, value: string) => {
  //   if (["str", "dex", "con", "int", "wis", "cha"].includes(key)) {
  //     setTempScores((prev) => ({
  //       ...prev,
  //       [key]: Number(value),
  //     }));
  //   }
  // };

  const user_uid = SessionStorage.getItem("userUid");
  const character_uid = SessionStorage.getItem("characterUid");
  const session_token = SessionStorage.getItem("token");

  const submitLevelUp = async () => {
    const payload: any = {
      user_uid,
      character_uid,
      character: {
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
    if (level >= 3 && subclass) {
      character.subclass = subclass;
    }

    //Send the updated ability scores if changed
    if (isAbilityScoreLevel) {
      // character.ability_scores = {
      //   str: tempScores["str"],
      //   dex: tempScores["dex"],
      //   con: tempScores["con"],
      //   int: tempScores["int"],
      //   wis: tempScores["wis"],
      //   cha: tempScores["cha"],
      // };
      payload.character.ability_scores = { ...tempScores };
    }

    //Always send the level up
    character.level = level;

    try {
      const response = await fetch(
        "https://fmesof4kvl.execute-api.us-east-2.amazonaws.com/edit-character",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Session_Token: session_token,
            session_token: "cooper_is_slow",
          },
          body: JSON.stringify(character),
        }
      );

      console.log("Character:", character);
      console.log("Status:", response.status);
      // console.log("inventory", character.inventory);
      const responseText = await response.text(); // read as text first
      console.log("Raw Response:", responseText);

      if (!response.ok) throw new Error("Failed to submit level-up changes");

      const data = await response.json();
      console.log("Level up submitted", data);
      alert("Level up submitted successfully!");
      setShowLevelUp(false);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error submitting level-up changes.");
    }
  };
  // }

  const handleClose = async () => {
    await submitLevelUp();
    setEditCharListVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.pfpHolder}>
        <Image
          source={{ uri: charPfp }}
          style={styles.pfp}
          resizeMode="cover"
        />
        {/* Needs to have character sheets pfp used, placeholder for now */}
      </View>
      <View style={styles.staticContainer}>
        <TouchableOpacity
          onPress={() => {
            setEditCharListVisible(true);
          }}
        >
          <Text style={styles.header}>{character.name}</Text>
          <Text style={styles.header}>{character.species_id}</Text>
          <Text style={styles.header} numberOfLines={1} adjustsFontSizeToFit>
            {character.class_id} ({character.subclass_id})
          </Text>
        </TouchableOpacity>

        <Modal
          transparent={true}
          animationType="slide"
          visible={editCharListVisible}
          onRequestClose={() => setEditCharListVisible(false)}
        >
          <View style={styles.modalView}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
              <View style={styles.container}>
                <Text style={styles.modalText}>Edit Character</Text>
                <TextInput
                  placeholder={`Name: ${character.name}`}
                  style={styles.formControl}
                  placeholderTextColor="#ccc"
                  // value={editedName}
                  onChangeText={setEditedName}
                />
                <TextInput
                  value={`Level: ${level}`}
                  style={styles.formControl}
                  placeholderTextColor="#ccc"
                  // editable={false}
                  // value={character.name}
                  //  onChangeText={(text) => handleChange("name", text)}
                />

                <TouchableOpacity
                  style={styles.levelUpButton}
                  onPress={handleLevelUp}
                >
                  <Text style={styles.levelUpButtonText}>Level Up!</Text>
                </TouchableOpacity>

                {showLevelUp && (
                  <View>
                    {/* <View style={styles.container}> */}
                    {level >= 3 && (
                      <TextInput
                        style={styles.formControl}
                        placeholder="Enter Subclass"
                        value={subclass}
                        onChangeText={setSubclass}
                      ></TextInput>
                    )}
                  </View>
                  // </View>
                )}

                {isAbilityScoreLevel && (
                  <View>
                    <Text style={styles.abilityHeader}>
                      Ability Score Improvement
                    </Text>
                    <View style={styles.abilityRow}>
                      {abilityScores.map((ability) => (
                        <View key={ability.title} style={styles.abilityBox}>
                          <Text style={styles.abilityLabel}>
                            {ability.title}
                          </Text>
                          <TouchableOpacity
                            style={styles.abilityLabel}
                            onPress={() => handleIncreaseScore(ability.title)}
                          >
                            <View>
                              <Text style={styles.abilityScoreControl}>
                                {tempScores[ability.title] ?? ability.score}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                    {abilityPointsUsed >= maxPoints && (
                      <Text style={styles.warningText}>
                        You've used all 2 ability score increases.
                      </Text>
                    )}
                    <TouchableOpacity onPress={handleResetScores}>
                      <Text style={styles.resetButton}>Reset Scores</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>

      <View style={styles.iconContainer}>
        <View style={styles.iconWrapper}>
          <Circle size={70} strokeWidth={1} color={"white"} fill="#3E4A59" />
          <Text style={styles.iconText}>{character.proficiency_bonus}</Text>
        </View>

        <View style={styles.iconWrapper}>
          <Square size={70} color="white" strokeWidth={1} fill="#3E4A59" />
          <Text style={styles.iconText}>{character.speed}</Text>
        </View>

        <View style={styles.iconWrapper}>
          {/*Need to check in with inventory if equipped with a shield*/}
          <Shield size={70} color="white" strokeWidth={1} fill="#3E4A59" />
          <Text style={styles.iconText}>{character.armor_class}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleHp("add")}
          style={styles.iconWrapper}
        >
          <Plus size={35} color="green" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setEditHp(true)}
          style={styles.iconWrapper}
        >
          {editHp ? (
            <TextInput
              style={styles.hp}
              value={customHp}
              onChangeText={setCustomHp}
              keyboardType="numeric"
              autoFocus
              returnKeyType="done"
              onBlur={() => setEditHp(false)}
            />
          ) : (
            <Text style={styles.hp}>{character.hp}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleHp("subtract")}
          style={styles.iconWrapper}
        >
          <Minus size={35} color="red" />
        </TouchableOpacity>
      </View>

      <View style={styles.iconContainer}>
        {abilityScores.map((item, index) => (
          <View style={styles.iconWrapper}>
            <PanelTopDashed
              style={styles.abilityIcons}
              size={100}
              color="white"
              fill="#3E4A59"
              strokeWidth={0.5}
            />
            <RectangleHorizontal
              size={75}
              style={styles.rectangleIcons}
              color="white"
              fill="#3E4A59"
              strokeWidth={0.5}
            />

            <Text style={styles.abilityTitle}>{item.title}</Text>
            <Text style={styles.abilityScore}>{item.modifier}</Text>
            <Text style={styles.modifierScore}>{item.score}</Text>
          </View>
        ))}
      </View>

      <Text></Text>

      {/*Tells the user what filter they are seeing*/}
      {/*if filter is on all (? is true and : is false) if true show all if false another*/}
      {/*filter for favorites is true show favorites otherwise whats left is Proficient */}
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}>
          {filter === "all"
            ? "Viewing All Skills"
            : filter === "favorites"
            ? "Viewing Favorite Skills"
            : "Viewing Proficient Skills"}
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => setMenuVisible(true)}
        >
          <AlignJustify style={styles.selectionIcon} color="white" size={45} />
        </TouchableOpacity>

        <Text style={styles.sectionHeaderText}>Skill</Text>
        <Text style={styles.sectionHeaderText}>Ability</Text>
        <Text style={styles.sectionHeaderText}>Bonus</Text>
      </View>

      {/*if they are proficent in it then the circle is added to the bonus*/}
      <FlatList
        data={filteredSkills}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.sectionHeader}>
            <View style={styles.sectionContainer}>
              <Text style={styles.skillsText}>{item.skill}</Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.abilityText}>{item.ability}</Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.bonusText}>{item.bonus}</Text>
            </View>
          </View>
        )}
      />

      {/*This is the modal for showing all, favorites, proficient*/}
      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.menuModalContainer}>
          <View style={styles.menuModalContent}>
            {/*All option*/}
            <TouchableOpacity
              onPress={() => {
                setFilter("all");
                setMenuVisible(false);
              }}
            >
              <Text style={styles.menuItem}>View All</Text>
            </TouchableOpacity>

            {/*Favorites option*/}
            <TouchableOpacity
              onPress={() => {
                setFilter("favorites");
                setMenuVisible(false);
              }}
            >
              <Text style={styles.menuItem}>Favorites</Text>
            </TouchableOpacity>

            {/*Proficient option*/}
            <TouchableOpacity
              onPress={() => {
                setFilter("proficient");
                setMenuVisible(false);
              }}
            >
              <Text style={styles.menuItem}>Proficient</Text>
            </TouchableOpacity>

            {/*Edit Skills option*/}
            <TouchableOpacity
              onPress={() => {
                setEditSkillsListVisible(true);
                setMenuVisible(false);
              }}
            >
              <Text style={styles.menuItem}>Edit Skills</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* This is the modal for when they choose edit skills */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={editSkillsListVisible}
        onRequestClose={() => setEditSkillsListVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Edit Skills</Text>

          <View style={styles.editHeaderRow}>
            <Text style={styles.editHeader}>Skill</Text>
            <Text style={styles.editHeader}>Favorite</Text>
            <Text style={styles.editHeader}>Proficient</Text>
          </View>

          <FlatList
            data={skillsData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.editRow}>
                <Text style={styles.skillName}>{item.skill}</Text>
                <View style={styles.switchContainer}>
                  <View style={styles.favoriteSwitch}>
                    <Switch
                      value={item.favorite}
                      onValueChange={(val) => {
                        const updated = [...skillsData];
                        updated[index].favorite = val;
                        setSkillsData(updated);
                      }}
                      trackColor={{ true: "#A8FFFC" }}
                      thumbColor="#121427"
                    />
                  </View>
                </View>
                <View style={styles.switchContainer}>
                  <View style={styles.proficientSwitch}>
                    <Switch
                      value={item.proficient}
                      onValueChange={(val) => {
                        const updated = [...skillsData];
                        updated[index].proficient = val;
                        setSkillsData(updated);
                      }}
                      trackColor={{ true: "#A8FFFC" }}
                      thumbColor="#121427"
                    />
                  </View>
                </View>
              </View>
            )}
          />

          <TouchableOpacity onPress={() => setEditSkillsListVisible(false)}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#121427",
  },
  staticContainer: {
    alignSelf: "flex-end",
    width: "60%",
    height: "15%",
  },
  header: {
    ...globalText,
    fontSize: 20,
    padding: 5,
    textAlign: "center",
  },

  //Icon Styles
  iconContainer: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    flexDirection: "row",
  },
  iconText: {
    ...globalText,
    fontSize: 20,
    fontWeight: "bold",
    position: "absolute",
  },
  hp: {
    ...globalText,
    fontSize: 30,
    fontWeight: "bold",
    padding: 6.5,
    backgroundColor: "#3E4A59",
    borderRadius: 10,
    borderWidth: 2.5,
    borderColor: "white",
  },

  //Section styles
  sectionHeader: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    overflow: "hidden",
  },
  sectionHeaderText: {
    ...globalText,
    fontSize: 25,
    textAlign: "left",
    marginRight: 39,
  },
  sectionContainer: {
    width: "33.33%",
    justifyContent: "space-evenly",
  },

  //Ability section styles
  abilityIcons: {
    position: "relative",
    justifyContent: "center",
    paddingHorizontal: 60,
  },
  abilityScore: {
    ...globalText,
    fontSize: 25,
    position: "absolute",
    alignSelf: "baseline",
    margin: 47,
  },
  modifierScore: {
    ...globalText,
    fontSize: 19,
    color: "white",
    position: "absolute",
    alignSelf: "baseline",
    margin: 85,
    right: -32,
  },
  abilityTitle: {
    ...globalText,
    fontSize: 20,
    position: "absolute",
    alignSelf: "flex-start",
    paddingTop: "16%",
  },
  rectangleIcons: {
    position: "absolute",
    top: "28%",
  },

  //Skills section styles
  //Skills container using section header
  subHeader: {
    paddingVertical: 3,
    alignItems: "center",
    marginBottom: -7,
  },
  subHeaderText: {
    ...globalText,
    color: "#A8FFFC",
    fontSize: 15,
    fontStyle: "italic",
  },
  selectionIcon: {
    alignItems: "center",
    marginLeft: 5,
  },
  skillsText: {
    ...globalText,
    fontSize: 15.25,
    marginLeft: 20,
    textAlign: "center",
    marginBottom: 2,
  },
  abilityText: {
    ...globalText,
    fontSize: 15.75,
    textAlign: "center",
    marginBottom: 5,
  },
  bonusText: {
    ...globalText,
    fontSize: 15.75,
    alignSelf: "center",
    marginRight: 30,
  },

  //Character pfp styles
  pfpHolder: {
    height: 92,
    width: 110,
    margin: 5,
    position: "absolute",
    alignSelf: "flex-start",
    paddingLeft: 30,
  },
  pfp: {
    height: 92,
    width: 110,
    borderRadius: 10,
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 5,
  },

  //Skills Selection Menu (modal)
  menuModalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  menuModalContent: {
    margin: 100,
    backgroundColor: "#6B728C",
    borderRadius: 8,
    padding: 10,
  },
  menuItem: {
    ...globalText,
    fontSize: 18,
    paddingVertical: 9,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
    textAlign: "center",
  },

  //Edit Skills option
  modalView: {
    flex: 1,
    backgroundColor: "#121427",
    padding: 15,
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalText: {
    ...globalText,
    fontSize: 25,
    marginBottom: 10,
    textAlign: "center",
  },
  editHeaderRow: {
    flexDirection: "row",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 5,
  },
  editHeader: {
    ...globalText,
    color: "#A8FFFC",
    flex: 1,
    fontSize: 17,
    textAlign: "center",
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    marginHorizontal: 20,
  },
  skillName: {
    ...globalText,
    flex: 1,
    fontSize: 14,
    textAlign: "center",
    marginLeft: -15,
  },
  switchContainer: {
    flex: 1,
    flexDirection: "row",
  },
  favoriteSwitch: {
    marginLeft: 38,
  },
  proficientSwitch: {
    marginLeft: 50,
  },
  closeButton: {
    ...globalText,
    color: "#A8FFFC",
    marginTop: 10,
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  hoverStyle: {
    backgroundColor: "#4B5563",
    borderColor: "#4B5563",
  },

  buttonText: {
    color: "white",
    alignSelf: "center",
    fontSize: 22,
  },

  //Edit Character/Level up styles
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
  abilityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
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
  levelUpButton: {
    backgroundColor: "#6B728C",
    borderColor: "#6B728C",
    alignSelf: "center",
    borderWidth: 2,
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 15,
    width: "80%",
    padding: 5,
  },
  levelUpButtonText: {
    ...globalText,
    color: "#A8FFFC",
    alignSelf: "center",
    fontSize: 27,
  },
  warningText: {
    color: "#A8FFFC",
    fontWeight: "bold",
    marginTop: 10,
    alignSelf: "center",
  },
  resetButton: {
    ...globalText,
    color: "red",
    marginTop: 10,
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
  },
  editCharSubtitle: {
    ...globalText,
    fontSize: 20,
  },
  editCharTextInput: {
    ...globalText,
    fontSize: 20,
    textAlign: "center",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "white",
    borderRadius: 10,
    padding: 3,
    maxWidth: 200,
    alignContent: "flex-end",
    alignSelf: "flex-end",
    width: "100%",
  },
  abilityHeader: {
    ...globalText,
    color: "#A8FFFC",
    alignSelf: "center",
    fontSize: 20,
    marginBottom: 5,
  },
});
