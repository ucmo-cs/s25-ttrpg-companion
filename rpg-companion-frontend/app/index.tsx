import { Text, View, StyleSheet } from "react-native";
import CustomLogin from "@/app/CustomLogin";
import HomeMobile from "@/app/HomeMobile";
import TabNavigation from "./tabNavigation";

export default function Index() {
  return (
    <View style={styles.container}>
      {/* *** Until we get navigation. Just uncomment what you are working on **** */}
      <CustomLogin></CustomLogin>
      {/* <HomeMobile></HomeMobile> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#121427",
  },
});
