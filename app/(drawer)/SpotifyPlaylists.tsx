import { AntDesign } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Playlist = { id: string; title: string; cover: string };

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
    cover:
      "https://images.unsplash.com/photo-1494233901474-dccde49a0bff?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function SpotifyPlaylists() {
  const navigation = useNavigation();

  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

  const renderItem = ({ item }: { item: Playlist }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={() =>
        router.push({ pathname: "/PlaylistDetail", params: { id: item.id, title: item.title } })
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Playlissts</Text>

        <TouchableOpacity style={styles.headerRight} onPress={openDrawer} activeOpacity={0.8}>
          <AntDesign name="menuunfold" size={24} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={["#1f1f1f", "#0f0f0f"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      // Replace your current header block with this:
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Playlists</Text>

        <TouchableOpacity style={styles.headerRight} onPress={openDrawer} activeOpacity={0.8}>
          <AntDesign name="menuunfold" size={24} />
        </TouchableOpacity>
      </View>


      <View style={styles.container}>
        <FlatList
          data={MOCK_PLAYLISTS}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const FIELD_WIDTH = "80%";

const styles = StyleSheet.create({
  screen: { flex: 1 },

  // Add/update these styles:
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  headerRight: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },


  container: {
    alignSelf: "center",
    width: FIELD_WIDTH, // 80%
  },

  card: {
    width: "100%",
    backgroundColor: "#141414",
    borderRadius: 16,
    padding: 12,
  },
  coverWrap: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#222",
    marginBottom: 10,
  },
  coverImg: { width: "100%", height: "100%" },
  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
  cardSubtitle: { color: "#9a9a9a", fontSize: 13, marginTop: 2 },
});
