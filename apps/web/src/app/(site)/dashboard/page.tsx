"use client";

import { atomicToAudString } from "@/lib/amount";
import { uint8ToBase64 } from "@/lib/b64";
import { getAppUrl } from "@/lib/env";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type PlanRow = {
  id: string;
  name: string;
  amountAtomic: string;
  interval: string;
  feeBps: number;
  createdAt: string;
};

export default function DashboardPage() {
  const { publicKey, signMessage, connected } = useWallet();
  const { connection } = useConnection();
  const appUrl = useMemo(() => getAppUrl(), []);

  const [name, setName] = useState("Pro");
  const [amountAud, setAmountAud] = useState("10");
  const [feeBps, setFeeBps] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<PlanRow[]>([]);

  const load = useCallback(async () => {
    if (!publicKey) return;
    const res = await fetch(`/api/plans?merchant=${publicKey.toBase58()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Failed to load plans");
    setPlans(data.plans);
  }, [publicKey]);

  useEffect(() => {
    void load().catch(() => {});
  }, [load]);

  async function createPlan(e: React.FormEvent) {
    e.preventDefault();
    if (!publicKey || !signMessage) return;
    setBusy(true);
    setError(null);
    try {
      const payload = {
        v: 1 as const,
        action: "create_plan" as const,
        merchantPubkey: publicKey.toBase58(),
        name,
        amountAud,
        interval: "month" as const,
        feeBps,
        ts: Date.now(),
      };
      const message = `audd-subs:create:v1|${JSON.stringify(payload)}`;
      const sig = await signMessage(new TextEncoder().encode(message));
      const signature = uint8ToBase64(sig);

      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey: publicKey.toBase58(), signature, payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create plan");

      setName("Pro");
      setAmountAud("10");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10">
      <div>
        <p className="font-mono-ui text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
          Merchants
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 text-muted">
          Create AUDD plans and copy the embed snippet, or see{" "}
          <Link
            className="font-semibold text-blue underline decoration-neutral-400 underline-offset-4 hover:text-fg"
            href="/integrations"
          >
            integration examples
          </Link>{" "}
          for web apps and mobile.
        </p>
      </div>

      <header className="card-surface flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        <p className="text-sm text-muted">Connect the wallet that receives subscription payouts.</p>
        <WalletMultiButton />
      </header>

      {!connected && (
        <p className="border-2 border-dashed border-line bg-paper-bright px-4 py-8 text-center text-sm text-muted">
          Connect a Solana wallet to create plans.
        </p>
      )}

      {connected && publicKey && (
        <>
          <section className="card-surface p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-fg">New plan</h2>
            <p className="mt-1 text-sm text-muted">
              Price is charged in AUDD per month. Subscribers pay on-chain; renewals use the same flow
              (notify + pay) for this MVP.
            </p>
            <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={createPlan}>
              <label className="block text-sm">
                <span className="text-muted">Name</span>
                <input
                  className="input-field mt-1.5 w-full"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </label>
              <label className="block text-sm">
                <span className="text-muted">Amount (AUD / month)</span>
                <input
                  className="input-field mt-1.5 w-full"
                  onChange={(e) => setAmountAud(e.target.value)}
                  value={amountAud}
                />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="text-muted">
                  Platform fee (basis points, 0 to 10000) requires{" "}
                  <code className="code-inline">NEXT_PUBLIC_PLATFORM_TREASURY</code>
                </span>
                <input
                  className="input-field mt-1.5 w-full"
                  inputMode="numeric"
                  onChange={(e) => setFeeBps(Number(e.target.value))}
                  value={feeBps}
                />
              </label>
              {error && <p className="text-sm text-red-800 sm:col-span-2">{error}</p>}
              <button className="btn-primary sm:col-span-2" disabled={busy} type="submit">
                {busy ? "Creating…" : "Create plan"}
              </button>
            </form>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-lg font-semibold text-fg">Your plans</h2>
            {plans.length === 0 ? (
              <p className="text-sm text-muted">No plans yet.</p>
            ) : (
              <ul className="space-y-4">
                {plans.map((p) => (
                  <li className="card-surface p-5" key={p.id}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <p className="font-semibold text-fg">{p.name}</p>
                        <p className="text-sm text-muted">
                          {atomicToAudString(BigInt(p.amountAtomic))} AUD / {p.interval} · fee{" "}
                          {p.feeBps} bps
                        </p>
                      </div>
                      <p className="font-mono-ui text-xs text-muted">{p.id}</p>
                    </div>
                    <label className="mt-4 block font-mono-ui text-[10px] font-medium uppercase tracking-[0.28em] text-muted">
                      Embed snippet
                      <textarea
                        className="mt-2 w-full resize-y border border-fg bg-fg p-4 font-mono-ui text-[11px] leading-relaxed text-paper-bright"
                        readOnly
                        rows={4}
                        value={`<script src="${appUrl}/widget.js" data-audd-widget data-plan="${p.id}" data-api="${appUrl}" async></script>`}
                      />
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      <p className="font-mono-ui text-[11px] text-muted">RPC endpoint: {connection.rpcEndpoint}</p>
    </div>
  );
}
