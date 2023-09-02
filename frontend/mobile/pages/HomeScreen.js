import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Button from "../components/Button";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.mainView}>
      <View style={styles.buttonGroup}>
        <Button
          text="Login"
          onPress={() => navigation.navigate("Login")}
          buttonStyle={styles.button}
        />
        <Button
          text="Sign Up"
          onPress={() => navigation.navigate("Signup")}
          buttonStyle={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  buttonGroup: {
    width: "33%",
  },
  button: {
    marginBottom: 5,
  },
});
