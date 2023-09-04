import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SectionList,
} from "react-native";

export default function PopupMenu(props) {
  const styles = StyleSheet.create({
    popup: {
      display: props.open ? "block" : "none",
    },
  });

  const DATA = [
    {
      title: "Main dishes",
      data: ["Pizza", "Burger", "Risotto"],
    },
    {
      title: "Sides",
      data: ["French Fries", "Onion Rings", "Fried Shrimps"],
    },
  ];

  const renderItem = ({ item }) => {
    <TouchableOpacity>
      <Text>{item}</Text>
    </TouchableOpacity>;
  };

  return (
    <Modal visible={props.open}>
      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={renderItem}
      />
    </Modal>
  );
}
