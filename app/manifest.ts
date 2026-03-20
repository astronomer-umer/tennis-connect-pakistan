import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tennis Connect Pakistan",
    short_name: "TCP",
    description: "Pakistan's premier tennis networking app. Find players, book courts, and grow the tennis community.",
    start_url: "/",
    scope: "/",
    id: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    background_color: "#0a1628",
    theme_color: "#22c55e",
    orientation: "portrait-primary",
    lang: "en",
    dir: "ltr",
    categories: ["sports", "lifestyle", "social networking"],
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Discover Players",
        short_name: "Discover",
        description: "Find tennis players in your area",
        url: "/",
        icons: [{ src: "/icons/icon-192.svg", sizes: "192x192" }],
      },
      {
        name: "Book Courts",
        short_name: "Courts",
        description: "Browse and book tennis courts",
        url: "/courts",
        icons: [{ src: "/icons/icon-192.svg", sizes: "192x192" }],
      },
      {
        name: "View Matches",
        short_name: "Matches",
        description: "See your matches and chats",
        url: "/matches",
        icons: [{ src: "/icons/icon-192.svg", sizes: "192x192" }],
      },
    ],
    screenshots: [],
    related_applications: [],
    prefer_related_applications: false,
  };
}
