import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import Animated, {
    FadeIn,
    FadeInDown,
    FadeOutUp,
    Layout,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// Storage keys
const STORAGE_KEY = "@profile_form_cache:v1";      // draft cache (autosave)
const PROFILE_PERSIST_KEY = "@profile_persist:v1"; // final saved profile

const GENRES = ["", "Pop", "Rock", "Jazz", "Classical", "Hip-Hop"] as const;
type Genre = (typeof GENRES)[number];

type FormState = { username: string; email: string; genre: Genre; avatar?: string };
type FormErrors = { username?: string; email?: string; genre?: string };

const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(state: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!usernameRegex.test(state.username)) {
    errors.username = "Username must be 3–20 characters (letters, numbers, underscores).";
  }
  if (!emailRegex.test(state.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!state.genre) {
    errors.genre = "Please select a genre.";
  }
  return errors;
}

const ProfilePreview = React.memo(function ProfilePreview({
  username,
  email,
  genre,
  avatar,
}: {
  username: string;
  email: string;
  genre: Genre;
  avatar?: string;
}) {
  if (!username && !email && !genre && !avatar) return null;
  const imageUrl =
    avatar || `https://via.placeholder.com/100?text=${encodeURIComponent(genre || "User")}`;
  return (
    <Animated.View entering={FadeIn.duration(250)} layout={Layout.springify()} style={styles.previewCard}>
      <View style={styles.previewRow}>
        <Image source={{ uri: imageUrl }} style={styles.previewAvatar} />
        <View style={styles.previewTextCol}>
          <Text style={styles.previewName}>{username || "Your name"}</Text>
          <Text style={styles.previewEmail}>{email || "your@email.com"}</Text>
          <Text style={styles.previewGenre}>{genre || "Select a genre"}</Text>
        </View>
      </View>
    </Animated.View>
  );
});

export default function SpotifyProfileForm() {
  const [form, setForm] = useState<FormState>({ username: "", email: "", genre: "" });
  const [errors, setErrors] = useState<FormErrors>({});

  // Shake anim values
  const shakeU = useSharedValue(0);
  const shakeE = useSharedValue(0);
  const shakeG = useSharedValue(0);
  const rShakeU = useAnimatedStyle(() => ({ transform: [{ translateX: shakeU.value }] }));
  const rShakeE = useAnimatedStyle(() => ({ transform: [{ translateX: shakeE.value }] }));
  const rShakeG = useAnimatedStyle(() => ({ transform: [{ translateX: shakeG.value }] }));

  // Restore draft
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setForm(JSON.parse(raw));
      } catch {
        // ignore
      }
    })();
  }, []);

  // Autosave draft (debounced)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(form)).catch(() => {});
    }, 250);
    return () => saveTimer.current && clearTimeout(saveTimer.current);
  }, [form]);

  // Live validation
  useEffect(() => {
    setErrors(validate(form));
  }, [form.username, form.email, form.genre]);

  const triggerShake = (which: "u" | "e" | "g") => {
    const target = which === "u" ? shakeU : which === "e" ? shakeE : shakeG;
    target.value = withSequence(
      withTiming(-6, { duration: 60 }),
      withTiming(6, { duration: 60 }),
      withTiming(-4, { duration: 50 }),
      withTiming(4, { duration: 50 }),
      withTiming(0, { duration: 80 })
    );
  };

  const onChange = useCallback(<K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  }, []);

  // Pick image from gallery
  const pickImage = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Please allow access to your photos to change the profile image.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });
      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        onChange("avatar", result.assets[0].uri);
      }
    } catch {
      Alert.alert("Error", "Could not open photo library.");
    }
  }, [onChange]);

  const onSubmit = async () => {
    const v = validate(form);
    setErrors(v);
    if (v.username) triggerShake("u");
    if (v.email) triggerShake("e");
    if (v.genre) triggerShake("g");
    if (Object.keys(v).length > 0) return;

    // Persist final profile (including avatar)
    await AsyncStorage.setItem(
      PROFILE_PERSIST_KEY,
      JSON.stringify({
        username: form.username,
        email: form.email,
        genre: form.genre,
        avatar: form.avatar,
      })
    );

    // Clear draft + reset
    await AsyncStorage.removeItem(STORAGE_KEY);
    setForm({ username: "", email: "", genre: "", avatar: undefined });

    Alert.alert("Saved", "Profile updated.", [{ text: "OK", onPress: () => router.back() }]);
  };

  const disabled = !form.username || !form.email || !form.genre;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <LinearGradient
          colors={["rgba(14, 14, 14, 1)", "#252525ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientFill}
        />

        {/* Top bar with back */}
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </Pressable>
          <Text style={styles.topTitle}>Edit Profile</Text>
          <View style={styles.iconBtn} />
        </View>

        {/* Centered card */}
        <View style={styles.centerWrap}>
          <View style={styles.card}>
            {/* Avatar + Change Photo */}
            <View style={styles.avatarWrap}>
              <Image
                source={{
                  uri:
                    form.avatar ||
                    `https://via.placeholder.com/120?text=${encodeURIComponent(form.genre || "User")}`,
                }}
                style={styles.avatar}
              />
              <Pressable style={styles.changeBtn} onPress={pickImage}>
                <Ionicons name="image-outline" size={16} color="#fff" />
                <Text style={styles.changeText}>Change Photo</Text>
              </Pressable>
            </View>

            {/* Title */}
            <Text style={styles.title}>Profile Details</Text>

            {/* Username */}
            <Animated.View style={[styles.fieldWrap, rShakeU]}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={form.username}
                onChangeText={(t) => onChange("username", t)}
                placeholder="your_username"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                returnKeyType="next"
              />
              {errors.username && (
                <Animated.Text entering={FadeInDown} exiting={FadeOutUp} style={styles.error}>
                  {errors.username}
                </Animated.Text>
              )}
            </Animated.View>

            {/* Email */}
            <Animated.View style={[styles.fieldWrap, rShakeE]}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={form.email}
                onChangeText={(t) => onChange("email", t)}
                placeholder="name@example.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
              />
              {errors.email && (
                <Animated.Text entering={FadeInDown} exiting={FadeOutUp} style={styles.error}>
                  {errors.email}
                </Animated.Text>
              )}
            </Animated.View>

            {/* Genre */}
            <Animated.View style={[styles.fieldWrap, rShakeG]}>
              <Text style={styles.label}>Favorite Genre</Text>
              <View style={styles.pickerBox}>
                <Picker
                  selectedValue={form.genre}
                  onValueChange={(v) => onChange("genre", v as Genre)}
                  dropdownIconColor="#0055ffff"
                  style={styles.picker}
                >
                  {GENRES.map((g) => (
                    <Picker.Item
                      key={g || "none"}
                      label={g || "Select a genre"}
                      value={g}
                      color={g ? "black" : "black"}
                    />
                  ))}
                </Picker>
              </View>
              {errors.genre && (
                <Animated.Text entering={FadeInDown} exiting={FadeOutUp} style={styles.error}>
                  {errors.genre}
                </Animated.Text>
              )}
            </Animated.View>

            {/* Submit */}
            <Pressable
              style={[styles.submitBtn, disabled && styles.btnDisabled]}
              disabled={disabled}
              onPress={onSubmit}
            >
              <Text style={styles.submitText}>Save Profile</Text>
            </Pressable>

            {/* Live Preview */}
            <ProfilePreview
              username={form.username}
              email={form.email}
              genre={form.genre}
              avatar={form.avatar}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const colors = {
  card: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.08)",
  surface: "#2a2a2a",
  text: "#E5E7EB",
  sub: "#E5E7EB",
  red: "#EF4444",
  green: "#10B981",
};

const AVATAR_SIZE = 120;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#121212" },
  flex: { flex: 1 },
  gradientFill: StyleSheet.absoluteFillObject as any,

  topBar: {
    height: 44,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  iconBtn: {
    width: 40,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  topTitle: { color: "#fff", fontWeight: "800", fontSize: 16 },

  centerWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 20,
  },

  avatarWrap: {
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "#1f1f1f",
  },
  changeBtn: {
    marginTop: 10,
    backgroundColor: "#2a2a2a",
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  changeText: { color: "#fff", fontWeight: "700", fontSize: 12, letterSpacing: 0.3 },

  title: { color: colors.text, fontSize: 22, fontWeight: "900", marginTop: 4, marginBottom: 12 },

  fieldWrap: { marginBottom: 14 },
  label: { color: colors.text, fontWeight: "800", marginBottom: 6 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    color: colors.text,
    fontSize: 16,
  },
  pickerBox: {
    backgroundColor: "colors.surface",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
  picker: { color: colors.text, height: 44, width: "100%" },

  error: { color: colors.red, marginTop: 6, fontSize: 12, fontWeight: "600" },

  submitBtn: {
    marginTop: 10,
    backgroundColor: colors.green,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  btnDisabled: { backgroundColor: "rgba(16,185,129,0.5)" },
  submitText: { color: "#fff", fontWeight: "800" },

  previewCard: {
    marginTop: 18,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewRow: { flexDirection: "row", alignItems: "center" },
  previewAvatar: { width: 64, height: 64, borderRadius: 12, marginRight: 12 },
  previewTextCol: { flex: 1 },
  previewName: { color: colors.text, fontSize: 18, fontWeight: "800" },
  previewEmail: { color: colors.sub, marginTop: 2 },
  previewGenre: { color: colors.text, marginTop: 6, fontWeight: "700" },
});
