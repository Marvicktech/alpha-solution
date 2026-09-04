import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { track } from "@/lib/analytics";

export function FinalCTA({ onBook }: { onBook: () => void }) {
  return (
    <section className="section-ink relative overflow-hidden py-32">
      <div className="hero-glow absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <Reveal>
          <h2 className="display-1 font-extrabold text-balance text-on-ink">
            Your customers are already looking. Let's make sure they find you.
          </h2>
          <div className="mt-10 flex justify-center">
            <Button
              variant="hero"
              size="xl"
              data-magnetic
              onClick={() => {
                track("booking_cta_click", { location: "final_cta" });
                onBook();
              }}
            >
              Book a free consultation
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
