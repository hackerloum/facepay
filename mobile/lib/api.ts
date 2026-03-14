import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export interface MatchFaceResponse {
  matched: boolean;
  customer?: {
    id: string;
    name: string;
    phone: string;
    phone_network: string;
    face_image_url?: string;
  };
  confidence?: number;
}

export async function matchFace(
  imageBase64: string,
  merchantId: string
): Promise<MatchFaceResponse> {
  const { data } = await api.post<MatchFaceResponse>("/api/match-face", {
    image_base64: imageBase64,
    merchant_id: merchantId,
  });
  return data;
}

export interface InitiatePaymentResponse {
  transaction_id: string;
  status: string;
}

export async function initiatePayment(
  customerId: string,
  merchantId: string,
  amount: number
): Promise<InitiatePaymentResponse> {
  const { data } = await api.post<InitiatePaymentResponse>("/api/initiate-payment", {
    customer_id: customerId,
    merchant_id: merchantId,
    amount,
    currency: "TZS",
  });
  return data;
}

export interface TransactionStatus {
  id: string;
  status: string;
  amount: number;
  currency: string;
}

export async function getTransactionStatus(
  transactionId: string
): Promise<TransactionStatus> {
  const { data } = await api.get<TransactionStatus>(
    `/api/transaction/${transactionId}`
  );
  return data;
}
