import { useState } from "react";
import { MessageCircle, X, CalendarCheck, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookACallButton } from "./BookACallButton";
import { SITE } from "@/config/site";
import { track } from "@/lib/analytics";

/**
 * Floating contact crate: a small chat-style launcher that opens a glass panel
 * with the fastest ways to reach Alpha Presence. Only real, confirmed contact
 * details from `SITE` are shown.
 */
export function ContactWidget({ onBook }: { onBook: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open && (
        <div
          role="dialog"
          aria-label="Contact Alpha Presence"
          className="w-[min(92vw,20rem)] overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]"
        >
          <div className="section-ink px-5 py-4">
            <p className="text-sm font-bold text-on-ink">Talk to a real person</p>
            <p className="mt-1 text-xs text-on-ink-muted">
              Tell us what is not working. We reply within one working day.
            </p>
          </div>
          <div className="space-y-2 p-4">
            <Button
              className="w-full justify-start"
              variant="hero"
              onClick={() => {
                track("booking_cta_click", { location: "contact_widget" });
                setOpen(false);
                onBook();
              }}
            >
              <CalendarCheck aria-hidden="true" />
              Book a free consultation
            </Button>
            <BookACallButton
              location="contact_widget"
              variant="outline"
              size="default"
              className="w-full justify-start"
            >
              Or pick a time on my calendar
            </BookACallButton>
            {SITE.email && (
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href={`mailto:${SITE.email}`}>
                  <Mail aria-hidden="true" />
                  {SITE.email}
                </a>
              </Button>
            )}
            {SITE.phone && SITE.phoneHref && (
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href={`tel:${SITE.phoneHref}`}>
                  <Phone aria-hidden="true" />
                  {SITE.phone}
                </a>
              </Button>
            )}
            <p className="pt-1 text-center text-xs text-muted-foreground">
              No spam, ever. {SITE.coverage}.
            </p>
          </div>
        </div>
      )}

      <Button
        size="icon"
        variant="hero"
        data-magnetic
        className="size-14 rounded-full shadow-[var(--shadow-glow)]"
        aria-expanded={open}
        aria-label={open ? "Close contact panel" : "Open contact panel"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X aria-hidden="true" /> : <MessageCircle aria-hidden="true" />}
      </Button>
    </div>
  );
}
