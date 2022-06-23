import React from "react";
import { Text, View } from "react-native";
import UserDetails from "./UserDetails";

export default function UserScreen({ userAccounts }) {
  if (!userAccounts.length) {
    return <Text>Loading... </Text>;
  }
  return (
    <View>
      <UserDetails userAccounts={userAccounts} />
    </View>
  );
}
