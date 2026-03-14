import { useRef, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

interface FaceScannerProps {
  onCapture: (imageBase64: string) => void;
  disabled?: boolean;
}

export function FaceScanner({ onCapture, disabled }: FaceScannerProps) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [capturing, setCapturing] = useState(false);

  const capture = async () => {
    if (!cameraRef.current || !permission?.granted || disabled || capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.8,
      });
      if (photo?.base64) {
        const base64 = `data:image/jpeg;base64,${photo.base64}`;
        onCapture(base64);
      }
    } finally {
      setCapturing(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission is required for face scanning.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera}>
        <View style={styles.overlay}>
          <View style={styles.ring} />
        </View>
      </CameraView>
      <Text style={styles.hint}>Position face in the circle. Ensure good lighting.</Text>
      <TouchableOpacity
        style={[styles.button, (disabled || capturing) && styles.buttonDisabled]}
        onPress={capture}
        disabled={disabled || capturing}
      >
        {capturing ? (
          <ActivityIndicator color="#0A0F1E" />
        ) : (
          <Text style={styles.buttonText}>Scan Face</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "rgba(0, 212, 255, 0.5)",
  },
  hint: {
    color: "#94A3B8",
    fontSize: 14,
    textAlign: "center",
    marginTop: 16,
    paddingHorizontal: 24,
  },
  button: {
    backgroundColor: "#00D4FF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
    marginHorizontal: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#0A0F1E",
    fontSize: 16,
    fontWeight: "600",
  },
  text: {
    color: "#94A3B8",
    fontSize: 16,
    textAlign: "center",
    padding: 24,
  },
});
