import { Quote } from "lucide-react";
import { Reveal } from "./Reveal";

export const TESTIMONIALS = [
  {
    category: "Website Conversion",
    quote:
      "Alpha Presence did an amazing job improving our website. They didn't just make it look better; they focused on making the entire customer journey clearer and easier. Within just one week, we had 15 customers come through the website. That was a result we honestly didn't expect so quickly.",
    company: "Onomz Investments",
  },
  {
    category: "Business Automation",
    quote:
      "Before working with Alpha Presence, a lot of our daily processes were still being handled manually. They helped us identify the repetitive tasks and introduced automation that made our workflow much more efficient. We reduced our manual workload by about 60%, and that has given us more time to focus on serving our customers and growing the business.",
    company: "Abestos Services",
  },
  {
    category: "Google Business Profile Optimization",
    quote:
      "Alpha Presence helped us optimize our Google Business Profile and improve how our business appeared in local search. They looked at the profile from both a visibility and customer perspective and made the necessary improvements. We started getting better visibility and more engagement from people searching for our services.",
    company: "Onomz Investments",
  },
  {
    category: "AI & Automation",
    quote:
      "Alpha Presence helped us see how AI and automation could actually fit into our business instead of just adding more tools to our workflow. They identified areas where we were wasting time and showed us how to automate them. The whole process became much more organized and efficient.",
    company: "Tiri Solutions",
  },
  {
    category: "Business Growth Consultation",
    quote:
      "My consultation with Alpha Presence gave me a completely different perspective on my business. They looked at what we were currently doing, identified the gaps, and showed me opportunities we weren't taking advantage of. Their strategy was focused on helping us scale the business 10x beyond where we were, with practical steps rather than just theory.",
    company: "Tiri Ventures",
  },
  {
    category: "Marketing Automation (HubSpot)",
    quote:
      "Alpha Presence did an excellent job enhancing our marketing automation through HubSpot. They demonstrated a strong understanding of workflow optimization and lead nurturing strategies. Their attention to detail and ability to align automation with our marketing goals greatly improved our lead generation efforts.",
    // PLACEHOLDER: no client/company name was supplied for this one yet.
    // Replace with the real business name before launch — do not invent one.
    company: "Client name pending",
  },
];

/**
 * Floating boxed testimonial panels: each card sits in a `.glass-panel`
 * (translucent, bordered, blurred) and bobs gently on its own timing via
 * `.ambient-float`, so the grid never moves in lockstep. The float animation
 * lives on an inner wrapper, separate from the `Reveal` scroll-in element,
 * because both would otherwise fight over the same `transform` property.
 */
export function Testimonial() {
  return (
    <section
      id="testimonials"
      className="section-ink relative overflow-hidden py-24"
      aria-label="Client testimonials"
    >
      <div className="hero-glow absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow-text text-primary-glow">What clients say</p>
          <h2 className="heading-2 mt-4 font-extrabold text-balance text-on-ink">
            Real results, from real UK businesses
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal
              key={t.company + t.category}
              delay={i * 90}
              bounce
              className={i % 3 === 1 ? "lg:mt-10" : undefined}
            >
              <div
                className="ambient-float h-full"
                style={{
                  animationDuration: `${7.5 + i * 0.9}s`,
                  animationDelay: `${i * 0.45}s`,
                }}
              >
                <div className="glass-panel flex h-full flex-col rounded-2xl p-6">
                  <Quote
                    className="size-6 shrink-0 text-primary-glow opacity-70"
                    aria-hidden="true"
                    strokeWidth={1.5}
                  />
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-on-ink-muted">
                    {t.quote}
                  </p>
                  <div className="mt-6 border-t border-white/10 pt-4">
                    <p className="eyebrow-text text-primary-glow">{t.category}</p>
                    <p className="mt-1 text-sm font-bold text-on-ink">{t.company}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
