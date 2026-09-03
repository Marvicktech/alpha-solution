import { Phone, Search, FileCheck2 } from "lucide-react";
import { Reveal } from "./Reveal";

// There's no real recording of a consultation to show, so rather than fake
// one, this is an honest animated mockup of the actual three steps — it
// sets correct expectations instead of implying real footage.
const STEPS = [
  {
    icon: Phone,
    title: "Quick call",
    body: "15–30 minutes, no pitch. We ask about your business and how customers find you today.",
  },
  {
    icon: Search,
    title: "We review your site",
    body: "We look at what's working, what's costing you customers, and what's worth fixing first.",
  },
  {
    icon: FileCheck2,
    title: "You get a fixed quote",
    body: "Clear scope, clear price, agreed upfront. No obligation to go ahead.",
  },
];

export function ConsultationPreview() {
  return (
    <Reveal delay={40} className="mt-10">
      <p className="text-center text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
        What the free consultation actually looks like
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, body }, i) => (
          <div
            key={title}
            className="relative rounded-2xl border border-border bg-card p-5 text-center shadow-[var(--shadow-card)] sm:text-left"
          >
            <div
              className="step-glow mx-auto grid size-11 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground sm:mx-0"
              style={{ animationDelay: `${i * 3}s` }}
            >
              <Icon className="size-5" aria-hidden="true" />
            </div>
            <p className="mt-3 text-sm font-bold">
              <span className="text-primary">{i + 1}.</span> {title}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
