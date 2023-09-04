import React, { useState, useCallback, useEffect } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Button(props) {
  const styles = StyleSheet.create({
    button: {
      flexDirection: "row",
      borderRadius: 5,
      padding: 5,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "mediumpurple",
      ...props.buttonStyle,
    },
    buttonText: {
      fontWeight: "bold",
      color: "white",
      ...props.textStyle,
    },
  });

  return (
    <TouchableOpacity style={styles.button} onPress={props.onPress}>
      <Text style={styles.buttonText}>{props.text}</Text>
      {props.icon}
    </TouchableOpacity>
  );
}
