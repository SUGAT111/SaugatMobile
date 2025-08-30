// components/SafeScreen.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import COLORS from "../constants/color";

export default function SafeScreen({ children }) {
  const insets = useSafeAreaInsets();

  // Wrap any direct string/number children in <Text>
  const safeChildren = React.Children.map(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      return <Text>{child}</Text>;
    }
    return child;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {safeChildren}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
