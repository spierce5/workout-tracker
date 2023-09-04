import "react-native-gesture-handler";
import React, { useMemo, useReducer, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, ToastAndroid, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./pages/HomeScreen";
import Login from "./pages/Login";
import PasswordResetRequest from "./pages/PasswordResetRequest";
import UserDashboard from "./pages/UserDashboard";
import AccountSetup from "./pages/AccountSetup";
import * as SecureStore from "expo-secure-store";
import { login } from "./services/UserService";
import AuthContext from "./context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            user: action.user,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            user: action.user,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            user: null,
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
      let user;

      try {
        userToken = await SecureStore.getItemAsync("userToken");
        user = await SecureStore.getItemAsync("user");
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({
        type: "RESTORE_TOKEN",
        token: userToken,
        user: JSON.parse(user),
      });
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      user: {
        token: state.userToken,
        ...state.user,
      },
      signIn: async (data) => {
        const result = await login(data)
          .then((res) => {
            const { result, ok } = res;
            ToastAndroid.show(result.message, ToastAndroid.SHORT);
            if (ok) {
              return result;
            }
          })
          .catch((err) => {
            throw new Error(err);
          });

        if (result && result.accessToken) {
          await SecureStore.setItemAsync("userToken", result.accessToken);
          await SecureStore.setItemAsync("user", JSON.stringify(result.user));

          dispatch({
            type: "SIGN_IN",
            token: result.accessToken,
            user: result.user,
          });
        }
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
    [state.userToken]
  );

  const screenOptions = ({ navigation }) => ({
    headerTintColor: "mediumpurple",
    headerRight: () => {
      return (
        <TouchableOpacity
          onPress={() => navigation.navigate("AccountSetup")}
          style={styles.accountButton}
        >
          <MaterialIcons
            name={"account-circle"}
            color={"mediumpurple"}
            size={35}
          />
        </TouchableOpacity>
      );
    },
  });

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {state.userToken == null ? (
          <Stack.Navigator screenOptions={{ headerTintColor: "mediumpurple" }}>
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
          </Stack.Navigator>
        ) : (
          <Drawer.Navigator screenOptions={screenOptions}>
            <Drawer.Screen
              name="UserDashboard"
              component={UserDashboard}
              options={{
                title: "Dashboard",
              }}
            />
            <Drawer.Group
              screenOptions={{
                drawerItemStyle: { display: "none" },
              }}
            >
              <Drawer.Screen
                name="AccountSetup"
                component={AccountSetup}
                options={{
                  title: "Account",
                }}
              />
            </Drawer.Group>
          </Drawer.Navigator>
        )}
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
  accountButton: {
    paddingRight: 10,
  },
});
