// app/(drawer)/SpotifyProfile.tsx
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Stat = { label: string; value: number | string };
type PubPlaylist = { id: string; title: string; likes: number; cover: string };

const AVATAR =
  "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=800&auto=format&fit=crop";

const STATS: Stat[] = [
  { label: "PLAYLISTS", value: 10 },
  { label: "FOLLOWERS", value: 2 },
  { label: "FOLLOWING", value: 34 },
];

const PUBLIC_PLAYLISTS: PubPlaylist[] = [
  {
    id: "p1",
    title: "OPM SONG",
    likes: 0,
    cover: "https://picsum.photos/seed/aa/64/64",
  },
  {
    id: "p2",
    title: "Broke asf",
    likes: 0,
    cover: "https://picsum.photos/seed/bb/64/64",
  },
  {
    id: "p3",
    title: "Living young and Wild",
    likes: 1,
    cover: "https://picsum.photos/seed/cc/64/64",
  },
];

export default function SpotifyProfile() {
  const navigation = useNavigation();
  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

  const openPlaylist = (p: PubPlaylist) =>
    router.push({ 
      pathname: "/(tabs)/(drawer)/SpotifyPlayListDetails",
      params: { id: p.id, title: "title" in p ? p.title : "Playlist" },
    });

  return (
    <SafeAreaView style={styles.safe}>
      {/* top gradient header */}
      <LinearGradient
        colors={["#252525ff", "rgba(14, 14, 14, 1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header bar: drawer on left, kebab on right */}
      <View style={styles.topBar}>
        <Pressable onPress={openDrawer} style={styles.iconBtn}>
          <AntDesign name="menuunfold" size={30} color="#fff" />
        </Pressable>
        <Pressable onPress={() => {}} style={styles.iconBtn}>
          <Ionicons name="ellipsis-horizontal" size={30} color="#fff" />
        </Pressable>
      </View>

      <FlatList
        data={PUBLIC_PLAYLISTS}
        keyExtractor={(i) => i.id}
        ListHeaderComponent={
          <>
            {/* avatar */}
          <View style={styles.avatarWrap}>
            <Image
              // from app/(drawer)/SpotifyProfile.tsx -> ../../assets/images/...
              source={require("../../../assets/images/userProfile.jpg")}
              style={styles.avatar}
            />
          </View>

            {/* name */}
            <Text style={styles.name}>Mike</Text>

            {/* edit profile pill */}
            <Pressable style={styles.editBtn} onPress={() => {}}>
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
          </>
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
          <Pressable style={[styles.row, { marginTop: 6 }]} onPress={() => {}}>
            <Text style={[styles.rowTitle, { flex: 1 }]}>See all playlists</Text>
            <Ionicons name="chevron-forward" size={18} color="#c9c9c9" />
          </Pressable>
        }
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const AVATAR_SIZE = 96;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#121212" },

  topBar: {
    height: 44,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // <-- fix the typo here
  },
  iconBtn: {
    width:  40,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    letterSpacing: 0.5,
    paddingTop: 20,
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
  rowCover: { width: 46, height: 46, borderRadius: 6, backgroundColor: "#272727" },
  rowTextWrap: { flex: 1, marginLeft: 12, marginRight: 8 },
  rowTitle: { color: "#fff", fontWeight: "700" },
  rowSub: { color: "#9c9c9c", fontSize: 12, marginTop: 2 },
});
