"use client";

import { createAuthClient } from "better-auth/react";
import type { ReactNode } from "react";

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const { useSession, signIn, signOut, signUp } = authClient;

export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
