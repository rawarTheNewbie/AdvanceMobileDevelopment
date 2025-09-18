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
          drawerStyle: {
            backgroundColor: "#121212",
          },
          drawerActiveTintColor: "#1ed760",
          drawerInactiveTintColor: "#ccc",
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: "600",
          },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{ drawerItemStyle: { display: "none" } }}
        />

        <Drawer.Screen name="SpotifyPlaylists" options={{ title: "Home" }} />
        <Drawer.Screen name="SpotifyProfile" options={{ title: "Profile" }} />
        <Drawer.Screen name="SpotifySettings" options={{ title: "Settings" }} />
        <Drawer.Screen
          name="SpotifyPlayListDetails"
          options={{ drawerItemStyle: { display: "none" } }}
        />        
        <Drawer.Screen
          name="Spotify"  
          options={{ drawerItemStyle: { display: "none" } }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
