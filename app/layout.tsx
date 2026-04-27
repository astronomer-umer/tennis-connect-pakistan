import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { ServiceWorkerRegistrar } from "@/components/layout/ServiceWorkerRegistrar";
import { AnimatedBackground } from "@/components/providers/AnimatedBackground";
import { DebugPanel } from "@/components/DebugPanel";
import { SoundProvider } from "@/components/providers/SoundProvider";

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
  metadataBase: new URL("https://lezzplay.pk"),
  title: {
    default: "Vibe Up | Find Tennis Players & Courts",
    template: "%s | Vibe Up",
  },
  description:
    "Pakistan's tennis app. Find players, book courts, and vibe! Swipe to connect with players in your city.",
  applicationName: "Vibe Up",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TCP",
    startupImage: [
      {
        url: "/icons/icon-512.svg",
        media: "(device-width: 768px) and (device-height: 1024px)",
      },
    ],
  },
  formatDetection: { telephone: false },
  keywords: [
    "tennis",
    "pakistan",
    "courts",
    "players",
    "coaches",
    "lahore",
    "karachi",
    "islamabad",
    "tennis app",
    "book court",
    "find tennis partner",
    "sports networking",
  ],
  authors: [{ name: "Vibe Up" }],
  creator: "Vibe Up",
  publisher: "Vibe Up",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Vibe Up",
    title: "Vibe Up | Find Tennis Players & Courts",
    description: "Pakistan's tennis app. Find players, book courts, and vibe!",
    images: [
      {
        url: "/icons/icon-512.svg",
        width: 512,
        height: 512,
        alt: "Vibe Up",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibe Up",
    description: "Pakistan's tennis app. Find players, book courts, and vibe!",
    images: ["/icons/icon-512.svg"],
    creator: "@lezzplay_pk",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
  },
  manifest: "/manifest.ts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} antialiased overflow-x-hidden overscroll-none`}>
        <ServiceWorkerRegistrar />
        <AnimatedBackground>
          <SoundProvider>
            <main className="lg:max-w-none lg:w-full max-w-lg mx-auto relative overflow-x-hidden">
              {children}
            </main>
            <BottomTabBar />
          </SoundProvider>
        </AnimatedBackground>
        <DebugPanel />
      </body>
    </html>
  );
}
