import { Reveal } from "./Reveal";

export const STEPS = [
  {
    title: "Book a free consultation",
    body: "15 minutes, no pressure. Tell us what's not working.",
  },
  {
    title: "We map out the fix",
    body: "A plain-English plan: what we'll build, how long it'll take, what it costs.",
  },
  {
    title: "We build it, you launch it",
    body: "Typically live in 2 to 4 weeks. You approve every step along the way.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-secondary py-24" aria-labelledby="how-heading">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            How it works
          </p>
          <h2 id="how-heading" className="mt-4 heading-2 font-extrabold">
            A process you can follow without a translator.
          </h2>
        </Reveal>

        <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 80} className="bg-card">
              <div className="h-full p-7">
                <span className="text-sm font-bold tracking-[0.15em] text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-muted-foreground">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
