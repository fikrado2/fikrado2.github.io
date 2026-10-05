import { createFileRoute } from "@tanstack/react-router";
import Courses from "../pages/Courses.jsx";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Tech Courses | FIKRADO Security" },
      {
        name: "description",
        content:
          "Hands-on courses in ethical hacking, Linux, programming, and AI education — accessible technology training across the Horn of Africa.",
      },
      { property: "og:title", content: "Tech Courses | FIKRADO Security" },
      {
        property: "og:description",
        content: "Hands-on courses in ethical hacking, Linux, programming, and AI education.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Courses,
});
