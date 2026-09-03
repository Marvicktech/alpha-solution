/**
 * Lightweight, dependency-free analytics events.
 *
 * Pushes to `window.dataLayer` (GTM/GA4 friendly) and forwards to `gtag`
 * or `plausible` when either is present. Safe to call during SSR.
 */
type EventName =
  | "booking_cta_click"
  | "booking_form_submit"
  | "booking_form_success"
  | "booking_form_error"
  | "service_selected";

type EventProps = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props?: EventProps }) => void;
  }
}

export function track(event: EventName, props: EventProps = {}) {
  if (typeof window === "undefined") return;
  const payload = { event, ...props };
  try {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push(payload);
    window.gtag?.("event", event, props);
    window.plausible?.(event, { props });
  } catch {
    /* analytics must never break the page */
  }
}
