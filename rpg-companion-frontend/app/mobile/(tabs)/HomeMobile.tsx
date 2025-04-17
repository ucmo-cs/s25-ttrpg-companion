import { useState } from "react";
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
} from "react-native";
// import CheckBox from "@react-native-community/checkbox";

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

export default function HomeMobile() {
  //Adjusting HP

  ///////////Need something that allows us to import their max hp and make that adjustable.//////////
  ///////////Possibly similar to the edit skills option that is just an edit character///////////////
  const [hp, setHp] = useState(0);
  const [customHp, setCustomHp] = useState("");
  const [editHp, setEditHp] = useState(false);

  const getCustomHp = () => {
    const num = parseInt(customHp);
    //isNaN (is not a number) if not a number return 1 otherwise return num
    return isNaN(num) ? 1 : num;
  };

  //Skill preferences like proficient and favorites
  // const [skillPref, setSkillPref] = useState(skillsData);
  const [skillsData, setSkillsData] = useState(initialSkillsData);

  const [filter, setFilter] = useState("all");
  const [menuVisible, setMenuVisible] = useState(false);
  // const [modalVisible, setModalVisible] = useState(false);
  // const [selectedSkillIndex, setSelectedSkillIndex] = useState(null);
  // const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [editListVisible, setEditListVisible] = useState(false);

  const filteredSkills = skillsData.filter((skill) => {
    if (filter === "favorites") return skill.favorite;
    if (filter === "proficient") return skill.proficient;
    return true;
  });

  // const openEditModal = (index) => {
  //   setSelectedSkillIndex(index);
  //   setModalVisible(true);
  // };

  // const updateSkill = (type, value) => {
  //   const updatedSkills = [...skillPref];
  //   updatedSkills[selectedSkillIndex][type] = value;
  //   setSkillPref(updatedSkills);
  // };

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
            <Text style={styles.hp}>{hp}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleHp("subtract")}
          style={styles.iconWrapper}
        >
          <Minus size={35} color="red" />
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
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
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
                setEditListVisible(true);
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
        visible={editListVisible}
        onRequestClose={() => setEditListVisible(false)}
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

          <TouchableOpacity onPress={() => setEditListVisible(false)}>
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
    // flexDirection: "row",
    // justifyContent: "center",

    flexDirection: "row",
    width: "100%",
    // paddingHorizontal: -50,
    // paddingVertical: 5,
    alignItems: "center",
    overflow: "hidden",
  },
  sectionHeaderText: {
    ...globalText,
    fontSize: 25,
    flex: 1,
    textAlign: "center",
    // marginRight:
    marginLeft: -50,
    // width: "33%",
  },
  sectionContainer: {
    // alignItems: "",
    width: "33.33%",
    justifyContent: "space-evenly",
    // flex: 1,
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
    // alignSelf: "center",
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
    fontSize: 20,
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
});
