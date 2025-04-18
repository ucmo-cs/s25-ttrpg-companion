import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Sword, Wand, Axe, Circle, Zap } from "lucide-react-native";
import { useEffect, useState } from "react";
import ItemModal from "../ItemModal";
import SessionStorage from "react-native-session-storage";
const globalText = {
  color: "white",
  fontFamily: "Sora",
};

export default function Inventory() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const inventory =   SessionStorage.getItem("charInventory");

  const handleItemPress = (myItem) => {
    setSelectedItem(myItem);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };
  const getIconForItem = (item) => {
    if (item.type === "weapon") {
      if (item.name.toLowerCase().includes("bow")) return "bow-arrow";
      if (item.name.toLowerCase().includes("sword")) return "sword";
      if (item.name.toLowerCase().includes("axe")) return "axe";
      if (item.name.toLowerCase().includes("wand")) return "wand";
      return "sword-cross";
    }

    if (item.type === "armor") {
      if (item.name.toLowerCase().includes("shield")) return "shield-half-full";
      if (item.name.toLowerCase().includes("helmet")) return "helmet";
      if (item.name.toLowerCase().includes("leather")) return "tshirt-v";
      return "shield";
    }

    return "help-circle"; // fallback
  };
  return (
    <View style={styles.container}>
      <Text style={styles.pageHeader}>Inventory Screen</Text>

      <ScrollView style={styles.staticContainer}>
        {inventory.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <TouchableOpacity
              onPress={() =>
                handleItemPress({
                  ...item,
                  icon: getIconForItem(item),
                  description: item.description || "No description available",
                })
              }
            >
              <MaterialCommunityIcons
                name={getIconForItem(item)}
                size={50}
                color="white"
              />
            </TouchableOpacity>
            {selectedItem && (
              <ItemModal
                item={selectedItem}
                visible={modalVisible}
                onClose={handleCloseModal}
              />
            )}
            <View style={styles.itemContent}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.itemText}>{item.properties}</Text>
              <View style={styles.attributesContainer}>
                {item.attributes?.map((attr, i) => (
                  <View style={styles.attributesTextContainer}>
                    <Text style={styles.attributeText}>{attr || ""}</Text>
                  </View>
                ))}
              </View>
            </View>
            <TouchableOpacity style={styles.equipContainer}>
              <Text style={styles.equipButton}>Equip</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
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
    alignSelf: "center",
    width: "95%",
    height: "15%",
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#121427",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    padding: 10,
    margin: 10,
  },
  itemContent: {
    flex: 1,
    marginTop: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    color: "white",
    fontSize: 16,
    marginTop: 5,
  },
  attributesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "90%",
    marginTop: 0,
  },
  attributesTextContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    padding: 2,
    margin: 5,
  },
  attributeText: {
    ...globalText,
    fontSize: 12,
  },
  equipContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    padding: 4,
    margin: 5,
  },
  equipButton: {
    ...globalText,
  },
  pageHeader: {
    ...globalText,
    fontSize: 30,
    padding: 5,
    textAlign: "center",
    marginTop: 7,
  },
});
