import { createFileRoute } from "@tanstack/react-router";
import Books from "../pages/Books.jsx";

export const Route = createFileRoute("/books")({
  head: () => ({
    meta: [
      { title: "Books & Learning Materials | FIKRADO Security" },
      {
        name: "description",
        content:
          "Free and accessible cybersecurity and technology books and learning materials from FIKRADO Security.",
      },
      { property: "og:title", content: "Books & Learning Materials | FIKRADO Security" },
      {
        property: "og:description",
        content: "Cybersecurity and technology books and learning materials from FIKRADO Security.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Books,
});
