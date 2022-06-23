import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  Linking,
} from "react-native";

export default function App() {
  const [email, setEmail] = useState("");
  const [doc, setDoc] = useState("");
  const currentURL = new URL(window.location.href);
  const code = currentURL.searchParams.get("code");
  console.log(window.location.href);
  useEffect(() => {
    if (!code) {
      fetch("http://127.0.0.1:8000/token/")
        .then((response) => Linking.openURL(response.url))

        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  return <View>Test</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    marginBottom: 40,
    width: 300,
    height: 200,
    resizeMode: "stretch",
  },

  inputView: {
    backgroundColor: "#FFC0CB",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,

    alignItems: "center",
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
  },

  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#FF0000",
  },
});
