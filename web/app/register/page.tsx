"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaceCapture } from "@/components/FaceCapture";

const NETWORKS = [
  { value: "TZ-AIRTEL-C2B", label: "Airtel Money" },
  { value: "TZ-TIGO-C2B", label: "Mixx by Yas (Tigo)" },
  { value: "TZ-HALOTEL-C2B", label: "HaloPesa" },
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneNetwork, setPhoneNetwork] = useState("TZ-AIRTEL-C2B");
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faceImage) {
      setError("Please capture your face first");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/register-face`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_base64: faceImage,
          name,
          phone: phone.replace(/\s/g, ""),
          phone_network: phoneNetwork,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || res.statusText);
      }
      const { user_id } = await res.json();
      document.cookie = `facepay_user=${user_id}; path=/; max-age=86400`;
      document.cookie = `facepay_phone=${phone}; path=/; max-age=86400`;
      router.push(`/dashboard?phone=${encodeURIComponent(phone)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-24 pb-16 max-w-2xl mx-auto px-4">
      <h1 className="font-syne font-bold text-3xl mb-2">Customer Registration</h1>
      <p className="text-text-secondary mb-8">
        Register your face to pay at any FacePay merchant.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-text-secondary">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-bg-secondary border border-border text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-accent-blue"
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-text-secondary">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-bg-secondary border border-border text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-accent-blue"
            placeholder="255712345678"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-text-secondary">
            Mobile Money Network
          </label>
          <select
            value={phoneNetwork}
            onChange={(e) => setPhoneNetwork(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-bg-secondary border border-border text-text-primary focus:outline-none focus:border-accent-blue"
          >
            {NETWORKS.map((n) => (
              <option key={n.value} value={n.value}>
                {n.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-text-secondary">
            Face Capture
          </label>
          <FaceCapture
            onCapture={(img) => setFaceImage(img)}
            disabled={loading}
          />
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-accent-red/10 border border-accent-red/50 text-accent-red">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !faceImage}
          className="w-full py-4 rounded-lg bg-gradient-to-r from-accent-blue to-blue-500 text-bg-primary font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Registering..." : "Complete Registration"}
        </button>
      </form>

      <p className="mt-6 text-center text-text-secondary text-sm">
        Already registered?{" "}
        <Link href="/dashboard" className="text-accent-blue hover:underline">
          View Dashboard
        </Link>
      </p>
    </main>
  );
}
