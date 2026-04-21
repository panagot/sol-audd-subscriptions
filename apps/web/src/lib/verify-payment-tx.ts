import { Connection, PublicKey } from "@solana/web3.js";
import type { ParsedTransactionWithMeta } from "@solana/web3.js";
import { AUDD_MINT, getRpcUrl } from "@/lib/env";

function tokenDeltaForOwner(
  tx: ParsedTransactionWithMeta,
  owner: PublicKey,
  mint: PublicKey,
): bigint {
  const pre = tx.meta?.preTokenBalances ?? [];
  const post = tx.meta?.postTokenBalances ?? [];
  const mintStr = mint.toBase58();
  const ownerStr = owner.toBase58();

  const preAmt = sumFor(pre, ownerStr, mintStr);
  const postAmt = sumFor(post, ownerStr, mintStr);
  return postAmt - preAmt;
}

function sumFor(
  rows:
    | NonNullable<ParsedTransactionWithMeta["meta"]>["postTokenBalances"]
    | null
    | undefined,
  ownerStr: string,
  mintStr: string,
): bigint {
  let sum = 0n;
  for (const row of rows ?? []) {
    if (row.mint !== mintStr) continue;
    if (row.owner !== ownerStr) continue;
    const amt = row.uiTokenAmount?.amount ?? "0";
    sum += BigInt(amt);
  }
  return sum;
}

export async function verifyAuddSubscriptionPayment(opts: {
  txSignature: string;
  subscriber: PublicKey;
  merchant: PublicKey;
  treasury: PublicKey | null;
  expectedMerchantAtomic: bigint;
  expectedTreasuryAtomic: bigint;
}): Promise<boolean> {
  const connection = new Connection(getRpcUrl(), "confirmed");
  const parsed = await connection.getParsedTransaction(opts.txSignature, {
    maxSupportedTransactionVersion: 0,
  });

  if (!parsed || parsed.meta?.err) return false;

  const subDec = tokenDeltaForOwner(parsed, opts.subscriber, AUDD_MINT);
  if (subDec >= 0n) return false;

  const paidOut = -subDec;

  const merInc = tokenDeltaForOwner(parsed, opts.merchant, AUDD_MINT);
  const treInc = opts.treasury
    ? tokenDeltaForOwner(parsed, opts.treasury, AUDD_MINT)
    : 0n;

  if (merInc < opts.expectedMerchantAtomic) return false;
  if (opts.treasury && treInc < opts.expectedTreasuryAtomic) return false;
  if (!opts.treasury && opts.expectedTreasuryAtomic > 0n) return false;

  if (merInc + treInc !== paidOut) return false;

  return true;
}
