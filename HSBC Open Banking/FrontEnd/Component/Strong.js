import React from "react";
import { Text } from "react-native";
/* component for resusable */

export default function Strong(props) {
  return <Text style={{ fontWeight: "bold" }}>{props.children}</Text>;
}
