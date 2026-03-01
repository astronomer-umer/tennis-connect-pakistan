"use client";

import { createAuthClient } from "better-auth/react";
import type { ReactNode } from "react";

const authClient = createAuthClient({
  baseURL: "/api/auth",
});

export const { useSession, signIn, signOut, signUp } = authClient;

export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
