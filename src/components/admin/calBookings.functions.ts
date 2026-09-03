// Server function wrapper around the Cal.com API client. Safe to import at
// the top level from client components: TanStack Start strips the handler
// body out of the client bundle and replaces it with an RPC call, so the
// CAL_API_KEY (loaded server-side inside the handler) never ships to the
// browser.
import { createServerFn } from "@tanstack/react-start";
import type { CalBooking, CalBookingStatus } from "@/integrations/cal/client.server";

export const getCalBookings = createServerFn({ method: "GET" })
  .validator((input: { status?: CalBookingStatus; limit?: number }) => input)
  .handler(async ({ data }): Promise<CalBooking[]> => {
    const { fetchCalBookings } = await import("@/integrations/cal/client.server");
    return fetchCalBookings(data);
  });
