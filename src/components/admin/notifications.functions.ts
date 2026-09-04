// Server function that emails a client when their consultation request's
// status changes (e.g. marked "booked" or "closed") — covers "you changed
// something, they get told" for the request/lead flow. Cal.com bookings
// made through the live calendar already email both sides automatically on
// booking, reschedule and cancellation, so nothing extra is needed there.
import { createServerFn } from "@tanstack/react-start";

export const notifyStatusChange = createServerFn({ method: "POST" })
  .validator((input: { name: string; email: string; status: string }) => input)
  .handler(async ({ data }): Promise<void> => {
    const { sendEmail } = await import("@/integrations/email/client.server");
    const { statusUpdateEmail } = await import("@/integrations/email/templates");
    await sendEmail({
      to: { address: data.email, name: data.name },
      ...statusUpdateEmail({ name: data.name, status: data.status }),
    });
  });
