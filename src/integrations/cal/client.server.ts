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
