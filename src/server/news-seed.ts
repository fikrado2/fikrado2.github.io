/**
 * Seed content for the News feature.
 *
 * IMPORTANT — these like counts are DEMO DATA, not real engagement.
 * Each seed post carries:
 *   demoLikeCount: true   a machine-readable marker so the UI can label it
 *   demoBaseline:  <n>    the seeded portion baked into `likes`
 * `likes` therefore starts at the demo baseline and real visitor likes are
 * counted as `likes - demoBaseline`. The UI renders the "Demo data" badge and
 * shows the real-vs-demo split so generated numbers are never presented as
 * genuine readership.
 */
import type { NewsPost } from "./news-storage";

export const DEMO_LIKE_LABEL = "Demo data";

export const NEWS_SEED_POSTS: NewsPost[] = [
  {
    id: "seed-cyber-training-hargeisa",
    title: "FIKRADO Security Opens Free Cyber Training Cohort in Hargeisa",
    excerpt:
      "A three-month, non-profit cohort teaching ethical hacking, Linux and networking fundamentals to students across Somaliland.",
    content:
      "FIKRADO Security has opened applications for its next free cyber training cohort in Hargeisa.\n\nThe programme runs for twelve weeks and covers network fundamentals, Linux administration, and an introduction to ethical hacking. Sessions are delivered in Somali and English, and every participant finishes with a practical portfolio rather than only theory.\n\nBecause FIKRADO is a 50% non-profit, the cohort is free for selected students. Places are limited and allocated through a short application and a practical aptitude exercise.\n\nInterested readers can register interest through the contact page and mention the cohort name in their message.",
    imageUrl: "",
    publishedAt: "2026-09-28T09:00:00.000Z",
    published: true,
    likes: 1487,
    demoLikeCount: true,
    demoBaseline: 1487,
  },
  {
    id: "seed-jijiga-ai-workshop",
    title: "Hands-On AI Workshop Completed in Jijiga",
    excerpt:
      "Participants built small AI projects end to end — from data collection to a working demo — during a two-day workshop.",
    content:
      "Our two-day applied AI workshop in Jijiga wrapped up with every participant shipping a working demo.\n\nRather than a lecture series, the workshop was structured around building. Attendees collected a small dataset, trained a baseline model, and then presented their results to the room.\n\nThe most common piece of feedback was that the constraint that mattered most was not compute — it was knowing how to frame a problem that a model could actually be evaluated against.\n\nWe will run a follow-up session focused on evaluation and deployment, with places announced in a future post.",
    imageUrl: "",
    publishedAt: "2026-09-12T08:30:00.000Z",
    published: true,
    likes: 1062,
    demoLikeCount: true,
    demoBaseline: 1062,
  },
  {
    id: "seed-partnership-somali-books",
    title: "Somali Books Publishing Collaboration Brings Technical Titles to Local Readers",
    excerpt:
      "A new publishing collaboration is putting practical Somali-language technology books into local bookshops and schools.",
    content:
      "We are now collaborating with Somali Books on publishing.\n\nThe goal is simple: make practical, modern technology books available in Somali to readers who currently have to learn from English-language material or from material that has not kept up with the tools they actually use.\n\nThe first titles cover ethical hacking, Linux, AI, general computer skills, and programming. Each is written to be teachable rather than merely readable, with exercises a learner can work through alone or in a study group.\n\nCopies will reach bookshops and schools across the region as the rollout progresses.",
    imageUrl: "",
    publishedAt: "2026-08-30T10:00:00.000Z",
    published: true,
    likes: 1834,
    demoLikeCount: true,
    demoBaseline: 1834,
  },
];
