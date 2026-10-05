import { createFileRoute } from "@tanstack/react-router";
import Services from "../pages/Services.jsx";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Cybersecurity Services | FIKRADO Security" },
      {
        name: "description",
        content:
          "Penetration testing, network defense, incident response, and security audits for organizations across the Horn of Africa.",
      },
      { property: "og:title", content: "Cybersecurity Services | FIKRADO Security" },
      {
        property: "og:description",
        content:
          "Penetration testing, network defense, incident response, and security audits across the Horn of Africa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Services,
});
