// app/(drawer)/_layout.tsx
import { Drawer } from "expo-router/drawer";
import React from "react";
import { StyleSheet } from "react-native";

// app/(drawer)/_layout.tsx
export default function DrawerLayout() {
  return (
    <Drawer
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        drawerPosition: "right",
        swipeEdgeWidth: 40,
        drawerStyle: { width: "80%", backgroundColor: "#0f0f0f" },
        overlayColor: "rgba(0,0,0,0.5)",
      }}
      // ...
    />
  );
}


const styles = StyleSheet.create({
  drawerContainer: { flex: 1, paddingTop: 60, alignItems: "center" },
});
