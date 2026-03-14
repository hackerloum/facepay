"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg-primary/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-syne font-bold text-xl text-accent-blue">
            FacePay
          </Link>
          <div className="flex gap-6">
            <Link
              href="/register"
              className="text-text-secondary hover:text-accent-blue transition-colors"
            >
              Register
            </Link>
            <Link
              href="/merchant/login"
              className="text-text-secondary hover:text-accent-blue transition-colors"
            >
              Merchant Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
