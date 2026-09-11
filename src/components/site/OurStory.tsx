import { Reveal } from "./Reveal";

/**
 * Honest origin section, placed right before the testimonials. Deliberately
 * makes explicit what the Testimonial/Work sections don't say out loud: the
 * clients shown are the early ones who took a chance on this before there
 * was a long track record to point to — not arms-length enterprise accounts.
 *
 * PLACEHOLDER: kept intentionally general (no invented dates, costs, or
 * headcounts). If you want specific numbers here — how long you spent
 * learning before the first paid project, what you actually spent out of
 * pocket on tools/hosting/consultation platforms, etc — give me the real
 * figures and I'll slot them in. Do not invent values.
 */
export function OurStory() {
  return (
    <section className="bg-secondary py-24" aria-labelledby="story-heading">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <Reveal>
          <p className="text-sm font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            How we got here
          </p>
          <h2 id="story-heading" className="mt-4 heading-2 font-extrabold text-balance">
            Built by grinding through it, not by raising it.
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-8 space-y-5 text-left text-muted-foreground sm:text-lg">
            <p>
              There was no investor round behind Alpha Presence. Every tool, every hour learning
              the craft, and every hour spent building the booking system and automation running
              this site itself came out of pocket, before a single invoice was raised.
            </p>
            <p>
              The businesses you see below — Onomz Investments and the others — are the founding
              clients. They said yes when there wasn't yet a long track record to point to, just a
              plan and a promise to deliver it in plain English. The results underneath their
              names are the real, measured outcome of that bet paying off, and they're the reason
              this exists as more than an idea.
            </p>
            <p>
              If you're the next business to say yes, you're not signing up as customer number
              one thousand in a queue. You're getting the same close attention they got.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
