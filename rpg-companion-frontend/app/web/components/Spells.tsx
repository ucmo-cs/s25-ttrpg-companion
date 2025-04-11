import React from 'react';
import {Text,View,TextInput,StyleSheet,Button,Alert,Platform,Image,Pressable} from "react-native";

interface SpellsProps {
  test: string;
}

const Spells = (props: SpellsProps) => {
  return (
    <View>{props.test}</View>
  );
};

export default Spells;
