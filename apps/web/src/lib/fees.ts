export function splitWithFee(total: bigint, feeBps: number): { merchant: bigint; fee: bigint } {
  if (feeBps < 0 || feeBps > 10_000) {
    throw new Error("feeBps must be 0 to 10000");
  }
  const fee = (total * BigInt(feeBps)) / 10_000n;
  return { merchant: total - fee, fee };
}
