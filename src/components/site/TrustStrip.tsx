import { Reveal } from "./Reveal";

// Real clients only — pulled from the case studies and testimonials shown
// elsewhere on this site. Do not add a name here that isn't backed by a
// project or quote on the page.
const CLIENTS = [
  "Onomz Investments",
  "S9 Direct Motor",
  "Abestos Services",
  "Tiri Solutions",
  "Tiri Ventures",
];

export function TrustStrip() {
  return (
    <section className="border-y border-border bg-secondary/40 py-8" aria-label="Businesses we've worked with">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="shrink-0 text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Trusted by growing UK businesses
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 sm:justify-end">
            {CLIENTS.map((name) => (
              <li
                key={name}
                className="text-sm font-bold text-foreground/70 transition-colors hover:text-foreground"
              >
                {name}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
