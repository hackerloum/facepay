"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function MerchantRegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [temboAccountId, setTemboAccountId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error("Sign up failed");

      const { error: insertError } = await supabase.from("merchants").insert({
        user_id: authData.user.id,
        shop_name: shopName,
        owner_name: ownerName,
        tembo_account_id: temboAccountId || null,
      });
      if (insertError) throw insertError;

      router.push("/merchant/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-24 pb-16 max-w-md mx-auto px-4">
      <h1 className="font-syne font-bold text-3xl mb-2">Register Your Shop</h1>
      <p className="text-text-secondary mb-8">
        Create a merchant account to accept FacePay payments.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-bg-secondary border border-border text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-accent-blue"
            placeholder="merchant@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-lg bg-bg-secondary border border-border text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-accent-blue"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Shop Name
          </label>
          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-bg-secondary border border-border text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-accent-blue"
            placeholder="My Store"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Owner Name
          </label>
          <input
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-bg-secondary border border-border text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-accent-blue"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Tembo Account ID (optional)
          </label>
          <input
            type="text"
            value={temboAccountId}
            onChange={(e) => setTemboAccountId(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-bg-secondary border border-border text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-accent-blue"
            placeholder="From TemboPlus dashboard"
          />
        </div>
        {error && (
          <div className="p-4 rounded-lg bg-accent-red/10 border border-accent-red/50 text-accent-red text-sm">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-lg bg-gradient-to-r from-accent-blue to-blue-500 text-bg-primary font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-text-secondary text-sm">
        Already have an account?{" "}
        <Link href="/merchant/login" className="text-accent-blue hover:underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
