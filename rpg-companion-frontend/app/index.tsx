import { Text, View } from "react-native";
import CustomLogin from "@/components/CustomLogin";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121427",
      }}
    >
      <CustomLogin></CustomLogin>
    </View>
  );
}
