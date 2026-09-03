// Server function wrappers around the Cal.com out-of-office (availability
// block) API client. Safe to import at the top level from client components —
// TanStack Start strips the handler body out of the client bundle, so
// CAL_API_KEY never ships to the browser.
import { createServerFn } from "@tanstack/react-start";
import type { CalOooEntry, CalOooReason } from "@/integrations/cal/client.server";

export const getOooEntries = createServerFn({ method: "GET" })
  .validator((_input?: Record<string, never>) => ({}))
  .handler(async (): Promise<CalOooEntry[]> => {
    const { fetchOooEntries } = await import("@/integrations/cal/client.server");
    return fetchOooEntries();
  });

export const createOooBlock = createServerFn({ method: "POST" })
  .validator((input: { start: string; end: string; notes?: string; reason?: CalOooReason }) => input)
  .handler(async ({ data }): Promise<CalOooEntry> => {
    const { createOooEntry } = await import("@/integrations/cal/client.server");
    return createOooEntry(data);
  });

export const deleteOooBlock = createServerFn({ method: "POST" })
  .validator((input: { id: number }) => input)
  .handler(async ({ data }): Promise<void> => {
    const { deleteOooEntry } = await import("@/integrations/cal/client.server");
    return deleteOooEntry(data.id);
  });
