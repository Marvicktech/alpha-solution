import { createFileRoute } from "@tanstack/react-router";
import { CalBookingsDashboard } from "@/components/admin/CalBookingsDashboard";

export const Route = createFileRoute("/admin/_shell/bookings")({
  head: () => ({
    meta: [
      { title: "Cal.com bookings | Alpha Presence Admin" },
      { name: "description", content: "Internal dashboard for Alpha Presence Cal.com bookings." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Cal.com bookings | Alpha Presence Admin" },
      {
        property: "og:description",
        content: "Internal dashboard for Alpha Presence Cal.com bookings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CalBookingsDashboard,
});
