import { createFileRoute } from "@tanstack/react-router";

import {
  isSameOrigin,
  isResponse,
  json,
  readJson,
  requireAdmin,
  parsePostInput,
} from "../server/news-api";
import { createPost, listPublishedPosts } from "../server/news-storage";

/**
 * GET  /api/news  -> published posts (public)
 * POST /api/news  -> create a post (admin session required)
 */
export const Route = createFileRoute("/api/news")({
  server: {
    handlers: {
      GET: async () => {
        const posts = await listPublishedPosts();
        return json({ posts });
      },

      POST: async ({ request }) => {
        // Session check first: no parsing, no storage access before auth.
        const admin = requireAdmin();
        if (isResponse(admin)) return admin;

        if (!isSameOrigin(request)) {
          return json({ error: "Cross-origin request rejected." }, { status: 403 });
        }

        const body = await readJson(request);
        if (body === null) {
          return json({ error: "Expected a JSON body." }, { status: 400 });
        }

        const input = parsePostInput(body);
        if (input === null) {
          return json({ error: "A post title is required." }, { status: 400 });
        }

        const post = await createPost(input);
        return json({ post }, { status: 201 });
      },
    },
  },
});
