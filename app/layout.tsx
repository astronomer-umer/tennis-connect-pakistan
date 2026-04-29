import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { GoogleAnalytics } from "@/components/providers/GoogleAnalytics";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://playplan.vercel.app"),
  title: {
    default: "PlayPlan | Find Tennis Players & Courts",
    template: "%s | PlayPlan",
  },
  description:
    "Pakistan's tennis & padel app. Swipe. Match. Play. Find players, book courts!",
  applicationName: "PlayPlan",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PlayPlan",
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
    "padel",
    "pakistan",
    "courts",
    "players",
    "coaches",
    "lahore",
    "karachi",
    "islamabad",
    "tennis app",
    "padel app",
    "book court",
    "find tennis partner",
    "sports networking",
  ],
  authors: [{ name: "CLARITI" }],
  creator: "CLARITI",
  publisher: "CLARITI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "PlayPlan",
    title: "PlayPlan | Swipe. Match. Play.",
    description: "Pakistan's tennis & padel app. Find players, book courts!",
    images: [
      {
        url: "/icons/icon-512.svg",
        width: 512,
        height: 512,
        alt: "PlayPlan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PlayPlan",
    description: "Pakistan's tennis & padel app. Swipe. Match. Play.",
    images: ["/icons/icon-512.svg"],
    creator: "@clariti_pk",
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
        <GoogleAnalytics />
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
