import React, { useMemo, useReducer, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, ToastAndroid } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./pages/HomeScreen";
import Login from "./pages/Login";
import PasswordResetRequest from "./pages/PasswordResetRequest";
import UserDashboard from "./pages/UserDashboard";
import * as SecureStore from "expo-secure-store";
import { login } from "./services/UserService";
import AuthContext from "./context/AuthContext";

const Stack = createNativeStackNavigator();

export default function App() {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await SecureStore.getItemAsync("userToken");
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token
        const token = await login(data)
          .then((res) => {
            const { result, ok } = res;
            ToastAndroid.show(result.message, ToastAndroid.SHORT);
            if (ok) {
              return result.accessToken;
            }
          })
          .catch((err) => {
            throw new Error(err);
          });

        if (token) {
          await SecureStore.setItemAsync("userToken", token);
        }

        dispatch({ type: "SIGN_IN", token: token });
      },
      signOut: () => dispatch({ type: "SIGN_OUT" }),
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token

        dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          <>
            {state.userToken == null ? (
              <>
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{ title: "Welcome" }}
                />
                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{
                    title: "Login",
                    animationTypeForReplace: state.isSignout ? "pop" : "push",
                  }}
                />
                <Stack.Screen
                  name="PasswordResetRequest"
                  component={PasswordResetRequest}
                  options={{ title: "Forgot Password" }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="UserDashboard"
                  component={UserDashboard}
                  options={{ title: "Dashboard" }}
                />
              </>
            )}
          </>
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
