import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import SessionStorage from 'react-native-session-storage';

export default function SpellCarousel() {
  const [entries, setEntries] = useState<Array<[string, unknown]>>([]);

  useEffect(() => {
    async function loadSpells() {
      const raw = await SessionStorage.getItem("selectedCharacterData");
      const character = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (!character) return console.warn("No character data");

      const spellsByLevel = character.spells;
      if (!spellsByLevel) return console.warn("No spells field");

      const levelKey = `Level ${character.level}`;
      const levelObj = spellsByLevel[levelKey];
      if (!levelObj) return console.warn(`No spells for ${levelKey}`);

      setEntries(Object.entries(levelObj));
    }

    loadSpells();
  }, []);

  const renderItem = ({ item }) => {
    const [spellName, details] = item;
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{spellName}</Text>
        <Text style={styles.description}>{details.description}</Text>
        <Text>{"\n"}</Text>
        <Text style={styles.description}>Components: {details.components}</Text>
        <Text>{"\n"}</Text>
        <Text style={styles.description}>Duration: {details.duration}</Text>
        <Text>{"\n"}</Text>
        <Text style={styles.description}>Range: {details.range}</Text>
        <Text>{"\n"}</Text>
        <Text style={styles.description}>School: {details.school}</Text>
        <Text>{"\n"}</Text>
      </View>
    );
  };

  return (
    <View style={styles.carouselContainer}>
      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item[0]}-${index}`}
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
    width: 650,
    minWidth: 450,
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
    color: '#A8FFFC',
    marginBottom: 12,
  },
  description: {
    fontSize: 18,
    color: 'white',
  },
});
