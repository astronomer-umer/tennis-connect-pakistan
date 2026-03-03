import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { ServiceWorkerRegistrar } from "@/components/layout/ServiceWorkerRegistrar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  themeColor: "#00ff9d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Tennis Connect Pakistan",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} antialiased min-h-dvh`}>
        <ThemeProvider>
          <ServiceWorkerRegistrar />
          <main className="lg:max-w-none lg:w-full max-w-lg mx-auto relative min-h-dvh bg-gradient-light dark:bg-gradient-dark transition-colors duration-300">
            {children}
          </main>
          <BottomTabBar />
        </ThemeProvider>
      </body>
    </html>
  );
}
