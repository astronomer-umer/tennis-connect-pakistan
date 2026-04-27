import { NextResponse } from "next/server";

export async function GET() {
  const commit = process.env.VERCEL_GIT_COMMIT_SHA || process.env.NEXT_PUBLIC_GIT_COMMIT || "dev-local";
  const deployedAt = process.env.VERCEL_DEPLOYMENT_CREATED_AT || new Date().toISOString();

  return NextResponse.json({
    commit,
    timestamp: deployedAt,
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    environment: process.env.NODE_ENV,
    buildNumber: process.env.VERCEL_DEPLOYMENT_ID || "local",
  });
}