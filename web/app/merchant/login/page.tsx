"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function MerchantLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push("/merchant/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-24 pb-16 max-w-md mx-auto px-4">
      <h1 className="font-syne font-bold text-3xl mb-2">Merchant Login</h1>
      <p className="text-text-secondary mb-8">
        Sign in to access your merchant dashboard.
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
            className="w-full px-4 py-3 rounded-lg bg-bg-secondary border border-border text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-accent-blue"
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
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-text-secondary text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/merchant/register" className="text-accent-blue hover:underline">
          Register your shop
        </Link>
      </p>
    </main>
  );
}
