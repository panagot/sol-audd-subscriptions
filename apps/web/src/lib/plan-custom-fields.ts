export type PlanCustomField = { label: string; value: string };

export function parsePlanCustomFields(raw: unknown): PlanCustomField[] {
  if (!Array.isArray(raw)) return [];
  const out: PlanCustomField[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const label = "label" in row && typeof row.label === "string" ? row.label : "";
    const value = "value" in row && typeof row.value === "string" ? row.value : "";
    if (label.trim() === "" && value.trim() === "") continue;
    out.push({ label: label.trim(), value: value.trim() });
  }
  return out;
}
