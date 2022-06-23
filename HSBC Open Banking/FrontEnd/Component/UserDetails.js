import React from "react";
import { Image, Text, View, StyleSheet } from "react-native";
import Strong from "./Strong";

export default function UserDetails({ userAccounts }) {
  const userAccount = userAccounts[0];
  return (
    <View style={styles.userDetailsContainer}>
      <View style={styles.avatarContainer}>
        <Image
          style={styles.avatarImage}
          source={require("../assets/UserAvathar1.png")}
        />
      </View>
      <View>
        <Text style={styles.accountTitle}>
          Hi <Strong>{userAccount.Account[0].Name} </Strong>
          Welcome!
        </Text>
      </View>
      <View>
        <Text style={styles.accountText}>
          <Strong>Account Id :</Strong> {userAccount.AccountId}
        </Text>
      </View>
      <View>
        <Text style={styles.accountText}>
          <Strong>Currency</Strong> : {userAccount.Currency}
        </Text>
      </View>
      <View>
        <Text style={styles.accountText}>
          <Strong>AccountType :</Strong> {userAccount.AccountType}
        </Text>
      </View>
      <View>
        <Text style={styles.accountText}>
          <Strong>Description :</Strong> {userAccount.Description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    marginTop: 30,
    marginBottom: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    height: 150,
    width: 150,
    borderRadius: 150 / 2,
    overflow: "hidden",
  },
  userDetailsContainer: {
    fontSize: 1,
    display: "flex",
    justifyContent: "center",
  },
  accountText: {
    fontSize: 20,
    textAlign: "left",
    marginLeft: 20,
  },
  accountTitle: {
    fontSize: 30,
    marginBottom: 40,
    textAlign: "center",
  },
});
