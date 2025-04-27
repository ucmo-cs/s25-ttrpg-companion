import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Sword, Wand, Axe, Circle, Zap } from "lucide-react-native";
import { useEffect, useState } from "react";
import SessionStorage from "react-native-session-storage";

const globalText = {
  color: "white",
  fontFamily: "Sora",
};

const colorOptions = [
  { color: "white", fill: "#121427" },
  { color: "green", fill: "green" },
  { color: "red", fill: "red" },
];
const getIconForItem = (item) => {
  if (item.type === "weapon") {
    if (item.name.toLowerCase().includes("bow")) return "bow-arrow";
    if (item.name.toLowerCase().includes("sword")) return "sword";
    if (item.name.toLowerCase().includes("axe")) return "axe";
    if (item.name.toLowerCase().includes("wand")) return "wand";
    return "sword-cross";
  }

  if (item.type === "armor") {
    if (item.name.toLowerCase().includes("shield")) return "shield-half-full";
    if (item.name.toLowerCase().includes("helmet")) return "helmet";
    if (item.name.toLowerCase().includes("leather")) return "tshirt-v";
    return "shield";
  }

  return "help-circle"; // fallback
};
const actions = [
  {
    title: "Shortbow",
    hit: "+5",
    damage: "1d6",
    icon: <MaterialCommunityIcons name="bow-arrow" size={45} color="white" />,
  },
  {
    title: "Melee",
    hit: "+7",
    damage: "1d8",
    icon: <Axe size={45} color="white" />,
  },
  {
    title: "Shortsword",
    hit: "+5",
    damage: "1d6",
    icon: <Sword size={45} color="white" />,
  },
];
const bonusActions = [
  {
    title: "Spell",
    hit: "+4",
    damage: "1d10",
    icon: <Wand size={45} color="white" />,
  },
  {
    title: "Class Feature",
    hit: "+4",
    damage: "1d10",
    icon: <Zap size={45} color="white" />,
  },
  {
    title: "Class Feature",
    hit: "+4",
    damage: "1d10",
    icon: <Zap size={45} color="white" />,
  },
];
export default function Combat() {
  const [equippedItem, setEquippedItem] = useState<Array<any>>([]);
  const [abilities, setAbilities] = useState<Array<any>>([]);
  const [armor, setArmor] = useState<Array<any>>([]);
  useEffect(() => {
    const interval = setInterval(() => {
      const parsed = SessionStorage.getItem("equippedItem");
      try {
        const parsedItems = JSON.parse(parsed) || [];

        const weapons = parsedItems.filter((item) => item.type === "weapon");
        const armor = parsedItems.filter((item) => item.type === "armor");
        SessionStorage.setItem("armorEquipped", JSON.stringify(armor));
        setEquippedItem(weapons);
      } catch (err) {
        console.error("Failed to parse equipped item combat equip:", err);
      }
    }, 1000);

    const characterAbilities = SessionStorage.getItem("abilityScores");
    try {
      const parsedAbilities = JSON.parse(characterAbilities);
      console.log("Parsed character abilities:", parsedAbilities);
      setAbilities(parsedAbilities);
    } catch (err) {
      console.error("Failed to parse character abilities:", err);
    }
  }, []);

  const getHitModifier = (item) => {
    if (!abilities || abilities.length === 0) return "";

    const strMod =
      abilities.find((ability) => ability.title === "Str")?.modifier || "+0";
    const dexMod =
      abilities.find((ability) => ability.title === "Dex")?.modifier || "+0";

    // Check if item.attributes includes "Finesse"
    if (item.attributes && item.attributes.includes("Finess")) {
      return dexMod;
    }

    // Otherwise default to Strength
    return strMod;
  };
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
      <View style={styles.scrollSection}>
        <ScrollView style={styles.scrollArea}>
          <View style={styles.gridContainer}>
            {equippedItem.map((item, index) => (
              <View key={index} style={styles.infoBox}>
                <MaterialCommunityIcons
                  name={getIconForItem(item)}
                  size={50}
                  color="white"
                />
                <View>
                  <Text style={styles.boxTitle}>{item.name}</Text>
                  <View style={styles.statRow}>
                    <Text style={styles.boxSubtitle}>Hit</Text>
                    <Text style={styles.boxValue}>{getHitModifier(item)}</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.boxSubtitle}>Damage</Text>
                    <Text style={styles.boxValue}>{item.damage_type}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
      <Text style={styles.sectionHeader}>Bonus Actions</Text>

      <View style={styles.scrollSection}>
        <ScrollView style={styles.scrollArea}>
          <View style={styles.gridContainer}>
            {bonusActions.map((item, index) => (
              <View key={index} style={styles.infoBox}>
                {item.icon}
                <View>
                  <Text style={styles.boxTitle}>{item.title}</Text>
                  <View style={styles.statRow}>
                    <Text style={styles.boxSubtitle}>Hit</Text>
                    <Text style={styles.boxValue}>{item.hit}</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.boxSubtitle}>Damage</Text>
                    <Text style={styles.boxValue}>{item.damage}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
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
  //Container Styles
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#121427",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginHorizontal: 5,
  },
  deathSaveContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  //Header Styles
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
    marginTop: 7,
  },

  //Box Styles
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#3E4A59",
    borderRadius: 10,
    padding: 10,
    width: 175,
    marginBottom: 15,
    marginHorizontal: 7,
  },
  boxTitle: {
    ...globalText,
    fontSize: 15,
    color: "#A8FFFC",
    marginBottom: 4,
    marginLeft: 10,
  },
  boxSubtitle: {
    ...globalText,
    fontSize: 12,
    marginLeft: 10,
  },
  boxValue: {
    color: "#A8FFFC",
    marginHorizontal: "15%",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  //Scrolling Styles
  scrollArea: {
    width: "100%",
  },
  scrollSection: {
    height: 180,
    marginBottom: 15,
  },
});
