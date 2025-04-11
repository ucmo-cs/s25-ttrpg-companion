import React from 'react';
import {Text,View,TextInput,StyleSheet,Button,Alert,Platform,Image,Pressable} from "react-native";

interface CombatProps {
  test: string;
}

const Combat = (props: CombatProps) => {
  return (
    <View>{props.test}</View>
  );
};

export default Combat;
