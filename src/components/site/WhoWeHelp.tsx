import { Wrench, HeartPulse, Coffee, Dumbbell, Briefcase } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";

const SEGMENTS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Wrench,
    title: "Trades",
    body: "Plumbers, electricians, builders and other tradespeople who need enquiries to keep coming in.",
  },
  {
    icon: HeartPulse,
    title: "Clinics & salons",
    body: "Health, beauty and wellbeing businesses that live or die on bookings and trust.",
  },
  {
    icon: Coffee,
    title: "Cafés & independent retailers",
    body: "Local food, drink and retail businesses competing for footfall and repeat custom.",
  },
  {
    icon: Dumbbell,
    title: "Gyms & studios",
    body: "Fitness businesses that need memberships and class bookings to fill up, not just enquiries.",
  },
  {
    icon: Briefcase,
    title: "Small professional practices",
    body: "Accountants, solicitors, consultants and other practices that need to look credible fast.",
  },
];

// Duplicated once so the track can loop seamlessly at translateX(-50%).
const TRACK = [...SEGMENTS, ...SEGMENTS];

function SegmentCard({ s, i }: { s: (typeof SEGMENTS)[number]; i: number }) {
  return (
    <div className="w-72 shrink-0 px-2.5 sm:w-80">
      <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-start justify-between gap-4">
          <span className="font-display text-2xl leading-none font-extrabold text-primary">
            {String((i % SEGMENTS.length) + 1).padStart(2, "0")}
            <span className="text-muted-foreground/60">/{String(SEGMENTS.length).padStart(2, "0")}</span>
          </span>
          <span className="grid size-11 shrink-0 place-items-center rounded-full border border-border bg-background text-primary">
            <s.icon className="size-5" aria-hidden="true" />
          </span>
        </div>
        <h3 className="mt-6 heading-3 font-bold">{s.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
      </div>
    </div>
  );
}

/**
 * Continuously swiping marquee of audience segments — matches the reference
 * site's ticker-style industries strip, instead of a static grid. Pauses on
 * hover so the text stays readable, and freezes entirely under
 * prefers-reduced-motion (see `.marquee-track` in styles.css).
 */
export function WhoWeHelp() {
  return (
    <section id="who-we-help" className="bg-secondary py-24" aria-labelledby="who-heading">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Who we help
          </p>
          <h2 id="who-heading" className="mt-4 heading-2 font-extrabold">
            Built specifically for UK local businesses like yours.
          </h2>
        </Reveal>
      </div>

      <Reveal bounce delay={120} className="mt-14">
        <div className="marquee-row">
          <div className="marquee-track">
            {TRACK.map((s, i) => (
              <SegmentCard key={`${s.title}-${i}`} s={s} i={i} />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
