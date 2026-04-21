import { NextResponse } from "next/server";
import { z } from "zod";
import { audToAtomic } from "@/lib/amount";
import { prisma } from "@/lib/prisma";
import { verifyWalletMessage } from "@/lib/wallet-verify";

const createBody = z.object({
  publicKey: z.string(),
  signature: z.string(),
  payload: z.object({
    v: z.literal(1),
    action: z.literal("create_plan"),
    merchantPubkey: z.string(),
    name: z.string().min(1).max(120),
    amountAud: z.string(),
    interval: z.enum(["month"]),
    feeBps: z.number().int().min(0).max(10_000),
    ts: z.number(),
  }),
});

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = createBody.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { publicKey, signature, payload } = parsed.data;
  if (publicKey !== payload.merchantPubkey) {
    return NextResponse.json({ error: "publicKey mismatch" }, { status: 400 });
  }

  const age = Date.now() - payload.ts;
  if (Math.abs(age) > 5 * 60 * 1000) {
    return NextResponse.json({ error: "Stale signature" }, { status: 400 });
  }

  const message = `audd-subs:create:v1|${JSON.stringify(payload)}`;
  const ok = verifyWalletMessage(publicKey, message, signature);
  if (!ok) {
    return NextResponse.json({ error: "Bad signature" }, { status: 401 });
  }

  let amountAtomic: bigint;
  try {
    amountAtomic = audToAtomic(payload.amountAud);
  } catch {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  if (amountAtomic <= 0n) {
    return NextResponse.json({ error: "Amount must be positive" }, { status: 400 });
  }

  const plan = await prisma.plan.create({
    data: {
      merchantPubkey: payload.merchantPubkey,
      name: payload.name,
      amountAtomic: amountAtomic.toString(),
      interval: payload.interval,
      feeBps: payload.feeBps,
    },
  });

  return NextResponse.json({ plan });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const merchant = searchParams.get("merchant");
  if (!merchant) {
    return NextResponse.json({ error: "merchant required" }, { status: 400 });
  }

  const plans = await prisma.plan.findMany({
    where: { merchantPubkey: merchant },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ plans });
}
