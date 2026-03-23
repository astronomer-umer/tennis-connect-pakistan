import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
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
  metadataBase: new URL("https://tennis-connect-pakistan.vercel.app"),
  title: {
    default: "Tennis Connect Pakistan | Find Courts & Players",
    template: "%s | Tennis Connect Pakistan",
  },
  description:
    "Pakistan's premier tennis networking app. Find players, book courts, and grow the tennis community. Swipe-based matching, real-time chat, and seamless court booking.",
  applicationName: "Tennis Connect Pakistan",
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
  authors: [{ name: "Tennis Connect Pakistan" }],
  creator: "Tennis Connect Pakistan",
  publisher: "Tennis Connect Pakistan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Tennis Connect Pakistan",
    title: "Tennis Connect Pakistan | Find Courts & Players",
    description: "Pakistan's premier tennis networking app. Find players, book courts, and grow the tennis community.",
    images: [
      {
        url: "/icons/icon-512.svg",
        width: 512,
        height: 512,
        alt: "Tennis Connect Pakistan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tennis Connect Pakistan",
    description: "Pakistan's premier tennis networking app. Find players, book courts, and grow the tennis community.",
    images: ["/icons/icon-512.svg"],
    creator: "@tennisconnectpk",
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
      <body className={`${geist.variable} antialiased min-h-dvh`}>
        <ServiceWorkerRegistrar />
        <AnimatedBackground>
          <main className="lg:max-w-none lg:w-full max-w-lg mx-auto relative min-h-dvh">
            {children}
          </main>
          <BottomTabBar />
        </AnimatedBackground>
      </body>
    </html>
  );
}
