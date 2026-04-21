"use client";

import { atomicToAudString } from "@/lib/amount";
import { buildAudSubscriptionPaymentTx } from "@/lib/payment";
import { billingPeriodPhrase } from "@/lib/billing-interval";
import { parsePlanCustomFields } from "@/lib/plan-custom-fields";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Plan = {
  id: string;
  merchantPubkey: string;
  name: string;
  amountAtomic: string;
  interval: string;
  feeBps: number;
  customFields: unknown;
};

export default function EmbedCheckoutPage() {
  const params = useParams<{ planId: string }>();
  const planId = params.planId;
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [platformTreasury, setPlatformTreasury] = useState<PublicKey | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [doneSig, setDoneSig] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [planRes, platformRes] = await Promise.all([
          fetch(`/api/plans/${planId}`),
          fetch("/api/platform"),
        ]);
        const planData = await planRes.json();
        if (!planRes.ok) throw new Error(planData.error ?? "Plan not found");
        const platformData = (await platformRes.json()) as {
          platformTreasury: string | null;
        };
        if (!cancelled) {
          setPlan(planData.plan);
          const raw = platformData.platformTreasury?.trim();
          setPlatformTreasury(raw ? new PublicKey(raw) : null);
        }
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : "Failed to load");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [planId]);

  async function pay() {
    if (!plan || !publicKey) return;
    setBusy(true);
    setPayError(null);
    try {
      const tx = await buildAudSubscriptionPaymentTx({
        connection,
        subscriber: publicKey,
        merchant: new PublicKey(plan.merchantPubkey),
        amountAtomic: BigInt(plan.amountAtomic),
        feeBps: plan.feeBps,
        platformTreasury,
      });
      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction(sig, "confirmed");

      const res = await fetch("/api/subscriptions/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          subscriberPubkey: publicKey.toBase58(),
          txSignature: sig,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Confirmation failed");

      setDoneSig(sig);
    } catch (e) {
      setPayError(e instanceof Error ? e.message : "Payment failed");
    } finally {
      setBusy(false);
    }
  }

  if (loadError) {
    return <div className="p-6 text-sm text-red-800">{loadError}</div>;
  }

  if (!plan) {
    return (
      <div className="p-6 font-mono-ui text-sm text-muted">
        Loading…
      </div>
    );
  }

  const price = atomicToAudString(BigInt(plan.amountAtomic));
  const checkoutExtras = parsePlanCustomFields(plan.customFields);

  return (
    <div className="flex min-h-[480px] flex-col gap-6 p-6 sm:p-8">
      <div className="border-2 border-fg bg-paper-bright p-5">
        <p className="font-mono-ui text-[10px] font-medium uppercase tracking-[0.28em] text-muted">
          Checkout · AUDD
        </p>
        <h1 className="font-display mt-2 text-xl font-semibold text-fg">{plan.name}</h1>
        <p className="mt-2 text-sm text-muted">
          {price} AUD / {billingPeriodPhrase(plan.interval)} · settled on Solana
        </p>
        {checkoutExtras.length > 0 && (
          <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
            {checkoutExtras.map((row, i) => (
              <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3" key={`extra-${i}`}>
                <dt className="font-medium text-fg sm:min-w-[7rem]">{row.label}</dt>
                <dd className="text-muted">{row.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <WalletMultiButton />
      </div>

      {connected && publicKey && (
        <button className="btn-primary w-fit" disabled={busy} onClick={() => void pay()} type="button">
          {busy
            ? "Confirm in wallet…"
            : `Pay ${price} AUDD / ${billingPeriodPhrase(plan.interval)}`}
        </button>
      )}

      {payError && <p className="text-sm text-red-800">{payError}</p>}
      {doneSig && (
        <p className="font-mono-ui text-xs text-muted">
          Paid. Tx{" "}
          <a
            className="font-semibold text-blue underline underline-offset-2 hover:text-fg"
            href={`https://solscan.io/tx/${doneSig}`}
            rel="noreferrer"
            target="_blank"
          >
            {doneSig.slice(0, 8)}…
          </a>
        </p>
      )}
    </div>
  );
}
