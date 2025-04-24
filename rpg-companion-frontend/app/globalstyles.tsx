import { StyleSheet, Platform } from "react-native";
import { useFonts } from "expo-font";



const GlobalStyles = StyleSheet.create({
  page: {
    backgroundColor: "#121427",
    width: "100%",
    height: "100%",
    color: "white",
    justifyContent: "center",
    fontFamily: "Sora-Regular",
    fontSize: 16,

    ...Platform.select({
      web: {
        minWidth:1200,
        minHeight:675
      },
        }),
  },
  dynamicHolder: {
    flex: 1,
    display:"flex",
    backgroundColor:"green",
    marginHorizontal:10,
    marginBottom:10,

    ...Platform.select({
      ios: {
        flexDirection:"column",
      },
      android: {
        flexDirection:"column",
      },
      web: {
        flexDirection:"row",
      },
        }),
  },
  flexBox: {
    flex: 1,
    backgroundColor: "#121427",
    flexDirection: "column"
  },
});

export default GlobalStyles;
