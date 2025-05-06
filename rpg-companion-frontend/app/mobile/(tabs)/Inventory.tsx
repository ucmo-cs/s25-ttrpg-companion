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
import InventoryModal from "../InventoryModal";
const globalText = {
  color: "white",
  fontFamily: "Sora",
};

export default function Inventory() {
  const knownItems: InventoryItem[] = [
    {
      name: "Chain Mail",
      type: "armor",
      armor_class: 16,
      attributes: ["Heavy"],
      description: "A sturdy set of interlocking metal rings.",
      equippable: true,
    },
    {
      name: "Greatsword",
      type: "weapon",
      damage_type: "2d6",
      properties: "Heavy, Two-Handed",
      attributes: ["Slashing"],
      description: "A massive two-handed sword.",
      equippable: true,
    },
    {
      name: "Dagger",
      type: "weapon",
      damage_type: "1d4",
      properties: "Light, Finesse, Thrown (20/60)",
      attributes: ["Piercing"],
      description: "A throwable light dagger.",
      equippable: true,
    },
    {
      name: "Flail",
      type: "weapon",
      damage_type: "1d8",
      properties: "Martial Melee Weapon",
      attributes: ["Bludgeoning"],
      description: "A spiked ball on a chain.",
      equippable: true,
    },
    {
      name: "Javelin",
      type: "weapon",
      damage_type: "1d6",
      properties: "Thrown, Range (30/120)",
      attributes: ["Piercing"],
      description: "A throwing spear.",
      equippable: true,
    },
    {
      name: "Dungeoneer’s Pack",
      type: "misc",
      attributes: [],
      description: "A pack containing adventuring gear.",
      equippable: false,
    },
    {
      name: "Scholar's Pack",
      type: "misc",
      attributes: [],
      description: "A pack containing adventuring gear.",
      equippable: false,
    },
    {
      name: "Quiver",
      type: "misc",
      attributes: [],
      description: "A leather container for arrows.",
      equippable: true,
    },
    {
      name: "Longbow",
      type: "weapon",
      damage_type: "1d8",
      properties: "Two-Handed, Ranged",
      attributes: ["Piercing"],
      description: "A large bow favored by archers.",
      equippable: true,
    },
    {
      name: "Robe",
      type: "armor",
      armor_class: 11,
      attributes: ["Light"],
      description: "Armor made of cloth.",
      equippable: true,
    },
    {
      name: "Quarterstaff",
      type: "weapon",
      damage_type: "1d6",
      properties: "Versatile (1d8)",
      attributes: ["Topple", "Bludgeoning"],
      description: "A sturdy wooden staff.",
      equippable: true,
    },
    {
      name: "Spellbook",
      type: "misc",
      attributes: ["Magic"],
      description: "A spellbook for storing spells.",
      equippable: true,
    },
    {
      name: "GP",
      type: "misc",
      attributes: ["Magic"],
      description: "Money in the form of gold pieces.",
      equippable: true,
      quantity: 1,
    },
  ];

  type InventoryItem = {
    name: string;
    type: "weapon" | "armor" | "misc";
    properties?: string;
    quantity?: number;
    damage_type?: string;
    armor_class?: number;
    attributes?: string[];
    description: string;
    equippable: boolean;
  };

  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [characterData, setCharacterData] = useState(
    SessionStorage.getItem("selectedCharacterData")
  );
  console.log("Character data Inventory:", characterData.inventory);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const parseStartingEquipment = (itemsString: string): InventoryItem[] => {
    const cleaned = itemsString.replace(/and\s+/g, "").replace(/;/g, "");
    const splitItems = cleaned.split(",").map((item) => item.trim());

    const parsedItems: InventoryItem[] = [];
    let goldCount = 0;

    splitItems.forEach((entry) => {
      const match = knownItems.find((i) =>
        entry.toLowerCase().includes(i.name.toLowerCase())
      );

      if (entry.toLowerCase().includes("gp")) {
        const goldMatch = entry.match(/(\d+)\s*gp/i);
        if (goldMatch) {
          goldCount += parseInt(goldMatch[1]);
        } else {
          goldCount += 1; // default if not specified
        }
        return; // skip adding now, we’ll push one entry later
      }

      if (match) {
        const quantityMatch = entry.match(/^(\d+)\s+(.*)/);
        if (quantityMatch) {
          const count = parseInt(quantityMatch[1]);
          for (let i = 0; i < count; i++) {
            parsedItems.push({ ...match });
          }
        } else {
          parsedItems.push({ ...match, quantity: 1 });
        }
      } else {
        parsedItems.push({
          name: entry,
          type: "misc",
          attributes: [],
          description: entry,
          equippable: false,
          quantity: 1,
        });
      }
    });

    if (goldCount > 0) {
      parsedItems.push({
        name: "GP",
        type: "misc",
        attributes: [],
        description: `${goldCount} Gold Piece${goldCount > 1 ? "s" : ""}`,
        equippable: false,
        quantity: goldCount,
      });
    }

    return parsedItems;
  };

  useEffect(() => {
    const rawData = SessionStorage.getItem("selectedCharacterData");
    if (!rawData) return;

    try {
      const parsedCharacter =
        typeof rawData === "string" ? JSON.parse(rawData) : rawData;
      setCharacterData(parsedCharacter);

      const startingItems = parsedCharacter.starting_equipment?.items || "";
      const parsedInventory = parseStartingEquipment(startingItems);

      setInventory(parsedInventory);
      SessionStorage.setItem("charInventory", JSON.stringify(parsedInventory));
    } catch (err) {
      console.error("Failed to parse inventory or character:", err);
      setInventory([]);
    }
  }, []);

  //Starting with empty inventory and then setting it from session storage
  useEffect(() => {
    const parsed =
      SessionStorage.getItem("charInventory") || characterData.inventory;

    const raw2 = characterData;
    try {
      console.log(raw2);
      const flat = Array.isArray(parsed[0]) ? parsed[0] : parsed;
      console.log("Parsed selected character data:", flat);
    } catch (err) {
      console.error("Failed to parse selected character data:", err);
    }
  }, []);

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
    if (item.name.toLowerCase().includes("spellbook")) return "book-open";
    if (item.name.toLowerCase().includes("quiver")) return "quiver";
    if (item.name.toLowerCase().includes("robe")) return "tshirt-crew";
    if (item.name.toLowerCase().includes("pack")) return "sack";
    if (item.name.toLowerCase().includes("javelin")) return "spear";
    if (item.name.toLowerCase().includes("gp")) return "hand-coin";

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

  const addItemModal = () => {
    setModalVisible(true);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.pageHeader}>Inventory Screen</Text>

      <ScrollView style={styles.staticContainer}>
        {inventory.length > 0 ? (
          inventory.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <TouchableOpacity
                onPress={() =>
                  handleItemPress({
                    ...item,
                    icon: getIconForItem(item),
                    description:
                      item.name === "GP"
                        ? `${item.quantity || 0} Gold Piece${
                            item.quantity === 1 ? "" : "s"
                          }`
                        : item.description || "No description available",
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
                {(item.quantity ?? 1) > 1 && (
                  <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
                )}

                <View style={styles.attributesContainer}>
                  {item.attributes?.map((attr, i) => (
                    <View style={styles.attributesTextContainer}>
                      <Text style={styles.attributeText}>{attr || ""}</Text>
                    </View>
                  ))}
                </View>
              </View>
              {item.equippable && (
                <TouchableOpacity
                  style={styles.equipContainer}
                  onPress={() => addToCombat(item)}
                >
                  <Text style={styles.equipButton}>
                    {isEquipped(item) ? "Unequip" : "Equip"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.itemText}>No items in inventory</Text>
        )}
      </ScrollView>
      <View>
        <TouchableOpacity
          style={styles.equipContainer}
          onPress={() => addItemModal()}
        >
          <Text style={styles.equipButton}>Add Item</Text>
        </TouchableOpacity>
        <InventoryModal
          visible={modalVisible}
          onClose={handleCloseModal}
          inventory={inventory}
          characterData={characterData}
          knownItems={knownItems}
        />
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
