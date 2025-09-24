import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerActions, useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Stat = { label: string; value: number | string };
type PubPlaylist = { id: string; title: string; likes: number; cover: string };
type ProfileData = { username: string; email: string; genre: string; avatar?: string };

const PROFILE_PERSIST_KEY = "@profile_persist:v1";
const AVATAR_FALLBACK = require("../../../assets/images/userProfile.jpg");

const STATS: Stat[] = [
  { label: "PLAYLISTS", value: 10 },
  { label: "FOLLOWERS", value: 2 },
  { label: "FOLLOWING", value: 34 },
];

const PUBLIC_PLAYLISTS: PubPlaylist[] = [
  { id: "p1", title: "OPM SONG", likes: 0, cover: "https://picsum.photos/seed/aa/64/64" },
  { id: "p2", title: "Broke asf", likes: 0, cover: "https://picsum.photos/seed/bb/64/64" },
  { id: "p3", title: "Living young and Wild", likes: 1, cover: "https://picsum.photos/seed/cc/64/64" },
];

export default function SpotifyProfile() {
  const navigation = useNavigation();
  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

  const [profile, setProfile] = useState<ProfileData>({
    username: "",
    email: "",
    genre: "",
    avatar: undefined,
  });

  // Load profile whenever this screen gains focus
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      (async () => {
        try {
          const raw = await AsyncStorage.getItem(PROFILE_PERSIST_KEY);
          if (raw && isActive) {
            const data = JSON.parse(raw) as ProfileData;
            setProfile({
              username: data.username ?? "",
              email: data.email ?? "",
              genre: data.genre ?? "",
              avatar: data.avatar,
            });
          }
        } catch {
          // ignore read errors
        }
      })();
      return () => {
        isActive = false;
      };
    }, [])
  );

  const openPlaylist = (p: PubPlaylist) =>
    router.push({
      pathname: "/(tabs)/(drawer)/SpotifyPlayListDetails",
      params: { id: p.id, title: p.title },
    });

  const displayName = profile.username || "Mike";
  const genrePlaceholder = profile.genre
    ? { uri: `https://via.placeholder.com/96?text=${encodeURIComponent(profile.genre)}` }
    : AVATAR_FALLBACK;

  const avatarSource = profile.avatar ? { uri: profile.avatar } : genrePlaceholder;

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={["rgba(14, 14, 14, 1)", "#252525ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientFill}
      />

      {/* Header bar */}
      <View style={styles.topBar}>
        <Pressable onPress={openDrawer} style={styles.iconBtn}>
          <Ionicons name="menu" size={30} color="#fff" />
        </Pressable>
        <Pressable onPress={() => {}} style={styles.iconBtn}>
          <Ionicons name="ellipsis-horizontal" size={30} color="#fff" />
        </Pressable>
      </View>

      <FlatList
        data={PUBLIC_PLAYLISTS}
        keyExtractor={(i) => i.id}
        ListHeaderComponent={
          <View>
            {/* avatar */}
            <View style={styles.avatarWrap}>
              <Image source={avatarSource} style={styles.avatar} />
            </View>

            {/* name + email */}
            <Text style={styles.name}>{displayName}</Text>
            {profile.email ? (
              <Text style={[styles.rowSub, styles.centerSub]}>{profile.email}</Text>
            ) : null}

            {/* edit profile pill */}
            <Pressable
              style={styles.editBtn}
              onPress={() => router.push("/(tabs)/(drawer)/SpotifyProfileForm")}
            >
              <Text style={styles.editText}>EDIT PROFILE</Text>
            </Pressable>

            {/* stats row */}
            <View style={styles.statsRow}>
              {STATS.map((s) => (
                <View key={s.label} style={styles.statItem}>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>

            {/* section header */}
            <Text style={styles.sectionTitle}>Public playlists</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => openPlaylist(item)}>
            <Image source={{ uri: item.cover }} style={styles.rowCover} />
            <View style={styles.rowTextWrap}>
              <Text numberOfLines={1} style={styles.rowTitle}>
                {item.title}
              </Text>
              <Text style={styles.rowSub} numberOfLines={1}>
                {item.likes} {item.likes === 1 ? "like" : "likes"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#c9c9c9" />
          </Pressable>
        )}
        ListFooterComponent={
          <Pressable style={[styles.row, styles.footerRow]} onPress={() => {}}>
            <Text style={[styles.rowTitle, styles.flex1]}>See all playlists</Text>
            <Ionicons name="chevron-forward" size={18} color="#c9c9c9" />
          </Pressable>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const AVATAR_SIZE = 96;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#121212" },
  gradientFill: StyleSheet.absoluteFillObject as any,

  topBar: {
    height: 44,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBtn: {
    width: 40,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },

  avatarWrap: {
    alignItems: "center",
    marginTop: 8,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
  },

  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 10,
  },
  centerSub: { textAlign: "center", marginTop: 4 },

  editBtn: {
    alignSelf: "center",
    marginTop: 8,
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  editText: {
    color: "#e6e6e6",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.4,
  },

  statsRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 24,
  },
  statItem: { alignItems: "center" },
  statValue: { color: "#fff", fontWeight: "800", fontSize: 14 },
  statLabel: {
    color: "#bcbcbc",
    fontSize: 11,
    letterSpacing: 0.7,
    marginTop: 2,
  },

  sectionTitle: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    paddingHorizontal: 16,
    marginTop: 22,
    marginBottom: 8,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "transparent",
  },
  footerRow: { marginTop: 6 },
  flex1: { flex: 1 },
  rowCover: { width: 46, height: 46, borderRadius: 6, backgroundColor: "#272727" },
  rowTextWrap: { flex: 1, marginLeft: 12, marginRight: 8 },
  rowTitle: { color: "#fff", fontWeight: "700" },
  rowSub: { color: "#9c9c9c", fontSize: 12, marginTop: 2 },

  separator: { height: 8 },
  listContent: { paddingBottom: 32 },
});
