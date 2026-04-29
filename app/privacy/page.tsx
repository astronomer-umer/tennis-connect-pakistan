import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | PlayPlan",
  description: "Privacy Policy for PlayPlan",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-dvh bg-background p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm mb-4">Last updated: March 2026</p>

        <div className="space-y-6 text-foreground/90">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">1. Information We Collect</h2>
            <p className="text-sm">
              We collect information you provide directly to us, including: name, email, phone number, city, tennis level, and profile photos when you create an account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>To provide and maintain our services</li>
              <li>To help you connect with other tennis players</li>
              <li>To send you updates and promotional content</li>
              <li>To improve and optimize our app</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">3. Data Storage</h2>
            <p className="text-sm">
              Your data is stored securely using Turso database services. We implement appropriate security measures to protect your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">4. Data Sharing</h2>
            <p className="text-sm">
              We do not sell, trade, or otherwise transfer your personal information to outside parties. We may share information with service providers who assist us in operating our app.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">5. Your Rights</h2>
            <p className="text-sm">
              You have the right to access, update, or delete your personal information at any time through your profile settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">6. Contact</h2>
            <p className="text-sm">
              If you have any questions about this Privacy Policy, please contact us through the app.
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
