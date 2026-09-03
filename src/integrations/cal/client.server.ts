// Server-only Cal.com API client. Never import this at the top level of a
// file that ships to the client bundle — the API key must never reach the
// browser. Load it inside a server function instead:
//   const { fetchCalBookings } = await import("@/integrations/cal/client.server");

const CAL_API_BASE = "https://api.cal.com/v2";
// Cal.com v2 requires a version header on every request. Pin it so a Cal.com
// API upgrade can't silently change the response shape underneath us.
const CAL_API_VERSION = "2026-05-01";

export type CalBookingStatus = "upcoming" | "recurring" | "past" | "cancelled" | "unconfirmed";

export type CalBooking = {
  id: number;
  uid: string;
  title: string;
  status: "cancelled" | "accepted" | "rejected" | "pending";
  start: string;
  end: string;
  duration: number;
  eventType: { id: number; slug: string } | null;
  location: string | null;
  attendees: { name: string; email: string; timeZone: string }[];
  createdAt: string;
};

type CalBookingsResponse = {
  status: "success" | "error";
  data: CalBooking[];
  pagination: { nextCursor: string | null; hasMore: boolean };
};

function getCalApiKey(): string {
  const key = process.env["CAL_API_KEY"];
  if (!key) {
    throw new Error(
      "Missing CAL_API_KEY environment variable. Add it as a secret in Cloudflare (Workers & Pages → alpha-presence → Settings → Variables and Secrets).",
    );
  }
  return key;
}

export async function fetchCalBookings(params: {
  status?: CalBookingStatus;
  limit?: number;
}): Promise<CalBooking[]> {
  const apiKey = getCalApiKey();
  const search = new URLSearchParams();
  if (params.status) search.set("status", params.status);
  search.set("limit", String(params.limit ?? 100));

  const res = await fetch(`${CAL_API_BASE}/bookings?${search.toString()}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "cal-api-version": CAL_API_VERSION,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Cal.com API error (${res.status}): ${body || res.statusText}`);
  }

  const json = (await res.json()) as CalBookingsResponse;
  if (json.status !== "success") {
    throw new Error("Cal.com API returned an error response.");
  }
  return json.data;
}

// --- Out-of-office (availability blocks) ---------------------------------
// Cal.com blocks a date range for the account owner by creating an "OOO"
// entry — every event type stops accepting bookings for that window. The
// /v2/me/ooo endpoints don't take the cal-api-version header (unlike
// /v2/bookings above), so it's deliberately omitted here.

export type CalOooReason = "unspecified" | "vacation" | "travel" | "sick" | "public_holiday";

export type CalOooEntry = {
  id: number;
  uuid: string;
  start: string;
  end: string;
  notes?: string | null;
  reason?: CalOooReason;
};

type CalOooListResponse = { status: "success" | "error"; data: CalOooEntry[] };
type CalOooItemResponse = { status: "success" | "error"; data: CalOooEntry };

function calOooHeaders(apiKey: string): HeadersInit {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

export async function fetchOooEntries(): Promise<CalOooEntry[]> {
  const apiKey = getCalApiKey();
  const res = await fetch(`${CAL_API_BASE}/me/ooo?take=250&sortStart=asc`, {
    headers: calOooHeaders(apiKey),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Cal.com API error (${res.status}): ${body || res.statusText}`);
  }

  const json = (await res.json()) as CalOooListResponse;
  if (json.status !== "success") {
    throw new Error("Cal.com API returned an error response.");
  }
  return json.data;
}

export async function createOooEntry(input: {
  start: string;
  end: string;
  notes?: string;
  reason?: CalOooReason;
}): Promise<CalOooEntry> {
  const apiKey = getCalApiKey();
  const res = await fetch(`${CAL_API_BASE}/me/ooo`, {
    method: "POST",
    headers: calOooHeaders(apiKey),
    body: JSON.stringify({
      start: input.start,
      end: input.end,
      notes: input.notes || undefined,
      reason: input.reason ?? "unspecified",
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Cal.com API error (${res.status}): ${body || res.statusText}`);
  }

  const json = (await res.json()) as CalOooItemResponse;
  if (json.status !== "success") {
    throw new Error("Cal.com API returned an error response.");
  }
  return json.data;
}

export async function deleteOooEntry(id: number): Promise<void> {
  const apiKey = getCalApiKey();
  const res = await fetch(`${CAL_API_BASE}/me/ooo/${id}`, {
    method: "DELETE",
    headers: calOooHeaders(apiKey),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Cal.com API error (${res.status}): ${body || res.statusText}`);
  }
}
