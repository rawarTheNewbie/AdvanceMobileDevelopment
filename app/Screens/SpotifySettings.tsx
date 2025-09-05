// SpotifySettings.tsx
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function SpotifySettings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleLogout = () => {
    // TODO: clear auth/session if needed
    router.replace("/SpotifyLogin");
  };

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={["#252525ff", "rgba(14, 14, 14, 1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.container}>
        {/* Notifications */}
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View style={styles.rowIcon}>
              <AntDesign name="bells" size={20} color="#fff" />
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
              <AntDesign name="bulb1" size={20} color="#fff" />
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
    </View>
  );
}

const FIELD_WIDTH = "80%";

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  container: {
    alignSelf: "center",
    width: FIELD_WIDTH, // ✅ consistent 80% width
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
