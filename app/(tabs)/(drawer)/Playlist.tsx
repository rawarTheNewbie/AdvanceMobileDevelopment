import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerActions } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeOutUp,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// ------------ Types ------------
type Song = { id: string; title: string };
type State = {
  past: Song[][];
  present: Song[];
  future: Song[][];
  history: string[];
};
type Action =
  | { type: "ADD"; title: string }
  | { type: "REMOVE"; id: string }
  | { type: "CLEAR" }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "RESTORE"; state: State };

const STORAGE_KEY = "@playlist_with_history:v1";

const initialState: State = { past: [], present: [], future: [], history: [] };
const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

// ------------ Reducer ------------
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD": {
      const t = action.title.trim();
      if (!t) return state;
      const next = [{ id: uid(), title: t }, ...state.present];
      return {
        past: [...state.past, state.present],
        present: next,
        future: [],
        history: [`Added “${t}”`, ...state.history].slice(0, 50),
      };
    }
    case "REMOVE": {
      const removed = state.present.find((s) => s.id === action.id);
      const next = state.present.filter((s) => s.id !== action.id);
      return {
        past: [...state.past, state.present],
        present: next,
        future: [],
        history: removed
          ? [`Removed “${removed.title}”`, ...state.history].slice(0, 50)
          : state.history,
      };
    }
    case "CLEAR": {
      if (!state.present.length) return state;
      return {
        past: [...state.past, state.present],
        present: [],
        future: [],
        history: [`Cleared playlist`, ...state.history].slice(0, 50),
      };
    }
    case "UNDO": {
      if (!state.past.length) return state;
      const previous = state.past[state.past.length - 1];
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
        history: [`Undo`, ...state.history].slice(0, 50),
      };
    }
    case "REDO": {
      if (!state.future.length) return state;
      const next = state.future[0];
      return {
        past: [...state.past, state.present],
        present: next,
        future: state.future.slice(1),
        history: [`Redo`, ...state.history].slice(0, 50),
      };
    }
    case "RESTORE":
      return action.state;
    default:
      return state;
  }
}

// ------------ Colors ------------
const colors = {
  card: "rgba(255,255,255,0.06)",
  cardBorder: "rgba(255,255,255,0.08)",
  text: "#E5E7EB",
  sub: "#9CA3AF",
  blue: "#3B82F6",
  green: "#10B981",
  red: "#EF4444",
  surface: "#2a2a2a",
  chip: "rgba(255,255,255,0.08)",
};

// ------------ Small UI helpers ------------
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{children}</Text>
    </View>
  );
}

function Fab({ disabled, onPress }: { disabled?: boolean; onPress: () => void }) {
  const scale = useSharedValue(1);
  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: withTiming(disabled ? 0.6 : 1, { duration: 120 }),
  }));
  return (
    <Animated.View style={[styles.fabContainer, rStyle]}>
      <Pressable
        onPressIn={() => (scale.value = withTiming(0.96, { duration: 80 }))}
        onPressOut={() => (scale.value = withTiming(1, { duration: 80 }))}
        onPress={onPress}
        disabled={disabled}
        style={styles.fab}
      >
        <Text style={styles.fabText}>Add</Text>
      </Pressable>
    </Animated.View>
  );
}

function BarButton({
  label,
  onPress,
  disabled,
  tone = "blue",
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: "blue" | "red";
}) {
  const bg = tone === "blue" ? colors.blue : colors.red;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.barButton,
        {
          backgroundColor: disabled ? "rgba(255,255,255,0.08)" : bg,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <Text style={styles.barButtonText}>{label}</Text>
    </Pressable>
  );
}

// ------------ Screen ------------
export default function PlaylistScreen() {
  const [text, setText] = useState("");
  const [state, dispatch] = useReducer(reducer, initialState);

  // Drawer
  const navigation = useNavigation();
  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

  // Persistence (debounced)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
    }, 250);
    return () => saveTimer.current && clearTimeout(saveTimer.current);
  }, [state]);

  // Restore
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as State;
          if (parsed?.present && parsed?.past && parsed?.future) {
            dispatch({ type: "RESTORE", state: parsed });
          }
        }
      } catch {
        Alert.alert("Restore failed", "Couldn't restore previous playlist.");
      }
    })();
  }, []);

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;
  const hasItems = state.present.length > 0;

  const addSong = () => {
    if (!text.trim()) return;
    dispatch({ type: "ADD", title: text });
    setText("");
  };

  const Header = useMemo(
    () => (
      <View style={styles.headerWrapper}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>My Playlist</Text>
          <Pill>{state.present.length} songs</Pill>
        </View>

        {/* Input card */}
        <View style={styles.inputCard}>
          <View style={styles.inputRow}>
            <View
              style={[
                styles.dot,
                { backgroundColor: text.trim() ? colors.green : colors.sub },
              ]}
            />
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type a song name and hit Add"
              placeholderTextColor={colors.sub}
              onSubmitEditing={addSong}
              style={styles.textInput}
            />
          </View>

          <View style={styles.barRow}>
            <BarButton
              label="Undo"
              onPress={() => dispatch({ type: "UNDO" })}
              disabled={!canUndo}
            />
            <BarButton
              label="Redo"
              onPress={() => dispatch({ type: "REDO" })}
              disabled={!canRedo}
            />
            <BarButton
              label="Clear"
              onPress={() => dispatch({ type: "CLEAR" })}
              disabled={!hasItems}
              tone="red"
            />
          </View>
        </View>
      </View>
    ),
    [text, canUndo, canRedo, hasItems, state.present.length]
  );

  const renderItem = ({ item }: { item: Song }) => (
    <Animated.View
      entering={FadeInDown.duration(220)}
      exiting={FadeOutUp.duration(180)}
      layout={Layout.springify().damping(20).stiffness(180)}
      style={styles.songCard}
    >
      <View style={styles.songRow}>
        <View style={styles.songThumb} />
        <Text style={styles.songTitle} numberOfLines={1}>
          {item.title}
        </Text>
      </View>

      <Pressable
        onPress={() => dispatch({ type: "REMOVE", id: item.id })}
        style={({ pressed }) => [
          styles.deleteButton,
          { opacity: pressed ? 0.9 : 1 },
        ]}
        accessibilityLabel={`Remove ${item.title}`}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Gradient background */}
      <LinearGradient
        colors={["rgba(14, 14, 14, 1)", "#252525ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* NEW: Top bar with drawer button */}
      <View style={styles.topBar}>
        <Pressable onPress={openDrawer} style={styles.menuBtn}>
          <Ionicons name="menu" size={30} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.container}>
        {Header}

        <FlatList
          data={state.present}
          keyExtractor={(s) => s.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Your playlist is empty</Text>
              <Text style={styles.emptySub}>
                Add a few songs to get started.
              </Text>
            </View>
          }
        />

        {/* History */}
        {state.history.length > 0 && (
          <View style={styles.historyCard}>
            <Text style={styles.historyTitle}>Recent</Text>
            {state.history.slice(0, 4).map((h, i) => (
              <Text key={`${h}-${i}`} style={styles.historyText}>
                • {h}
              </Text>
            ))}
          </View>
        )}

        <Fab disabled={!text.trim()} onPress={addSong} />
      </View>
    </KeyboardAvoidingView>
  );
}

// ------------ Styles ------------
const styles = StyleSheet.create({
  flex: { flex: 1 },

  // top bar
  topBar: {
    height: 44,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 4,
    paddingTop: 80,
    paddingBottom: 20,
  },
  menuBtn: {
    width: 40,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  headerWrapper: { gap: 14 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.chip,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  pillText: { color: colors.sub, fontSize: 12, fontWeight: "700" },
  inputCard: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: 10,
  },
  inputRow: {
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dot: { width: 8, height: 8, borderRadius: 8 },
  textInput: { flex: 1, color: colors.text, fontSize: 16 },
  barRow: { flexDirection: "row", gap: 10, marginTop: 10 },
  barButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  barButtonText: { color: "white", fontWeight: "700" },
  fabContainer: { position: "absolute", right: 16, bottom: 16 },
  fab: {
    backgroundColor: colors.green,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  fabText: { color: "white", fontWeight: "800", fontSize: 16 },
  songCard: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  songRow: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  songThumb: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  songTitle: { color: colors.text, fontSize: 16, flex: 1 },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.red,
  },
  deleteText: { color: "white", fontWeight: "700" },
  listContent: { paddingBottom: 100, marginTop: 16 },
  emptyCard: {
    alignItems: "center",
    paddingVertical: 36,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  emptyTitle: { color: colors.sub, fontSize: 16, fontWeight: "600" },
  emptySub: { color: colors.sub, opacity: 0.8, marginTop: 6 },
  historyCard: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 80,
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 12,
  },
  historyTitle: { color: colors.sub, fontWeight: "800", marginBottom: 6 },
  historyText: { color: colors.sub, fontSize: 12, opacity: 0.9 },
});
