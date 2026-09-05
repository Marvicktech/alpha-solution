import { Reveal } from "./Reveal";

const POINTS = [
  {
    title: "Do you start with a real conversation?",
    body: "Yes. Every project starts with a free look at your business and your customers. We find what is actually stopping people from choosing you.",
  },
  {
    title: "Will I understand what you're doing?",
    body: "Yes. We work in plain English, with no jargon or acronym soup. You know the plan, the reason and the price before anything starts.",
  },
  {
    title: "Do you build for AI search as well as Google?",
    body: "Yes. Google still matters, and so do the AI assistants people ask first. We build for both, not one at the expense of the other.",
  },
  {
    title: "Who owns the work when it's finished?",
    body: "You do. Domain, hosting account, files and data stay in your name. There is no lock-in and no retainer you cannot leave.",
  },
];

export function Trust() {
  return (
    <section id="why-us" className="section-ink py-24" aria-labelledby="trust-heading">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.2em] text-on-ink-muted uppercase">
            Why Alpha Presence
          </p>
          <h2 id="trust-heading" className="mt-4 heading-2 font-extrabold text-on-ink">
            Why choose Alpha Presence?
          </h2>
          <p className="mt-4 text-on-ink-muted">
            Alpha Presence is a UK digital agency that builds online presence, UI/UX, automation
            and SEO/AEO/GEO for local businesses. We work in plain English, at a fixed price
            agreed upfront. You own everything we build.
          </p>
        </Reveal>

        <dl className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
          {POINTS.map((p, i) => (
            // `<dl>`'s content model only allows a wrapping element around a
            // dt/dd pair if that wrapper is a <div> whose OWN direct children
            // are the dt/dd — nesting Reveal's div AND a second inner div
            // (as this used to) put the dt/dd two levels deep, which is what
            // Lighthouse's "dl doesn't contain only dt/dd/div groups" audit
            // flags. Reveal already renders a single <div>, so its className
            // absorbs what the removed inner wrapper used to carry.
            <Reveal key={p.title} delay={i * 80} className="h-full bg-ink p-7">
              <dt className="text-lg font-bold text-on-ink">{p.title}</dt>
              <dd className="mt-2 text-on-ink-muted">{p.body}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
