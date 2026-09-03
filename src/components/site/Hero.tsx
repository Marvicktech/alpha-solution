import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { CountUp } from "./CountUp";
import { track } from "@/lib/analytics";
import heroPhoto from "@/assets/hero-photo-2.jpg";

const STATS = [
  { value: "99%", label: "research a local business online first" },
  { value: "2–4", label: "weeks from kickoff to launch" },
  { value: "1 in 5", label: "searches now happen in AI tools" },
];

/**
 * Boxed background photo — inset from the section edges with padding and
 * rounded corners, so the section's own background shows through as a frame
 * around it (this is the piece that gets "boxed", not the text content).
 * The frame is white/clean (the section background below), not a dark
 * ink border — and every gradient here stays inside the red/maroon family
 * with no black "ink" mixed in, so nothing reads as a dark overlay sitting
 * on top of the design. Matches the reference's clean, consistently red
 * hero exactly.
 */
function HeroBackground() {
  return (
    <div
      className="absolute inset-3 overflow-hidden rounded-[1.75rem] sm:inset-5 sm:rounded-[2rem] lg:inset-6"
      aria-hidden="true"
    >
      {/* Red linear-gradient wash, sampled from the photo's own background
          red (#da0418) so the image blends into the page instead of
          sitting on top of it — renders instantly, before the photo loads.
          Stays within the red/maroon family end to end, no black. */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(155deg, #da0418 0%, #7a0412 45%, #4a0410 100%)",
        }}
      />

      {/* Photo. The source image is pre-composed (see
          src/assets/hero-photo-2.jpg) with the subject positioned toward
          the right, red backdrop filling the left side, head near the top
          — matching the reference layout.

          object-position 80% 0% (not 100%) is deliberate: on a wide
          desktop box, object-fit: cover is width-bound and 80% vs 100%
          look nearly identical. But on a narrow, tall box the crop becomes
          height-bound instead, so the visible slice is much narrower than
          the subject himself — at 100% that slice was pinned to the
          rightmost edge and only ever showed hair and headphone, cropping
          the face and headset out of frame entirely. 80% keeps the face
          and headset in view at every width.

          Below `sm`, the photo is capped to a fixed band pinned to the top
          of the frame instead of stretching to fill the whole container.
          The container's own height follows the hero's CONTENT (headline
          + paragraph + two stacked buttons + fine print + a 3-up stat
          grid), which on a phone runs well past one screen's height —
          letting a single portrait photo's object-fit: cover try to cover
          all of that forced an extreme, blown-up zoom that filled the
          entire scrolling page behind the text. Capping the photo's own
          height keeps it a normal, well-composed size; the red wash behind
          it (which does span the full container) carries the rest of the
          way down so text stays legible against it either way. From `sm`
          up, content roughly fits one screen again, so the photo goes back
          to filling the full container as before. */}
      <img
        src={heroPhoto}
        alt=""
        className="absolute inset-x-0 top-0 h-[58svh] w-full object-cover object-[80%_0%] [-webkit-mask-image:linear-gradient(to_bottom,#000_80%,transparent_100%)] [mask-image:linear-gradient(to_bottom,#000_80%,transparent_100%)] sm:inset-0 sm:h-full sm:[-webkit-mask-image:none] sm:[mask-image:none]"
        loading="eager"
        fetchPriority="high"
      />

      {/* Left-to-right gradient (red, not ink, so it blends with the photo's
          own red background) so the headline stays readable over whatever
          sits underneath — same role the reference's overlay plays */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, #4a0410 0%, rgba(74,4,16,0.85) 30%, rgba(74,4,16,0.3) 62%, rgba(74,4,16,0.08) 100%)",
        }}
      />
    </div>
  );
}

export function Hero({ onBook }: { onBook: () => void }) {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-background"
    >
      <HeroBackground />

      <div className="relative z-10 flex flex-1 flex-col justify-center px-5 pt-32 pb-14 sm:px-10 lg:px-16 sm:pt-40 sm:pb-20">
        <Reveal>
          <h1 className="display-1 max-w-2xl font-extrabold text-balance text-on-ink">
            Have you been struggling to get more bookings?
          </h1>

          <p className="mt-4 font-display text-2xl font-bold text-primary-glow sm:text-3xl">
            Then this is for you.
          </p>

          <p className="mt-6 max-w-xl text-sm leading-relaxed text-on-ink-muted sm:text-base">
            Most local businesses only tap into a fraction of what the digital space can do
            for them. That's where Alpha Solution comes in: we help you 10x your bookings
            with a site, automation and search presence built to convert.
          </p>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="hero"
              size="xl"
              data-magnetic
              onClick={() => {
                track("booking_cta_click", { location: "hero" });
                onBook();
              }}
            >
              Book a free consultation
              <ArrowRight aria-hidden="true" />
            </Button>
            <Button variant="glass" size="xl" asChild>
              <a href="#services">See what we do</a>
            </Button>
          </div>

          <p className="mt-5 text-xs text-on-ink-muted sm:text-sm">
            Fixed scope and price agreed before work starts. No retainers you cannot exit.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md">
            {STATS.map((s) => (
              <div key={s.value} className="bg-ink/70 px-3 py-4 sm:px-4 sm:py-5">
                <dt className="font-display text-lg font-extrabold text-on-ink sm:text-xl">
                  <CountUp value={s.value} />
                </dt>
                <dd className="mt-1 text-[0.65rem] leading-snug text-on-ink-muted sm:text-xs">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
