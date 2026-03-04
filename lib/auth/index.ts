import { betterAuth } from "better-auth";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    "http://localhost:3000",
    process.env.NEXT_PUBLIC_APP_URL || "https://tennis-connect-pakistan.vercel.app",
  ],
});

export type Session = typeof auth.$Infer.Session;
