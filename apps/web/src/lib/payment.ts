"use client";

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { AUDD_DECIMALS, AUDD_MINT, getPlatformTreasury } from "@/lib/env";
import { splitWithFee } from "@/lib/fees";

export async function buildAudSubscriptionPaymentTx(opts: {
  connection: Connection;
  subscriber: PublicKey;
  merchant: PublicKey;
  amountAtomic: bigint;
  feeBps: number;
}): Promise<Transaction> {
  const treasury = getPlatformTreasury();
  const { merchant, fee } = splitWithFee(opts.amountAtomic, opts.feeBps);

  if (fee > 0n && !treasury) {
    throw new Error(
      "This plan charges a platform fee but NEXT_PUBLIC_PLATFORM_TREASURY is not configured.",
    );
  }

  const subscriberAta = getAssociatedTokenAddressSync(
    AUDD_MINT,
    opts.subscriber,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );
  const merchantAta = getAssociatedTokenAddressSync(
    AUDD_MINT,
    opts.merchant,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );

  const tx = new Transaction();

  if (merchant > 0n) {
    const info = await opts.connection.getAccountInfo(merchantAta);
    if (!info) {
      tx.add(
        createAssociatedTokenAccountInstruction(
          opts.subscriber,
          merchantAta,
          opts.merchant,
          AUDD_MINT,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID,
        ),
      );
    }
  }

  if (fee > 0n && treasury) {
    const treasuryAta = getAssociatedTokenAddressSync(
      AUDD_MINT,
      treasury,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );
    const tInfo = await opts.connection.getAccountInfo(treasuryAta);
    if (!tInfo) {
      tx.add(
        createAssociatedTokenAccountInstruction(
          opts.subscriber,
          treasuryAta,
          treasury,
          AUDD_MINT,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID,
        ),
      );
    }
  }

  const subInfo = await opts.connection.getAccountInfo(subscriberAta);
  if (!subInfo) {
    throw new Error(
      "No AUDD token account found for your wallet. Fund AUDD first.",
    );
  }

  if (merchant > 0n) {
    tx.add(
      createTransferCheckedInstruction(
        subscriberAta,
        AUDD_MINT,
        merchantAta,
        opts.subscriber,
        merchant,
        AUDD_DECIMALS,
        [],
        TOKEN_PROGRAM_ID,
      ),
    );
  }

  if (fee > 0n && treasury) {
    const treasuryAta = getAssociatedTokenAddressSync(
      AUDD_MINT,
      treasury,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );
    tx.add(
      createTransferCheckedInstruction(
        subscriberAta,
        AUDD_MINT,
        treasuryAta,
        opts.subscriber,
        fee,
        AUDD_DECIMALS,
        [],
        TOKEN_PROGRAM_ID,
      ),
    );
  }

  const { blockhash } = await opts.connection.getLatestBlockhash("confirmed");
  tx.feePayer = opts.subscriber;
  tx.recentBlockhash = blockhash;

  return tx;
}
