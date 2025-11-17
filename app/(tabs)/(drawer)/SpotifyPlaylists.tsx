// app/(tabs)/(drawer)/SpotifyPlaylists.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
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

// Theme (Redux)
import { useSelector } from "react-redux";
import { RootState } from "../../../src/store";
import AnimatedThemeView from "../../../src/theme/AnimatedThemeView";

type Playlist = { id: string; title: string; cover: string | any };
type Mix = { id: string; title: string; artists: string; cover: string };

const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: "1",
    title: "Daily Mix 1",
    cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Lo-Fi Beats",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Top Hits Philippines",
    cover: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Chill Vibes",
    // local asset; keep require without { uri: ... }
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
const imgSource = (src: string | any) =>
  typeof src === "string" ? { uri: src } : src;

export default function SpotifyPlaylists() {
  const navigation = useNavigation();
  const { colors } = useSelector((s: RootState) => s.theme);

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
    <AnimatedThemeView>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Drawer button */}
          <TouchableOpacity
            style={{ padding: 16, alignSelf: "flex-start" }}
            onPress={openDrawer}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="menu" size={30} color={colors.text} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.greeting, { color: colors.text }]}>
              Good afternoon
            </Text>

            <View style={styles.headerIcons}>
              <View style={{ width: 4 }} />
              <Pressable style={styles.iconBtn}>
                <Ionicons
                  name="notifications-outline"
                  size={30}
                  color={colors.text}
                />
              </Pressable>
              <Pressable style={styles.iconBtn}>
                <Ionicons name="time-outline" size={30} color={colors.text} />
              </Pressable>
              <Pressable style={styles.iconBtn}>
                <Ionicons
                  name="settings-outline"
                  size={30}
                  color={colors.text}
                />
              </Pressable>
            </View>
          </View>

          {/* Chips */}
          <View style={styles.chipsRow}>
            {CHIPS.map((c) => (
              <Pressable
                key={c}
                style={[
                  styles.chip,
                  {
                    backgroundColor: colors.card,
                    borderColor: "#00000022",
                  },
                ]}
              >
                <Text
                  style={{ color: colors.text, fontSize: 12, fontWeight: "600" }}
                >
                  {c}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Grid of small tiles */}
          <View style={styles.grid}>
            {MOCK_PLAYLISTS.map((p) => (
              <Pressable
                key={p.id}
                style={[styles.tile, { backgroundColor: colors.card }]}
                onPress={() => handleOpenPlaylist(p)}
              >
                <Image source={imgSource(p.cover)} style={styles.tileCover} />
                <View style={styles.tileRight}>
                  <Text
                    numberOfLines={1}
                    style={{ color: colors.text, fontWeight: "600", flex: 1, marginRight: 8 }}
                  >
                    {p.title}
                  </Text>
                  <MaterialCommunityIcons
                    name="dots-horizontal"
                    size={18}
                    color={colors.muted}
                    style={{ opacity: 0.9 }}
                  />
                </View>
              </Pressable>
            ))}
          </View>

          {/* “Your top mixes” horizontal list */}
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 8 }]}>
            Your top mixes
          </Text>
          <FlatList
            horizontal
            data={MIXES}
            keyExtractor={(m) => m.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
            renderItem={({ item }) => (
              <Pressable style={styles.card} onPress={() => handleOpenPlaylist(item)}>
                <Image source={{ uri: item.cover }} style={styles.cardCover} />
                <Text style={{ color: colors.text, marginTop: 8, fontWeight: "700" }} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }} numberOfLines={2}>
                  {item.artists}
                </Text>
              </Pressable>
            )}
          />

          {/* Spacer to avoid overlap with now-playing bar & tab bar */}
          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Mini Now Playing Bar (themed) */}
        <View
          style={[
            styles.nowPlaying,
            { backgroundColor: colors.card },
          ]}
        >
          <Image
            source={{ uri: "https://picsum.photos/80?np" }}
            style={styles.npCover}
          />
          <View style={{ flex: 1 }}>
            <Text style={[styles.npTitle, { color: colors.text }]} numberOfLines={1}>
              OKAY (Prod. GroovyRoom)
            </Text>
            <Text style={[styles.npSubtitle, { color: colors.muted }]} numberOfLines={1}>
              +1, Simon Dominic, MUSHVENOM
            </Text>
          </View>
          <Pressable
            style={[styles.npBtn, { backgroundColor: colors.accent }]}
          >
            <Ionicons name="play" size={18} color={colors.background} />
          </Pressable>
        </View>
      </SafeAreaView>
    </AnimatedThemeView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greeting: { fontSize: 27, fontWeight: "600" },
  headerIcons: { flexDirection: "row", alignItems: "center", paddingTop: 5 },
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
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },

  sectionTitle: {
    fontSize: 30,
    fontWeight: "700",
    paddingHorizontal: 16,
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

  card: { width: 160, marginHorizontal: 8, marginLeft: 16 },
  cardCover: {
    width: "100%",
    height: 160,
    borderRadius: 8,
    backgroundColor: "#2222", // placeholder shimmer bg behind images
  },

  // Now Playing (themed)
  nowPlaying: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 20,
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
  npCover: { width: 60, height: 60, borderRadius: 6 },
  npTitle: { fontWeight: "700", fontSize: 18 },
  npSubtitle: { fontSize: 13, marginTop: 2 },
  npBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
});
