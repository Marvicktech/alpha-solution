import { createFileRoute } from "@tanstack/react-router";
import { RequestsDashboard } from "@/components/admin/RequestsDashboard";

export const Route = createFileRoute("/admin/_shell/")({
  head: () => ({
    meta: [
      { title: "Consultation requests | Alpha Presence Admin" },
      { name: "description", content: "Internal dashboard for Alpha Presence consultation requests." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Consultation requests | Alpha Presence Admin" },
      {
        property: "og:description",
        content: "Internal dashboard for Alpha Presence consultation requests.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RequestsDashboard,
});
