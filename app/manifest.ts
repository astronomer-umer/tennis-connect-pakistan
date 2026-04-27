import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vibe Up | Pakistan",
    short_name: "Vibe Up",
    description: "Find tennis players & book courts in Pakistan. Let's play!",
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
        name: "Find Players",
        short_name: "Players",
        description: "Discover tennis players near you",
        url: "/",
        icons: [{ src: "/icons/icon-192.svg", sizes: "192x192" }],
      },
      {
        name: "Book Courts",
        short_name: "Courts",
        description: "Browse & book tennis courts",
        url: "/courts",
        icons: [{ src: "/icons/icon-192.svg", sizes: "192x192" }],
      },
      {
        name: "Matches",
        short_name: "Matches",
        description: "View your matches",
        url: "/matches",
        icons: [{ src: "/icons/icon-192.svg", sizes: "192x192" }],
      },
    ],
    screenshots: [],
    related_applications: [],
    prefer_related_applications: false,
  };
}