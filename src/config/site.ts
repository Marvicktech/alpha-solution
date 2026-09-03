/**
 * Single place for real-world Alpha Solution business details.
 *
 * Anything left as an empty string is treated as "not confirmed yet" and is
 * simply not rendered anywhere on the site. Fill these in before launch —
 * never replace them with invented values.
 */
export const SITE = {
  name: "Alpha Solution",
  positioning:
    "Alpha Solution: plain-English digital help for UK local businesses.",
  /** e.g. "hello@alphasolution.co.uk" */
  email: "",
  /** Display format, e.g. "020 7946 0000" */
  phone: "",
  /** Tel href format, e.g. "+442079460000" */
  phoneHref: "",
  /** WhatsApp number in international format without "+", e.g. "447700900000" */
  whatsapp: "",
  /** Trading address, only if a real one exists */
  address: "",
  coverage: "Working with businesses across the United Kingdom",
  social: {
    linkedin: "",
    instagram: "",
    facebook: "",
  },
} as const;

export const HAS_CONTACT = Boolean(SITE.email || SITE.phone);
