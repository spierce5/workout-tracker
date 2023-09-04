import React, { useState, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { DefaultTheme } from "@react-navigation/native";

export default function SetupSection({ children }) {
  const styles = StyleSheet.create({
    container: {
      borderWidth: 2,
      borderRadius: 15,
      borderStyle: "solid",
      borderColor: "lightgray",
      height: 300,
      width: "100%",
      marginBottom: 10,
    },
    spacer: {
      position: "absolute",
      borderColor: DefaultTheme.colors.background,
      borderWidth: 10,
    },
    verticalSpacer: {
      position: "absolute",
      height: "102%",
      top: "-1%",
      width: "70%",
      left: "15%",
    },
    horizontalSpacer: {
      // display: "none",
      position: "absolute",
      height: "50%",
      top: "25%",
      left: "-1%",
      width: "102%",
      // backgroundColor: "gainsboro",
    },
    content: {
      position: "relative",
      padding: 20,
      height: "100%",
    },
  });

  return (
    <View style={styles.container}>
      <View style={[styles.spacer, styles.verticalSpacer]}></View>
      <View style={[styles.spacer, styles.horizontalSpacer]}></View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}
