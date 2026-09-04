// Server function wrapper around the Cal.com slots API, for the public
// booking calendar. Safe to import at the top level from client components —
// TanStack Start strips the handler body out of the client bundle, so
// CAL_API_KEY never ships to the browser.
import { createServerFn } from "@tanstack/react-start";
import type { CalSlotsByDate } from "@/integrations/cal/client.server";

export const getAvailableSlots = createServerFn({ method: "GET" })
  .validator((input: { startTime: string; endTime: string; timeZone?: string }) => input)
  .handler(async ({ data }): Promise<CalSlotsByDate> => {
    const { fetchAvailableSlots } = await import("@/integrations/cal/client.server");
    return fetchAvailableSlots(data);
  });
