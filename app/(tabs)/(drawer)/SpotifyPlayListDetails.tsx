// app/(tabs)/(drawer)/PlaylistDetail.tsx
import { AntDesign, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import {
    FlatList,
    Image,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";

type CoverSrc = string | number;
type Track = { id: string; title: string; artists: string; duration: string };

const MOCK_TRACKS: Track[] = [
  { id: "t1", title: "Sunset Drive", artists: "Keshi", duration: "3:21" },
  { id: "t2", title: "Neon Lights", artists: "Tame Impala", duration: "4:02" },
  { id: "t3", title: "Echoes", artists: "LANY", duration: "3:47" },
  { id: "t4", title: "Homebound", artists: "Jeremy Zucker", duration: "2:56" },
  { id: "t5", title: "Night Walk", artists: "Joji", duration: "3:35" },
  { id: "t6", title: "Astral", artists: "The 1975", duration: "3:59" },
];

export default function PlaylistDetail() {
  const params = useLocalSearchParams<{
    id?: string;
    title?: string;
    cover?: string;
  }>();

  // You can pass a cover via params later; for now, we try params.cover then fallback
  const cover: CoverSrc = useMemo<CoverSrc>(() => {
    if (params.cover) return params.cover as string;
    // fallback image (remote) — swap with a local require if you prefer:
    return "https://images.unsplash.com/photo-1507878866276-a947ef722fee?q=80&w=1600&auto=format&fit=crop";
    // or: return require("@/assets/images/yourFallbackCover.jpg");
  }, [params.cover]);

  const title = params.title ?? "Playlist";

  const renderTrack = ({ item, index }: { item: Track; index: number }) => (
    <Pressable style={styles.trackRow}>
      <Text style={styles.trackIndex}>{index + 1}</Text>
      <View style={styles.trackCenter}>
        <Text numberOfLines={1} style={styles.trackTitle}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={styles.trackArtists}>
          {item.artists}
        </Text>
      </View>
      <Text style={styles.trackDuration}>{item.duration}</Text>
      <MaterialCommunityIcons
        name="dots-horizontal"
        size={20}
        color="#bdbdbd"
        style={{ marginLeft: 8 }}
      />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={["#2a2a2a", "#121212"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <AntDesign name="arrowleft" size={20} color="#fff" />
        </Pressable>
        <Pressable onPress={() => {}} style={styles.iconBtn}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#fff" />
        </Pressable>
      </View>

      {/* Header with cover + meta */}
      <View style={styles.header}>
        <Image
          source={typeof cover === "string" ? { uri: cover } : cover}
          style={styles.cover}
        />
        <Text numberOfLines={2} style={styles.title}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          Playlist • Made for you
        </Text>

        <View style={styles.actionRow}>
          <Pressable style={[styles.actionBtn, styles.playBtn]}>
            <Ionicons name="play" size={20} color="#000" />
            <Text style={styles.playText}>Play</Text>
          </Pressable>
          <Pressable style={[styles.actionBtn, styles.shuffleBtn]}>
            <Ionicons name="shuffle" size={18} color="#1ed760" />
            <Text style={styles.shuffleText}>Shuffle</Text>
          </Pressable>
        </View>
      </View>

      {/* Tracks */}
      <FlatList
        data={MOCK_TRACKS}
        keyExtractor={(t) => t.id}
        renderItem={renderTrack}
        ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
        contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: 14 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Text style={styles.sectionLabel}>Songs</Text>}
      />
    </SafeAreaView>
  );
}

const COVER_SIZE = 200;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#121212" },

  topBar: {
    height: 44,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  cover: {
    width: COVER_SIZE,
    height: COVER_SIZE,
    borderRadius: 12,
    backgroundColor: "#222",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 12,
  },
  subtitle: {
    color: "#c2c2c2",
    fontSize: 12,
    marginTop: 4,
  },

  actionRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  playBtn: {
    backgroundColor: "#fff",
  },
  playText: {
    color: "#000",
    fontWeight: "800",
  },
  shuffleBtn: {
    backgroundColor: "rgba(30, 215, 96, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(30, 215, 96, 0.5)",
  },
  shuffleText: {
    color: "#1ed760",
    fontWeight: "800",
  },

  sectionLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    paddingHorizontal: 2,
    marginBottom: 8,
  },

  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 6,
    backgroundColor: "transparent",
  },
  trackIndex: {
    width: 24,
    color: "#a9a9a9",
    textAlign: "center",
  },
  trackCenter: { flex: 1, marginLeft: 6, marginRight: 8 },
  trackTitle: { color: "#fff", fontWeight: "700" },
  trackArtists: { color: "#9c9c9c", fontSize: 12, marginTop: 2 },
  trackDuration: { color: "#a9a9a9", fontSize: 12 },
});
