import { AUDD_DECIMALS } from "@/lib/env";

export function audToAtomic(aud: string): bigint {
  const trimmed = aud.trim();
  if (!/^\d+(\.\d+)?$/.test(trimmed)) {
    throw new Error("Invalid AUD amount");
  }
  const [whole, frac = ""] = trimmed.split(".");
  if (frac.length > AUDD_DECIMALS) {
    throw new Error(`Too many decimal places (max ${AUDD_DECIMALS})`);
  }
  const paddedFrac = frac.padEnd(AUDD_DECIMALS, "0");
  const atomic = BigInt(whole + paddedFrac);
  return atomic;
}

export function atomicToAudString(atomic: bigint): string {
  const base = 10n ** BigInt(AUDD_DECIMALS);
  const whole = atomic / base;
  const frac = atomic % base;
  if (frac === 0n) return whole.toString();
  const fracStr = frac.toString().padStart(AUDD_DECIMALS, "0").replace(/0+$/, "");
  return `${whole.toString()}.${fracStr}`;
}
