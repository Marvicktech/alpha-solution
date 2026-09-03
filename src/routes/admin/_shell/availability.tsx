import { createFileRoute } from "@tanstack/react-router";
import { OooManager } from "@/components/admin/OooManager";

export const Route = createFileRoute("/admin/_shell/availability")({
  head: () => ({
    meta: [
      { title: "Availability | Alpha Presence Admin" },
      { name: "description", content: "Block off time to control Alpha Presence Cal.com availability." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Availability | Alpha Presence Admin" },
      {
        property: "og:description",
        content: "Block off time to control Alpha Presence Cal.com availability.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OooManager,
});
