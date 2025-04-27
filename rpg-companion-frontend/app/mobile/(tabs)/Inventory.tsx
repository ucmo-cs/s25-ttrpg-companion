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

  useEffect(() => {
    const parsed = SessionStorage.getItem("charInventory");
    try {
      const flat = JSON.parse(parsed);
      setInventory(flat);
      console.log("Parsed inventory:", flat);
    } catch (err) {
      console.error("Failed to parse inventory:", err);
    }

    const raw2 = SessionStorage.getItem("selectedCharacterData");
    try {
      console.log(raw2);
      const flat = Array.isArray(parsed[0]) ? parsed[0] : parsed;
      console.log("Parsed selected character data:", parsed);
    } catch (err) {
      console.error("Failed to parse selected character data:", err);
    }
  }, []);
  const [inventory, setInventory] = useState<Array<any>>([]);
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
  const [refreshKey, setRefreshKey] = useState(0);
  const addToCombat = (item) => {
    console.log("Adding item to combat:", item);
    const stored = SessionStorage.getItem("equippedItem");
    let equipped: Array<any> = [];
    if (stored) {
      try {
        equipped = JSON.parse(stored) || [];
      } catch (err) {
        console.error("Failed to parse equipped item add to combat:", err);
      }
    }
    const alreadyEquipped = equipped.some(
      (equippedItem) => equippedItem.name === item.name
    );
    if (alreadyEquipped) {
      equipped = equipped.filter(
        (equippedItem) => equippedItem.name !== item.name
      );
      console.log("Item already equipped:", item.name);
    } else {
      equipped.push(item);
    }
    SessionStorage.setItem(`equippedItem`, JSON.stringify(equipped));
    console.log("Equipped items:", equipped);
    setRefreshKey((prev) => prev + 1);
  };

  const isEquipped = (item) => {
    const equipped = SessionStorage.getItem("equippedItem");
    if (!equipped) return false;
    try {
      const parsedEquipped = JSON.parse(equipped) || [];
      return parsedEquipped.some(
        (equippedItem) => equippedItem.name === item.name
      );
    } catch (err) {
      console.error(
        "Failed to parse equipped item inventory is equipped:",
        err
      );
      return false;
    }
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
            <TouchableOpacity
              style={styles.equipContainer}
              onPress={() => addToCombat(item)}
            >
              <Text style={styles.equipButton}>
                {isEquipped(item) ? "Unequip" : "Equip"}
              </Text>
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
