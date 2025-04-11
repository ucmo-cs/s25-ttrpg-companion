import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";

const globalText = {
  color: "white",
  fontFamily: "Sora",
};

export default function Combat() {
  console.log("Running on:", Platform.OS);

  const initialCharacterData = {
    name: "",
    species: "",
    class: "",
    subclass: "",
    inventoryNotes: "",
    str: "10",
    dex: "10",
    con: "10",
    wis: "10",
    int: "10",
    cha: "10",
  };
  const [characterData, setCharacterData] = useState(initialCharacterData);

  const handleChange = (key, value) => {
    setCharacterData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const payload = {
    username: "leejac608", // Will be replaced with the logged in user
    character: {
      name: characterData.name,
      hp: characterData.str, // placeholder
      ac: characterData.dex, // placeholder
      items: {
        shortsword: {
          amount: 1,
          notes: "A short sword",
          weight: 15,
        },
        gold: {
          amount: 100,
          notes: "Gold coins",
          weight: 0.1,
        },
      },
    },
  };
  const submitCharacter = async () => {
    try {
      const response = await fetch(
        "https://fmesof4kvl.execute-api.us-east-2.amazonaws.com/create-character",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.text();
      console.log(data);
      alert("Character created successfully!");
      setCharacterData(initialCharacterData); // Reset the form after submission
    } catch (error) {
      console.error(error);
      console.log("Data:", payload);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#121427" }}
      behavior="padding"
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.container}>
          <Text style={styles.pageHeader}>Create Character</Text>
          <TextInput
            placeholder="Name"
            style={styles.formControl}
            placeholderTextColor="#ccc"
            value={characterData.name}
            onChangeText={(text) => handleChange("name", text)}
          />
          <TextInput
            placeholder="Species"
            style={styles.formControl}
            placeholderTextColor="#ccc"
            value={characterData.species}
            onChangeText={(text) => handleChange("species", text)}
          />
          <TextInput
            placeholder="Class"
            style={styles.formControl}
            placeholderTextColor="#ccc"
            value={characterData.class}
            onChangeText={(text) => handleChange("class", text)}
          />
          <TextInput
            placeholder="Subclass"
            style={styles.formControl}
            placeholderTextColor="#ccc"
            value={characterData.subclass}
            onChangeText={(text) => handleChange("subclass", text)}
          />
          <Text style={styles.Inventory}>Inventory</Text>
          <TextInput
            style={[styles.formControl, { height: 100 }]}
            placeholderTextColor="#ccc"
            multiline={true}
            value={characterData.inventoryNotes}
            onChangeText={(text) => handleChange("inventoryNotes", text)}
            placeholder="Inventory Notes"
          />
          <Text style={styles.AbilityScores}>Ability Scores</Text>
          <View style={styles.abilityScoreWrapper}>
            <View style={styles.abilityRow}>
              <View style={styles.abilityBox}>
                <Text style={styles.abilityLabel}>Str</Text>
                <TextInput
                  style={styles.abilityScoreControl}
                  placeholder="10"
                  placeholderTextColor="#ccc"
                  value={characterData.str}
                  onChangeText={(text) => handleChange("str", text)}
                />
              </View>
              <View style={styles.abilityBox}>
                <Text style={styles.abilityLabel}>Dex</Text>
                <TextInput
                  style={styles.abilityScoreControl}
                  placeholder="10"
                  placeholderTextColor="#ccc"
                  value={characterData.dex}
                  onChangeText={(text) => handleChange("dex", text)}
                />
              </View>
              <View style={styles.abilityBox}>
                <Text style={styles.abilityLabel}>Con</Text>
                <TextInput
                  style={styles.abilityScoreControl}
                  placeholder="10"
                  placeholderTextColor="#ccc"
                  value={characterData.con}
                  onChangeText={(text) => handleChange("con", text)}
                />
              </View>
            </View>
            <View style={styles.abilityRow}>
              <View style={styles.abilityBox}>
                <Text style={styles.abilityLabel}>Wis</Text>
                <TextInput
                  style={styles.abilityScoreControl}
                  placeholder="10"
                  placeholderTextColor="#ccc"
                  value={characterData.wis}
                  onChangeText={(text) => handleChange("wis", text)}
                />
              </View>

              <View style={styles.abilityBox}>
                <Text style={styles.abilityLabel}>Int</Text>
                <TextInput
                  style={styles.abilityScoreControl}
                  placeholder="10"
                  placeholderTextColor="#ccc"
                  value={characterData.int}
                  onChangeText={(text) => handleChange("int", text)}
                />
              </View>
              <View style={styles.abilityBox}>
                <Text style={styles.abilityLabel}>Cha</Text>
                <TextInput
                  style={styles.abilityScoreControl}
                  placeholder="10"
                  placeholderTextColor="#ccc"
                  value={characterData.cha}
                  onChangeText={(text) => handleChange("cha", text)}
                />
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={submitCharacter}>
          <Text style={styles.buttonText}>Create Character</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  globalContainer: {
    ...globalText,
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#121427",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#121427",
  },
  staticContainer: {
    alignSelf: "flex-end",
    width: "70%",
    height: "15%",
  },
  pageHeader: {
    ...globalText,
    fontSize: 30,
    padding: 5,
    textAlign: "center",
    marginTop: 7,
  },
  formControl: {
    ...globalText,
    padding: 10,
    margin: 10,
    fontSize: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    width: "100%",
    marginBottom: 24,
    textAlign: "left",
    marginTop: 10,
  },
  AbilityScores: {
    ...globalText,
    padding: 10,
    margin: 10,
    fontSize: 24,
    color: "#ccc",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    width: "100%",
    marginBottom: 24,
    textAlign: "left",
    marginTop: 10,
  },
  abilityScoreWrapper: {
    marginBottom: 5,
  },
  abilityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  abilityScoreControl: {
    ...globalText,
    fontSize: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#121427",
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: 100,
    textAlign: "center",
  },
  abilityLabel: {
    ...globalText,
    fontSize: 24,
    marginBottom: 4,
    marginTop: 4,
  },
  abilityBox: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  button: {
    backgroundColor: "#6B728C",
    borderColor: "#6B728C",
    alignSelf: "center",
    borderWidth: 2,
    borderRadius: 25,
    marginTop: 40,
    width: "75%",
  },
  buttonText: {
    ...globalText,
    alignSelf: "center",
    fontSize: 22,
  },
  Inventory: {
    ...globalText,
    padding: 10,
    margin: 10,
    fontSize: 24,
    color: "#ccc",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    width: "100%",
    marginBottom: 24,
    textAlign: "left",
    marginTop: 10,
  },
});
