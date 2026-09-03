import { Reveal } from "./Reveal";

const ROWS = [
  {
    problem: "Does your online presence look like it's from 2015?",
    points: [
      "We build a presence that looks like the business you actually are.",
      "Fast, clean and credible in ten seconds flat.",
      "Speed pays: mobile conversions can fall up to 20% per extra second of load time.",
    ],
    note: "2",
  },
  {
    problem: "You show up on page 4 of Google, and not at all in ChatGPT. Why?",
    points: [
      "We optimise for traditional search and AI answer engines together.",
      "ChatGPT alone now handles close to 1 in 5 searches worldwide.",
      "It passed a billion monthly users this year, so SEO on its own leaves you behind.",
    ],
    note: "3",
  },
  {
    problem: "People land on your page and just… leave. What fixes that?",
    points: [
      "Better UX keeps people reading instead of bouncing.",
      "Bounce probability jumps 32% going from a 1-second load to a 3-second one.",
      "We remove the dead ends and make the next step obvious.",
    ],
    note: "4",
  },
  {
    problem: "Doing the same admin task for the fortieth time this month?",
    points: [
      "We automate the repetitive parts of your day.",
      "Enquiries, follow-ups and reminders run themselves.",
      "Your time goes back into the business, not the busywork.",
    ],
  },
];

const SOURCES = [
  "BrightLocal / SynUp consumer research, via SeoProfy: 99% of people have researched a local business online in the past year; 88% who search locally on mobile visit or call within a day.",
  "Google and Ipsos, via WP Rocket: mobile conversions can fall by up to 20% for every one-second delay in load time.",
  "First Page Sage research study, June 2026: ChatGPT holds roughly 17.9% of global digital queries and passed 1 billion monthly active users in May 2026.",
  "Google, via WP Rocket: bounce probability increases 32% as load time goes from 1 second to 3 seconds.",
];

export function Problems() {
  return (
    <section className="bg-background py-24" aria-labelledby="problems-heading">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-3xl">
          <p className="text-sm font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Sound familiar?
          </p>
          <h2 id="problems-heading" className="mt-4 heading-2 font-extrabold">
            Why do local businesses lose customers online?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Most UK local businesses lose customers to a slow page and a search they never
            appeared in, not to a better competitor. Alpha Presence fixes both.
          </p>
        </Reveal>

        <ul className="mt-14 divide-y divide-border border-y border-border">
          {ROWS.map((r, i) => (
            <Reveal as="li" key={r.problem} delay={i * 80}>
              <div className="grid gap-2 py-7 md:grid-cols-[1fr_1fr] md:items-baseline md:gap-10">
                <h3 className="text-lg font-bold">{r.problem}</h3>
                <ul className="space-y-1.5 text-muted-foreground">
                  {r.points.map((p, pi) => (
                    <li key={p} className="flex gap-2">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                      <span>
                        {p}
                        {r.note && pi === r.points.length - 1 && (
                          <sup className="ml-0.5">{r.note}</sup>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={120}>
          <ol className="mt-8 space-y-1 text-xs text-muted-foreground">
            {SOURCES.map((s, i) => (
              <li key={s}>
                <sup className="mr-1">{i + 1}</sup>
                {s}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
