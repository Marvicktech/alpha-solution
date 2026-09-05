import { Mail, Phone, Linkedin, Instagram, Facebook } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { SITE } from "@/config/site";

const SOCIALS = [
  { key: "linkedin", Icon: Linkedin, label: "LinkedIn", href: SITE.social.linkedin },
  { key: "instagram", Icon: Instagram, label: "Instagram", href: SITE.social.instagram },
  { key: "facebook", Icon: Facebook, label: "Facebook", href: SITE.social.facebook },
].filter((s) => s.href);

export function Footer() {
  const hasContact = Boolean(SITE.email || SITE.phone);

  return (
    <footer className="border-t border-white/10 bg-ink-2 py-14 text-on-ink">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Wordmark tone="ink" className="text-2xl" />
            <p className="mt-5 max-w-xs text-sm text-on-ink-muted">{SITE.positioning}</p>
            <p className="mt-3 text-xs text-on-ink-muted">{SITE.coverage}</p>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-sm font-semibold tracking-[0.2em] uppercase">Explore</h2>
            <ul className="mt-4 space-y-2 text-sm text-on-ink-muted">
              {[
                // Absolute path + hash (not a bare "#anchor") so this footer
                // works correctly on subpages too — like /work/onomz-investments
                // — not only when it's rendered on the homepage itself.
                ["/#services", "Services"],
                ["/#work", "Work"],
                ["/#how-it-works", "How we work"],
                ["/#faq", "FAQ"],
                ["/#book", "Book a consultation"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="transition-colors hover:text-on-ink">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold tracking-[0.2em] uppercase">Contact</h2>
            {hasContact ? (
              <ul className="mt-4 space-y-2 text-sm text-on-ink-muted">
                {SITE.email && (
                  <li>
                    <a
                      href={`mailto:${SITE.email}`}
                      className="inline-flex items-center gap-2 hover:text-on-ink"
                    >
                      <Mail className="size-4" aria-hidden="true" /> {SITE.email}
                    </a>
                  </li>
                )}
                {SITE.phone && (
                  <li>
                    <a
                      href={`tel:${SITE.phoneHref || SITE.phone}`}
                      className="inline-flex items-center gap-2 hover:text-on-ink"
                    >
                      <Phone className="size-4" aria-hidden="true" /> {SITE.phone}
                    </a>
                  </li>
                )}
                {SITE.address && <li>{SITE.address}</li>}
              </ul>
            ) : (
              <p className="mt-4 max-w-xs text-sm text-on-ink-muted">
                The quickest way to reach us is the consultation form. Send your details and we
                reply within one working day.
              </p>
            )}

            {SOCIALS.length > 0 && (
              <div className="mt-5 flex gap-3">
                {SOCIALS.map(({ key, Icon, label, href }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Alpha Presence on ${label}`}
                    className="grid size-10 place-items-center rounded-xl border border-white/20 bg-white/10 transition-colors hover:bg-white/20"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="mt-12 border-t border-white/10 pt-6 text-xs text-on-ink-muted">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
