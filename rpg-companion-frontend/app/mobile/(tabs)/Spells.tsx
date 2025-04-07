// //Use a flat list with a view with borders that holds the spell information
// //Once the card is clicked
// //Hold one view (like the thumbnal) then when clicked have the height scales to bring out the information
// import { View, Text, StyleSheet, FlatList } from "react-native";

import React from "react";
import { FlatList, View, Text, Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8; // 80% of screen width
const SPACING = (width - CARD_WIDTH) / 2;

export default function Spells() {
  const data = [
    { id: "1", title: "Card 1" },
    { id: "2", title: "Card 2" },
    { id: "3", title: "Card 3" },
    { id: "4", title: "Card 4" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Spells</Text>

      <FlatList
        data={data}
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
            <Text style={styles.card}>{item.title}</Text>
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
    justifyContent: "space-evenly",
    backgroundColor: "#121427",
    // backgroundColor: "green",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    padding: 5,
    textAlign: "center",
    marginTop: 5,
  },
  card: {
    flex: 1,
    flexDirection: "column",
    width: CARD_WIDTH * 0.9,
    backgroundColor: "#6B728C",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 15,
    padding: 10,
  },
  cardFrame: {
    width: CARD_WIDTH,
    backgroundColor: "#121427",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    height: "75%",
    marginTop: "20%",
  },
});
