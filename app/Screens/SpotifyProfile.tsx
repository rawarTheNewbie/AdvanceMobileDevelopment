import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SpotifyProfile() {
  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={["#252525ff", "rgba(14, 14, 14, 1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.container}>
        {/* Profile Picture */}
        <View style={styles.avatar}>
          <Image
            source={require("@/assets/images/userProfile.jpg")} // 🔑 replace with your image
            style={styles.avatarImg}
          />
        </View>

        {/* Name */}
        <Text style={styles.name}>Monkey de Luffy</Text>
        {/* Email */}
        <Text style={styles.email}>monkeyluffy@email.com</Text>

        {/* Edit Button */}
        <LinearGradient
          colors={["#1ed760", "#0b7f3a"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.editWrap}
        >
          <TouchableOpacity style={styles.editButton} onPress={() => router.push("/SpotifyProfile")}>
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}

const FIELD_WIDTH = "80%";

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: "center", justifyContent: "center" },

  container: { alignItems: "center", gap: 12 },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden", // 🔑 ensures image stays inside the circle
    backgroundColor: "#222",
    marginBottom: 20,
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  name: { color: "#fff", fontSize: 24, fontWeight: "600" },
  email: { color: "#aaa", fontSize: 16 },

  editWrap: {
    width: FIELD_WIDTH,
    borderRadius: 28,
    overflow: "hidden",
    marginTop: 20,
    elevation: 6,
  },
  editButton: { paddingVertical: 14, alignItems: "center" },
  editText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
