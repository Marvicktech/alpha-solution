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

        <Reveal delay={100} className="lg:order-last">
          {/* Scaled to a comfortable share of the screen on mobile (not
              full-bleed, not tiny) so the photo reads as a supporting visual
              under the heading it belongs to. Opens back up at lg, where it
              sits in its own column beside the text. */}
          <div className="relative mx-auto w-[82%] max-w-xs sm:max-w-sm lg:w-full lg:max-w-none">
            <div className="aspect-[5/6] overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-card)]">
              <img
                src={consultationPhoto}
                alt="A consultation session where a plan is talked through on a flip chart, the kind of plain-English walkthrough every Alpha Presence project starts with"
                loading="lazy"
                decoding="async"
                className="photo-breathe size-full object-cover"
              />
            </div>
            <span className="absolute -bottom-4 left-4 max-w-[calc(100%-2rem)] rounded-xl border border-border bg-card px-3.5 py-2 text-xs leading-snug font-bold shadow-[var(--shadow-card)]">
              Where every project starts
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
