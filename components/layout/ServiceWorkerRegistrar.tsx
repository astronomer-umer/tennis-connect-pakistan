"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => console.log("[TCP] SW registered:", reg.scope))
        .catch((err) => console.warn("[TCP] SW registration failed:", err));
    }
  }, []);

  return null;
}
