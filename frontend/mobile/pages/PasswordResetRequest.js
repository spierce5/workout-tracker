import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  // Button,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { requestPasswordReset } from "../services/UserService";
import Button from "../components/Button";

export default function PasswordResetRequest({ navigation }) {
  const [email, setEmail] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = useCallback(async () => {
    await requestPasswordReset(email).then((res) => {
      // ToastAndroid.show(res.message, ToastAndroid.SHORT);
      setResponse(res.message);
    });
  }, [email, setResponse]);

  const resetForm = useCallback(() => {
    setResponse(null);
  }, [setResponse]);

  return (
    <View style={styles.view}>
      {Boolean(!response) && (
        <>
          <Text style={styles.label}>Request Password Reset</Text>
          <TextInput
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="Email"
            inputMode="email"
            style={styles.input}
          />
          <View style={styles.actionContainer}>
            <Button
              onPress={handleSubmit}
              text="Submit"
              icon={<Ionicons name="send" size={24} color="white" />}
            />
          </View>
        </>
      )}
      {Boolean(response) && (
        <View style={[styles.view, styles.spacedView]}>
          <Text>{response}</Text>
          <Button
            onPress={() => navigation.navigate("Login")}
            text="Go to login"
          />
          <View>
            <Text>Didn't receive an email?</Text>
            <TouchableOpacity onPress={resetForm}>
              <Text style={styles.anchor}>Submit another request.</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  input: {
    height: 40,
    width: "100%",
    margin: 12,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  label: {
    fontSize: 24,
    fontWeight: "bold",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
  },
  anchor: {
    color: "mediumpurple",
  },
  spacedView: {
    justifyContent: "space-evenly",
    maxHeight: "40%",
  },
});
