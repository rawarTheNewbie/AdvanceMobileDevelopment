// app/(tabs)/(drawer)/SpotifyPlaylists.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Playlist = { id: string; title: string; cover: string | any };
type Mix = { id: string; title: string; artists: string; cover: string };

const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: "1",
    title: "Daily Mix 1",
    cover:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Lo-Fi Beats",
    cover:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Top Hits Philippines",
    cover:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Chill Vibes",
    // ✅ local asset (require returns a number), don't wrap with { uri: ... }
    cover: require("@/assets/images/Parokya.jpg"),
  },
];

const MIXES: Mix[] = [
  {
    id: "m1",
    title: "Chill Mix",
    artists: "Sik-K, keshi, Slom and more",
    cover: "https://picsum.photos/300?11",
  },
  {
    id: "m2",
    title: "Moody Mix",
    artists: "little image, Warren Hue, rei brown and more",
    cover: "https://picsum.photos/300?12",
  },
  {
    id: "m3",
    title: "Elevated",
    artists: "Maverick City Music, Bethel Music",
    cover: "https://picsum.photos/300?13",
  },
  {
    id: "m4",
    title: "Work Jams",
    artists: "Tame Impala, Phoenix, etc.",
    cover: "https://picsum.photos/300?14",
  },
];

const CHIPS = ["Music", "Podcasts & Shows", "Audiobooks"];

// helper to render both local and remote images
const imgSource = (src: string | any) =>
  typeof src === "string" ? { uri: src } : src;

export default function SpotifyPlaylists() {
  const navigation = useNavigation();

  const openDrawer = () => {
    const parent: any = (navigation as any).getParent?.();
    if (parent?.openDrawer) parent.openDrawer();
    else navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleOpenPlaylist = (p: Playlist | Mix) =>
    router.push({
      pathname: "/(tabs)/(drawer)/SpotifyPlayListDetails",
      params: { id: p.id, title: "title" in p ? p.title : "Playlist" },
    });

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={["rgba(14, 14, 14, 1)", "#252525ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.drawerBtn} onPress={openDrawer} activeOpacity={0.8}>
          <MaterialCommunityIcons name="menu" size={30} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerRow}>
          <Text style={styles.greeting}>Good afternoon</Text>

          <View style={styles.headerIcons}>
            <View style={{ width: 4 }} />
            <Pressable style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={30} color="#fff" />
            </Pressable>
            <Pressable style={styles.iconBtn}>
              <Ionicons name="time-outline" size={30} color="#fff" />
            </Pressable>
            <Pressable style={styles.iconBtn}>
              <Ionicons name="settings-outline" size={30} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* Chips */}
        <View style={styles.chipsRow}>
          {CHIPS.map((c) => (
            <Pressable key={c} style={styles.chip}>
              <Text style={styles.chipText}>{c}</Text>
            </Pressable>
          ))}
        </View>

        {/* Grid of small tiles */}
        <View style={styles.grid}>
          {MOCK_PLAYLISTS.map((p) => (
            <Pressable key={p.id} style={styles.tile} onPress={() => handleOpenPlaylist(p)}>
              {/* ✅ handle local vs remote */}
              <Image source={imgSource(p.cover)} style={styles.tileCover} />
              <View style={styles.tileRight}>
                <Text numberOfLines={1} style={styles.tileTitle}>
                  {p.title}
                </Text>
                <MaterialCommunityIcons
                  name="dots-horizontal"
                  size={18}
                  color="#bdbdbd"
                  style={{ opacity: 0.9 }}
                />
              </View>
            </Pressable>
          ))}
        </View>

        {/* “Your top mixes” horizontal list */}
        <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Your top mixes</Text>
        <FlatList
          horizontal
          data={MIXES}
          keyExtractor={(m) => m.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => handleOpenPlaylist(item)}>
              {/* ✅ item.cover is a string URL, so { uri: ... } is correct */}
              <Image source={{ uri: item.cover }} style={styles.cardCover} />
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.cardSubtitle} numberOfLines={2}>
                {item.artists}
              </Text>
            </Pressable>
          )}
        />

        {/* Spacer to avoid overlap with now-playing bar & tab bar */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Mini Now Playing Bar */}
      <View style={styles.nowPlaying}>
        <Image source={{ uri: "https://picsum.photos/80?np" }} style={styles.npCover} />
        <View style={{ flex: 1 }}>
          <Text style={styles.npTitle} numberOfLines={1}>
            OKAY (Prod. GroovyRoom)
          </Text>
          <Text style={styles.npSubtitle} numberOfLines={1}>
            +1, Simon Dominic, MUSHVENOM
          </Text>
        </View>
        <Pressable style={styles.npBtn}>
          <Ionicons name="play" size={18} color="#000" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0b" },
  content: { paddingBottom: 24 },

  headerRow: {
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greeting: { color: "#fff", fontSize: 27, fontWeight: "600" },
  headerIcons: { flexDirection: "row", alignItems: "center", paddingTop: 5 },
  drawerBtn: {
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingTop: 20,
    paddingLeft: 16,
  },

  iconBtn: {
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },

  chipsRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 10,
  },
  chip: {
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#2c2c2c",
  },
  chipText: { color: "#fff", fontSize: 12, fontWeight: "600" },

  sectionTitle: {
    color: "#dcdcdc",
    fontSize: 30,
    fontWeight: "700",
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },

  grid: {
    paddingHorizontal: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    paddingTop: 20,
    paddingBottom: 20,
  },
  tile: {
    width: "48%",
    height: 64,
    backgroundColor: "#292929",
    borderRadius: 5,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
  },
  tileCover: { width: 64, height: "100%" },
  tileRight: {
    flex: 1,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tileTitle: { color: "#fff", fontWeight: "600", flex: 1, marginRight: 8 },

  card: {
    width: 160,
    marginHorizontal: 8,
    marginLeft: 16,
  },
  cardCover: {
    width: "100%",
    height: 160,
    borderRadius: 8,
    backgroundColor: "#222",
  },
  cardTitle: { color: "#fff", marginTop: 8, fontWeight: "700" },
  cardSubtitle: { color: "#bdbdbd", fontSize: 12, marginTop: 2 },

  nowPlaying: {
    paddingTop: 10,
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 20,
    backgroundColor: "#353535",
    borderRadius: 12,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  npCover: { width: 60, height: 60, borderRadius: 6, backgroundColor: "#333" },
  npTitle: { color: "#fff", fontWeight: "700", fontSize: 18 },
  npSubtitle: { color: "#c6c6c6", fontSize: 13, marginTop: 2 },
  npBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
});
