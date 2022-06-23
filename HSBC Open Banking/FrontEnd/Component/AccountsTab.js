import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import Strong from "./Strong";
/* User Account details page  */

export default function AccountsTab({ balances }) {
  console.log(balances);
  if (!balances) {
    return <Text>Loading...</Text>;
  }
  return (
    <View>
      <View style={styles.avatarContainer}>
        <Image
          style={styles.avatarImage}
          source={require("../assets/Balance.png")}
        />
      </View>
      {balances.map((balance) => (
        <View key={balance.DateTime}>
          <Text style={styles.balanceText}>
            <Strong>AccountId:</Strong> {balance.AccountId}
          </Text>
          <Text style={styles.balanceText}>
            <Strong>Balance:</Strong> {balance.Amount.Currency}
            {" " + balance.Amount.Amount}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    marginTop: 30,
    marginBottom: 20,
    display: "flex",
    alignItems: "center",
  },
  avatarImage: {
    height: 130,
    width: 130,
    overflow: "hidden",
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  balanceText: {
    fontSize: 25,
    textAlign: "left",
    marginLeft: 60,
  },
});
