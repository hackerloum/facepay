import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getTransactionStatus } from "@/lib/api";

const POLL_INTERVAL = 3000;

export default function StatusScreen() {
  const { transactionId, merchantId } = useLocalSearchParams<{
    transactionId: string;
    merchantId?: string;
  }>();
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    if (!transactionId) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;

    const poll = async () => {
      try {
        const tx = await getTransactionStatus(transactionId);
        setStatus(tx.status);
        setAmount(tx.amount);
        return tx.status === "SUCCESS" || tx.status === "FAILED";
      } catch {
        return false;
      }
    };

    poll().then((done) => {
      if (!done) {
        intervalId = setInterval(async () => {
          const d = await poll();
          if (d && intervalId) clearInterval(intervalId);
        }, POLL_INTERVAL);
      }
    });

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [transactionId]);

  const handleNewPayment = () => {
    if (merchantId) {
      router.replace({ pathname: "/scan", params: { merchantId } });
    } else {
      router.replace("/");
    }
  };

  if (!transactionId) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No transaction ID</Text>
      </View>
    );
  }

  if (status === "SUCCESS") {
    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Text style={styles.successIcon}>&#10003;</Text>
        </View>
        <Text style={styles.title}>Payment Received</Text>
        {amount != null && (
          <Text style={styles.amount}>
            {amount.toLocaleString()} TZS
          </Text>
        )}
        <TouchableOpacity style={styles.button} onPress={handleNewPayment}>
          <Text style={styles.buttonText}>New Payment</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (status === "FAILED") {
    return (
      <View style={styles.container}>
        <View style={[styles.iconContainer, styles.failedIcon]}>
          <Text style={styles.failedIconText}>&#10007;</Text>
        </View>
        <Text style={styles.title}>Payment Rejected or Timed Out</Text>
        <TouchableOpacity style={styles.button} onPress={handleNewPayment}>
          <Text style={styles.buttonText}>New Payment</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#00D4FF" />
      <Text style={styles.waiting}>Waiting for customer to confirm...</Text>
      <Text style={styles.hint}>
        Customer should receive a USSD prompt on their phone. They need to enter their PIN to complete the payment.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0F1E",
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(0, 255, 135, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  successIcon: {
    fontSize: 48,
    color: "#00FF87",
  },
  failedIcon: {
    backgroundColor: "rgba(255, 71, 87, 0.2)",
  },
  failedIconText: {
    fontSize: 48,
    color: "#FF4757",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  amount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00FF87",
    marginBottom: 32,
  },
  waiting: {
    fontSize: 18,
    color: "#FFFFFF",
    marginTop: 24,
  },
  hint: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 12,
    paddingHorizontal: 24,
  },
  button: {
    backgroundColor: "#00D4FF",
    borderRadius: 12,
    padding: 16,
    paddingHorizontal: 32,
    marginTop: 24,
  },
  buttonText: {
    color: "#0A0F1E",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: "#FF4757",
    fontSize: 16,
  },
});
