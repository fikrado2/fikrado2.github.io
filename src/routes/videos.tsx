import { createFileRoute } from "@tanstack/react-router";
import Videos from "../pages/Videos.jsx";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "Video Tutorials | FIKRADO Security" },
      {
        name: "description",
        content:
          "Cybersecurity and technology video tutorials from FIKRADO Security — learn ethical hacking, Linux, and more.",
      },
      { property: "og:title", content: "Video Tutorials | FIKRADO Security" },
      {
        property: "og:description",
        content: "Cybersecurity and technology video tutorials from FIKRADO Security.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Videos,
});
