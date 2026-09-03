import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import onomzSite from "@/assets/onomz-site.jpg";
import s9Site from "@/assets/s9-direct-motor.jpg";

const PROJECTS = [
  {
    name: "Onomz Investments",
    sector: "Hair and braiding salon · Aberdeen, Scotland",
    href: "https://onomzinvestments.co.uk",
    domain: "onomzinvestments.co.uk",
    summary:
      "A clear, credible online presence with a single obvious route to getting in touch.",
    outcome: "One clear booking route, live and indexed.",
    // Sourced directly from the client's own testimonial below — not a
    // number we're estimating. Leave unset (see S9) rather than invent one.
    stat: "+15 customers in week 1",
    image: onomzSite,
    alt: "Homepage of the Onomz website, a hair and braiding salon in Aberdeen, built by Alpha Presence",
  },
  {
    name: "S9 Direct Motor",
    sector: "DVSA-approved MOT testing centre · Sheffield, England",
    href: "https://s9directmotor.com",
    domain: "s9directmotor.com",
    summary:
      "Local search visibility and a booking journey built around how drivers actually search.",
    outcome: "Built around how drivers actually search for an MOT.",
    stat: undefined as string | undefined,
    image: s9Site,
    alt: "Homepage of the S9 Direct Motor website, a DVSA-approved MOT testing centre, built by Alpha Presence",
  },
];

export function Work() {
  return (
    <section id="work" className="bg-background py-24" aria-labelledby="work-heading">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Recent work
          </p>
          <h2 id="work-heading" className="mt-4 heading-2 font-extrabold">
            Real businesses you can check for yourself.
          </h2>
          <p className="mt-4 text-muted-foreground">
            We only show work that is live. Every link below opens the client's own site.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.name} delay={i * 90}>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-glow)] motion-reduce:transform-none motion-reduce:transition-none"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
                  {p.image ? (
                    <>
                      <img
                        src={p.image}
                        alt={p.alt}
                        loading="lazy"
                        decoding="async"
                        className="size-full object-cover object-top saturate-[0.8] transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      {/* Brand-pink duotone tint, so the screenshots read as
                          "part of this site" instead of plain unedited photos. */}
                      <div
                        className="pointer-events-none absolute inset-0 bg-primary/30 mix-blend-color"
                        aria-hidden="true"
                      />
                      <div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent"
                        aria-hidden="true"
                      />
                      {p.stat && (
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-ink/85 px-3 py-1.5 text-xs font-bold text-on-ink shadow-[var(--shadow-glow)] backdrop-blur-sm">
                          <span className="size-1.5 shrink-0 rounded-full bg-primary-glow" aria-hidden="true" />
                          {p.stat}
                        </span>
                      )}
                    </>
                  ) : (
                    <div className="grid size-full place-items-center px-6 text-center">
                      <span className="text-sm font-semibold text-muted-foreground">
                        {p.domain}
                      </span>
                    </div>
                  )}
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-ink via-ink/85 to-transparent px-5 pt-10 pb-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none"
                  >
                    <p className="text-sm font-semibold text-on-ink">{p.outcome}</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="flex items-center gap-2 text-lg font-bold">
                    {p.name}
                    <ArrowUpRight
                      className="size-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.sector}</p>
                  <p className="mt-3 text-muted-foreground">{p.summary}</p>
                  <span className="mt-4 block text-sm font-semibold text-primary">{p.domain}</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
