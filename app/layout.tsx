import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { SignUpBanner } from "@/components/layout/SignUpBanner";
import { ServiceWorkerRegistrar } from "@/components/layout/ServiceWorkerRegistrar";
import { AnimatedBackground } from "@/components/providers/AnimatedBackground";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  themeColor: "#22c55e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Tennis Connect Pakistan | Find Courts & Players",
  description:
    "Connect with Pakistani tennis players, book premium courts & find elite coaches. The sleekest tennis community app in Pakistan.",
  applicationName: "Tennis Connect Pakistan",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TCP",
  },
  formatDetection: { telephone: false },
  keywords: ["tennis", "pakistan", "courts", "players", "coaches", "lahore", "karachi", "islamabad"],
  openGraph: {
    title: "Tennis Connect Pakistan",
    description: "Connect with Pakistani tennis players, book premium courts & find elite coaches.",
    url: "https://tennis-connect-pakistan.vercel.app",
    siteName: "Tennis Connect Pakistan",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tennis Connect Pakistan",
    description: "Connect with Pakistani tennis players, book premium courts & find elite coaches.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} antialiased min-h-dvh`}>
        <ServiceWorkerRegistrar />
        <AnimatedBackground>
          <SignUpBanner />
          <main className="lg:max-w-none lg:w-full max-w-lg mx-auto relative min-h-dvh">
            {children}
          </main>
          <BottomTabBar />
        </AnimatedBackground>
      </body>
    </html>
  );
}
