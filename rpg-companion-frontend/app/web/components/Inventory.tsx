import React, {useState, useEffect} from 'react';
import {Text,View,TextInput,StyleSheet,Button,Alert,Platform,Image,Pressable, ScrollView} from "react-native";
import ItemModal from '@/app/mobile/ItemModal';
import SessionStorage from 'react-native-session-storage';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


interface InventoryProps {
  
}

const Inventory = (props: InventoryProps) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const parsed = SessionStorage.getItem("selectedCharacterData").inventory;
    try {
      const flat = Array.isArray(parsed[0]) ? parsed[0] : parsed;
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

  return (
     <View style={styles.container}>
  <Text style={styles.pageHeader}>Inventory Screen</Text>

  <ScrollView style={styles.staticContainer}>
    {inventory.map((item) => (
      <View key={item} style={styles.itemContainer}>
        <Pressable
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
        </Pressable>
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
        <Pressable style={styles.equipContainer}>
          <Text style={styles.equipButton}>Equip</Text>
        </Pressable>
      </View>
    ))}
  </ScrollView>
</View>
);



};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#121427",
    borderColor:"white",
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
    fontSize: 12,
    color:"white",
    padding:2
  },
  equipContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    padding: 4,
    margin: 5,
  },
  equipButton: {
    color:"white",
    height:"100%"  
  },
  pageHeader: {
    fontSize: 30,
    padding: 5,
    textAlign: "center",
    marginTop: 7,
    color:"white"
  },
});

export default Inventory;
