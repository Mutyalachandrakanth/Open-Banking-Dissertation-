import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
/* Home page of one-fin Apllication  */

const HomeScreen = ({ navigation, route }) => {
  return (
    <>
      <View style={styles.container}>
        <Image
          style={styles.tinyLogo}
          source={require("../assets/ONE-FIN.jpg")}
        />
        <Text style={styles.headding}>Hi Welcome </Text>
        <Text style={styles.subheadding}>
          ONE-FIN is an open banking service platform to provide new user
          experience in banking
        </Text>
        <Text style={styles.title}>
          Click here below and provide your OBP consent
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Authenticate", { code: null })}
        >
          <Image
            style={styles.hsbcImg}
            source={require("../assets/HSBC-Logo_600.png")}
          />
        </TouchableOpacity>
        <Text style={styles.bottomtext}>FAQ and Contact us</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  headding: {
    height: 60,
    fontWeight: "bold",
    fontSize: 35,
  },

  bottomtext: {
    height: 30,
    marginBottom: 30,
  },

  subheadding: {
    height: 280,
    color: "#808080",
    fontSize: 13,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#859a9b",
    borderRadius: 140,
    marginBottom: 40,
    shadowColor: "#808080",
    shadowOffset: { width: 200, height: 50 },
    shadowRadius: 200,
    shadowOpacity: 0.35,
    width: 120,
    height: 40,
  },
  hsbcImg: {
    width: 120,
    height: 40,
    shadowColor: "#808080",
    borderRadius: 140,
    shadowOffset: { width: 200, height: 50 },
  },
  tinyLogo: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    marginBottom: 60,
  },
  title: {
    textAlign: "center",
    marginVertical: 8,
  },
});

export default HomeScreen;
