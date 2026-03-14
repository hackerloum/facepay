import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 via-transparent to-accent-blue/5" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <h1 className="font-syne font-bold text-4xl sm:text-5xl lg:text-6xl text-center max-w-4xl mx-auto leading-tight">
            Pay with Your Face.
            <br />
            <span className="text-accent-blue">No Cards. No Cash.</span>
          </h1>
          <p className="mt-6 text-lg text-text-secondary text-center max-w-2xl mx-auto">
            Register your face once. Scan at any shop. Confirm on your phone. Fast, secure payments with Airtel, Tigo, and HaloPesa.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-gradient-to-r from-accent-blue to-blue-500 text-bg-primary font-semibold hover:opacity-90 transition-opacity"
            >
              Register Now
            </Link>
            <Link
              href="/merchant/login"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg border border-border text-text-primary font-semibold hover:border-accent-blue hover:text-accent-blue transition-colors"
            >
              Merchant Login
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-syne font-bold text-3xl text-center mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-bg-secondary/50 border border-border rounded-xl p-8 backdrop-blur">
              <div className="w-12 h-12 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue font-bold text-xl mb-4">
                1
              </div>
              <h3 className="font-syne font-semibold text-xl mb-2">Register Face</h3>
              <p className="text-text-secondary">
                Sign up on the web portal with your name, phone, and a quick face scan. Your face is securely stored and linked to your mobile money.
              </p>
            </div>
            <div className="bg-bg-secondary/50 border border-border rounded-xl p-8 backdrop-blur">
              <div className="w-12 h-12 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue font-bold text-xl mb-4">
                2
              </div>
              <h3 className="font-syne font-semibold text-xl mb-2">Scan at Shop</h3>
              <p className="text-text-secondary">
                Merchants scan your face at the point of sale. Instant recognition — no cards or cash needed.
              </p>
            </div>
            <div className="bg-bg-secondary/50 border border-border rounded-xl p-8 backdrop-blur">
              <div className="w-12 h-12 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue font-bold text-xl mb-4">
                3
              </div>
              <h3 className="font-syne font-semibold text-xl mb-2">Confirm on Phone</h3>
              <p className="text-text-secondary">
                Receive a USSD push on your phone. Enter your PIN to confirm. Payment complete.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-syne font-bold text-3xl text-center mb-16">
            Why FacePay
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-accent-green text-3xl mb-2">&#10003;</div>
              <h3 className="font-syne font-semibold">Secure</h3>
              <p className="text-text-secondary text-sm mt-1">Face data encrypted. PIN required for every payment.</p>
            </div>
            <div className="text-center">
              <div className="text-accent-blue text-3xl mb-2">&#9733;</div>
              <h3 className="font-syne font-semibold">Fast</h3>
              <p className="text-text-secondary text-sm mt-1">Scan and pay in seconds. No fumbling for cards.</p>
            </div>
            <div className="text-center">
              <div className="text-accent-blue text-3xl mb-2">&#128176;</div>
              <h3 className="font-syne font-semibold">Mobile Money</h3>
              <p className="text-text-secondary text-sm mt-1">Works with M-Pesa, Airtel, HaloPesa.</p>
            </div>
            <div className="text-center">
              <div className="text-accent-blue text-3xl mb-2">&#128274;</div>
              <h3 className="font-syne font-semibold">No Cards</h3>
              <p className="text-text-secondary text-sm mt-1">Your face is your payment method.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Networks */}
      <section className="py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-syne font-bold text-3xl mb-4">Supported Networks</h2>
          <p className="text-text-secondary mb-12">Pay with your preferred mobile money provider</p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="px-6 py-3 rounded-lg border border-border bg-bg-secondary/50">
              <span className="font-syne font-semibold text-accent-blue">Airtel Money</span>
            </div>
            <div className="px-6 py-3 rounded-lg border border-border bg-bg-secondary/50">
              <span className="font-syne font-semibold text-accent-blue">HaloPesa</span>
            </div>
            <div className="px-6 py-3 rounded-lg border border-border bg-bg-secondary/50">
              <span className="font-syne font-semibold text-accent-blue">Mixx by Yas (Tigo)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-text-secondary text-sm">
          Built for Africa · Powered by Face AI · FacePay MVP v1.0
        </div>
      </footer>
    </main>
  );
}
