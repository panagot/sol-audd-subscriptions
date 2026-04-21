import { PublicKey } from "@solana/web3.js";

export const AUDD_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_AUDD_MINT ??
    "AUDDttiEpCydTm7joUMbYddm72jAWXZnCpPZtDoxqBSw",
);

export const AUDD_DECIMALS = Number(
  process.env.NEXT_PUBLIC_AUDD_DECIMALS ?? "6",
);

export function getRpcUrl() {
  return (
    process.env.NEXT_PUBLIC_SOLANA_RPC ?? "https://api.mainnet-beta.solana.com"
  );
}

export function getAppUrl() {
  const url = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return url.replace(/\/$/, "");
}

/** Server-side only. For browser payment construction, use `GET /api/platform`. */
export function getPlatformTreasury(): PublicKey | null {
  const raw =
    process.env.PLATFORM_TREASURY?.trim() ??
    process.env.NEXT_PUBLIC_PLATFORM_TREASURY?.trim();
  if (!raw) return null;
  try {
    return new PublicKey(raw);
  } catch {
    return null;
  }
}
