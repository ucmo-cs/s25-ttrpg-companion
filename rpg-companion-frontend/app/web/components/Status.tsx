import React from 'react';
import {Text,View,TextInput,StyleSheet,Button,Alert,Platform,Image,Pressable} from "react-native";

interface StatusProps {
  test: string;
}

const Status = (props: StatusProps) => {
  return (
    <View>{props.test}</View>
  );
};

export default Status;
