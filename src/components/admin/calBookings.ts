import type { CalBooking } from "@/integrations/cal/client.server";

export type { CalBooking };

export const CAL_STATUS_OPTIONS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "unconfirmed", label: "Needs confirmation" },
  { value: "past", label: "Past" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export const CAL_STATUS_BADGE: Record<string, string> = {
  accepted: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  pending: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  rejected: "bg-muted text-muted-foreground border-border",
  cancelled: "bg-muted text-muted-foreground border-border",
};

export function calStatusLabel(value: CalBooking["status"]) {
  if (value === "accepted") return "Confirmed";
  if (value === "pending") return "Needs confirmation";
  if (value === "rejected") return "Rejected";
  if (value === "cancelled") return "Cancelled";
  return value;
}

export function formatBookingTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function primaryAttendee(booking: CalBooking) {
  return booking.attendees[0] ?? null;
}

export function upcomingCount(rows: CalBooking[]) {
  const now = Date.now();
  return rows.filter((b) => new Date(b.start).getTime() > now && b.status !== "cancelled").length;
}

export function thisWeekCount(rows: CalBooking[]) {
  const now = new Date();
  const day = (now.getDay() + 6) % 7; // Monday-start
  const monday = new Date(now);
  monday.setDate(now.getDate() - day);
  monday.setHours(0, 0, 0, 0);
  const nextMonday = new Date(monday);
  nextMonday.setDate(monday.getDate() + 7);
  return rows.filter((b) => {
    const start = new Date(b.start);
    return start >= monday && start < nextMonday && b.status !== "cancelled";
  }).length;
}
