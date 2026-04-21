import nacl from "tweetnacl";
import { PublicKey } from "@solana/web3.js";

/**
 * Verifies a wallet `signMessage` signature (ed25519 over the exact message bytes).
 */
export function verifyWalletMessage(
  publicKeyBase58: string,
  messageUtf8: string,
  signatureBase58: string,
): boolean {
  try {
    const pubkey = new PublicKey(publicKeyBase58).toBytes();
    const sig = Buffer.from(signatureBase58, "base64");
    const msg = new TextEncoder().encode(messageUtf8);
    return nacl.sign.detached.verify(msg, sig, pubkey);
  } catch {
    return false;
  }
}
