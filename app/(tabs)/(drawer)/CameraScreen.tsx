// app/(tabs)/(drawer)/CameraScreen.tsx
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useRef, useState } from "react";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);

  // Web is not supported by expo-camera (preview), show a friendly message
  if (Platform.OS === "web") {
    return (
      <View style={styles.center}>
        <Text style={styles.dim}>Camera preview isn’t supported on web. Open this route in Expo Go (Android/iOS).</Text>
      </View>
    );
  }

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.dim}>Preparing camera…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>We need your permission to use the camera</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={requestPermission}>
          <Text style={styles.primaryText}>Grant permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const flip = () => setFacing((p) => (p === "back" ? "front" : "back"));

  const snap = async () => {
    try {
      const pic = await cameraRef.current?.takePictureAsync({ quality: 1 });
      if (pic?.uri) setPhotoUri(pic.uri);
    } catch (e) {
      console.warn("Capture failed", e);
    }
  };

  if (photoUri) {
    return (
      <View style={styles.previewWrap}>
        <Image source={{ uri: photoUri }} style={styles.preview} resizeMode="contain" />
        <View style={styles.previewActions}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => setPhotoUri(null)}>
            <Text style={styles.secondaryText}>Retake</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={(r) => (cameraRef.current = r)}
        style={styles.camera}
        facing={facing}           // "back" | "front"
        animateShutter            // nice shutter animation on capture
        enableTorch={false}
      >
        <View style={styles.controls}>
          <TouchableOpacity onPress={flip} style={styles.controlBtn}>
            <Text style={styles.controlText}>Flip</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={snap} style={styles.shutterOuter}>
            <View style={styles.shutterInner} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1, justifyContent: "flex-end" },

  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  controlBtn: {
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  controlText: { color: "#fff", fontWeight: "700" },

  shutterOuter: {
    width: 76, height: 76, borderRadius: 38,
    borderWidth: 5, borderColor: "#fff",
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center", alignItems: "center",
  },
  shutterInner: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#fff" },

  previewWrap: { flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" },
  preview: { width: "100%", height: "80%" },
  previewActions: { flexDirection: "row", gap: 12, marginTop: 14 },
  secondaryBtn: {
    borderColor: "rgba(255,255,255,0.5)",
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  secondaryText: { color: "#fff", fontWeight: "700" },

  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "#000" },
  dim: { color: "#bbb", textAlign: "center" },
  title: { color: "#fff", fontSize: 16, textAlign: "center", marginBottom: 12 },
  primaryBtn: { backgroundColor: "#1ED760", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  primaryText: { color: "#000", fontWeight: "800" },
});
