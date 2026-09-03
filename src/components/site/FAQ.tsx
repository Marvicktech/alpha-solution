import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "./Reveal";

export type FaqEntry = { q: string; a: string; group: string };

export const FAQ_GROUPS = [
  "General",
  "Pricing & process",
  "Our services",
  "By industry",
  "AEO, GEO & local search",
  "Trust & comparison",
] as const;

// Every answer opens with a complete, standalone sentence an AI answer
// engine can quote verbatim on its own. No invented stats or numbers.
export const FAQS: FaqEntry[] = [
  // ---------------------------------------------------------------- General
  {
    group: "General",
    q: "What does Alpha Solution do?",
    a: "Alpha Solution is a UK digital agency that builds online presence, UI/UX, automation and SEO/AEO/GEO for local businesses. We help trades, clinics, salons, cafés, gyms and small professional practices get found on Google and in AI answers, look credible, and run smoother.",
  },
  {
    group: "General",
    q: "Who does Alpha Solution work with?",
    a: "Alpha Solution works exclusively with UK local businesses, from trades and salons to garages and independent services. That focus means we understand the customers you are trying to reach and the budgets you are working with. We do not build for venture-backed startups.",
  },
  {
    group: "General",
    q: "Where is Alpha Solution based?",
    a: "Alpha Solution is UK-based and works remotely with local businesses across the United Kingdom. We also work with a small number of clients beyond the UK. Everything is handled over calls, video and email, so location is never a barrier.",
  },
  {
    group: "General",
    q: "I don't know exactly what I need. Can you still help?",
    a: "Yes, and that describes most people who contact us. Choose the \"not sure\" option on this page, or book a free consultation. We ask the right questions and tell you honestly what would move the needle for your business, including when the answer is nothing from us.",
  },
  {
    group: "General",
    q: "How do I get started with Alpha Solution?",
    a: "You start by booking a free consultation through the form on this page. We review your current online presence, talk through what is and is not working, and give you a fixed quote before any work begins. There is no obligation to go ahead.",
  },

  // ------------------------------------------------------ Pricing & process
  {
    group: "Pricing & process",
    q: "How much does a website or digital project cost with Alpha Solution?",
    a: "Alpha Solution quotes every project after a free consultation, once the scope is clear. A simple brochure-style presence costs less than one with bookings, payments and automation built in. You get a fixed price upfront, agreed before any work starts. There are no hourly surprises and no retainers you cannot exit.",
  },
  {
    group: "Pricing & process",
    q: "Do you require a deposit before starting work?",
    a: "Yes, we typically ask for a deposit before work begins, with the balance due at agreed milestones or on launch. The exact split is confirmed in writing with your fixed quote, so you always know what is due and when.",
  },
  {
    group: "Pricing & process",
    q: "What payment options do you accept?",
    a: "We accept bank transfer as standard, and can discuss other payment options during your consultation. Payment terms are agreed upfront in your fixed quote, before any work starts.",
  },
  {
    group: "Pricing & process",
    q: "What is included in a typical project?",
    a: "A typical project includes design, build, mobile-first layout, copy structure, enquiry forms, and launch, plus 30 days of post-launch support. Your fixed quote lists exactly what is included before you commit, so there are no surprises.",
  },
  {
    group: "Pricing & process",
    q: "What is not included in a project quote?",
    a: "Anything not listed in your written quote is not included, and we say so plainly. Common extras like paid advertising spend, premium stock licences or third-party software subscriptions are always flagged before you agree to anything.",
  },
  {
    group: "Pricing & process",
    q: "How many rounds of revisions do I get?",
    a: "Every project includes structured revision rounds at the design and build stages, agreed in your quote. We check in with you at each milestone rather than disappearing until launch day, so big surprises at the end are rare.",
  },
  {
    group: "Pricing & process",
    q: "What happens after I submit the booking form?",
    a: "After you submit the booking form, a real person from Alpha Solution reviews your details and replies within one business day. We usually suggest a short call to understand your business, then send a fixed quote. You are never added to a mailing list or chased with sales calls.",
  },
  {
    group: "Pricing & process",
    q: "How quickly will someone respond to my enquiry?",
    a: "We respond to every enquiry within one business day. Most enquiries sent during working hours hear back the same day.",
  },
  {
    group: "Pricing & process",
    q: "What happens during the free consultation?",
    a: "The free consultation is a short, honest conversation about your business and your online presence. We look at what you have now, explain in plain English what is holding it back, and tell you what we would fix first. It costs nothing and there is no pressure to continue.",
  },
  {
    group: "Pricing & process",
    q: "Is the free consultation really free?",
    a: "Yes, the consultation is completely free with no obligation. You keep everything we tell you, even if you decide not to work with us.",
  },
  {
    group: "Pricing & process",
    q: "How long does a project take?",
    a: "Most Alpha Solution projects go from kickoff to launch in two to four weeks. Smaller presences can be quicker. Larger builds with automation, custom features or ongoing branding work take longer. We tell you the timeline upfront, before you commit, not halfway through the build.",
  },
  {
    group: "Pricing & process",
    q: "Do you offer support after the project launches?",
    a: "Yes. Every Alpha Solution project includes 30 days of post-launch support, plus a handover where we walk you through everything you own. After that, optional ongoing care plans are available from around £45 a month, with no lock-in. You keep your domain, hosting and files either way.",
  },

  // ------------------------------------------------------------ Our services
  {
    group: "Our services",
    q: "What is included in a website design and build project?",
    a: "A website design and build project includes design, build, a mobile-first layout, copy structure, and contact and enquiry forms, and typically takes two to four weeks. The site is structured around your best-selling service and one clear action, so visitors become enquiries.",
  },
  {
    group: "Our services",
    q: "Will my new website work properly on mobile phones?",
    a: "Yes, every site we build is designed mobile-first. Most of your customers will find you from a phone search, so the mobile experience is the starting point, not an afterthought.",
  },
  {
    group: "Our services",
    q: "Can you rebuild my existing website instead of starting from scratch?",
    a: "Yes, we can rebuild or improve an existing site when the foundations are sound. During the free consultation we review what you have and tell you honestly whether a rebuild or a fresh start is the better use of your money.",
  },
  {
    group: "Our services",
    q: "Do I own my website when the project is finished?",
    a: "Yes, you own everything. Your domain, hosting account, files and data stay in your name. There is no lock-in and no retainer you cannot leave.",
  },
  {
    group: "Our services",
    q: "What is UI/UX design and why does my business need it?",
    a: "UI/UX design is the process of shaping your site around how real customers actually behave, so they act instead of leaving. We map the real journey, remove the dead ends and rewrite the decision points. The result is a shorter path from first visit to first conversation.",
  },
  {
    group: "Our services",
    q: "How long does a UI/UX design project take?",
    a: "A UI/UX design project usually takes one to three weeks. It covers journey mapping, wireframes, interface design and a conversion-focused page structure.",
  },
  {
    group: "Our services",
    q: "What kind of business tasks can you automate?",
    a: "We automate the repetitive admin that eats your week: enquiry follow-ups, booking confirmations, reminders, and forms that feed straight into a CRM. Most setups are live within one to two weeks, and the result is faster responses and fewer dropped leads.",
  },
  {
    group: "Our services",
    q: "Will automation work with the tools I already use?",
    a: "In most cases, yes. We connect the tools you already rely on, such as your email, calendar, booking system or CRM, rather than forcing you onto new software. If something will not connect, we tell you before you pay for anything.",
  },
  {
    group: "Our services",
    q: "What is included in your branding and SEO/AEO/GEO service?",
    a: "The service covers brand consistency, technical SEO, structured data and AI-readable answer content, and typically takes two to four weeks with optional ongoing work. The goal is that your business looks consistent everywhere and gets found on Google and in AI answers.",
  },
  {
    group: "Our services",
    q: "Do you write the content for my website?",
    a: "Yes, we structure and write the core copy for your site in plain English, in the words your customers actually use. You review and approve everything before it goes live, because nobody knows your business better than you.",
  },

  // ------------------------------------------------------------- By industry
  {
    group: "By industry",
    q: "I am a plumber or electrician. Do I really need a website?",
    a: "Yes, because most customers now check a trade online before calling, even when they were recommended by a friend. A fast, clear site with your services, area and reviews turns those checks into booked jobs instead of calls to a competitor.",
  },
  {
    group: "By industry",
    q: "Can you help my building or trades business show up for local jobs?",
    a: "Yes. We build your presence around the specific jobs and areas you want, with clear service pages, consistent business details and a properly set up Google Business Profile. That is what gets a trade into the local results customers actually call from.",
  },
  {
    group: "By industry",
    q: "I get most of my work from word of mouth. Why change anything?",
    a: "Word of mouth still works, but the first thing a referred customer does is look you up. If what they find is a slow site or an empty profile, a warm referral quietly goes cold. We make sure your online presence backs up your reputation instead of undermining it.",
  },
  {
    group: "By industry",
    q: "Can you add online booking to my salon or clinic website?",
    a: "Yes. We build booking and enquiry flows for salons and clinics so clients can request or book appointments without phone tag. We can also automate confirmations and reminders, which cuts no-shows and admin time.",
  },
  {
    group: "By industry",
    q: "How can my salon or clinic reduce no-shows?",
    a: "Automated booking confirmations and reminders are the most reliable way to reduce no-shows. We set these up as part of an automation project, so clients get timely reminders without your front desk lifting a finger.",
  },
  {
    group: "By industry",
    q: "Can you help my café or shop get found by people nearby?",
    a: "Yes. Local discovery for cafés and independent retailers comes from a fast mobile-friendly presence, an accurate Google Business Profile, and consistent opening hours, menus and details everywhere online. We set all of that up and keep it easy for you to maintain.",
  },
  {
    group: "By industry",
    q: "Do I need online ordering or e-commerce for my independent shop?",
    a: "Not always, and we will tell you honestly either way. For many independent retailers a clear presence that drives footfall matters more than a full online shop. If ordering or e-commerce would genuinely pay off for you, we scope it as a fixed-price project.",
  },
  {
    group: "By industry",
    q: "Can you build a website for my gym or fitness studio?",
    a: "Yes. We build sites for gyms and studios focused on the two actions that matter: viewing the timetable or prices, and starting a membership or trial. Class information, pricing and sign-up are made obvious on mobile, where most of your future members will look.",
  },
  {
    group: "By industry",
    q: "How can my gym or studio turn website visitors into members?",
    a: "The key is a short, obvious path from landing on the site to starting a trial or membership. We remove dead ends, make pricing easy to find, and automate the follow-up when someone enquires but does not join straight away.",
  },
  {
    group: "By industry",
    q: "Do you work with accountants, consultants and other small professional practices?",
    a: "Yes. For small professional practices we build credible, plain-English presences that explain your services clearly and make it easy to request a consultation. Trust and clarity matter more than flashy design in your world, and we build accordingly.",
  },
  {
    group: "By industry",
    q: "My practice is regulated. Can you still build our website?",
    a: "Yes. We are careful with claims, credentials and compliance-sensitive wording for regulated practices such as solicitors and accountants. You review and approve all content before launch, and we never publish claims you have not signed off.",
  },

  // ----------------------------------------------- AEO, GEO & local search
  {
    group: "AEO, GEO & local search",
    q: "What is AEO and GEO, and why does it matter for a small business?",
    a: "AEO is Answer Engine Optimisation. GEO is Generative Engine Optimisation. Both make your business easy for AI tools to read, quote and recommend. It matters because customers now ask ChatGPT or Perplexity for a local trade instead of scrolling Google. If AI cannot read you, it cannot recommend you.",
  },
  {
    group: "AEO, GEO & local search",
    q: "How do I get my business to show up in ChatGPT or Perplexity answers?",
    a: "AI answer engines quote clear, factual, well-structured pages they can parse. You need plain answers near the top of each page, structured data describing your services, consistent business details everywhere online, and content written in the words customers actually use. Alpha Solution builds all of that in as standard.",
  },
  {
    group: "AEO, GEO & local search",
    q: "What's the difference between SEO and AEO?",
    a: "SEO aims to rank your page in a list of blue links. AEO aims to get your business quoted inside the answer itself. SEO optimises for crawlers and rankings. AEO optimises for extraction, so an assistant can lift a sentence and name you. They overlap, and you need both.",
  },
  {
    group: "AEO, GEO & local search",
    q: "How is AI search different from Google search?",
    a: "Google shows a list of links and lets the customer choose. AI search reads many sources and gives one direct answer, often naming a business inside it. You are either in that answer or invisible, which is why clear, structured, quotable content matters so much now.",
  },
  {
    group: "AEO, GEO & local search",
    q: "How do I get my business on Google Maps and the local pack?",
    a: "You need a complete, accurate Google Business Profile, consistent name, address and phone details across the web, and a website that confirms the same information. Reviews, correct categories and regular updates also help. We set up and align all of it as part of a local search project.",
  },
  {
    group: "AEO, GEO & local search",
    q: "How long does it take to see results from SEO or AEO?",
    a: "Realistically, meaningful improvement takes weeks to months, not days. Technical fixes and clearer content can help quickly, but search engines and AI tools re-read the web on their own schedule. We set honest expectations upfront and never promise overnight rankings.",
  },
  {
    group: "AEO, GEO & local search",
    q: "Does AEO and GEO actually work for a small local business?",
    a: "Yes, and local businesses are often better placed than big brands. AI tools prefer clear, specific, locally relevant answers, which is exactly what a good local business site can provide. You do not need a huge budget, you need the right structure.",
  },
  {
    group: "AEO, GEO & local search",
    q: "Can you guarantee my business will rank number one on Google?",
    a: "No, and you should be wary of anyone who does. Nobody controls Google's rankings. What we can do is fix the technical issues, structure and content that hold you back, and give your business the strongest honest chance of being found.",
  },

  // ----------------------------------------------------- Trust & comparison
  {
    group: "Trust & comparison",
    q: "How is Alpha Solution different from hiring a freelancer?",
    a: "A freelancer usually covers one skill, while a project needs design, build, copy structure and search visibility working together. Alpha Solution handles the whole job with one fixed quote and one point of contact, and you are not left stranded if one person gets busy or moves on.",
  },
  {
    group: "Trust & comparison",
    q: "How is Alpha Solution different from a big agency?",
    a: "Big agencies are built for big budgets, with account layers and retainers a local business does not need. Alpha Solution works only with UK local businesses, quotes a fixed price upfront, and explains everything in plain English. You talk to the people doing the work.",
  },
  {
    group: "Trust & comparison",
    q: "What happens if I am not happy with the work?",
    a: "We fix it. Revision rounds are built into every project, and you approve the work at each milestone before we move on. If something is wrong at launch, the included 30 days of post-launch support covers putting it right.",
  },
  {
    group: "Trust & comparison",
    q: "Is my business data safe with you?",
    a: "Yes. Enquiry and customer data is stored securely, access is restricted, and we only collect what a project actually needs. Your accounts, files and data stay in your name, so you are never locked out of your own business assets.",
  },
  {
    group: "Trust & comparison",
    q: "Do you work with businesses outside the UK?",
    a: "Our focus is UK local businesses, but we do work with a small number of clients beyond the UK, including an existing client in Denmark. If you are outside the UK, get in touch and we will tell you honestly whether we are the right fit.",
  },
  {
    group: "Trust & comparison",
    q: "Do you offer ongoing maintenance and support plans?",
    a: "Yes. Optional ongoing care plans start from around £45 a month and cover updates, small changes and keeping everything running. There is no lock-in, and every project already includes 30 days of post-launch support before you decide.",
  },
  {
    group: "Trust & comparison",
    q: "Will I be locked into a contract?",
    a: "No. Projects are fixed-price and agreed upfront, and ongoing care plans have no lock-in. You own your domain, hosting, files and data, so you are free to leave at any point.",
  },
];

const DEFAULT_VISIBLE = 8;

export function FAQ() {
  const [expanded, setExpanded] = useState(false);

  const visible = FAQS.slice(0, DEFAULT_VISIBLE);
  const extra = FAQS.slice(DEFAULT_VISIBLE);

  // Group the hidden remainder by label for a cleaner "see more" experience.
  const extraGroups = FAQ_GROUPS.map((g) => ({
    label: g,
    items: extra.filter((f) => f.group === g),
  })).filter((g) => g.items.length > 0);

  let itemIndex = 0;

  return (
    <section id="faq" className="bg-background py-24" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-5">
        <Reveal>
          <p className="text-sm font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            FAQ
          </p>
          <h2 id="faq-heading" className="mt-4 heading-2 font-extrabold">
            Questions we are asked every week
          </h2>
        </Reveal>

        <Reveal delay={80} className="mt-10">
          <Accordion type="single" collapsible className="w-full">
            {visible.map((f) => (
              <AccordionItem
                key={f.q}
                value={`item-${itemIndex++}`}
                className="mb-3 rounded-2xl border border-border bg-card px-5 shadow-[var(--shadow-card)]"
              >
                <AccordionTrigger className="text-left text-base font-bold hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/*
            All remaining FAQs are rendered in the DOM from the start (hidden
            via the `hidden` attribute only) so search engines and AI crawlers
            see the full content in the page source. The button just toggles
            visibility — nothing is fetched or injected client-side.
          */}
          <div hidden={!expanded}>
            {extraGroups.map((group) => (
              <div key={group.label}>
                <h3 className="heading-3 mt-10 mb-4 font-bold">{group.label}</h3>
                <Accordion type="single" collapsible className="w-full">
                  {group.items.map((f) => (
                    <AccordionItem
                      key={f.q}
                      value={`item-${itemIndex++}`}
                      className="mb-3 rounded-2xl border border-border bg-card px-5 shadow-[var(--shadow-card)]"
                    >
                      <AccordionTrigger className="text-left text-base font-bold hover:no-underline">
                        {f.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {f.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="inline-flex items-center justify-center rounded-full border border-input bg-background px-6 py-2.5 text-sm font-semibold shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {expanded
                ? "Show fewer questions"
                : `See more questions (${extra.length} more)`}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
