import React from 'react';
import {Text,View,TextInput,StyleSheet,Button,Alert,Platform,Image,Pressable} from "react-native";

interface InventoryProps {
  test: string;
}

const Inventory = (props: InventoryProps) => {
  return (
    <View>{props.test}</View>
  );
};

export default Inventory;
