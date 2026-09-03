import { Monitor, PenTool, Workflow, Search, MapPin, HelpCircle, type LucideIcon } from "lucide-react";

export type ServiceId = "website" | "uiux" | "automation" | "branding" | "gmb" | "other";

export const SERVICES: {
  id: ServiceId;
  title: string;
  description: string;
  problem: string;
  solution: string;
  outcome: string;
  icon: LucideIcon;
}[] = [
  {
    id: "website",
    title: "Website Design & Build",
    description:
      "Loads fast, looks sharp, turns visitors into enquiries.",
    problem: "The site looks dated and visitors cannot tell what you do or what to do next.",
    solution: "A rebuilt site structured around your best-selling service and one clear action.",
    outcome: "More of the traffic you already have turns into enquiries.",
    icon: Monitor,
  },
  {
    id: "uiux",
    title: "UI/UX Design",
    description:
      "Interfaces people actually enjoy using, and don't abandon halfway through.",
    problem: "People land, hesitate, scroll and leave without contacting you.",
    solution: "We map the real journey, remove the dead ends and rewrite the decision points.",
    outcome: "A shorter path from first visit to first conversation.",
    icon: PenTool,
  },
  {
    id: "automation",
    title: "Automation",
    description:
      "Let the boring stuff run itself, so you can focus on the business.",
    problem: "Enquiries arrive by email and get chased manually, so some never get answered.",
    solution: "Forms feed a CRM, alerts fire instantly and follow-ups send themselves.",
    outcome: "Faster responses, fewer dropped leads and hours back each week.",
    icon: Workflow,
  },
  {
    id: "branding",
    title: "Branding & SEO/AEO/GEO",
    description:
      "Look consistent everywhere, and get found on Google and in AI answers.",
    problem: "Competitors appear in search and AI answers while your business does not.",
    solution:
      "Technical fixes, structured data and clear, quotable content that engines can rely on.",
    outcome: "Steadier discovery from both traditional search and AI answers.",
    icon: Search,
  },
  {
    id: "gmb",
    title: "Google Business Profile Optimisation",
    description:
      "Show up in the map pack and local results, with a profile that converts lookers into calls.",
    problem: "Your Google Business Profile is incomplete or outdated, so competitors win the map pack instead of you.",
    solution: "We optimise categories, services, photos, posts and your review strategy so it ranks and converts.",
    outcome: "More calls, direction requests and website clicks straight from Google Maps and local search.",
    icon: MapPin,
  },
  {
    id: "other",
    title: "Not sure / something else",
    description:
      "Not sure which one fits? Tell us what's going on and we'll figure it out together.",
    problem: "You know something is not working but not which part.",
    solution: "A short conversation to diagnose where the friction really sits.",
    outcome: "A clear, honest recommendation before you spend anything.",
    icon: HelpCircle,
  },
];

/** Structured, extractable summary of each offering: what's included and how long it takes. */
export const SERVICE_TABLE: {
  id: Exclude<ServiceId, "other">;
  name: string;
  includes: string;
  timeframe: string;
}[] = [
  {
    id: "website",
    name: "Website Design & Build",
    includes: "Design, build, mobile-first layout, copy structure, contact and enquiry forms",
    timeframe: "2–4 weeks",
  },
  {
    id: "uiux",
    name: "UI/UX Design",
    includes: "Journey mapping, wireframes, interface design, conversion-focused page structure",
    timeframe: "1–3 weeks",
  },
  {
    id: "automation",
    name: "Automation",
    includes: "Form-to-CRM connections, instant alerts, automated follow-ups, booking reminders",
    timeframe: "1–2 weeks",
  },
  {
    id: "branding",
    name: "Branding & SEO/AEO/GEO",
    includes: "Brand consistency, technical SEO, structured data, AI-readable answer content",
    timeframe: "2–4 weeks, ongoing optional",
  },
  {
    id: "gmb",
    name: "Google Business Profile Optimisation",
    includes: "Full profile setup or audit, categories, service list, photos, posts, review strategy",
    timeframe: "1–2 weeks",
  },
];

export const SERVICE_LABELS: Record<ServiceId, string> = {
  website: "Website Design & Build",
  uiux: "UI/UX Design",
  automation: "Automation",
  branding: "Branding & SEO/AEO/GEO",
  gmb: "Google Business Profile Optimisation",
  other: "Something else",
};
