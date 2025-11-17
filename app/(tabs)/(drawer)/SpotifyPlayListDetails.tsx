// app/(tabs)/(drawer)/PlaylistDetail.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Redux theme
import { useSelector } from "react-redux";
import { RootState } from "../../../src/store";
import AnimatedThemeView from "../../../src/theme/AnimatedThemeView";

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

const COVER_SIZE = 200;

export default function PlaylistDetail() {
  const { colors } = useSelector((s: RootState) => s.theme);

  const params = useLocalSearchParams<{
    id?: string;
    title?: string;
    cover?: string;
  }>();

  const cover: CoverSrc = useMemo<CoverSrc>(() => {
    if (params.cover) return params.cover as string;
    return "https://images.unsplash.com/photo-1507878866276-a947ef722fee?q=80&w=1600&auto=format&fit=crop";
  }, [params.cover]);

  const title = params.title ?? "Playlist";

  const renderTrack = ({ item, index }: { item: Track; index: number }) => (
    <Pressable style={styles.trackRow}>
      <Text style={[styles.trackIndex, { color: colors.muted }]}>{index + 1}</Text>
      <View style={styles.trackCenter}>
        <Text numberOfLines={1} style={[styles.trackTitle, { color: colors.text }]}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={[styles.trackArtists, { color: colors.muted }]}>
          {item.artists}
        </Text>
      </View>
      <Text style={[styles.trackDuration, { color: colors.muted }]}>{item.duration}</Text>
      <MaterialCommunityIcons
        name="dots-horizontal"
        size={20}
        color={colors.muted}
        style={{ marginLeft: 8 }}
      />
    </Pressable>
  );

  return (
    <AnimatedThemeView style={{ flex: 1 }}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={30} color={colors.text} />
        </Pressable>
        <Pressable onPress={() => {}} style={styles.iconBtn}>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.text} />
        </Pressable>
      </View>

      {/* Header with cover + meta */}
      <View style={styles.header}>
        <Image
          source={typeof cover === "string" ? { uri: cover } : cover}
          style={[styles.cover, { backgroundColor: colors.card }]}
        />
        <Text numberOfLines={2} style={[styles.title, { color: colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.subtitle, { color: colors.muted }]} numberOfLines={1}>
          Playlist • Made for you
        </Text>

        <View style={styles.actionRow}>
          <Pressable style={[styles.actionBtn, { backgroundColor: colors.text }]}>
            <Ionicons name="play" size={20} color={colors.background} />
            <Text style={[styles.playText, { color: colors.background }]}>Play</Text>
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
        ListHeaderComponent={
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Songs</Text>
        }
      />
    </AnimatedThemeView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingTop: 70,
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
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 12,
  },
  subtitle: {
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
  playText: { fontWeight: "800" },
  shuffleText: { fontWeight: "800" },

  sectionLabel: {
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
  trackIndex: { width: 24, textAlign: "center" },
  trackCenter: { flex: 1, marginLeft: 6, marginRight: 8 },
  trackTitle: { fontWeight: "700" },
  trackArtists: { fontSize: 12, marginTop: 2 },
  trackDuration: { fontSize: 12 },
});
