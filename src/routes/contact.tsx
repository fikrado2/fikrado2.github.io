import { createFileRoute } from "@tanstack/react-router";
import Contact from "../pages/Contact.jsx";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact FIKRADO Security | Hargeisa & Jijiga" },
      {
        name: "description",
        content:
          "Get in touch with FIKRADO Security — offices in Hargeisa, Somaliland and Jijiga, Ethiopia. Email, phone, and WhatsApp.",
      },
      { property: "og:title", content: "Contact FIKRADO Security | Hargeisa & Jijiga" },
      {
        property: "og:description",
        content: "Contact FIKRADO Security — offices in Hargeisa, Somaliland and Jijiga, Ethiopia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});
