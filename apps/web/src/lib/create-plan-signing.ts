/**
 * Canonical payload shape and stringification for `audd-subs:create:v1` wallet signatures.
 * Key order must match exactly between client and server so JSON.stringify is identical.
 */
import type { BillingInterval } from "@/lib/billing-interval";

export type CreatePlanPayloadV1 = {
  v: 1;
  action: "create_plan";
  merchantPubkey: string;
  name: string;
  amountAud: string;
  interval: BillingInterval;
  feeBps: number;
  customFields: { label: string; value: string }[];
  ts: number;
};

export function createPlanSignMessage(payload: CreatePlanPayloadV1): string {
  const normalized: CreatePlanPayloadV1 = {
    v: 1,
    action: "create_plan",
    merchantPubkey: payload.merchantPubkey,
    name: payload.name,
    amountAud: payload.amountAud,
    interval: payload.interval,
    feeBps: payload.feeBps,
    customFields: payload.customFields.map((r) => ({
      label: r.label,
      value: r.value,
    })),
    ts: payload.ts,
  };
  return `audd-subs:create:v1|${JSON.stringify(normalized)}`;
}
