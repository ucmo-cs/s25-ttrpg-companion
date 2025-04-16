import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, Pressable, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const globalText = {
  color: "white",
  fontFamily: "Sora",
};
const ItemModal = ({ item, visible, onClose }) => {
  const [modalVisible, setModalVisible] = useState(visible);

  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

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
          <Text style={styles.modalTextHeader}>{item.name}</Text>
          <MaterialCommunityIcons name={item.icon} size={80} color="white" />
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
          <Text style={styles.modalText}>{item.description}</Text>
          <Pressable
            style={styles.buttonClose}
            onPress={() => {
              setModalVisible(!modalVisible);
              onClose();
            }}
          >
            <Text style={styles.textStyle}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
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
  },
});
export default ItemModal;
