import { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  Circle,
  Square,
  Shield,
  PanelTopDashed,
  RectangleHorizontal,
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
} from "react-native";

const skillsData = [
  { skill: "Acrobatics", ability: "Dex", bonus: "+0" },
  { skill: "Arcana", ability: "Int", bonus: "+0" },
  { skill: "Athletics", ability: "Str", bonus: "+0" },
  { skill: "Deception", ability: "Cha", bonus: "+0" },
  { skill: "History", ability: "Int", bonus: "+0" },
  { skill: "Insight", ability: "Wis", bonus: "+0" },
  { skill: "Intimidation", ability: "Cha", bonus: "+0" },
  { skill: "Investigation", ability: "Int", bonus: "+0" },
  { skill: "Medicine", ability: "Wis", bonus: "+0" },
  { skill: "Nature", ability: "Int", bonus: "+0" },
  { skill: "Perception", ability: "Wis", bonus: "+0" },
  { skill: "Religion", ability: "Int", bonus: "+0" },
  { skill: "Stealth", ability: "Dex", bonus: "+0" },
  { skill: "Sleight of Hand", ability: "Dex", bonus: "+0" },
  { skill: "Animal Handling", ability: "Wis", bonus: "+0" },
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

export default function HomeMobile() {
  //Adjusting HP
  const [hp, setHp] = useState(0);
  const [customHp, setCustomHp] = useState("");
  const [editHp, setEditHp] = useState(false);

  const getCustomHp = () => {
    const num = parseInt(customHp);
    //isNaN (is not a number) if not a number return 1 otherwise return num
    return isNaN(num) ? 1 : num;
  };

  //If the plus/minus is touched it will increase/decrease 1
  //If the Hp textArea is touched the user will enter a number then click plus/minus
  //That will add/subtract the number entered from the current Hp
  const handleHp = (type) => {
    const amount = getCustomHp();
    setHp((prev) => (type === "add" ? prev + amount : prev - amount));
    setCustomHp("");
    setEditHp(false);
    Keyboard.dismiss(); // Hide the keyboard after clicking plus/minus
  };

  return (
    <View style={styles.container}>
      <View style={styles.pfpHolder}>
        <Image
          source={require("../../../assets/images/placeholderDND.png")}
          style={styles.pfp}
          resizeMode="cover"
        />
        {/* Needs to have character sheets pfp used, placeholder for now */}
      </View>
      <View style={styles.staticContainer}>
        <Text style={styles.header}>Character Name</Text>
        <Text style={styles.header}>Species</Text>
        <Text style={styles.header}>Class (SubClass)</Text>
      </View>

      <View style={styles.iconContainer}>
        <View style={styles.iconWrapper}>
          <Circle size={70} strokeWidth={1} color={"white"} fill="#3E4A59" />
          <Text style={styles.iconText}>10</Text>
        </View>

        <View style={styles.iconWrapper}>
          <Square size={70} color="white" strokeWidth={1} fill="#3E4A59" />
          <Text style={styles.iconText}>20</Text>
        </View>

        <View style={styles.iconWrapper}>
          {/*Need to check in with inventory if equipped with a shield*/}
          <Shield size={70} color="white" strokeWidth={1} fill="#3E4A59" />
          <Text style={styles.iconText}>30</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleHp("add")}
          style={styles.iconWrapper}
        >
          <AntDesign name="plus" size={35} color="green" />
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
            <Text style={styles.hp}>{hp}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleHp("subtract")}
          style={styles.iconWrapper}
        >
          <AntDesign name="minus" size={35} color="red" />
        </TouchableOpacity>
      </View>

      {/* </View> */}

      {/* </View> */}
      <View style={styles.iconContainer}>
        {abilityData.map((item, index) => (
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

            <Text style={styles.abilityText}>{item.title}</Text>
            <Text style={styles.abilityScore}>{item.modifier}</Text>
            <Text style={styles.modifierScore}>{item.score}</Text>
          </View>
        ))}
      </View>

      <Text></Text>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>Skill</Text>
        <Text style={styles.sectionHeaderText}>Ability</Text>
        <Text style={styles.sectionHeaderText}>Bonus</Text>
      </View>

      {/*if they are proficent in it then the circle is added to the bonus*/}
      <FlatList
        data={skillsData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.sectionHeader}>
            <View style={styles.sectionContainer}>
              <Text style={styles.skillsText}>{item.skill}</Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.skillsText}>{item.ability}</Text>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.skillsText}>{item.bonus}</Text>
            </View>
          </View>
        )}
      />
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
  },
  sectionHeaderText: {
    ...globalText,
    fontSize: 25,
    flex: 1,
    textAlign: "center",
    paddingVertical: 2.5,
  },
  sectionContainer: {
    alignItems: "center",
    width: "33%",
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
  abilityText: {
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
  skillsText: {
    ...globalText,
    fontSize: 15.75,
    paddingVertical: 2,
    marginLeft: 3.5,
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
    // alignSelf: "center",
    borderRadius: 10,
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 5,
  },

  row: {
    flexDirection: "row",
    // flexWrap: "wrap",
  },
});
