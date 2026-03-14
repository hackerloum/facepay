"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { TransactionCard } from "@/components/TransactionCard";

interface Merchant {
  id: string;
  shop_name: string;
  owner_name: string;
}

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at?: string;
}

export default function MerchantDashboardPage() {
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/merchant/login";
        return;
      }
      const { data: merchantData } = await supabase
        .from("merchants")
        .select("id, shop_name, owner_name")
        .eq("user_id", user.id)
        .single();
      if (!merchantData) {
        setLoading(false);
        return;
      }
      setMerchant(merchantData);
      const today = new Date().toISOString().split("T")[0];
      const { data: txData } = await supabase
        .from("transactions")
        .select("*")
        .eq("merchant_id", merchantData.id)
        .gte("created_at", `${today}T00:00:00Z`)
        .order("created_at", { ascending: false })
        .limit(20);
      setTransactions(txData || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <main className="pt-24 pb-16 max-w-2xl mx-auto px-4">
        <p className="text-text-secondary">Loading...</p>
      </main>
    );
  }

  if (!merchant) {
    return (
      <main className="pt-24 pb-16 max-w-2xl mx-auto px-4">
        <p className="text-text-secondary">
          No merchant account found.{" "}
          <Link href="/merchant/register" className="text-accent-blue hover:underline">
            Register your shop
          </Link>
        </p>
      </main>
    );
  }

  const todayTotal = transactions
    .filter((t) => t.status === "SUCCESS")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <main className="pt-24 pb-16 max-w-2xl mx-auto px-4">
      <h1 className="font-syne font-bold text-3xl mb-2">{merchant.shop_name}</h1>
      <p className="text-text-secondary mb-8">Merchant Dashboard</p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="p-6 rounded-xl bg-bg-secondary/50 border border-border">
          <p className="text-text-secondary text-sm">Today&apos;s Transactions</p>
          <p className="font-syne font-bold text-2xl mt-1">{transactions.length}</p>
        </div>
        <div className="p-6 rounded-xl bg-bg-secondary/50 border border-border">
          <p className="text-text-secondary text-sm">Today&apos;s Total (TZS)</p>
          <p className="font-syne font-bold text-2xl text-accent-green mt-1">
            {todayTotal.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <a
          href="facepay://scan"
          className="inline-flex items-center justify-center w-full py-4 rounded-lg bg-gradient-to-r from-accent-blue to-blue-500 text-bg-primary font-semibold hover:opacity-90 transition-opacity"
        >
          Open Scanner App
        </a>
        <p className="mt-2 text-center text-text-secondary text-sm">
          Use the FacePay mobile app to scan customer faces
        </p>
      </div>

      <div>
        <h3 className="font-syne font-semibold text-lg mb-4">Recent Transactions</h3>
        {transactions.length === 0 ? (
          <p className="text-text-secondary">No transactions today.</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <TransactionCard key={tx.id} transaction={tx} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
