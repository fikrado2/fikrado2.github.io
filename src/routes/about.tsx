import { createFileRoute } from "@tanstack/react-router";
import About from "../pages/About.jsx";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About FIKRADO Security | Our Mission & Team" },
      {
        name: "description",
        content:
          "FIKRADO Security is a 50% non-profit cybersecurity company serving the Horn of Africa. Learn about our mission, vision, values, certified team, and offices in Hargeisa and Jijiga.",
      },
      { property: "og:title", content: "About FIKRADO Security | Our Mission & Team" },
      {
        property: "og:description",
        content:
          "A 50% non-profit cybersecurity company serving the Horn of Africa — our mission, values, and certified team.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});
