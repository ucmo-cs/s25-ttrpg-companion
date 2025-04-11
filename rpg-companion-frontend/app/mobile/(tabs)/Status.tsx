import { View, Text, StyleSheet } from "react-native";

const globalText = {
  color: "white",
  fontFamily: "Sora",
};

export default function Status() {
  return (
    <View style={styles.container}>
      <Text style={styles.pageHeader}>Status Screen</Text>
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
  pageHeader: {
    ...globalText,
    fontSize: 30,
    padding: 5,
    textAlign: "center",
    marginTop: 7,
  },
});
