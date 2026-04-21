import { PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";
import { z } from "zod";
import { splitWithFee } from "@/lib/fees";
import { getPlatformTreasury } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { verifyAuddSubscriptionPayment } from "@/lib/verify-payment-tx";

const bodySchema = z.object({
  planId: z.string(),
  subscriberPubkey: z.string(),
  txSignature: z.string(),
});

function addInterval(from: Date, interval: string): Date {
  const d = new Date(from.getTime());
  if (interval === "month") {
    d.setMonth(d.getMonth() + 1);
    return d;
  }
  d.setMonth(d.getMonth() + 1);
  return d;
}

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { planId, subscriberPubkey, txSignature } = parsed.data;

  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  const total = BigInt(plan.amountAtomic);
  const { merchant, fee } = splitWithFee(total, plan.feeBps);
  const treasury = getPlatformTreasury();

  if (fee > 0n && !treasury) {
    return NextResponse.json(
      { error: "Server missing NEXT_PUBLIC_PLATFORM_TREASURY for fee plans" },
      { status: 500 },
    );
  }

  const ok = await verifyAuddSubscriptionPayment({
    txSignature,
    subscriber: new PublicKey(subscriberPubkey),
    merchant: new PublicKey(plan.merchantPubkey),
    treasury,
    expectedMerchantAtomic: merchant,
    expectedTreasuryAtomic: fee,
  });

  if (!ok) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  const now = new Date();
  const nextDue = addInterval(now, plan.interval);

  const subscription = await prisma.subscription.upsert({
    where: {
      planId_subscriberPubkey: { planId, subscriberPubkey },
    },
    create: {
      planId,
      subscriberPubkey,
      status: "active",
      nextDue,
      lastPaidTx: txSignature,
    },
    update: {
      status: "active",
      nextDue,
      lastPaidTx: txSignature,
    },
  });

  return NextResponse.json({ subscription });
}
