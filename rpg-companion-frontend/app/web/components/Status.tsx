import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable
} from "react-native";
import { Star, Skull } from "lucide-react-native";
import { FlatList } from "react-native-gesture-handler";
import { useState, useEffect } from "react";
import SessionStorage from "react-native-session-storage";

interface StatusProps {

}

const globalText = {
  color: "white",
  fontFamily: "Sora",
};

const statusOptions = [
  { label: "Posioned", color: "#62ECBE" },
  { label: "Blessed", color: "#DEFF4A" },
  { label: "Stunned", color: "#7094E0" },
];


export default function Status() {
  const [speciesData, setSpeciesData] = useState<Record<string, string>>({});
  const [subSpeciesData, setSubSpeciesData] = useState<Record<string, string>>(
    {}
  );
  const [classFeatures, setClassFeatures] = useState<any>([]);
  const [featuresData, setFeaturesData] = useState<any>([]);
  const [characterData, setCharacterData] = useState(SessionStorage.getItem("selectedCharacterData"));
  console.log("Character data:", characterData);
  //UseEffect to load feature data from session storage
  useEffect(() => {
    //Species Data loaded from session storage
    if (!SessionStorage.getItem("speciesData"))
      return; //if no species data, do not load anything
    else {
      let parsedSpecies =
        SessionStorage.getItem("speciesData") || characterData.speciesfeatures;
      console.log("Parsed species features:", parsedSpecies);
      if (typeof parsedSpecies === "string") {
        try {
          parsedSpecies = JSON.parse(parsedSpecies);
        } catch (e) {
          console.error("Failed to parse species features", e);
          parsedSpecies = {};
        }
      }
      setSpeciesData(parsedSpecies);

      let subSpeciesData =
        SessionStorage.getItem("subSpeciesData") ||
        characterData.subspeciesfeatures;
      if (typeof subSpeciesData === "string") {
        try {
          subSpeciesData = JSON.parse(subSpeciesData);
        } catch (e) {
          console.error("Failed to parse sub species features", e);
          subSpeciesData = {};
        }
      }
      setSubSpeciesData(subSpeciesData);

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
    const subSpeciesFeatures = Object.entries(subSpeciesData).map(
      ([key, value]) => ({
        title: "Sub Species Feature",
        subtitle: key,
        icon: <Star color="white" size={50} />,
        description: value,
      })
    );

    const parsedclassFeatures =
      classFeatures.flatMap((featureGroup: any) =>
        Object.entries(featureGroup || {}).map(([key, value]) => ({
          title: "Class Feature",
          subtitle: key,
          icon: <Skull color="white" size={50} />,
          description: value,
        }))
      ) || [];

    const allFeatures = [
      ...speciesFeatures,
      ...parsedclassFeatures,
      ...subSpeciesFeatures,
    ];
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
    color: "white",
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
    alignItems: "center",
    justifyContent: "center"
  },
  scrollArea: {
    width: "100%",
    flexDirection: "column",

  },
  line: {
    borderBottomColor: "white",
    borderBottomWidth: 2.5,
    alignSelf: "stretch",
    width: "100%",
    paddingTop: 8,
    fontWeight: "500"
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
  },

  //Feature Styles
  featureBox: {
    borderRadius: 10,
    width: "90%",
    marginBottom: 20,
    marginHorizontal: 7,
    borderWidth: 3.5,
    borderColor: "white",
    backgroundColor: "#3E4A59",
  },
  featureTitle: {
    color: "#A8FFFC",
    marginTop: 5,
    fontSize: 18,
    fontWeight: "700"
  },
  featureSubtitle: {
    marginTop: 5,
    fontSize: 16.5,
    fontWeight: "500",
    color: "#A8FFFC",
  },
  featureContent: {
    alignItems: "center",
    padding: 10,
    marginHorizontal: -10,
  },
  descriptionContainer: {
    padding: 2.5,
    maxHeight: 400,

  },
  description: {
    padding: 5,
    backgroundColor: "#3E4A59",
    borderRadius: 10,
    textAlign: "left",
    color: "white"

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

