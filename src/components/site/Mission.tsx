import { Reveal } from "./Reveal";
import consultationPhoto from "@/assets/mission-consultation.jpg";

export function Mission() {
  return (
    <section className="bg-background py-24" aria-labelledby="mission-heading">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <Reveal className="text-center lg:text-left">
          <h2
            id="mission-heading"
            className="heading-2 font-extrabold text-balance"
          >
            Built for Local Businesses{" "}
            <span className="font-display text-primary">&amp;</span>{" "}
            Powered by Plain English
          </h2>
          <p className="lead-copy mx-auto mt-6 max-w-2xl text-muted-foreground lg:mx-0">
            No jargon, no agency-speak and no twelve-page proposals. We look at your business,
            tell you honestly what is costing you customers online, and fix it at a fixed price,
            so you always know what you are getting and why.
          </p>
        </Reveal>

        <Reveal delay={100} className="order-first lg:order-last">
          <div className="mx-auto aspect-[5/6] max-w-sm overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-card)] lg:max-w-none">
            <img
              src={consultationPhoto}
              alt="A consultation session where a plan is talked through on a flip chart, the kind of plain-English walkthrough every Alpha Presence project starts with"
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
