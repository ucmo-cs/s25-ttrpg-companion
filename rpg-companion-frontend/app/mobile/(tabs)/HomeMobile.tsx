import { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  Circle,
  Square,
  Shield,
  PanelTopDashed,
  RectangleHorizontal,
} from "lucide-react-native";
import { Text, View, StyleSheet, FlatList, Image } from "react-native";

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

const globalText = {
  color: "white",
  fontFamily: "Sora",
};

export default function HomeMobile() {
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
          <Circle size={70} strokeWidth={1.5} color={"white"} />
          <Text style={styles.iconText}>10</Text>
        </View>

        <View style={styles.iconWrapper}>
          <Square size={70} color="white" strokeWidth={1.5} />
          <Text style={styles.iconText}>20</Text>
        </View>

        <View style={styles.iconWrapper}>
          <Shield size={70} color="white" strokeWidth={1.5} />
          <Text style={styles.iconText}>30</Text>
        </View>

        <View style={styles.iconWrapper}>
          <AntDesign name="plus" size={35} color="green" />
        </View>

        <View>
          <Text style={styles.hp}>HP</Text>
        </View>

        <View>
          <AntDesign name="minus" size={35} color="red" />
        </View>
      </View>
      <View style={styles.iconContainer}>
        <View style={styles.iconWrapper}>
          <PanelTopDashed
            style={styles.abilityIcons}
            size={100}
            color="white"
            strokeWidth={0.5}
          />
          <RectangleHorizontal
            size={75}
            style={styles.rectangleIcons}
            color="white"
            strokeWidth={0.5}
          />
          <Text style={styles.abilityText}>Str</Text>
          <Text style={styles.abilityScore}>+10</Text>
          <Text style={styles.modifierScore}>10</Text>
        </View>

        <View style={styles.iconWrapper}>
          <PanelTopDashed
            style={styles.abilityIcons}
            size={100}
            color="white"
            strokeWidth={0.5}
          />
          <RectangleHorizontal
            size={75}
            style={styles.rectangleIcons}
            color="white"
            strokeWidth={0.5}
          />
          <Text style={styles.abilityText}>Dex</Text>
          <Text style={styles.abilityScore}>+10</Text>
          <Text style={styles.modifierScore}>10</Text>
        </View>

        <View style={styles.iconWrapper}>
          <PanelTopDashed
            style={styles.abilityIcons}
            size={100}
            color="white"
            strokeWidth={0.5}
          />
          <RectangleHorizontal
            size={75}
            style={styles.rectangleIcons}
            color="white"
            strokeWidth={0.5}
          />
          <Text style={styles.abilityText}>Con</Text>
          <Text style={styles.abilityScore}>+10</Text>
          <Text style={styles.modifierScore}>10</Text>
        </View>
      </View>
      <View style={styles.iconContainer}>
        <View style={styles.iconWrapper}>
          <PanelTopDashed
            style={styles.abilityIcons}
            size={100}
            color="white"
            strokeWidth={0.5}
          />
          <RectangleHorizontal
            size={75}
            style={styles.rectangleIcons}
            color="white"
            strokeWidth={0.5}
          />
          <Text style={styles.abilityText}>Int</Text>
          <Text style={styles.abilityScore}>+10</Text>
          <Text style={styles.modifierScore}>10</Text>
        </View>

        <View style={styles.iconWrapper}>
          <PanelTopDashed
            style={styles.abilityIcons}
            size={100}
            color="white"
            strokeWidth={0.5}
          />
          <RectangleHorizontal
            size={75}
            style={styles.rectangleIcons}
            color="white"
            strokeWidth={0.5}
          />
          <Text style={styles.abilityText}>Wis</Text>
          <Text style={styles.abilityScore}>+10</Text>
          <Text style={styles.modifierScore}>10</Text>
        </View>

        <View style={styles.iconWrapper}>
          <PanelTopDashed
            style={styles.abilityIcons}
            size={100}
            color="white"
            strokeWidth={0.5}
          />
          <RectangleHorizontal
            size={75}
            style={styles.rectangleIcons}
            color="white"
            strokeWidth={0.5}
          />
          <Text style={styles.abilityText}>Cha</Text>
          <Text style={styles.abilityScore}>+10</Text>
          <Text style={styles.modifierScore}>10</Text>
        </View>
      </View>

      <Text></Text>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>Skill</Text>
        <Text style={styles.sectionHeaderText}>Ability</Text>
        <Text style={styles.sectionHeaderText}>Bonus</Text>
      </View>

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
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
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
    padding: 10,
  },
  // line: {
  //   borderBottomColor: "white",
  //   borderBottomWidth: StyleSheet.hairlineWidth,
  //   alignSelf: "stretch",
  //   width: "100%",
  //   paddingTop: 8,
  // },

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
    margin: 94,
  },
  abilityText: {
    ...globalText,
    // flex: 1,
    fontSize: 20,
    position: "absolute",
    alignSelf: "flex-start",
    paddingTop: "16%",
  },
  rectangleIcons: {
    position: "absolute",
    top: "61%",
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
});
