import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UserScreen from "./UserScreen";
import AccountsTab from "./AccountsTab";
import { Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import TransactionsTab from "./TransactionsTab";
import Strong from "./Strong";

const Tab = createBottomTabNavigator();

const SingnOutButton = ({ navigation }) => {
  return (
    <TouchableOpacity
      style={styles.signoutButton}
      onPress={() => navigation.navigate("Home", { code: null })}
    >
      <Text style={styles.textb}>
        <Strong>SignOut</Strong>
      </Text>
    </TouchableOpacity>
  );
};

export default function UserAccount({ route, navigation }) {
  const { backEndCode } = route.params;
  const [userAccountDetails, setUserAccountDetails] = useState();
  const [userAccounts, setUserAccounts] = useState([]);

  useEffect(() => {
    if (backEndCode) {
      fetch("http://10.0.2.2:8000/user-request/", {
        headers: { "x-access-code": backEndCode },
      }).then((response) => {
        if (response.ok) {
          response.json().then((json) => setUserAccounts(json?.Data?.Account));
        } else {
          navigation.navigate("Home");
        }
      });
    }
  }, []);
  useEffect(() => {
    if (!userAccountDetails) {
      fetch("http://10.0.2.2:8000/balances/", {
        headers: { "x-access-code": backEndCode },
      }).then((response) => {
        if (response.ok) {
          response.json().then((json) => {
            setUserAccountDetails(json);
          });
        } else {
          navigation.navigate("Home");
        }
      });
    }
  }, []);
  console.log("userAccounts", userAccounts);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Profile"
        options={{
          tabBarIcon: () => (
            <Image
              style={styles.tabIcon}
              source={require("../assets/UserAvathar1.png")}
            />
          ),
          headerRight: () => <SingnOutButton navigation={navigation} />,
        }}
      >
        {() => <UserScreen userAccounts={userAccounts} />}
      </Tab.Screen>
      <Tab.Screen
        name="Balance"
        options={{
          tabBarIcon: () => (
            <Image
              style={styles.tabIcon}
              source={require("../assets/Balance.png")}
            />
          ),
          headerRight: () => <SingnOutButton navigation={navigation} />,
        }}
      >
        {() => (
          <AccountsTab balances={userAccountDetails?.balances?.Data?.Balance} />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Transactions"
        options={{
          tabBarIcon: () => (
            <Image
              style={styles.tabIcon}
              source={require("../assets/Transfer.png")}
            />
          ),
          headerRight: () => <SingnOutButton navigation={navigation} />,
        }}
      >
        {() => (
          <TransactionsTab
            transactions={userAccountDetails?.transactions?.Data?.Transaction}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 30,
    height: 30,
  },
  signoutButton: {
    backgroundColor: "#F8F8F8",
    color: "black",
    borderRadius: 40 / 2,
  },
  textb: {
    fontSize: 20,
    color: "grey",
  },
});
