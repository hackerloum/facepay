import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { initiatePayment } from "@/lib/api";

export default function ConfirmScreen() {
  const { customerId, customerName, customerPhoto, merchantId } =
    useLocalSearchParams<{
      customerId: string;
      customerName: string;
      customerPhoto: string;
      merchantId: string;
    }>();
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCharge = async () => {
    const numAmount = parseFloat(amount.replace(/,/g, ""));
    if (!numAmount || numAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }
    if (!customerId || !merchantId) {
      Alert.alert("Error", "Missing customer or merchant info");
      return;
    }
    setLoading(true);
    try {
      const result = await initiatePayment(customerId, merchantId, numAmount);
      router.replace({
        pathname: "/status",
        params: { transactionId: result.transaction_id, merchantId },
      });
    } catch (err) {
      Alert.alert(
        "Payment Failed",
        err instanceof Error ? err.message : "Could not initiate payment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {customerPhoto && customerPhoto.length > 0 ? (
          <Image
            source={{ uri: customerPhoto }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>?</Text>
          </View>
        )}
        <Text style={styles.name}>{customerName || "Customer"}</Text>
      </View>

      <Text style={styles.label}>Amount (TZS)</Text>
      <TextInput
        style={styles.input}
        placeholder="5000"
        placeholderTextColor="#94A3B8"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleCharge}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#0A0F1E" />
        ) : (
          <Text style={styles.buttonText}>
            Charge {customerName || "Customer"}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0F1E",
    padding: 24,
  },
  card: {
    alignItems: "center",
    padding: 24,
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  avatarPlaceholder: {
    backgroundColor: "#1E2A3A",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#94A3B8",
    fontSize: 32,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  label: {
    color: "#94A3B8",
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1E2A3A",
    borderRadius: 12,
    padding: 16,
    color: "#FFFFFF",
    fontSize: 18,
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#00D4FF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#0A0F1E",
    fontSize: 16,
    fontWeight: "600",
  },
});
