//Things to change? move level to the spell title move duration to the level spot and uubt class in durations spot
import React from "react";
import {
  FlatList,
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8; // 80% of screen width
const SPACING = (width - CARD_WIDTH) / 2;
const globalText = {
  color: "white",
  fontFamily: "Sora",
};

export default function Spells() {
  const data = [
    {
      title: "Fireball",
      level: "3",
      casting: "1 action",
      range: "150 ft",
      component: "V S M",
      duration: "Instantaneous",
      target: "A point you choose within range",
      materials: "A tiny ball of bat guano and sulfur",
      classes: "Sorcerer, Wizard",
      description:
        "A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere centered on that point must make a Dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one. The fire spreads around corners. It ignites flammable objects in the area that aren’t being worn or carried.",
      school: "evocation",
    },

    {
      title: "Eldritch Blast",
      level: "0",
      casting: "1 action",
      range: "120 ft",
      component: "V S",
      duration: "Instantaneous",
      target: "A creature within range",
      materials: "",
      classes: "Warlock",
      description:
        "A beam of crackling energy streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 force damage. The spell creates more than one beam when you reach higher levels: two beams at 5th level, three beams at 11th level, and four beams at 17th level. You can direct the beams at the same target or at different ones. Make a separate attack roll for each beam.",
      school: "evocation",
    },
    {
      title: "Misty Step",
      level: "2",
      casting: "1 bonus action",
      range: "self",
      component: "V",
      duration: "Instantaneous",
      target: "Self",
      materials: "",
      classes: "Sorcerer, Warlock, Wizard",
      description:
        "Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space that you can see.",
      school: "conjuration",
    },
    {
      title: "Minor Illusion",
      level: "0",
      casting: "1 Action",
      range: "30 ft",
      component: "S M",
      duration: "1 Minute",
      target: "See text",
      materials: "A bit of fleece",
      classes: "Sorcerer, Warlock, Wizard, Bard",
      description:
        "You create a sound or an image of an object within range that lasts for the duration. The illusion also ends if you dismiss it as an action or cast this spell again. If you create a sound, its volume can range from a whisper to a scream. It can be your voice, someone else’s voice, a lion’s roar, a beating of drums, or any other sound you choose. The sound continues unabated throughout the duration, or you can make discrete sounds at different times before the spell ends.       If you create an image of an object—such as a chair, muddy footprints, or a small chest—it must be no larger than a 5-foot cube. The image can’t create sound, light, smell, or any other sensory effect. Physical interaction with the image reveals it to be an illusion, because things can pass through it.       If a creature uses its action to examine the sound or image, the creature can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the illusion becomes faint to the creature.",
      school: "illusion",
    },
  ];
  const sortedData = data.sort((a, b) => parseInt(a.level) - parseInt(b.level));

  return (
    <View style={styles.container}>
      <Text style={styles.pageHeader}>Spells</Text>

      <FlatList
        data={sortedData}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: SPACING,
        }}
        snapToAlignment="start"
        renderItem={({ item }) => (
          <View style={styles.cardFrame}>
            <View style={styles.card}>
              <View style={styles.statRow}>
                <Text
                  style={[styles.spellTitle, { flex: 1, textAlign: "center" }]}
                >
                  {item.title}
                </Text>
                <Text style={styles.spellLevel}>{item.level}</Text>
              </View>
              <View style={styles.row}>
                <View style={styles.infoBox}>
                  <Text style={styles.boxTitle}>Casting</Text>
                  <Text style={styles.boxValue}>{item.casting}</Text>
                </View>
                <View style={styles.infoBox}>
                  <Text style={styles.boxTitle}>Duration</Text>
                  <Text style={styles.boxValue}>{item.duration}</Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.infoBox}>
                  <Text style={styles.boxTitle}>Component</Text>
                  <Text style={styles.boxValue}>{item.component}</Text>
                </View>
                <View style={styles.infoBox}>
                  <Text style={styles.boxTitle}>Range</Text>
                  <Text style={styles.boxValue}>{item.range}</Text>
                </View>
              </View>
              <Text style={styles.componentText}>
                <Text style={styles.boxTitle}>Class(es) </Text>
                {item.classes}
              </Text>
              <Text style={styles.componentText}>
                <Text style={styles.boxTitle}>Target </Text>
                {item.target}
              </Text>
              {item.materials ? (
                <Text style={styles.componentText}>
                  <Text style={styles.boxTitle}>Materials </Text>
                  {item.materials}
                </Text>
              ) : null}
              <Text style={styles.componentText}>
                <Text style={styles.boxTitle}>School </Text>
                {item.school}
              </Text>
              <View style={styles.infoBox}>
                <Text style={styles.descriptionHeader}>Description</Text>

                <ScrollView style={styles.descriptionContainer}>
                  <Text style={styles.description}>{item.description}</Text>
                </ScrollView>
              </View>
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
    backgroundColor: "#121427",
  },
  pageHeader: {
    ...globalText,
    fontSize: 30,
    padding: 5,
    textAlign: "center",
    marginTop: 7,
  },

  //Card styles
  card: {
    flex: 1,
    width: CARD_WIDTH * 0.95,
    backgroundColor: "#6B728C",
    borderRadius: 15,
    padding: 10,
  },
  cardFrame: {
    width: CARD_WIDTH,
    alignItems: "center",
    height: "80%",
    marginTop: "12.5%",
  },

  spellTitle: {
    ...globalText,
    padding: 2,
    alignSelf: "center",
    fontSize: 25,
    marginBottom: 5,
    // marginLeft: 50,
  },

  //Casting, level, component, range
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#3E4A59",
    borderRadius: 10,
    padding: 7,
    marginHorizontal: 5,
  },
  boxTitle: {
    ...globalText,
    fontSize: 14,
    color: "#A8FFFC",
    marginBottom: 4,
    alignSelf: "center",
  },
  boxValue: {
    ...globalText,
    fontSize: 14,
    alignSelf: "center",
  },

  //Duration, target, materials, school
  componentText: {
    ...globalText,
    marginBottom: 5,
    backgroundColor: "#3E4A59",
    borderRadius: 10,
    padding: 5,
    marginHorizontal: 5,
  },

  descriptionHeader: {
    ...globalText,
    alignSelf: "center",
    fontSize: 17,
    marginBottom: 2,
    color: "#A8FFFC",
  },
  descriptionContainer: {
    padding: 2.5,
  },
  description: {
    ...globalText,
    padding: 5,
    marginHorizontal: 5,
    backgroundColor: "#3E4A59",
    borderRadius: 10,
  },
  statRow: {
    flexDirection: "row",
    // justifyContent: "space-between",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    // paddingVertical: 5,
  },
  spellLevel: {
    ...globalText,
    fontSize: 20,
    position: "absolute", // pull it out of the normal row flow
    right: 8,
  },
});
