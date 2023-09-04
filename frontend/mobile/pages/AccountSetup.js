import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "../components/Button";
import SetupSection from "../components/SetupSection";
import AuthContext from "../context/AuthContext";

export default function AccountSetup({ navigation }) {
  const { user, signOut } = useContext(AuthContext);

  const [userSetup, setUserSetup] = useState({
    username: user.username,
    name: user.name,
    email: user.email,
  });

  const handleChange = useCallback(
    (e) => {
      const updatedValue = { ...userSetup };
      updatedValue[e._dispatchInstances.memoizedProps.name] =
        e.nativeEvent.text;
      setUserSetup(updatedValue);
    },
    [userSetup, setUserSetup]
  );

  return (
    <ScrollView contentContainerStyle={styles.view}>
      <Text style={styles.sectionHeader}>User Info</Text>
      <SetupSection>
        <View style={styles.field}>
          <Text>Username: </Text>
          <TextInput
            name="username"
            value={userSetup.username}
            onChange={handleChange}
          ></TextInput>
        </View>
        <View style={styles.field}>
          <Text>Name: </Text>
          <TextInput
            name="name"
            value={userSetup.name}
            onChange={handleChange}
          ></TextInput>
        </View>
        <View style={styles.field}>
          <Text>Email: </Text>
          <TextInput
            name="email"
            value={userSetup.email}
            onChange={handleChange}
          ></TextInput>
        </View>
        <View style={styles.test}>
          <Button text="Logout" buttonStyle={styles.logout} onPress={signOut} />
        </View>
      </SetupSection>
      <Text style={styles.sectionHeader}>App Settings</Text>
      <SetupSection></SetupSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  view: {
    flexDirection: "column",
    paddingTop: "5%",
    paddingHorizontal: "5%",
    alignItems: "center",
    minHeight: "150%",
    width: "100%",
    alignSelf: "center",
  },
  sectionHeader: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  field: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  test: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    flexGrow: 1,
  },
});
