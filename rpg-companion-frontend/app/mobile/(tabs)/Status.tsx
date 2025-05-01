import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Star, Skull } from "lucide-react-native";
import { FlatList } from "react-native-gesture-handler";
import { useState, useEffect } from "react";
import SessionStorage from "react-native-session-storage";

const globalText = {
  color: "white",
  fontFamily: "Sora",
};

const statusOptions = [
  { label: "Posioned", color: "#62ECBE" },
  { label: "Blessed", color: "#DEFF4A" },
  { label: "Stunned", color: "#7094E0" },
];

const features = [
  {
    title: "Class Feature",
    subtitle: "Umbral Sight",
    icon: <Star color="white" size={50} />,
    description:
      "You gain Darkvision with a range of 60ft. if you already have Darkvision when you gain this feature, its range increases by 30ft. Additionally while entirely in Darkness, you have the Invisible condition to any creature that relies on Darkvision to see you",
  },
  {
    title: "Special Feature",
    subtitle: "Grung Poison",
    icon: <Skull color="white" size={50} />,
    description:
      "You can apply your poison to any piercing weapon as part of an attack with that weapon. The target must succeed on a DC 12 Con saving throw or take 2d4 poison damage",
  },
  {
    title: "Special Feature",
    subtitle: "Grung Poison",
    icon: <Skull color="white" size={50} />,
    description:
      "You can apply your poison to any piercing weapon as part of an attack with that weapon. The target must succeed on a DC 12 Con saving throw or take 2d4 poison damage",
  },
];

export default function Status() {
  const [speciesData, setSpeciesData] = useState<any[]>([]);
  const [classFeatures, setClassFeatures] = useState<any>([]);
  const [featuresData, setFeaturesData] = useState<any>([]);
  const [characterData, setCharacterData] = SessionStorage.getItem(
    "selectedCharacterData"
  );
  console.log("Character data:", characterData);
  //UseEffect to load feature data from session storage
  useEffect(() => {
    //Species Data loaded from session storage
    if (!SessionStorage.getItem("speciesData"))
      return; //if no species data, do not load anything
    else {
      const raw =
        SessionStorage.getItem("speciesData") || characterData.speciesfeatures;
      try {
        const parsed = JSON.parse(raw);
        console.log("Parsed selected species data:", parsed);
        setSpeciesData(parsed);
      } catch (err) {
        console.error("Failed to parse selected character data:", err);
      }

      //Character Data loaded from session storage, specifically for features
      const raw2 =
        SessionStorage.getItem("classFeatures") || characterData.classfeatures;
      try {
        const parsed = JSON.parse(raw2);
        console.log("Parsed selected classFeatures:", parsed);
        setClassFeatures(parsed);
      } catch (err) {
        console.error("Failed to parse selected classFeatures:", err);
      }
    }
  }, []);

  //Features Data set up
  useEffect(() => {
    if (!speciesData || !classFeatures) return;
    const speciesFeatures = Object.entries(speciesData).map(([key, value]) => ({
      title: "Species Feature",
      subtitle: key,
      icon: <Star color="white" size={50} />,
      description: value,
    }));

    const parsedclassFeatures =
      classFeatures.flatMap((featureGroup: any) =>
        Object.entries(featureGroup || {}).map(([key, value]) => ({
          title: "Class Feature",
          subtitle: key,
          icon: <Skull color="white" size={50} />,
          description: value,
        }))
      ) || [];
    const allFeatures = [...speciesFeatures, ...parsedclassFeatures];
    setFeaturesData(allFeatures);
    console.log("Updated features data:", allFeatures);
  }, [speciesData, classFeatures]);

  const [statuses, setStatuses] = useState([0, 0, 0]);

  const toggleStatus = (index: number) => {
    setStatuses((prevStatuses) => {
      const newStatuses = [...prevStatuses];
      // Toggle the state (0 -> 1 for filled, 1 -> 0 for not filled)
      newStatuses[index] = newStatuses[index] === 0 ? 1 : 0;
      return newStatuses;
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.pageHeader}>Status & Features</Text>
      <View style={styles.row}>
        {statuses.map((status, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.statusBox,
              {
                borderColor: statusOptions[index].color, //always will be border color regarless of state
                backgroundColor:
                  status === 1 ? statusOptions[index].color : "#121427", //if selected (1) be index color, otherwise background color
              },
            ]}
            onPress={() => toggleStatus(index)}
          >
            <Text
              style={[
                styles.statusText,
                { color: status === 1 ? "black" : statusOptions[index].color }, //selected (1) black text, otherwise index color
              ]}
            >
              {statusOptions[index].label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView style={styles.scrollArea}>
        <View style={styles.row}>
          <View style={styles.row}>
            {featuresData.map((item, index) => (
              <View key={index} style={styles.featureBox}>
                <View style={styles.featureContent}>
                  {item.icon}
                  <Text style={styles.featureTitle}>{item.title}</Text>
                  <View style={styles.line}></View>
                  <Text style={styles.featureSubtitle}>{item.subtitle}</Text>

                  <ScrollView style={styles.descriptionContainer}>
                    {typeof item.description === "string" ? (
                      // If it's a regular string, just show it normally
                      <Text style={styles.description}>{item.description}</Text>
                    ) : (
                      // If it's an object, map each sub-trait!
                      Object.entries(item.description).map(
                        ([subTrait, detail], i) => (
                          <View key={i} style={{ marginBottom: 10 }}>
                            <Text style={styles.subTraitTitle}>{subTrait}</Text>
                            <Text style={styles.subTraitDescription}></Text>
                          </View>
                        )
                      )
                    )}
                  </ScrollView>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  //Container Styles
  //Misc Styles
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
    marginBottom: 15,
    fontWeight: 500,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  scrollArea: {
    width: "100%",
  },
  line: {
    borderBottomColor: "white",
    borderBottomWidth: 2.5,
    alignSelf: "stretch",
    width: "100%",
    paddingTop: 8,
  },

  //Status Styles
  statusBox: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 10,
    width: 115,
    marginBottom: 20,
    marginHorizontal: 7,
    borderWidth: 3.5,
    justifyContent: "space-evenly",
  },
  statusText: {
    ...globalText,
  },

  //Feature Styles
  featureBox: {
    borderRadius: 10,
    width: "45%",
    marginBottom: 20,
    marginHorizontal: 7,
    borderWidth: 3.5,
    borderColor: "white",
    backgroundColor: "#3E4A59",
  },
  featureTitle: {
    ...globalText,
    marginTop: 5,
    fontSize: 18,
  },
  featureSubtitle: {
    ...globalText,
    marginTop: 5,
    fontSize: 16.5,
  },
  featureContent: {
    alignItems: "center",
    padding: 10,
    marginHorizontal: -10,
  },
  descriptionContainer: {
    padding: 2.5,
    maxHeight: 150,
  },
  description: {
    ...globalText,
    padding: 5,
    backgroundColor: "#3E4A59",
    borderRadius: 10,
    textAlign: "center",
  },

  subTraitTitle: {
    ...globalText,
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
    textAlign: "center",
  },

  subTraitDescription: {
    ...globalText,
    fontSize: 14,
    marginBottom: 5,
    textAlign: "center",
  },
});
