import { View, Text, StyleSheet } from "react-native";

export default function Combat() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Combat Screen</Text>
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
    width: "70%",
    height: "15%",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    padding: 5,
    textAlign: "center",
  },
});
