// Server-only ZeptoMail client (Zoho's transactional email API — the right
// tool within the Zoho ecosystem for app-triggered emails like these, since
// raw SMTP isn't reliable to run from a Cloudflare Worker). Never import
// this at the top level of a file that ships to the client bundle — load it
// inside a server function instead:
//   const { sendEmail } = await import("@/integrations/email/client.server");

const ZEPTOMAIL_API_URL = "https://api.zeptomail.com/v1.1/email";

// Must be an address on a domain verified inside your ZeptoMail account.
const FROM = { address: "info@alphapresence.studio", name: "Alpha Presence" };

function getZeptoMailApiKey(): string {
  const key = process.env["ZEPTOMAIL_API_KEY"];
  if (!key) {
    throw new Error(
      "Missing ZEPTOMAIL_API_KEY environment variable. Add it as a secret in Cloudflare (Workers & Pages → alpha-presence → Settings → Variables and Secrets).",
    );
  }
  return key;
}

export async function sendEmail(input: {
  to: { address: string; name?: string };
  subject: string;
  html: string;
}): Promise<void> {
  const apiKey = getZeptoMailApiKey();

  const res = await fetch(ZEPTOMAIL_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Zoho-enczapikey ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [
        {
          email_address: {
            address: input.to.address,
            name: input.to.name || input.to.address,
          },
        },
      ],
      subject: input.subject,
      htmlbody: input.html,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`ZeptoMail API error (${res.status}): ${body || res.statusText}`);
  }
}
