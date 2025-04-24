import {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';

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

export default function SpellCarousel() {

  const [containerWidth, setContainerWidth] = useState(0);

<View
  onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
  style={{ flex: 1 }}
>

</View>
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.carouselContainer} key={"carousel"}>
      <FlatList
        data={data}
        renderItem={renderItem}
        scrollEnabled={true}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  listContainer: {
    alignItems: 'center',
  },
  card: {
    flex: 1,
    width:650,
    minWidth:450,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 24,
    marginVertical: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginBottom: 12,
  },
  description: {
    fontSize: 18,
    color: '#cbd5e1',
  },
});
