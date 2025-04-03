import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";

export default function Notes() {
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const saveNote = () => {
    console.log("saved note: ", note);
  };

  // setSaving(true);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.border}>
          <Text style={styles.header}>Notes</Text>
          <TextInput
            style={styles.textInput}
            multiline={true}
            placeholder={"Write your session notes here..."}
            placeholderTextColor={"#888"}
            value={note}
            onChangeText={setNote}
          />
        </View>
        <TouchableOpacity
          onPress={saveNote}
          disabled={saving}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Save Note</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#121427",
    justifyContent: "flex-end",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    padding: 5,
    textAlign: "center",
  },
  border: {
    flex: 1,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "white",
    borderRadius: 10,
    padding: 5,
    width: "99%",
    marginTop: 3,
  },
  textInput: {
    color: "white",
    fontSize: 15,
    marginLeft: 5,
  },
  button: {
    backgroundColor: "#6B728C",
    borderColor: "#6B728C",
    textAlign: "center",
    borderWidth: 2,
    margin: "2%",
    borderRadius: 25,
    width: "75%",
  },
  buttonText: {
    color: "white",
    alignSelf: "center",
    fontSize: 22,
  },
});
