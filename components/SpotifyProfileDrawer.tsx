import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SpotifyProfileDrawer() {
  // Replace with your actual user state if available
  const user = { name: "Spotify User", email: "user@email.com", avatarUri: undefined };

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Image
          source={
            user?.avatarUri
              ? { uri: user.avatarUri }
              : require("@/assets/images/userProfile.jpg")
          }
          style={styles.avatarImg}
        />
      </View>

      <Text style={styles.name}>{user?.name ?? "Spotify User"}</Text>
      <Text style={styles.email}>{user?.email ?? "user@email.com"}</Text>

      <LinearGradient
        colors={["#1ed760", "#0b7f3a"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.editWrap}
      >
        <TouchableOpacity style={styles.editButton} onPress={() => router.push("/Screens/SpotifyProfile")}>
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const FIELD_WIDTH = "80%";

const styles = StyleSheet.create({
  container: { alignItems: "center", gap: 12, width: "100%" },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    backgroundColor: "#222",
    marginBottom: 18,
  },
  avatarImg: { width: "100%", height: "100%", resizeMode: "cover" },
  name: { color: "#fff", fontSize: 22, fontWeight: "700" },
  email: { color: "#aaa", fontSize: 14 },
  editWrap: {
    width: FIELD_WIDTH,
    borderRadius: 28,
    overflow: "hidden",
    marginTop: 18,
    elevation: 6,
  },
  editButton: { paddingVertical: 14, alignItems: "center" },
  editText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
