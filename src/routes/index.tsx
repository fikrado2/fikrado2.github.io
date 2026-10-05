import { createFileRoute } from "@tanstack/react-router";
import Home from "../pages/Home.jsx";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FIKRADO Security | Cybersecurity Services & Tech Courses in East Africa" },
      {
        name: "description",
        content:
          "FIKRADO Security offers professional cybersecurity services and technology courses across the Horn of Africa. Penetration testing, network defense, ethical hacking, Linux, and AI education. 50% non-profit.",
      },
      { property: "og:title", content: "FIKRADO Security | Cybersecurity Services & Tech Courses" },
      {
        property: "og:description",
        content:
          "Professional cybersecurity services and technology courses across the Horn of Africa. Penetration testing, ethical hacking, Linux, and AI education. 50% non-profit.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});
