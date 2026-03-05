import { betterAuth } from "better-auth";
import { createClient } from "@libsql/client";
import { LibsqlDialect } from "kysely-libsql";

const tursoClient = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:local-auth.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

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
