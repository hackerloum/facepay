import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FaceScanner } from "@/components/FaceScanner";
import { matchFace } from "@/lib/api";

export default function ScanScreen() {
  const { merchantId } = useLocalSearchParams<{ merchantId: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCapture = async (imageBase64: string) => {
    if (!merchantId) {
      Alert.alert("Error", "Merchant ID missing. Please log in again.");
      return;
    }
    setLoading(true);
    try {
      const result = await matchFace(imageBase64, merchantId);
      if (result.matched && result.customer) {
        router.push({
          pathname: "/confirm",
          params: {
            customerId: result.customer.id,
            customerName: result.customer.name,
            customerPhoto: result.customer.face_image_url || "",
            merchantId,
          },
        });
      } else {
        Alert.alert(
          "Face Not Recognized",
          "No matching customer found. Please try again or ask the customer to register on the web portal."
        );
      }
    } catch (err) {
      Alert.alert(
        "Scan Failed",
        err instanceof Error ? err.message : "Could not connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!merchantId) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>No merchant ID. Please log in again.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#00D4FF" />
          <Text style={styles.loadingText}>Matching face...</Text>
        </View>
      ) : (
        <FaceScanner onCapture={handleCapture} disabled={loading} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0F1E",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    color: "#94A3B8",
    marginTop: 16,
  },
  error: {
    color: "#FF4757",
    fontSize: 16,
  },
});
