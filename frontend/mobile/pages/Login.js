import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  // Button,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "../components/Button";
import AuthContext from "../context/AuthContext";

export default function Login({ navigation }) {
  const { signIn } = useContext(AuthContext);
  const [userInput, setUserInput] = useState({
    username: "",
    password: "",
  });
  const [passVisible, setPassVisible] = useState(true);

  const handleChange = useCallback(
    (e) => {
      const updatedValue = { ...userInput };
      updatedValue[e._dispatchInstances.memoizedProps.name] =
        e.nativeEvent.text;
      setUserInput(updatedValue);
    },
    [userInput, setUserInput]
  );

  const handleLogin = async () => {
    signIn(userInput);
  };

  const togglePassVisibility = useCallback(() => {
    setPassVisible(!passVisible);
  }, [passVisible, setPassVisible]);

  return (
    <View style={styles.view}>
      <Text style={styles.label}>Login</Text>
      <TextInput
        name="username"
        value={userInput.username}
        onChange={handleChange}
        placeholder="Username"
        style={styles.input}
      ></TextInput>
      <View style={[styles.input, styles.passwordContainer]}>
        <TouchableOpacity
          style={styles.showPassword}
          onPress={togglePassVisibility}
        >
          <Feather
            name={passVisible ? "eye" : "eye-off"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
        <TextInput
          name="password"
          value={userInput.password}
          onChange={handleChange}
          placeholder="Password"
          secureTextEntry={passVisible}
          style={styles.password}
        ></TextInput>
      </View>
      <View style={styles.actionContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("PasswordResetRequest")}
        >
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>
        <Button
          onPress={handleLogin}
          text="Login"
          icon={<MaterialCommunityIcons name="login" size={24} color="white" />}
        />
      </View>
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
  passwordContainer: {
    flexDirection: "row-reverse",
  },
  password: {
    flexGrow: 1,
    overflow: "scroll",
    maxWidth: "90%",
  },
  showPassword: {
    alignSelf: "center",
    justifySelf: "flex-end",
  },
  label: {
    fontSize: 24,
    fontWeight: "bold",
  },
  loginButton: {
    flexDirection: "row",
    // borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    alignItems: "center",
    backgroundColor: "mediumpurple",
  },
  loginButtonText: {
    fontWeight: "bold",
    color: "white",
  },
  forgotPasswordText: {
    color: "mediumpurple",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
});
