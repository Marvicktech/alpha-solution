// Plain, inline-styled HTML templates for the emails ZeptoMail sends.
// Email clients ignore <style> blocks and external CSS, so everything here
// is inline on purpose — keep it that way when editing.

const BRAND_RED = "#da0418";

function wrap(bodyHtml: string): string {
  return `
    <div style="background:#f5f5f5;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #eee;">
        <div style="background:${BRAND_RED};padding:20px 28px;">
          <span style="color:#ffffff;font-size:18px;font-weight:800;letter-spacing:-0.02em;">Alpha Presence</span>
        </div>
        <div style="padding:28px;color:#1a1a1a;font-size:14px;line-height:1.6;">
          ${bodyHtml}
        </div>
        <div style="padding:16px 28px;border-top:1px solid #eee;color:#888;font-size:12px;">
          Alpha Presence · alphapresence.studio
        </div>
      </div>
    </div>
  `;
}

export function leadConfirmationEmail(input: {
  name: string;
  serviceLabel: string;
  requestedWhen?: string | null;
}): {
  subject: string;
  html: string;
} {
  return {
    subject: "We've got your request — Alpha Presence",
    html: wrap(`
      <p style="margin:0 0 16px;">Hi ${input.name},</p>
      <p style="margin:0 0 16px;">
        Thanks for reaching out about <strong>${input.serviceLabel}</strong>.
        ${
          input.requestedWhen
            ? `You requested <strong>${input.requestedWhen}</strong> — we're reviewing that now and
               will confirm it (or suggest the nearest alternative) within one business day.`
            : `Your request is in and we'll be in touch within one business day.`
        }
      </p>
      <p style="margin:0;">— The Alpha Presence team</p>
    `),
  };
}

export function bookingConfirmedEmail(input: { name: string; start: string; timeZone: string }): {
  subject: string;
  html: string;
} {
  const when = new Intl.DateTimeFormat("en-GB", {
    timeZone: input.timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(input.start));

  return {
    subject: "You're confirmed — Alpha Presence",
    html: wrap(`
      <p style="margin:0 0 16px;">Hi ${input.name},</p>
      <p style="margin:0 0 16px;">
        You're confirmed for <strong>${when} (${input.timeZone})</strong>. It's on our calendar —
        you'll also get a separate calendar invite with the call link.
      </p>
      <p style="margin:0 0 16px;">
        Need to change it? Just reply to this email and we'll sort out a new time.
      </p>
      <p style="margin:0;">— The Alpha Presence team</p>
    `),
  };
}

export function bookingDeclinedEmail(input: { name: string }): {
  subject: string;
  html: string;
} {
  return {
    subject: "Let's find you a better time — Alpha Presence",
    html: wrap(`
      <p style="margin:0 0 16px;">Hi ${input.name},</p>
      <p style="margin:0 0 16px;">
        That time doesn't quite work on our end — sorry about that. Could you reply here with a
        couple of other times that suit you, or head back to the site and pick a new slot? We'll
        get you booked in properly.
      </p>
      <p style="margin:0;">— The Alpha Presence team</p>
    `),
  };
}

export function leadNotificationEmail(input: {
  name: string;
  email: string;
  phone?: string | null;
  businessName?: string | null;
  serviceLabel: string;
  message?: string | null;
  source: string;
}): { subject: string; html: string } {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#888;white-space:nowrap;">${label}</td><td style="padding:4px 0;">${value}</td></tr>`;

  return {
    subject: `New enquiry: ${input.name}${input.businessName ? ` (${input.businessName})` : ""}`,
    html: wrap(`
      <p style="margin:0 0 16px;">New request from the site:</p>
      <table style="border-collapse:collapse;font-size:14px;">
        ${row("Name", input.name)}
        ${row("Email", `<a href="mailto:${input.email}" style="color:${BRAND_RED};">${input.email}</a>`)}
        ${input.phone ? row("Phone", input.phone) : ""}
        ${input.businessName ? row("Business", input.businessName) : ""}
        ${row("Service", input.serviceLabel)}
        ${row("Source", input.source === "booking_form" ? "Booking form" : "Requested a call back")}
      </table>
      ${
        input.message
          ? `<p style="margin:16px 0 0;padding:12px;background:#f7f7f7;border-radius:8px;white-space:pre-wrap;">${input.message}</p>`
          : ""
      }
    `),
  };
}

export function statusUpdateEmail(input: { name: string; status: string }): {
  subject: string;
  html: string;
} {
  const copy: Record<string, { subject: string; body: string }> = {
    contacted: {
      subject: "We're reviewing your request — Alpha Presence",
      body: "We've started looking into your request and will follow up shortly with next steps.",
    },
    booked: {
      subject: "You're booked in — Alpha Presence",
      body: "You're booked in for your consultation. If anything changes on our end (including a reschedule), we'll email you straight away.",
    },
    declined: {
      subject: "Let's find you a better time — Alpha Presence",
      body: "That time doesn't quite work on our end — reply here with a couple of other times and we'll get you booked in.",
    },
    closed: {
      subject: "Update on your request — Alpha Presence",
      body: "We've closed out your request for now. If anything changes or you'd like to pick this back up, just reply to this email.",
    },
  };

  const c = copy[input.status] ?? {
    subject: "Update on your request — Alpha Presence",
    body: "There's an update on your request.",
  };

  return {
    subject: c.subject,
    html: wrap(`
      <p style="margin:0 0 16px;">Hi ${input.name},</p>
      <p style="margin:0 0 16px;">${c.body}</p>
      <p style="margin:0;">— The Alpha Presence team</p>
    `),
  };
}
