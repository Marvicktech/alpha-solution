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

// --- Available slots (real, live availability) ---------------------------
// Backs the on-site booking calendar. Pulls straight from Cal.com's slots
// engine, so it already excludes anything blocked via OOO above, existing
// bookings, and the event type's own working hours/buffers — nothing about
// that logic needs to be duplicated here.

// Matches https://cal.com/alphapresenced/30min — only the slug is used
// directly; the numeric event type id it maps to is resolved once (and
// cached) via resolveEventTypeId() below, since looking events up by
// username on this account 404s.
const CAL_EVENT_TYPE_SLUG = "30min";

export type CalSlot = { start: string; end?: string };
/** Date key is "YYYY-MM-DD" (in the requested timeZone), value is that day's open slots. */
export type CalSlotsByDate = Record<string, CalSlot[]>;

/**
 * Cal.com's docs don't publish a worked example of this endpoint's exact
 * `data` shape, and this environment can't reach api.cal.com to check
 * empirically — so parsing here is deliberately defensive. It accepts the
 * documented/expected shape (an object keyed by "YYYY-MM-DD", each value an
 * array of slot objects or ISO strings) and also copes with a flat array of
 * slots by bucketing each one under the date portion of its own start time.
 * Anything it can't make sense of is just dropped rather than thrown, so a
 * format surprise degrades the calendar instead of breaking the page.
 */
function parseSlotsResponse(json: unknown): CalSlotsByDate {
  const out: CalSlotsByDate = {};

  function addSlot(dateKey: string, slot: CalSlot) {
    if (!slot.start) return;
    (out[dateKey] ??= []).push(slot);
  }

  function toSlot(item: unknown): CalSlot | null {
    if (typeof item === "string") return { start: item };
    if (item && typeof item === "object") {
      const obj = item as Record<string, unknown>;
      const start = obj["start"] ?? obj["time"] ?? obj["utcStartTime"];
      const end = obj["end"] ?? obj["utcEndTime"];
      if (typeof start === "string") {
        return { start, end: typeof end === "string" ? end : undefined };
      }
    }
    return null;
  }

  const body = (json && typeof json === "object" ? json : {}) as Record<string, unknown>;
  const data = body["data"] ?? body["slots"] ?? body;

  if (Array.isArray(data)) {
    for (const raw of data) {
      const slot = toSlot(raw);
      if (slot) addSlot(slot.start.slice(0, 10), slot);
    }
    return out;
  }

  if (data && typeof data === "object") {
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      if (!Array.isArray(value)) continue;
      // Only treat this as a date bucket if the key looks like one —
      // guards against an unrelated top-level field (e.g. "status").
      if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) continue;
      for (const raw of value) {
        const slot = toSlot(raw);
        if (slot) addSlot(key, slot);
      }
    }
  }

  return out;
}

// The `eventTypeSlug` + `username` combo that Cal.com's own docs describe
// for this endpoint doesn't actually resolve for this account (confirmed by
// a real 404 NOT_FOUND from api.cal.com — not a docs gap, an actual account
// quirk) — `username` isn't even listed as a real query param on the current
// docs page, only `eventTypeId` and `usernameList` are. Rather than guess
// again, resolve the numeric event type id first (from the same "30min"
// slug, via the authenticated event-types list) and query slots with that —
// unambiguous, no slug/username resolution involved.
let cachedEventTypeId: number | null = null;

async function resolveEventTypeId(apiKey: string): Promise<number> {
  if (cachedEventTypeId !== null) return cachedEventTypeId;

  const res = await fetch(`${CAL_API_BASE}/event-types`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "cal-api-version": "2024-06-14",
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Cal.com API error (${res.status}): ${body || res.statusText}`);
  }
  const json = (await res.json()) as {
    status: "success" | "error";
    data: { id: number; slug: string }[];
  };
  if (json.status !== "success") {
    throw new Error("Cal.com API returned an error response.");
  }
  const match = json.data.find((et) => et.slug === CAL_EVENT_TYPE_SLUG);
  if (!match) {
    throw new Error(
      `No Cal.com event type with slug "${CAL_EVENT_TYPE_SLUG}" found on this account.`,
    );
  }
  cachedEventTypeId = match.id;
  return match.id;
}

export async function fetchAvailableSlots(input: {
  startTime: string;
  endTime: string;
  timeZone?: string;
}): Promise<CalSlotsByDate> {
  const apiKey = getCalApiKey();
  const eventTypeId = await resolveEventTypeId(apiKey);

  const search = new URLSearchParams({
    startTime: input.startTime,
    endTime: input.endTime,
    eventTypeId: String(eventTypeId),
  });
  if (input.timeZone) search.set("timeZone", input.timeZone);

  const res = await fetch(`${CAL_API_BASE}/slots/available?${search.toString()}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Cal.com API error (${res.status}): ${body || res.statusText}`);
  }

  const json = await res.json();
  return parseSlotsResponse(json);
}

// --- Creating a real booking (used once you accept a request) ------------
// This is the step that actually reserves the slot on Cal.com — everything
// before this (the visitor's form submission) is just a request sitting in
// Supabase. Only call this from the admin "Accept" action.

type CalCreatedBooking = {
  id: number;
  uid: string;
  status: string;
  start: string;
  end: string;
};

type CalCreateBookingResponse = { status: "success" | "error"; data: CalCreatedBooking };

export async function createCalBooking(input: {
  start: string;
  attendee: { name: string; email: string; timeZone?: string };
}): Promise<CalCreatedBooking> {
  const apiKey = getCalApiKey();
  // Use the resolved numeric id rather than eventTypeSlug+username — this
  // account's username lookup 404s on the slots endpoint, so the same
  // slug/username pair isn't trusted here either even though Cal.com's docs
  // list it as valid for booking creation.
  const eventTypeId = await resolveEventTypeId(apiKey);
  const res = await fetch(`${CAL_API_BASE}/bookings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "cal-api-version": CAL_API_VERSION,
    },
    body: JSON.stringify({
      start: input.start,
      attendee: {
        name: input.attendee.name,
        email: input.attendee.email,
        timeZone: input.attendee.timeZone || "Europe/London",
      },
      eventTypeId,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Cal.com API error (${res.status}): ${body || res.statusText}`);
  }

  const json = (await res.json()) as CalCreateBookingResponse;
  if (json.status !== "success") {
    throw new Error("Cal.com API returned an error response.");
  }
  return json.data;
}
