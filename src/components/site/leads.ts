import { supabase } from "@/integrations/supabase/client";
import type { ServiceId } from "./data";

const SERVICE_DB_MAP: Record<string, string> = {
  website: "website",
  uiux: "uiux",
  automation: "automation",
  branding: "branding_seo",
  branding_seo: "branding_seo",
  other: "other",
};

export function toDbService(id: ServiceId | null | undefined) {
  return (id && SERVICE_DB_MAP[id]) || "other";
}

export type LeadInput = {
  name: string;
  email: string;
  phone?: string | null;
  business_name?: string | null;
  service_interest: string;
  message?: string | null;
  source: "booking_form" | "live_person_request";
};

export async function submitLead(input: LeadInput) {
  const { error } = await supabase.from("consultation_requests").insert(input);
  if (error) throw error;
}
