import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// ✅ use the package SafeAreaView
import { SafeAreaView } from "react-native-safe-area-context";

export default function SpotifySettings() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleLogout = () => {
    // ✅ stay inside tabs so the bar doesn't disappear
    router.replace("/(tabs)/SpotifyLogin");
  };

  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={["rgba(14, 14, 14, 1)", "#252525ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={openDrawer} style={styles.menuBtn}>
          <Ionicons name="menu" size={30} color="#fff" />
        </Pressable>        
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 32 }} /> 
        {/* placeholder to keep title centered */}
      </View>

      {/* Content */}
      <View style={styles.container}>
        {/* Notifications */}
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View style={styles.rowIcon}>
              <Ionicons name="notifications-outline" size={20} color="#fff" />
            </View>
            <Text style={styles.rowLabel}>Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            thumbColor={notifications ? "#1ed760" : "#ccc"}
            trackColor={{ false: "#666", true: "#0c4124" }}
          />
        </View>

        {/* Dark Mode */}
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View style={styles.rowIcon}>
              <Ionicons name="bulb-outline" size={20} color="#fff" />
            </View>
            <Text style={styles.rowLabel}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            thumbColor={darkMode ? "#1ed760" : "#ccc"}
            trackColor={{ false: "#666", true: "#0c4124" }}
          />
        </View>

        {/* Logout */}
        <LinearGradient
          colors={["#1ed760", "#166d33ff"]}
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
  );
}

const FIELD_WIDTH = "80%";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#121212" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  menuBtn: {
    width:  30,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  headerTitle: {
    color: "#fff",
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
    backgroundColor: "#141414",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1f1f1f",
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { color: "#fff", fontSize: 16 },

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
