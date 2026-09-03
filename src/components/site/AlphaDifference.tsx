import { Banknote, MessagesSquare, Timer, MapPinned } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";

const DIFFERENTIATORS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Banknote,
    title: "Fixed price, no surprises",
    body: "Your price is agreed before work starts and it does not move once we're underway.",
  },
  {
    icon: MessagesSquare,
    title: "Plain English, no jargon",
    body: "Every update, quote and plan is written so you understand exactly what you're getting.",
  },
  {
    icon: Timer,
    title: "2–4 week turnaround",
    body: "Most projects go from kickoff to launch inside a month, not a quarter.",
  },
  {
    icon: MapPinned,
    title: "UK-local, not offshored",
    body: "You work directly with the people building your project, in your time zone.",
  },
];

export function AlphaDifference() {
  return (
    <section className="bg-background py-24" aria-labelledby="difference-heading">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            The Alpha difference
          </p>
          <h2 id="difference-heading" className="mt-4 heading-2 font-extrabold">
            What working with us actually feels like.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DIFFERENTIATORS.map((d, i) => (
            <Reveal key={d.title} delay={i * 80} bounce>
              <div className="group h-full overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-transform duration-300 hover:-translate-y-1">
                <div
                  className="relative flex h-28 items-center justify-center overflow-hidden bg-[radial-gradient(120%_120%_at_30%_20%,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_70%)]"
                  aria-hidden="true"
                >
                  <span className="ambient-float grid size-14 place-items-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform duration-500 group-hover:scale-110">
                    <d.icon className="size-6" aria-hidden="true" />
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold">{d.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{d.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
