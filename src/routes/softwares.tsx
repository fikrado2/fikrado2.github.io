import { createFileRoute } from "@tanstack/react-router";
import Softwares from "../pages/Softwares.jsx";

export const Route = createFileRoute("/softwares")({
  head: () => ({
    meta: [
      { title: "Fikrado Security Enterprise | AI-Powered Security Software" },
      {
        name: "description",
        content:
          "Fikrado Security Enterprise is AI-powered security software that detects malware and checks systems for vulnerabilities. Available in CLI and Desktop app editions for Windows, Linux, and macOS.",
      },
      {
        property: "og:title",
        content: "Fikrado Security Enterprise | AI-Powered Security Software",
      },
      {
        property: "og:description",
        content:
          "AI-powered security software that detects malware and checks systems for vulnerabilities across Windows, Linux, and macOS.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Softwares,
});
