import Link from "next/link";

export const metadata = {
  title: "Terms of Service | PlayPlan",
  description: "Terms of Service for PlayPlan",
};

export default function TermsOfService() {
  return (
    <div className="min-h-dvh bg-background p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">Terms of Service</h1>
        <p className="text-muted-foreground text-sm mb-4">Last updated: March 2026</p>

        <div className="space-y-6 text-foreground/90">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">1. Acceptance of Terms</h2>
            <p className="text-sm">
              By accessing and using PlayPlan, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">2. Use License</h2>
            <p className="text-sm">
              Permission is granted to temporarily use PlayPlan for personal, non-commercial use only. This is the grant of a license, not a transfer of title.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">3. User Account</h2>
            <p className="text-sm">
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">4. Prohibited Uses</h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Use the app for any unlawful purpose</li>
              <li>Harass, abuse, or harm another person</li>
              <li>Submit false or misleading information</li>
              <li>Upload viruses or malicious code</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">5. Limitation of Liability</h2>
            <p className="text-sm">
              PlayPlan shall not be liable for any indirect, incidental, or consequential damages arising out of your use of the app.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">6. Contact</h2>
            <p className="text-sm">
              If you have any questions about these Terms, please contact us through the app.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <Link href="/" className="text-lime-500 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
