import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { track } from "@/lib/analytics";

const CHECKLIST_HREF = "/downloads/5-things-costing-you-customers.pdf";

export function ChecklistCTA() {
  return (
    <section className="bg-secondary/40 py-20" aria-labelledby="checklist-heading">
      <div className="mx-auto max-w-4xl px-5">
        <Reveal>
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-card p-8 text-center shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:text-left md:p-10">
            <span className="inline-grid size-14 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground">
              <FileText className="size-7" aria-hidden="true" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                Free checklist
              </p>
              <h2 id="checklist-heading" className="mt-2 heading-3 font-extrabold">
                5 things costing UK local businesses customers online
              </h2>
              <p className="mt-2 text-muted-foreground">
                Not ready to book yet? Grab the one-page checklist and see what's worth fixing
                first, free.
              </p>
            </div>
            <Button
              asChild
              variant="hero"
              size="lg"
              className="shrink-0"
              onClick={() => track("checklist_download", { location: "faq_section" })}
            >
              <a href={CHECKLIST_HREF} download>
                <Download aria-hidden="true" />
                Download the checklist
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
