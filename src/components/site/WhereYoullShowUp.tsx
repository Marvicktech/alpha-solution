import { Search, MapPin, Bot, Building2, Instagram } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";

const PLATFORMS: { icon: LucideIcon; name: string; blurb: string }[] = [
  {
    icon: Search,
    name: "Google Search",
    blurb: "Ranking for the searches your customers actually type.",
  },
  {
    icon: MapPin,
    name: "Google Maps",
    blurb: "Showing up when people search \"near me\" on the move.",
  },
  {
    icon: Bot,
    name: "ChatGPT & Perplexity",
    blurb: "Cited as a source when people ask AI tools for a recommendation.",
  },
  {
    icon: Building2,
    name: "Google Business Profile",
    blurb: "A complete, accurate listing with hours, reviews and photos.",
  },
  {
    icon: Instagram,
    name: "Instagram & Facebook",
    blurb: "A presence that matches your site, not a stale, half-finished page.",
  },
];

export function WhereYoullShowUp() {
  const mid = Math.ceil(PLATFORMS.length / 2);
  const columns = [PLATFORMS.slice(0, mid), PLATFORMS.slice(mid)];

  return (
    <section className="bg-secondary py-24" aria-labelledby="show-up-heading">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Where you'll show up
          </p>
          <h2 id="show-up-heading" className="mt-4 heading-2 font-extrabold">
            The places your customers already look.
          </h2>
          <p className="mt-4 text-muted-foreground">
            We build your online presence to appear consistently across the search engines,
            maps and AI tools UK local customers actually use.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-x-12 gap-y-2 sm:grid-cols-2">
          {columns.map((col, ci) => (
            <ul key={ci} className="divide-y divide-border">
              {col.map((p, i) => (
                <Reveal as="li" key={p.name} delay={(ci * mid + i) * 80}>
                  <div className="flex items-start gap-4 py-5">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full border border-border bg-card text-primary">
                      <p.icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-bold">{p.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
