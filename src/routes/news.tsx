import { createFileRoute } from "@tanstack/react-router";
import News from "../pages/News.jsx";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News | FIKRADO Security" },
      {
        name: "description",
        content:
          "The latest announcements, course updates, and security write-ups from FIKRADO Security.",
      },
      { property: "og:title", content: "News | FIKRADO Security" },
      {
        property: "og:description",
        content:
          "The latest announcements, course updates, and security write-ups from FIKRADO Security.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: News,
});
