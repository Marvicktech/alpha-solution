import { Reveal } from "./Reveal";

export function Mission() {
  return (
    <section className="bg-background py-24" aria-labelledby="mission-heading">
      <div className="mx-auto max-w-4xl px-5 text-center">
        <Reveal>
          <h2
            id="mission-heading"
            className="heading-2 font-extrabold text-balance"
          >
            Built for Local Businesses{" "}
            <span className="font-display text-primary">&amp;</span>{" "}
            Powered by Plain English
          </h2>
          <p className="lead-copy mx-auto mt-6 max-w-2xl text-muted-foreground">
            No jargon, no agency-speak and no twelve-page proposals. We look at your business,
            tell you honestly what is costing you customers online, and fix it at a fixed price,
            so you always know what you are getting and why.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
