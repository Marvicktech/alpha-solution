import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { SITE } from "@/config/site";
import { track } from "@/lib/analytics";

const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#how-it-works", label: "How we work" },
  { href: "#why-us", label: "Why us" },
  { href: "#faq", label: "FAQ" },
];

// Rotates through short CTA phrases inside the pill, the way the reference
// nav cycles its own center label. Pure text swap, no layout shift.
const CTA_PHRASES = ["Book a free consultation", "Get found by Google & AI"];

/**
 * Floating pill navbar — a compact rounded capsule pinned near the top of
 * the viewport (not a full-width bar), with the logo on the left, a
 * rotating CTA label in the middle, and circular icon buttons (quote link,
 * call, menu) on the right. The menu button opens a full-screen overlay
 * holding the actual nav links, matching the reference's hamburger-first
 * navigation pattern.
 */
export function Navbar({ onBook }: { onBook: () => void }) {
  const [open, setOpen] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedRef.current) return;
    const id = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % CTA_PHRASES.length);
    }, 3800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-6">
        <nav
          aria-label="Primary"
          className="flex w-full max-w-md items-center gap-1 rounded-full border border-white/50 bg-white/30 py-1.5 pr-1.5 pl-4 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.45)] backdrop-blur-xl backdrop-saturate-150 sm:max-w-lg lg:max-w-2xl lg:pl-6 xl:max-w-3xl"
        >
          <a href="#top" aria-label="Alpha Presence home" className="mr-auto inline-flex shrink-0">
            <Wordmark tone="light" showMark className="text-[0.95rem]" />
          </a>

          {/* Short, always-visible label on mobile (the reference keeps a
              text label in the pill at every width, it just shortens it),
              swapped for the longer rotating phrase from sm: up. */}
          <button
            type="button"
            data-magnetic
            onClick={() => {
              track("booking_cta_click", { location: "navbar_pill" });
              onBook();
            }}
            className="truncate px-1 text-sm font-semibold text-foreground/90 transition-colors hover:text-foreground sm:hidden"
          >
            Book
          </button>
          <button
            type="button"
            data-magnetic
            onClick={() => {
              track("booking_cta_click", { location: "navbar_pill" });
              onBook();
            }}
            className="hidden truncate px-2 text-sm font-semibold text-foreground/90 transition-colors hover:text-foreground sm:block lg:px-4 lg:text-base"
          >
            <span key={phraseIndex} className="animate-in fade-in duration-300">
              {CTA_PHRASES[phraseIndex]}
            </span>
          </button>

          <button
            type="button"
            aria-label="Get a free quote"
            data-magnetic
            onClick={() => {
              track("booking_cta_click", { location: "navbar_icon" });
              onBook();
            }}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-on-ink transition-transform hover:scale-105"
          >
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </button>

          {SITE.phone && (
            <a
              href={`tel:${SITE.phoneHref || SITE.phone}`}
              aria-label={`Call us at ${SITE.phone}`}
              data-magnetic
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-on-ink transition-transform hover:scale-105"
            >
              <Phone className="size-4" aria-hidden="true" />
            </a>
          )}

          <button
            type="button"
            data-magnetic
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-on-ink transition-transform hover:scale-105"
          >
            {open ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
          </button>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-ink/98 backdrop-blur-lg transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <ul className="flex flex-col items-center gap-6">
          {LINKS.map((l, i) => (
            <li key={l.href} style={{ transitionDelay: open ? `${i * 60}ms` : "0ms" }}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display text-3xl font-extrabold text-on-ink transition-colors hover:text-primary-glow sm:text-4xl"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-center gap-4">
          {SITE.phone && (
            <a
              href={`tel:${SITE.phoneHref || SITE.phone}`}
              className="inline-flex items-center gap-2 text-on-ink-muted hover:text-on-ink"
            >
              <Phone className="size-4" aria-hidden="true" />
              {SITE.phone}
            </a>
          )}
          <button
            type="button"
            onClick={() => {
              track("booking_cta_click", { location: "navbar_overlay" });
              setOpen(false);
              onBook();
            }}
            className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
          >
            Book a free consultation
          </button>
        </div>
      </div>
    </>
  );
}
