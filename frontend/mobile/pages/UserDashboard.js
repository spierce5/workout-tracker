import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
} from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  FlatList,
} from "react-native";
import Button from "../components/Button";
import AuthContext from "../context/AuthContext";

export default function UserDashboard({ navigation }) {
  const { user, signOut } = useContext(AuthContext);

  return (
    <View style={styles.view}>
      <Text style={styles.label}>Username:</Text>
      <Text>{user.username}</Text>
      <Text style={styles.label}>User ID:</Text>
      <Text>{user.id}</Text>
      <Text style={styles.label}>Email:</Text>
      <Text>{user.email}</Text>
      <Text style={styles.label}>Name:</Text>
      <Text>{user.name}</Text>
      <Text style={styles.label}>Token:</Text>
      <Text>{user.token}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flexDirection: "column",
    paddingTop: "20%",
    alignItems: "center",
    height: "100%",
    width: "70%",
    alignSelf: "center",
  },
  label: {
    fontSize: 24,
    fontWeight: "bold",
  },
  button: {
    marginBottom: 5,
  },
});
