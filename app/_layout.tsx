// Must be first
import 'react-native-reanimated';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const NAV_KEY = 'nav:last'; // { path: string; drawerOpen: boolean }

export default function RootLayout() {
  const [loaded] = useFonts({ SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf') });
  const [booted, setBooted] = useState(false);

  // Restore last path on app launch (fallback to drawer playlists INSIDE tabs)
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(NAV_KEY);
        const { path } = raw ? JSON.parse(raw) : {};
        const target =
          typeof path === 'string' ? path : '/(tabs)/SpotifyLogin';
        setTimeout(() => router.replace(target), 0);
      } finally {
        setBooted(true);
      }
    })();
  }, []);

  if (!loaded || !booted) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, ...(Platform.OS === 'web' ? { pointerEvents: 'auto' } : {}) }}>
      <ThemeProvider value={DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          {/* Removed the extra (drawer) registration here */}
          <Stack.Screen name="+not-found" options={{ headerShown: true }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
