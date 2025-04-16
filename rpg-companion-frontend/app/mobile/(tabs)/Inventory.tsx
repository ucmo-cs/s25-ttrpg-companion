import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Sword, Wand, Axe, Circle, Zap } from "lucide-react-native";
import { useEffect, useState } from "react";
import ItemModal from "../ItemModal";
const globalText = {
  color: "white",
  fontFamily: "Sora",
};

export default function Inventory() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [inventory, setInventory] = useState({
    name: "",
    amount: "",
    notes: "",
  });
  const handleItemPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(
          "https://fmesof4kvl.execute-api.us-east-2.amazonaws.com/get-character"
        );
        const data = await response.json();
        console.log("fetchInventory data", data);
        setInventory(data.inventory);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };

    fetchInventory();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.pageHeader}>Inventory Screen</Text>
      <View style={styles.staticContainer}>
        <View style={styles.itemContainer}>
          <TouchableOpacity
            onPress={() =>
              handleItemPress({
                name: "Shortbow",
                description:
                  "The breastplate and shoulder protectors of this armor are made of leather that has been stiffened by being boiled in oil. The rest of the armor is made of softer and more flexible materials.",
                icon: "bow-arrow",
              })
            }
          >
            <MaterialCommunityIcons name="bow-arrow" size={50} color="white" />
          </TouchableOpacity>
          {selectedItem && (
            <ItemModal
              item={selectedItem}
              visible={modalVisible}
              onClose={handleCloseModal}
            />
          )}
          <View style={styles.itemContent}>
            <Text style={styles.itemText}>Shortbow</Text>
            <Text style={styles.itemText}>Simple Martial Weapon</Text>
            <View style={styles.attributesContainer}>
              <View style={styles.attributesTextContainer}>
                <Text style={styles.attributeText}>Piercing</Text>
              </View>
              <View style={styles.attributesTextContainer}>
                <Text style={styles.attributeText}>Slow</Text>
              </View>
              <View style={styles.attributesTextContainer}>
                <Text style={styles.attributeText}>1d6</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.equipContainer}>
            <Text style={styles.equipButton}>Equip</Text>
          </TouchableOpacity>
        </View>
      </View>
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
