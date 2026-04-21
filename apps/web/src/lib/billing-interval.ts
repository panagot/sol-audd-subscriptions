/** Stored on `Plan.interval` and in signed create-plan payloads. */
export type BillingInterval = "month" | "year";

export function isBillingInterval(s: string): s is BillingInterval {
  return s === "month" || s === "year";
}

/** Short label for UI, e.g. checkout subtitle */
export function billingPeriodPhrase(interval: string): string {
  return interval === "year" ? "year" : "month";
}
