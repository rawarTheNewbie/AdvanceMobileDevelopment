import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../src/store";
import { setAccent, setPreset, toggleMode } from "../../../src/store/themeSlice";
import AnimatedThemeView from "../../../src/theme/AnimatedThemeView";

const FIELD_WIDTH = "80%";
const SWATCHES = ["#1DB954", "#FF6B6B", "#FFD166", "#06B6D4", "#9B5DE5", "#22C55E"]; 

export default function SpotifySettings() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Example of a non-persisted setting
  const [notifications, setNotifications] = useState(true);

  // Theme from Redux
  const { mode, colors, accent } = useSelector((s: RootState) => s.theme);

  const handleLogout = () => router.replace("/(tabs)/SpotifyLogin");
  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

  // Recompute styles when theme colors change
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <AnimatedThemeView>
      <SafeAreaView style={styles.safe}>
        {/* soft overlay gradient that respects the theme */}
        <LinearGradient
          colors={[colors.background, colors.card]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={openDrawer} style={styles.menuBtn}>
            <Ionicons name="menu" size={30} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Content */}
        <View style={styles.container}>
          {/* Notifications */}
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}>
                <Ionicons name="notifications-outline" size={20} color={colors.text} />
              </View>
              <Text style={styles.rowLabel}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              thumbColor={notifications ? colors.accent : "#ccc"}
              trackColor={{ false: "#666", true: "#00000044" }}
            />
          </View>

          {/* Dark / Light toggle */}
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}>
                <Ionicons name="bulb-outline" size={20} color={colors.text} />
              </View>
              <Text style={styles.rowLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={mode === "dark"}
              onValueChange={() => dispatch(toggleMode())}
              thumbColor={mode === "dark" ? colors.accent : "#ccc"}
              trackColor={{ false: "#666", true: "#00000044" }}
            />
          </View>

          {/* Preset buttons */}
          <View style={{ flexDirection: "row", gap: 8, marginVertical: 6 }}>
            {(["light", "dark", "custom"] as const).map((preset) => (
              <TouchableOpacity
                key={preset}
                style={[
                  styles.presetBtn,
                  { backgroundColor: mode === preset ? colors.accent : colors.card },
                ]}
                onPress={() => dispatch(setPreset(preset))}
              >
                <Text
                  style={{
                    color: mode === preset ? "#fff" : colors.text,
                    fontWeight: "700",
                  }}
                >
                  {preset.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Accent picker */}
          <Text style={[styles.rowLabel, { marginTop: 8, marginBottom: 6 }]}>
            Accent Color
          </Text>
          <FlatList
            data={SWATCHES}
            keyExtractor={(c) => c}
            numColumns={6}
            columnWrapperStyle={{ gap: 10 }}
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => dispatch(setAccent(item))}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                  backgroundColor: item,
                  borderWidth: item === accent ? 3 : 1,
                  borderColor: item === accent ? "#fff" : "#00000022",
                }}
              />
            )}
          />

          {/* Logout */}
          <LinearGradient
            colors={[colors.accent, `${colors.accent}dd`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.logoutWrap}
          >
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </SafeAreaView>
    </AnimatedThemeView>
  );
}

function makeStyles(colors: {
  background: string;
  card: string;
  text: string;
  muted: string;
  accent: string;
}) {
  return StyleSheet.create({
    safe: { flex: 1 },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 20,
    },
    menuBtn: {
      width: 30,
      height: 45,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 16,
    },
    headerTitle: {
      color: colors.text,
      fontSize: 22,
      fontWeight: "700",
      letterSpacing: 0.5,
    },
    container: {
      alignSelf: "center",
      width: FIELD_WIDTH,
      gap: 8,
      paddingBottom: 40,
    },
    row: {
      width: "100%",
      backgroundColor: colors.card,
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 14,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 6,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "#00000022",
    },
    rowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    rowIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "#1f1f1f20",
      alignItems: "center",
      justifyContent: "center",
    },
    rowLabel: { color: colors.text, fontSize: 16 },
    presetBtn: {
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#00000022",
    },
    logoutWrap: {
      width: "100%",
      borderRadius: 28,
      overflow: "hidden",
      marginTop: 18,
      elevation: 6,
    },
    logoutBtn: {
      paddingVertical: 14,
      alignItems: "center",
    },
    logoutText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  });
}
