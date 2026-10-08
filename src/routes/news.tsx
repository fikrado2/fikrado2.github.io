import { createFileRoute } from "@tanstack/react-router";
import News from "../pages/News.jsx";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News & Updates | FIKRADO Security" },
      {
        name: "description",
        content:
          "Announcements, programme updates and publishing news from FIKRADO Security — cybersecurity and technology education across the Horn of Africa.",
      },
      { property: "og:title", content: "News & Updates | FIKRADO Security" },
      {
        property: "og:description",
        content: "Announcements, programme updates and publishing news from FIKRADO Security.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: News,
});
