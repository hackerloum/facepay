"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { TransactionCard } from "@/components/TransactionCard";

interface User {
  id: string;
  name: string;
  phone: string;
  phone_network: string;
  face_image_url: string | null;
}

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at?: string;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const phoneParam = searchParams.get("phone");
  const [phone, setPhone] = useState(phoneParam || "");
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchCustomer = async () => {
    if (!phone.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/customer?phone=${encodeURIComponent(phone.trim())}`);
      if (!res.ok) {
        if (res.status === 404) {
          setUser(null);
          setTransactions([]);
          return;
        }
        throw new Error("Failed to fetch");
      }
      const data = await res.json();
      setUser(data.user);
      setTransactions(data.transactions || []);
    } catch {
      setUser(null);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (phoneParam) {
      setPhone(phoneParam);
      setSearched(true);
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      fetch(`${apiUrl}/api/customer?phone=${encodeURIComponent(phoneParam)}`)
        .then((res) => (res.ok ? res.json() : Promise.reject(res)))
        .then((data) => {
          setUser(data.user);
          setTransactions(data.transactions || []);
        })
        .catch(() => {
          setUser(null);
          setTransactions([]);
        })
        .finally(() => setLoading(false));
    }
  }, [phoneParam]);

  const networkLabel =
    user?.phone_network === "TZ-AIRTEL-C2B"
      ? "Airtel"
      : user?.phone_network === "TZ-TIGO-C2B"
      ? "Tigo"
      : user?.phone_network === "TZ-HALOTEL-C2B"
      ? "Halotel"
      : user?.phone_network || "";

  return (
    <main className="pt-24 pb-16 max-w-2xl mx-auto px-4">
      <h1 className="font-syne font-bold text-3xl mb-2">Customer Dashboard</h1>
      <p className="text-text-secondary mb-8">
        Enter your phone number to view your profile and transaction history.
      </p>

      {!user ? (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="255712345678"
              className="flex-1 px-4 py-3 rounded-lg bg-bg-secondary border border-border text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-accent-blue"
            />
            <button
              onClick={fetchCustomer}
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-accent-blue to-blue-500 text-bg-primary font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Loading..." : "View"}
            </button>
          </div>
          {searched && !loading && (
            <p className="text-text-secondary">
              No customer found with this phone number.{" "}
              <Link href="/register" className="text-accent-blue hover:underline">
                Register now
              </Link>
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="p-6 rounded-xl bg-bg-secondary/50 border border-border">
            <div className="flex gap-6 items-center">
              {user.face_image_url ? (
                <img
                  src={user.face_image_url}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-accent-blue/50"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-bg-primary border-2 border-border flex items-center justify-center text-text-secondary">
                  ?
                </div>
              )}
              <div>
                <h2 className="font-syne font-semibold text-xl">{user.name}</h2>
                <p className="text-text-secondary">{user.phone}</p>
                <p className="text-accent-blue text-sm">{networkLabel}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-syne font-semibold text-lg mb-4">Transaction History</h3>
            {transactions.length === 0 ? (
              <p className="text-text-secondary">No transactions yet.</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <TransactionCard key={tx.id} transaction={tx} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <p className="mt-8 text-center text-text-secondary text-sm">
        <Link href="/" className="text-accent-blue hover:underline">
          Back to Home
        </Link>
      </p>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<main className="pt-24 pb-16 max-w-2xl mx-auto px-4"><p className="text-text-secondary">Loading...</p></main>}>
      <DashboardContent />
    </Suspense>
  );
}
