import { Text, View, StyleSheet } from "react-native";
import CustomLogin from "@/screens/CustomLogin";
import Home from "@/screens/Home";

export default function Index() {
  return (
    <View style={styles.container}>
      {/**** Until we get navigation. Just uncomment what you are working on *****/}
      {/* <CustomLogin></CustomLogin> */}
      <Home></Home>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#121427",
  },
  // container: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   backgroundColor: "#121427",
  // },
});
