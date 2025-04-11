import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Sword, Wand, Axe, Circle } from "lucide-react-native";
import { useState } from "react";

const globalText = {
  color: "white",
  fontFamily: "Sora",
};

const colorOptions = [
  { color: "white", fill: "#121427" },
  { color: "green", fill: "green" },
  { color: "red", fill: "red" },
];
export default function Combat() {
  //The array allows us to invidualize the circles
  const [deathSave, setDeathSave] = useState([0, 0, 0, 0, 0]);

  const handlePress = (deathSave) => {
    setDeathSave((prevColor) => {
      //getting the previous color state
      const newColor = [...prevColor];
      //Setting the new color of the death save (+1)
      //% is so it wraps back to the beginning
      newColor[deathSave] = (newColor[deathSave] + 1) % colorOptions.length;
      return newColor;
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageHeader}>Combat</Text>
      <Text style={styles.sectionHeader}>Actions</Text>

      <View style={styles.infoBox}>
        <MaterialCommunityIcons name="bow-arrow" size={50} color="white" />
        <Text style={styles.boxTitle}>Shortbow</Text>
      </View>

      <View style={styles.infoBox}>
        <Sword color="white" size={50} />
        <Text style={styles.boxTitle}>Shortsword</Text>
      </View>
      <View>
        <Text style={styles.sectionHeader}>Bonus Actions</Text>

        <Sword color="white" />
        <Wand color="white" />
        <Axe color="white" />
      </View>
      <Text style={styles.sectionHeader}>Death Saves</Text>
      <View style={styles.deathSaveContainer}>
        {/*deathSave.map gives you the current color (index of the area (0,1,2))*/}
        {/*colorIndex, i gives you the current circle being interacted with*/}
        {deathSave.map((colorIndex, i) => (
          <TouchableOpacity key={i} onPress={() => handlePress(i)}>
            <Circle
              strokeWidth={1}
              size={60}
              color={colorOptions[colorIndex].color}
              fill={colorOptions[colorIndex].fill}
            />
          </TouchableOpacity>
        ))}
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
  pageHeader: {
    ...globalText,
    fontSize: 30,
    padding: 5,
    textAlign: "center",
    marginTop: 7,
  },
  sectionHeader: {
    ...globalText,
    fontSize: 25,
    padding: 5,
    textAlign: "center",
    marginTop: 7,
  },

  deathSaveContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#3E4A59",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 25,
    // alignSelf: "center",
    alignSelf: "flex-start",
    height: 75,
    width: 175,
    marginBottom: 20,
  },
  boxTitle: {
    ...globalText,
    fontSize: 17,
    color: "#A8FFFC",
    marginBottom: 4,
    // alignSelf: "center",
    marginLeft: 10,
  },
  // boxValue: {
  //   ...globalText,
  //   fontSize: 14,
  //   alignSelf: "center",
  // },
  // iconContainer: {
  //   // justifyContent: "s",
  // },
  // textContainer: {
  //   // flex: 1,
  //   marginLeft: 75,
  //   alignSelf: "center",
  //   // position: "absolute",
  // },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
});
