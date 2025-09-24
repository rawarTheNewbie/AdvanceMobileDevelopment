// app/(tabs)/(drawer)/_layout.tsx
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false,
          drawerType: "front",
          swipeEdgeWidth: 40,
          drawerStyle: { backgroundColor: "#121212" },
          drawerActiveTintColor: "#1ed760",
          drawerInactiveTintColor: "#ccc",
          drawerLabelStyle: { fontSize: 16, fontWeight: "600" },
        }}
      >
        {/* Keep index hidden */}
        <Drawer.Screen
          name="index"
          options={{ drawerItemStyle: { display: "none" }, href: null }}
        />


        <Drawer.Screen
          name="SpotifyProfileForm"
          options={{ drawerItemStyle: { display: "none" }, href: null, headerShown: false }}
        />

        {/* Visible drawer entries */}
        <Drawer.Screen name="SpotifyPlaylists" options={{ title: "Home" }} />
        <Drawer.Screen name="SpotifyProfile" options={{ title: "Profile" }} />
        <Drawer.Screen name="SpotifySettings" options={{ title: "Settings" }} />

        {/* Other hidden routes */}
        <Drawer.Screen
          name="SpotifyPlayListDetails"
          options={{ drawerItemStyle: { display: "none" }, href: null }}
        />
        <Drawer.Screen
          name="Spotify"
          options={{ drawerItemStyle: { display: "none" }, href: null }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
