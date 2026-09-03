import type { CalOooEntry, CalOooReason } from "@/integrations/cal/client.server";

export type { CalOooEntry, CalOooReason };

export const OOO_REASON_OPTIONS: { value: CalOooReason; label: string }[] = [
  { value: "unspecified", label: "Blocked (no reason given)" },
  { value: "vacation", label: "Vacation" },
  { value: "travel", label: "Travel" },
  { value: "sick", label: "Sick" },
  { value: "public_holiday", label: "Public holiday" },
];

export function oooReasonLabel(value?: CalOooReason) {
  return OOO_REASON_OPTIONS.find((r) => r.value === value)?.label ?? "Blocked";
}

export function formatBlockDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatBlockRange(startIso: string, endIso: string) {
  const start = formatBlockDate(startIso);
  const end = formatBlockDate(endIso);
  return start === end ? start : `${start} – ${end}`;
}

export function isActiveOrUpcoming(entry: CalOooEntry) {
  return new Date(entry.end).getTime() >= Date.now() - 1000 * 60 * 60 * 24; // keep today's block visible
}

export function sortByStart(rows: CalOooEntry[]) {
  return [...rows].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}
