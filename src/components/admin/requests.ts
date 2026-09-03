import { supabase } from "@/integrations/supabase/client";

export type RequestStatus = "new" | "contacted" | "booked" | "closed";

export type ConsultationRequest = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  business_name: string | null;
  service_interest: string;
  message: string | null;
  source: string;
  status: string;
  notes: string | null;
};

export const STATUS_OPTIONS: { value: RequestStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "booked", label: "Booked" },
  { value: "closed", label: "Closed" },
];

export const SERVICE_OPTIONS: { value: string; label: string }[] = [
  { value: "website", label: "Website Design & Build" },
  { value: "uiux", label: "UI/UX Design" },
  { value: "automation", label: "Automation" },
  { value: "branding_seo", label: "Branding & SEO/AEO/GEO" },
  { value: "other", label: "Other" },
];

export function serviceLabel(value: string) {
  return SERVICE_OPTIONS.find((s) => s.value === value)?.label ?? value;
}

export function sourceLabel(value: string) {
  if (value === "booking_form") return "Booking form";
  if (value === "live_person_request") return "Requested a call back";
  return value;
}

export function statusLabel(value: string) {
  return STATUS_OPTIONS.find((s) => s.value === value)?.label ?? value;
}

export const STATUS_BADGE: Record<string, string> = {
  new: "bg-primary/15 text-primary border-primary/30",
  contacted: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  booked: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  closed: "bg-muted text-muted-foreground border-border",
};

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function fetchRequests(): Promise<ConsultationRequest[]> {
  const { data, error } = await supabase
    .from("consultation_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ConsultationRequest[];
}

export async function updateRequest(
  id: string,
  patch: { status?: string; notes?: string | null },
) {
  const { error } = await supabase.from("consultation_requests").update(patch).eq("id", id);
  if (error) throw error;
}

export function bookedThisWeek(rows: ConsultationRequest[]) {
  const now = new Date();
  const day = (now.getDay() + 6) % 7; // Monday-start
  const monday = new Date(now);
  monday.setDate(now.getDate() - day);
  monday.setHours(0, 0, 0, 0);
  return rows.filter((r) => r.status === "booked" && new Date(r.created_at) >= monday).length;
}
