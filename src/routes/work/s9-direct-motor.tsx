import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SubpageHeader } from "@/components/site/SubpageHeader";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { PROJECTS } from "@/components/site/Work";
import { pageHead, breadcrumbLd } from "@/lib/seo";

const PROJECT = PROJECTS.find((p) => p.slug === "s9-direct-motor")!;

const TITLE = "S9 Direct Motor case study | Alpha Presence";
const DESCRIPTION =
  "How Alpha Presence built local search visibility and a booking journey for S9 Direct Motor, a DVSA-approved MOT testing centre in Sheffield, around how drivers actually search.";

export const Route = createFileRoute("/work/s9-direct-motor")({
  head: () => ({
    ...pageHead({ title: TITLE, description: DESCRIPTION, path: "/work/s9-direct-motor" }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Work", path: "/#work" },
            { name: "S9 Direct Motor", path: "/work/s9-direct-motor" },
          ]),
        ),
      },
    ],
  }),
  component: S9CaseStudy,
});

function S9CaseStudy() {
  return (
    <div className="min-h-screen bg-background">
      <SubpageHeader />
      <main>
        <section className="border-b border-border bg-background py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-5">
            <p className="text-sm font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              Case study
            </p>
            <h1 className="mt-4 heading-2 font-extrabold">{PROJECT.name}</h1>
            <p className="mt-2 text-muted-foreground">{PROJECT.sector}</p>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{PROJECT.summary}</p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={PROJECT.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Visit {PROJECT.domain}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            </div>

            <div className="mt-10 overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-card)]">
              <picture>
                {PROJECT.imageWebp && <source srcSet={PROJECT.imageWebp} type="image/webp" />}
                <img
                  src={PROJECT.image}
                  alt={PROJECT.alt}
                  loading="eager"
                  decoding="async"
                  className="w-full object-cover object-top"
                />
              </picture>
            </div>
          </div>
        </section>

        <section className="bg-secondary/40 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-5">
            <h2 className="heading-3 font-extrabold">The challenge</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              S9 Direct Motor, a DVSA-approved MOT testing centre in Sheffield, needed to show up
              when local drivers search for an MOT, and give them a straightforward way to book
              once they land on the site.
            </p>

            <h2 className="mt-12 heading-3 font-extrabold">What we did</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              We built the site's structure and content around how drivers actually search for an
              MOT locally, with a booking journey that matches that search intent.
            </p>

            <h2 className="mt-12 heading-3 font-extrabold">The result</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">{PROJECT.outcome}</p>
          </div>
        </section>

        <section className="bg-background py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-5 text-center">
            <h2 className="heading-3 font-extrabold">Want a website that does this for you?</h2>
            <p className="mt-3 text-muted-foreground">
              Book a free consultation and we'll tell you honestly whether we can help.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button asChild variant="hero" size="lg">
                <a href="/#book">Book a free consultation</a>
              </Button>
              <Link
                to="/work/onomz-investments"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                See the Onomz Investments case study
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
