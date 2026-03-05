import { betterAuth } from "better-auth";
import { createClient } from "@libsql/client";
import { LibsqlDialect } from "kysely-libsql";

const tursoUrl = process.env.TURSO_DATABASE_URL;

const tursoClient = createClient({
  url: tursoUrl || ":memory:",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

if (!tursoUrl) {
  console.warn(
    "TURSO_DATABASE_URL not set — better-auth using in-memory SQLite. Auth data will not persist between serverless invocations."
  );
}

export const auth = betterAuth({
  database: {
    dialect: new LibsqlDialect({ client: tursoClient }),
    type: "sqlite" as const,
  },
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    "http://localhost:3000",
    process.env.NEXT_PUBLIC_APP_URL || "https://tennis-connect-pakistan.vercel.app",
  ],
});

export type Session = typeof auth.$Infer.Session;
