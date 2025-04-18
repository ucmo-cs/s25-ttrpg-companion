import { StyleSheet } from "react-native";

const GlobalStyles = StyleSheet.create({
  page: {
    backgroundColor: "#121427",
    width: "100%",
    height: "100%",
    color: "white",
    justifyContent: "center",
    fontFamily: "Sora-Regular",
    fontSize: 16,
  },
  dynamicHolder: {
    flex: 1,
    flexDirection:"column",
    backgroundColor:"green",
    marginHorizontal:10,
    marginBottom:10
  }
});

export default GlobalStyles;
