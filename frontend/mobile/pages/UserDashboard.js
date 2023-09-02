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
  DrawerLayoutAndroid,
  FlatList,
} from "react-native";
import Button from "../components/Button";
import AuthContext from "../context/AuthContext";

export default function UserDashboard({ navigation }) {
  const { signOut } = useContext(AuthContext);
  const drawer = useRef(null);

  const navOptions = [
    {
      id: "workouts",
      text: "Workouts",
    },
    {
      id: "assessments",
      text: "Assessments",
    },
  ];

  const listItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => console.log(`nav to ${item.id}`)}
        style={styles.listItem}
      >
        <Text style={styles.listItemText}>{item.text}</Text>
      </TouchableOpacity>
    );
  };

  const navigationView = () => (
    <View style={styles.navView}>
      <FlatList
        data={navOptions}
        renderItem={listItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={300}
      drawerPosition={"left"}
      renderNavigationView={navigationView}
    >
      <View style={styles.view}>
        <Text style={styles.label}>Dashboard</Text>
        <Button
          text="Open drawer"
          onPress={() => drawer.current.openDrawer()}
        />
        <Button text="Logout" onPress={signOut} />
      </View>
    </DrawerLayoutAndroid>
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
  navView: {
    width: "100%",
    padding: 20,
  },
  listItem: {
    width: "75%",
    backgroundColor: "lavender",
    borderRadius: 5,
    marginBottom: "5%",
  },
  listItemText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
