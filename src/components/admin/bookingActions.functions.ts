// Server functions behind the admin "Accept" / "Decline" buttons.
//
// Accept is the moment a request becomes a real, calendared meeting: it
// creates the actual Cal.com booking for the slot the visitor requested,
// then emails them the confirmed date/time. Decline just lets them know
// that time doesn't work, without touching Cal.com at all. Either way the
// Supabase row itself (status, cal_booking_uid) is updated separately by
// the caller once this succeeds — so a failed Cal.com call never leaves a
// request looking "booked" when no meeting actually exists.
import { createServerFn } from "@tanstack/react-start";

export const acceptBookingRequest = createServerFn({ method: "POST" })
  .validator(
    (input: { name: string; email: string; start: string; timeZone?: string }) => input,
  )
  .handler(async ({ data }): Promise<{ uid: string; start: string; end: string }> => {
    const { createCalBooking } = await import("@/integrations/cal/client.server");
    const booking = await createCalBooking({
      start: data.start,
      attendee: { name: data.name, email: data.email, timeZone: data.timeZone },
    });

    const { sendEmail } = await import("@/integrations/email/client.server");
    const { bookingConfirmedEmail } = await import("@/integrations/email/templates");
    await sendEmail({
      to: { address: data.email, name: data.name },
      ...bookingConfirmedEmail({
        name: data.name,
        start: booking.start,
        timeZone: data.timeZone || "Europe/London",
      }),
    });

    return { uid: booking.uid, start: booking.start, end: booking.end };
  });

export const declineBookingRequest = createServerFn({ method: "POST" })
  .validator((input: { name: string; email: string }) => input)
  .handler(async ({ data }): Promise<void> => {
    const { sendEmail } = await import("@/integrations/email/client.server");
    const { bookingDeclinedEmail } = await import("@/integrations/email/templates");
    await sendEmail({
      to: { address: data.email, name: data.name },
      ...bookingDeclinedEmail({ name: data.name }),
    });
  });
