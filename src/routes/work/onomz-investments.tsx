import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Quote } from "lucide-react";
import { SubpageHeader } from "@/components/site/SubpageHeader";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { PROJECTS } from "@/components/site/Work";
import { TESTIMONIALS } from "@/components/site/Testimonial";
import { pageHead, breadcrumbLd, SITE_URL } from "@/lib/seo";

const PROJECT = PROJECTS.find((p) => p.slug === "onomz-investments")!;
const REVIEWS = TESTIMONIALS.filter((t) => t.company === "Onomz Investments");

const TITLE = "Onomz Investments case study | Alpha Presence";
const DESCRIPTION =
  "How Alpha Presence rebuilt the Onomz Investments website — a hair and braiding salon in Aberdeen — around one clear booking route, bringing 15 new customers in the first week.";

export const Route = createFileRoute("/work/onomz-investments")({
  head: () => ({
    ...pageHead({ title: TITLE, description: DESCRIPTION, path: "/work/onomz-investments" }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Work", path: "/#work" },
            { name: "Onomz Investments", path: "/work/onomz-investments" },
          ]),
        ),
      },
      // Real, verbatim testimonial quotes already published on the homepage —
      // this only describes content that's already true and on the page, it
      // doesn't add anything new. See src/components/site/Testimonial.tsx.
      ...(REVIEWS.length > 0
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                name: "Alpha Presence — website design & build for Onomz Investments",
                brand: { "@type": "Organization", name: "Alpha Presence" },
                review: REVIEWS.map((r) => ({
                  "@type": "Review",
                  reviewBody: r.quote,
                  name: r.category,
                  itemReviewed: { "@id": `${SITE_URL}/#organization` },
                  author: { "@type": "Organization", name: r.company },
                })),
              }),
            },
          ]
        : []),
    ],
  }),
  component: OnomzCaseStudy,
});

function OnomzCaseStudy() {
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
              {PROJECT.stat && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-bold text-on-ink">
                  <span className="size-1.5 shrink-0 rounded-full bg-primary-glow" aria-hidden="true" />
                  {PROJECT.stat}
                </span>
              )}
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
              Onomz Investments, a hair and braiding salon in Aberdeen, needed a website that gave
              potential customers a clear, credible first impression and one obvious way to get in
              touch — instead of leaving them to hunt for a phone number or DM on social media.
            </p>

            <h2 className="mt-12 heading-3 font-extrabold">What we did</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              We rebuilt the site around a single, obvious booking route, cut the noise from the
              page, and made sure the site was genuinely findable and indexed on Google.
            </p>

            <h2 className="mt-12 heading-3 font-extrabold">The result</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">{PROJECT.outcome}</p>
          </div>
        </section>

        {REVIEWS.length > 0 && (
          <section className="section-ink relative overflow-hidden py-16 sm:py-20" aria-label="Client testimonials">
            <div className="hero-glow absolute inset-0 opacity-30" aria-hidden="true" />
            <div className="relative mx-auto max-w-4xl px-5">
              <h2 className="heading-3 font-extrabold text-on-ink">In their own words</h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {REVIEWS.map((t) => (
                  <div key={t.category} className="glass-panel flex h-full flex-col rounded-2xl p-6">
                    <Quote
                      className="size-6 shrink-0 text-primary-glow opacity-70"
                      aria-hidden="true"
                      strokeWidth={1.5}
                    />
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-on-ink-muted">{t.quote}</p>
                    <div className="mt-6 border-t border-white/10 pt-4">
                      <p className="eyebrow-text text-primary-glow">{t.category}</p>
                      <p className="mt-1 text-sm font-bold text-on-ink">{t.company}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

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
                to="/work/s9-direct-motor"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                See the S9 Direct Motor case study
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
