import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import Strong from "./Strong";

export default function TransactionsTab({ transactions }) {
  if (!transactions) {
    return <Text>Loading...</Text>;
  }
  return (
    <View>
      <View style={styles.avatarContainer}>
        <Image
          style={styles.TransferImage}
          source={require("../assets/Transfer.png")}
        />
      </View>
      {transactions.map((transaction) => (
        <View
          style={styles.transactionsTabtext}
          key={transaction.TransactionId}
        >
          <Text style={styles.transferText}>
            <Strong>AccountId:</Strong> {transaction.AccountId}
          </Text>
          <Text style={styles.transferText}>
            <Strong>Amount:</Strong> {transaction.Amount.Amount}{" "}
            {transaction.Amount.Currency}
          </Text>
          <Text style={styles.transferText}>
            <Strong>Type:</Strong> {transaction.CreditDebitIndicator}
          </Text>
          <Text style={styles.transferText}>
            <Strong>Status:</Strong> {transaction.Status}
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
  TransferImage: {
    height: 150,
    width: 150,
    borderRadius: 150 / 2,
    overflow: "hidden",
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  transferText: {
    fontSize: 18,
    textAlign: "left",
    marginLeft: 100,
    marginBottom: 1,
  },
  transactionsTabtext: {
    marginBottom: 10,
  },
});
