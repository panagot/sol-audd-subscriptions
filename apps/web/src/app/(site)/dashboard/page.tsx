"use client";

import { atomicToAudString } from "@/lib/amount";
import { uint8ToBase64 } from "@/lib/b64";
import { getAppUrl } from "@/lib/env";
import type { BillingInterval } from "@/lib/billing-interval";
import { billingPeriodPhrase } from "@/lib/billing-interval";
import { createPlanSignMessage } from "@/lib/create-plan-signing";
import { parsePlanCustomFields, type PlanCustomField } from "@/lib/plan-custom-fields";
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
  customFields: unknown;
  createdAt: string;
};

type CustomFieldDraft = { id: string; label: string; value: string };

export default function DashboardPage() {
  const { publicKey, signMessage, connected } = useWallet();
  const { connection } = useConnection();
  const appUrl = useMemo(() => getAppUrl(), []);

  const [name, setName] = useState("Pro");
  const [amountAud, setAmountAud] = useState("10");
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("month");
  const [feeBps, setFeeBps] = useState(0);
  const [customFieldRows, setCustomFieldRows] = useState<CustomFieldDraft[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<PlanRow[]>([]);

  const load = useCallback(async () => {
    if (!publicKey) return;
    const res = await fetch(`/api/plans?merchant=${publicKey.toBase58()}`);
    const raw = await res.text();
    let data: { error?: string; plans?: PlanRow[] } = {};
    const trimmed = raw.trim();
    if (trimmed) {
      try {
        data = JSON.parse(trimmed) as { error?: string; plans?: PlanRow[] };
      } catch {
        throw new Error("Invalid response while loading plans");
      }
    }
    if (!res.ok) throw new Error(data.error ?? "Failed to load plans");
    setPlans(data.plans ?? []);
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
      const customFields: PlanCustomField[] = customFieldRows
        .map((r) => ({ label: r.label.trim(), value: r.value.trim() }))
        .filter((r) => r.label.length > 0 && r.value.length > 0);

      const payload = {
        v: 1 as const,
        action: "create_plan" as const,
        merchantPubkey: publicKey.toBase58(),
        name,
        amountAud,
        interval: billingInterval,
        feeBps,
        customFields,
        ts: Date.now(),
      };
      const message = createPlanSignMessage(payload);
      const sig = await signMessage(new TextEncoder().encode(message));
      const signature = uint8ToBase64(sig);

      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey: publicKey.toBase58(), signature, payload }),
      });
      const raw = await res.text();
      let data: { error?: string } = {};
      const trimmed = raw.trim();
      if (trimmed) {
        try {
          data = JSON.parse(trimmed) as { error?: string };
        } catch {
          throw new Error(raw ? `Invalid response: ${raw.slice(0, 160)}` : "Empty response from server");
        }
      } else if (!res.ok) {
        throw new Error(`Create plan failed (${res.status})`);
      }
      if (!res.ok) throw new Error(data.error ?? `Failed to create plan (${res.status})`);

      setName("Pro");
      setAmountAud("10");
      setBillingInterval("month");
      setCustomFieldRows([]);
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
              Enter the AUDD amount for each billing period (monthly or yearly). Subscribers pay on-chain;
              renewals follow the same notify and pay flow for this MVP. Optional lines below show on the
              hosted checkout (e.g. what is included, support tier, or billing notes).
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
                <span className="text-muted">
                  Amount (AUD / {billingPeriodPhrase(billingInterval)})
                </span>
                <input
                  className="input-field mt-1.5 w-full"
                  onChange={(e) => setAmountAud(e.target.value)}
                  value={amountAud}
                />
              </label>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="text-sm text-muted" htmlFor="billing-interval">
                  Billing period
                </label>
                <select
                  className="input-field w-auto min-w-[9rem] max-w-[12rem] cursor-pointer self-start"
                  id="billing-interval"
                  onChange={(e) => setBillingInterval(e.target.value as BillingInterval)}
                  value={billingInterval}
                >
                  <option value="month">Monthly</option>
                  <option value="year">Yearly</option>
                </select>
              </div>
              <label className="block text-sm sm:col-span-2">
                <span className="text-muted">
                  Platform fee (basis points, 0 to 10000) requires{" "}
                  <code className="code-inline">PLATFORM_TREASURY</code>
                </span>
                <input
                  className="input-field mt-1.5 w-full"
                  inputMode="numeric"
                  onChange={(e) => setFeeBps(Number(e.target.value))}
                  value={feeBps}
                />
              </label>

              <div className="space-y-3 sm:col-span-2">
                <p className="text-sm font-semibold text-fg">Optional checkout details</p>
                <p className="text-xs text-muted">
                  Add label and value pairs (up to 20). Empty rows are ignored.
                </p>
                <div className="space-y-3">
                  {customFieldRows.map((row) => (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end" key={row.id}>
                      <label className="block min-w-0 flex-1 text-sm">
                        <span className="text-muted">Label</span>
                        <input
                          className="input-field mt-1.5 w-full"
                          onChange={(e) =>
                            setCustomFieldRows((prev) =>
                              prev.map((r) =>
                                r.id === row.id ? { ...r, label: e.target.value } : r,
                              ),
                            )
                          }
                          placeholder="e.g. Included"
                          value={row.label}
                        />
                      </label>
                      <label className="block min-w-0 flex-1 text-sm">
                        <span className="text-muted">Value</span>
                        <input
                          className="input-field mt-1.5 w-full"
                          onChange={(e) =>
                            setCustomFieldRows((prev) =>
                              prev.map((r) =>
                                r.id === row.id ? { ...r, value: e.target.value } : r,
                              ),
                            )
                          }
                          placeholder="e.g. Email support"
                          value={row.value}
                        />
                      </label>
                      <button
                        className="btn-ghost shrink-0 px-2 py-2 text-sm text-accent sm:mb-0.5"
                        onClick={() =>
                          setCustomFieldRows((prev) => prev.filter((r) => r.id !== row.id))
                        }
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  className="btn-secondary w-full disabled:opacity-50 sm:w-auto"
                  disabled={customFieldRows.length >= 20}
                  onClick={() =>
                    setCustomFieldRows((prev) =>
                      prev.length >= 20
                        ? prev
                        : [...prev, { id: crypto.randomUUID(), label: "", value: "" }],
                    )
                  }
                  type="button"
                >
                  Add line {customFieldRows.length >= 20 ? "(max 20)" : ""}
                </button>
              </div>

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
                {plans.map((p) => {
                  const extras = parsePlanCustomFields(p.customFields);
                  return (
                  <li className="card-surface p-5" key={p.id}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <p className="font-semibold text-fg">{p.name}</p>
                        <p className="text-sm text-muted">
                          {atomicToAudString(BigInt(p.amountAtomic))} AUD /{" "}
                          {billingPeriodPhrase(p.interval)} · fee {p.feeBps} bps
                        </p>
                        {extras.length > 0 && (
                          <ul className="mt-3 space-y-1 border-t border-line pt-3 text-sm text-muted">
                            {extras.map((x, i) => (
                              <li key={`${p.id}-extra-${i}`}>
                                <span className="font-medium text-fg">{x.label}:</span> {x.value}
                              </li>
                            ))}
                          </ul>
                        )}
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
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}

      <p className="font-mono-ui text-[11px] text-muted">RPC endpoint: {connection.rpcEndpoint}</p>
    </div>
  );
}
