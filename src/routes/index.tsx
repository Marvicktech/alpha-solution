import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { CustomCursor } from "@/components/site/CustomCursor";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Mission } from "@/components/site/Mission";
import { Problems } from "@/components/site/Problems";
import { ServicesPicker } from "@/components/site/ServicesPicker";
import { BookingForm } from "@/components/site/BookingForm";
import { Testimonial } from "@/components/site/Testimonial";
import { WhereYoullShowUp } from "@/components/site/WhereYoullShowUp";
import { Work } from "@/components/site/Work";
import { AlphaDifference } from "@/components/site/AlphaDifference";
import { HowItWorks } from "@/components/site/HowItWorks";
import { WhoWeHelp } from "@/components/site/WhoWeHelp";
import { Trust } from "@/components/site/Trust";
import { FAQ, FAQS } from "@/components/site/FAQ";
import { STEPS } from "@/components/site/HowItWorks";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Footer } from "@/components/site/Footer";
import { ContactWidget } from "@/components/site/ContactWidget";
import type { ServiceId } from "@/components/site/data";
import { track } from "@/lib/analytics";

const TITLE =
  "Alpha Presence | Digital Presence, UI/UX & Automation for UK Local Businesses";
const DESCRIPTION =
  "Alpha Presence helps UK local businesses get found on Google and AI search, look credible, and run smoother, with design, UI/UX, automation and SEO/AEO/GEO built in plain English. Book a free consultation.";

const SERVICE_SCHEMA = [
  {
    name: "Website Design & Build",
    description:
      "Fast, modern websites for UK local businesses that turn searches into enquiries.",
  },
  {
    name: "UI/UX Design",
    description: "Clear user journeys so visitors take action instead of bouncing.",
  },
  {
    name: "Automation",
    description: "Automating bookings, follow-ups and forms to cut manual admin work.",
  },
  {
    name: "Branding & SEO/AEO/GEO",
    description:
      "Branding, search optimisation and answer/generative engine optimisation so you are found on Google and cited in AI answers.",
  },
  {
    name: "Google Business Profile Optimisation",
    description:
      "Optimising your Google Business Profile so you rank in the map pack and convert local searches into calls.",
  },
];

// PLACEHOLDER: the following schema fields are intentionally omitted until real,
// verifiable business data exists. Do NOT invent values.
//   - telephone        -> add once a real business phone number is confirmed (src/config/site.ts)
//   - address (street) -> add once a real trading address is confirmed
//   - aggregateRating / reviewCount / "businesses helped" counts -> only add with real reviews
const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  "@id": "/#organization",
  name: "Alpha Presence",
  url: "/",
  description: DESCRIPTION,
  slogan: "Get found, look credible, convert more.",
  areaServed: { "@type": "Country", name: "United Kingdom" },
  address: {
    "@type": "PostalAddress",
    addressCountry: "GB",
  },
  knowsAbout: [
    "Web design",
    "UI/UX design",
    "Business process automation",
    "Local SEO",
    "Answer Engine Optimisation",
    "Generative Engine Optimisation",
  ],
  makesOffer: SERVICE_SCHEMA.map((s) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: s.name,
      description: s.description,
      serviceType: s.name,
      areaServed: { "@type": "Country", name: "United Kingdom" },
      provider: { "@id": "/#organization" },
    },
  })),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Digital services for UK local businesses",
    itemListElement: SERVICE_SCHEMA.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.name, description: s.description },
    })),
  },
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { property: "og:site_name", content: "Alpha Presence" },
      { property: "og:locale", content: "en_GB" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(ORGANIZATION_LD) },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to work with Alpha Presence",
          description:
            "The three-step Alpha Presence process, from free consultation to launch, for UK local businesses.",
          totalTime: "P28D",
          step: STEPS.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.title,
            text: s.body,
          })),
        }),
      },
    ],
  }),
  component: Index,
});


function Index() {
  const [selected, setSelected] = useState<ServiceId | null>(null);
  const [showHuman, setShowHuman] = useState(false);

  const scrollTo = (id: string) =>
    requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );

  const handleSelect = useCallback((id: ServiceId) => {
    setSelected(id);
    track("service_selected", { service: id });
    if (id === "other") {
      setShowHuman(true);
      scrollTo("talk-to-a-human");
    } else {
      setShowHuman(false);
      scrollTo("book");
    }
  }, []);

  const handleBook = useCallback(() => scrollTo("book"), []);

  return (
    <div className="min-h-screen bg-background">
      <CustomCursor />
      {/*
        Rendered here, at the top level, rather than inside Hero: Hero's
        section uses `isolate` for its own background layering, which
        creates a new stacking context. A `fixed` nav nested inside an
        isolated ancestor gets its z-index evaluated only within that
        ancestor's context, so later sections (Mission, Problems, ...) —
        which paint after Hero in normal document order — end up rendering
        ON TOP of the nav wherever they scroll under it. Keeping Navbar as
        a sibling of every section, at the root stacking context, is what
        keeps it reliably above everything as you scroll.
      */}
      <Navbar onBook={handleBook} />
      <main>

        <Hero onBook={handleBook} />
        <Mission />
        <Problems />
        <ServicesPicker selected={selected} onSelect={handleSelect} showHuman={showHuman} />
        <BookingForm service={selected} onServiceChange={(id) => setSelected(id)} />
        <Testimonial />
        <WhereYoullShowUp />
        <Work />
        <AlphaDifference />
        <HowItWorks />
        <WhoWeHelp />
        <Trust />
        <FAQ />
        <FinalCTA onBook={handleBook} />
      </main>
      <Footer />
      <ContactWidget onBook={handleBook} />
      <Toaster />
    </div>
  );
}
