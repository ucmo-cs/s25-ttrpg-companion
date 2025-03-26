import { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Text, View, StyleSheet, Platform } from "react-native";

export default function HomeMobile() {
  return (
    <View style={styles.container}>
      <View style={styles.staticContainer}>
        <Text style={styles.header}>Character Name</Text>
        <Text style={styles.header}>Species</Text>
        <Text style={styles.header}>Class (SubClass)</Text>
      </View>

      <View style={styles.iconContainer}>
        <View style={styles.iconWrapper}>
          <Feather name="circle" size={70} color="white" />
          <Text style={styles.iconText}>1</Text>
        </View>

        <View style={styles.iconWrapper}>
          <Feather name="square" size={70} color="white" />
          <Text style={styles.iconText}>20</Text>
        </View>

        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons
            name="shield-outline"
            size={70}
            color="white"
          />
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

      <View style={styles.abilityScoresHeader}>
        <Text style={styles.abilityHeaderText}>Ability</Text>
        <Text style={styles.abilityHeaderText}>Score</Text>
        <Text style={styles.abilityHeaderText}>Modifier</Text>
      </View>

      <View style={styles.line} />

      <View style={styles.abilityScoresContainer}>
        <View style={styles.abilityContainer}>
          <Text style={styles.abilityText}>Str</Text>
          <Text style={styles.abilityText}>Dex</Text>
          <Text style={styles.abilityText}>Con</Text>
          <Text style={styles.abilityText}>Wis</Text>
          <Text style={styles.abilityText}>Int</Text>
          <Text style={styles.abilityText}>Cha</Text>
        </View>
        <View style={styles.scoresContainer}>
          <Text style={styles.abilityText}>+10</Text>
          <Text style={styles.abilityText}>+10</Text>
          <Text style={styles.abilityText}>+10</Text>
          <Text style={styles.abilityText}>+10</Text>
          <Text style={styles.abilityText}>+10</Text>
          <Text style={styles.abilityText}>+10</Text>
        </View>
        <View style={styles.modifierContainer}>
          <Text style={styles.abilityText}>+0</Text>
          <Text style={styles.abilityText}>+0</Text>
          <Text style={styles.abilityText}>+0</Text>
          <Text style={styles.abilityText}>+0</Text>
          <Text style={styles.abilityText}>+0</Text>
          <Text style={styles.abilityText}>+0</Text>
        </View>
      </View>
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
  iconContainer: {
    justifyContent: "flex-start",
    textAlignVertical: "center",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  staticContainer: {
    // backgroundColor: "#1e1e1e",
    alignSelf: "flex-end",
    width: "70%",

    ...Platform.select({
      ios: {
        height: "15%",
      },
      default: {
        height: "18%",
      },
    }),
  },

  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    padding: 5,
    justifyContent: "center",
    textAlign: "center",
  },

  iconWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  iconText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    position: "absolute",
  },
  hp: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    position: "relative",
    padding: 10,
    flexDirection: "row",
  },

  line: {
    borderBottomColor: "white",
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
    width: "100%",
    paddingTop: 8,
  },

  abilityScoresHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  abilityHeaderText: {
    fontSize: 22,
    color: "white",
    flex: 1,
    textAlign: "center",
    paddingVertical: 2.5,
    // paddingHorizontal: 20,
    // padding: 2.5,
  },
  abilityText: {
    fontSize: 22,
    color: "white",
    // paddingHorizontal: 40,
    paddingVertical: 2,
    // marginLeft: 32,
  },
  abilityScoresContainer: {
    flexDirection: "row",
    paddingTop: 3,
    width: "100%",
    justifyContent: "space-around",
  },
  abilityContainer: {
    alignItems: "center",
    width: "33%",
    justifyContent: "center",
  },
  scoresContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "33%",
  },
  modifierContainer: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "33%",
  },
});
