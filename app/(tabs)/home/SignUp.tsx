import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUp() {
  const [gender, setGender] = useState<"male" | "female" | null>(null);

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={["#252525ff", "rgba(14, 14, 14, 1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/spotifyLogo.png")}
            style={styles.logo}
            contentFit="contain"
          />
          <Text style={styles.title}>Spotify</Text>
        </View>

        {/* Inputs */}
        <GradientInput placeholder="Email Address" />
        <GradientInput placeholder="Full Name" />
        <GradientInput placeholder="Password" secureTextEntry />

        {/* DOB */}
        <View style={styles.dobRow}>
          <Text style={styles.dobLabel}>Date Of Birth :</Text>
          <View style={styles.dobFields}>
            <SmallGradientInput placeholder="DD" maxLength={2} />
            <SmallGradientInput placeholder="MM" maxLength={2} />
            <SmallGradientInput placeholder="YY" maxLength={2} />
          </View>
        </View>

        {/* Gender */}
        <View style={styles.genderRow}>
          {/* Male */}
          <LinearGradient
            colors={["#0b0b0b", "#232323"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.genderWrap}
          >
            <TouchableOpacity
              style={[styles.genderPill, gender === "male" && styles.genderPillActive]}
              onPress={() => setGender("male")}
            >
              <Text style={[styles.genderText, gender === "male" && styles.genderTextActive]}>
                Male
              </Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Female */}
          <LinearGradient
            colors={["#0b0b0b", "#232323"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.genderWrap}
          >
            <TouchableOpacity
              style={[styles.genderPill, gender === "female" && styles.genderPillActive]}
              onPress={() => setGender("female")}
            >
              <Text style={[styles.genderText, gender === "female" && styles.genderTextActive]}>
                Female
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* CTA */}
        <LinearGradient
          colors={["#1ed760", "#166d33ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.ctaWrap}
        >
          <TouchableOpacity style={styles.ctaButton} onPress={() => router.replace("/SpotifyLogin")}>
            <Text style={styles.ctaText}>Sign Up</Text>
          </TouchableOpacity>         
          
        </LinearGradient>

        {/* Social */}
        <Text style={styles.signUpWith}>Sign Up With</Text>
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialCircle}>
            <FontAwesome name="facebook" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialCircle}>
            <AntDesign name="google" size={28} color="#fff" />
          </TouchableOpacity>
        </View>        

        {/* Bottom */}
        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Already have an account? </Text>     

          <TouchableOpacity onPress={() => router.replace("/SpotifyLogin")}>
            <Text style={styles.bottomLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

/* Custom Inputs */
function GradientInput(props: { placeholder: string; secureTextEntry?: boolean }) {
  return (
    <LinearGradient
      colors={["#0b0b0b", "#232323"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={s.giWrap}
    >
      <TextInput
        style={s.giInput}
        placeholder={props.placeholder}
        placeholderTextColor="#777"
        secureTextEntry={props.secureTextEntry}
      />
    </LinearGradient>
  );
}

function SmallGradientInput(props: { placeholder: string; maxLength?: number }) {
  return (
    <LinearGradient
      colors={["#0b0b0b", "#232323"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={s.smallWrap}
    >
      <TextInput
        style={s.smallInput}
        placeholder={props.placeholder}
        placeholderTextColor="#777"
        keyboardType="number-pad"
        maxLength={props.maxLength}
      />
    </LinearGradient>
  );
}

/* Shared Width */
const FIELD_WIDTH = "80%";

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { alignItems: "center", paddingTop: 40, paddingBottom: 40, gap: 18 },

  header: {
    width: FIELD_WIDTH,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 50,
    marginTop: 50
  },
  logo: { width: 60, height: 60},
  title: { color: "#fff", fontSize: 40, fontWeight: "500", letterSpacing: 1 },

  dobRow: { width: FIELD_WIDTH, gap: 10 },
  dobLabel: { color: "#20c05a", fontSize: 16, marginBottom: 2 },
  dobFields: { flexDirection: "row", gap: 10 },

  genderRow: {
    width: FIELD_WIDTH,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20, // spacing between the two
  },

  genderWrap: {
    flex: 1, // both buttons take equal space
    borderRadius: 22,
    overflow: "hidden",
  },

  genderPill: {
    paddingVertical: 10,
    alignItems: "center",
  },

  genderPillActive: {
    backgroundColor: "#0c4124",
    borderWidth: 2,
    borderRadius: 22,
    borderColor: "#1ed760",
  },

  genderText: { color: "#bdbdbd", fontSize: 16 },
  genderTextActive: { color: "#1ed760", fontWeight: "600" },

  ctaWrap: { 
    width: FIELD_WIDTH, 
    borderRadius: 25,
    overflow: "hidden", 
    marginTop: 8, 
    elevation: 6,
    paddingHorizontal: 16,
    paddingVertical: 2,    
},
  ctaButton: { paddingVertical: 14, alignItems: "center" },
  ctaText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "700" 
  },
  

  signUpWith: { 
    color: "#18b857",
    fontSize: 16,
    textAlign: "center",
    paddingTop: -20,
  },

  socialRow: { 
    width: FIELD_WIDTH,   
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  
  socialCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },

  bottomRow: { width: FIELD_WIDTH, flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 6 },
  bottomText: { color: "#9a9a9a", fontSize: 15 },
  bottomLink: {    
    color: "#1ed760",
    fontSize: 16,
    fontWeight: "bold",},
});

const s = StyleSheet.create({
  giWrap: {
    width: FIELD_WIDTH,
    borderRadius: 24,
    overflow: "hidden",
    paddingHorizontal: 16,
    paddingVertical: 2,
    alignSelf: "center",
  },
  giInput: { color: "#fff", fontSize: 16, paddingVertical: 12 },

  smallWrap: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingVertical: 2,
  },
  smallInput: { color: "#fff", fontSize: 16, textAlign: "center", paddingVertical: 10 },
});
