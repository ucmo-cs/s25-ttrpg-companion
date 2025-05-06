import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TextInput,
} from "react-native";
import SessionStorage from "react-native-session-storage";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Picker } from "@react-native-picker/picker";

const globalText = {
  color: "white",
  fontFamily: "Sora",
};
const InventoryModal = ({
  visible,
  onClose,
  inventory,
  characterData,
  knownItems,
}) => {
  const [modalVisible, setModalVisible] = useState(visible);
  const [characterInventory, setCharacterInventory] = useState(inventory);
  const [character, setCharacter] = useState(characterData);

  console.log("Known Items: ", knownItems);
  console.log("Character Data: ", characterData);
  const character_uid = characterData.character_uid;
  const user_uid = SessionStorage.getItem("userUid");
  const session_token = SessionStorage.getItem("token");
  const [propertyInput, setPropertyInput] = useState("");
  type InventoryItem = {
    name: string;
    type: "weapon" | "armor" | "misc";
    properties?: string[];
    quantity?: number;
    damage_type?: string;
    armor_class?: number;
    attributes?: string[];
    description: string;
    equippable: boolean;
  };

  const [newItem, setNewItem] = useState<InventoryItem>({
    name: "",
    type: "misc",
    properties: [],
    quantity: 1,
    damage_type: "",
    armor_class: 1,
    attributes: [],
    description: "",
    equippable: true,
  });

  const resetNewItem = () => {
    setNewItem({
      name: "",
      type: "misc",
      description: "",
      equippable: false,
      attributes: [],
      properties: [],
      quantity: 1,
    });
  };

  const inventoryToString = (items: InventoryItem[]) => {
    const counts: Record<string, number> = {};

    for (const item of items) {
      const name = item.name;
      counts[name] = (counts[name] || 0) + 1;
    }

    return Object.entries(counts)
      .map(([name, count]) =>
        name === "GP" ? `${count} GP` : count > 1 ? `${count} ${name}` : name
      )
      .join(", ");
  };

  const submitItems = async () => {
    console.log("User UID: ", user_uid);
    console.log("Session Token: ", session_token);
    console.log("Character UID: ", character_uid);

    if (!newItem.name || newItem.name.trim() === "") {
      alert("Item name is required.");
      return;
    }
    const updatedInventory = [...characterInventory, newItem];

    const payload = {
      character_uid: character_uid,
      user_uid: user_uid,

      starting_equipment: {
        items: inventoryToString([characterInventory, newItem]),
      },
      ...character,
    };

    try {
      const response = await fetch(
        "https://fmesof4kvl.execute-api.us-east-2.amazonaws.com/edit-character",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            session_token: session_token,
          },
          body: JSON.stringify(payload),
        }
      );
      console.log("Inventory update response:", await response.json());
      console.log("Updated Inventory: ", updatedInventory);
      resetNewItem();
      onClose();
      setModalVisible(false);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error submitting inventory changes.");
    }
  };

  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);
  useEffect(() => {
    setCharacterInventory(inventory);
  }, [inventory]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
        onClose();
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTextHeader}>Add New Item</Text>
          <Picker
            selectedValue={newItem.name}
            onValueChange={(value) => {
              const selected = knownItems.find((i) => i.name === value);
              if (selected) setNewItem({ ...selected, quantity: 1 });
            }}
            style={styles.picker}
          >
            <Picker.Item label="Select Item..." value="" />
            {knownItems.map((item, idx) => (
              <Picker.Item key={idx} label={item.name} value={item.name} />
            ))}
          </Picker>
          <Text style={styles.modalText}>Item Quantity</Text>
          <TextInput
            keyboardType="numeric"
            placeholder="Item Quantity"
            style={styles.input}
            placeholderTextColor="#aaa"
            value={newItem.quantity?.toString()}
            onChangeText={(text) =>
              setNewItem({ ...newItem, quantity: parseInt(text) })
            }
          />

          {/* <TextInput
            placeholder="Item Name"
            style={styles.input}
            placeholderTextColor="#aaa"
            value={newItem.name}
            onChangeText={(text) => setNewItem({ ...newItem, name: text })}
          />
          <Text style={styles.modalText}>Item Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={newItem.type}
              dropdownIconColor="white"
              style={styles.picker}
              onValueChange={(itemValue) =>
                setNewItem((prev) => ({ ...prev, type: itemValue }))
              }
            >
              <Picker.Item label="Weapon" value="weapon" />
              <Picker.Item label="Armor" value="armor" />
              <Picker.Item label="Misc" value="misc" />
            </Picker>
          </View>

          {newItem.type === "weapon" && (
            <TextInput
              placeholder="Damage Type"
              style={styles.input}
              placeholderTextColor="#aaa"
              value={newItem.damage_type}
              onChangeText={(text) =>
                setNewItem({ ...newItem, damage_type: text })
              }
            />
          )}
          {newItem.type === "armor" && (
            <TextInput
              placeholder="Armor Class"
              style={styles.input}
              placeholderTextColor="#aaa"
              value={newItem.armor_class?.toString()}
              onChangeText={(text) =>
                setNewItem({ ...newItem, armor_class: parseInt(text) })
              }
            />
          )}
          <Text style={styles.modalText}>Item Description</Text>
          <TextInput
            placeholder="Item Description"
            style={styles.input}
            placeholderTextColor="#aaa"
            value={newItem.description}
            onChangeText={(text) =>
              setNewItem({ ...newItem, description: text })
            }
          />

          <Text style={styles.modalText}>Properties</Text>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 10,
              width: "80%",
              marginLeft: 45,
            }}
          >
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 5 }]}
              placeholder="Add property"
              placeholderTextColor="#aaa"
              value={propertyInput}
              onChangeText={setPropertyInput}
            />
            <Pressable
              style={[styles.buttonClose, { paddingHorizontal: 10 }]}
              onPress={() => {
                if (propertyInput.trim() !== "") {
                  setNewItem((prev) => ({
                    ...prev,
                    properties: [
                      ...(prev.properties || []),
                      propertyInput.trim(),
                    ],
                  }));
                  setPropertyInput("");
                }
              }}
            >
              <Text style={styles.textStyle}>+</Text>
            </Pressable>
          </View>
          <View style={styles.attributesContainer}>
            {(newItem.properties || []).map((prop, i) => (
              <View key={i} style={styles.attributesTextContainer}>
                <Text style={styles.attributeText}>{prop}</Text>
              </View>
            ))}
          </View> */}
          <View
            style={{ flexDirection: "row", marginBottom: 10, marginRight: 10 }}
          >
            <Pressable style={styles.buttonClose} onPress={submitItems}>
              <Text style={styles.textStyle}>Add Item</Text>
            </Pressable>
            <Pressable
              style={styles.buttonClose}
              onPress={() => {
                setModalVisible(!modalVisible);
                onClose();
                resetNewItem();
              }}
            >
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  input: {
    backgroundColor: "#1f1f2e",
    color: "white",
    padding: 10,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    width: 250,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    backgroundColor: "#121427",
    margin: 20,
    width: "90%",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    margin: 5,
    paddingStart: 5,
  },
  modalTextHeader: {
    ...globalText,
    textAlign: "center",
    fontSize: 22,
    flexDirection: "row",
  },
  modalText: {
    ...globalText,
    marginBottom: 15,
    textAlign: "center",
  },
  attributesContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "90%",
    marginTop: 0,
  },
  attributesTextContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    padding: 7,
    margin: 5,
  },
  attributeText: {
    ...globalText,
    fontSize: 15,
  },
  buttonClose: {
    color: "#3E4A59",
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#3E4A59",
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
    marginTop: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
    backgroundColor: "#3E4A59",
    width: "70%",
    height: "10%",
  },
  picker: {
    flexDirection: "row",
    marginBottom: 10,

    marginLeft: 45,
    color: "white",
  },
});
export default InventoryModal;
