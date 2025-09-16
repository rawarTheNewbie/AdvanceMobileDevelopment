// app/signin.tsx
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignIn() {
  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={["#252525ff", "rgba(14, 14, 14, 1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.headerContainer}>
        <Image
          source={require("@/assets/images/spotifyLogo.png")}
          style={styles.spotifyLogo}
          contentFit="contain"
        />
        <Text style={styles.headerTitle}>Spotify</Text>
      </View>


      <View style={styles.inputContainer}>
        <LinearGradient
          colors={["#0b0b0b", "#232323"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientInput}
        >
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#575757ff"
          />
        </LinearGradient>

        <LinearGradient
          colors={["#0b0b0b", "#232323"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientInput}
        >
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#575757ff"
            secureTextEntry
          />
        </LinearGradient>

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>

        <LinearGradient
          colors={["#1ed760", "#166d33ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientInput}
        >
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push("/(tabs)/(drawer)/SpotifyPlaylists")  } 
            >
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>
        </LinearGradient>


        <Text style={styles.correctWith}>Be Correct With</Text>
        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="facebook" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <AntDesign name="google" size={28} color="#fff" />
          </TouchableOpacity>
        </View>


        <View style={styles.signUpRow}>
          <Text style={styles.signUpText}>Don’t have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/home/SignUp")}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    paddingTop: 80,
  },

  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },

  spotifyLogo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 50, 
    fontWeight: "500",
    letterSpacing: 1,
  },

  inputContainer: {
    width: "80%",
    marginTop: 80,
  },

  gradientInput: {
      borderRadius: 25,
      marginBottom: 15,
      overflow: "hidden",
      paddingHorizontal: 16,
      paddingVertical: 2,
  },

  input: {
    color: "#fff",
    fontSize: 18,
    paddingVertical: 14,
    letterSpacing: 0.5,
  },

  forgotPassword: {
    color: "#575757ff",
    fontSize: 16,
    textAlign: "right",
    marginBottom: 32,
  },

  loginButton: {
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: "center",
  },

  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 8,
  },

  correctWith: {
    color: "#18b857",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 14,
  },

  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 24,
  },

  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },

  signUpRow: {
    flexDirection: "row",
    justifyContent: "center",
  },

  signUpText: {
    color: "#888",
    fontSize: 16,
  },

  signUpLink: {
    color: "#1ed760",
    fontSize: 16,
    fontWeight: "bold",
  },
});
