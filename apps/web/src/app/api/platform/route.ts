import { NextResponse } from "next/server";

/**
 * Exposes the platform treasury pubkey for client-side tx building (fee split).
 * Set `PLATFORM_TREASURY` in the environment (same value the server uses).
 */
export async function GET() {
  const raw =
    process.env.PLATFORM_TREASURY?.trim() ??
    process.env.NEXT_PUBLIC_PLATFORM_TREASURY?.trim();
  const platformTreasury = raw && raw.length > 0 ? raw : null;
  return NextResponse.json({ platformTreasury });
}
