// Server function that emails both the visitor (confirmation) and Nifemi
// (notification) after a new consultation request is saved. Safe to import
// at the top level from client components — the ZEPTOMAIL_API_KEY loaded
// inside the handler never reaches the browser.
import { createServerFn } from "@tanstack/react-start";

export const notifyNewLead = createServerFn({ method: "POST" })
  .validator(
    (input: {
      name: string;
      email: string;
      phone?: string | null;
      businessName?: string | null;
      serviceLabel: string;
      message?: string | null;
      source: string;
      requestedWhen?: string | null;
    }) => input,
  )
  .handler(async ({ data }): Promise<void> => {
    const { sendEmail } = await import("@/integrations/email/client.server");
    const { leadConfirmationEmail, leadNotificationEmail } = await import(
      "@/integrations/email/templates"
    );

    // Best-effort, in parallel — one email failing shouldn't sink the other,
    // and the lead is already safely saved in the database regardless.
    const results = await Promise.allSettled([
      sendEmail({
        to: { address: data.email, name: data.name },
        ...leadConfirmationEmail({
          name: data.name,
          serviceLabel: data.serviceLabel,
          requestedWhen: data.requestedWhen,
        }),
      }),
      sendEmail({
        to: { address: "info@alphapresence.studio", name: "Alpha Presence" },
        ...leadNotificationEmail({
          name: data.name,
          email: data.email,
          phone: data.phone,
          businessName: data.businessName,
          serviceLabel: data.serviceLabel,
          message: data.message,
          source: data.source,
        }),
      }),
    ]);

    for (const r of results) {
      if (r.status === "rejected") console.error("[notifyNewLead] email failed:", r.reason);
    }
  });
