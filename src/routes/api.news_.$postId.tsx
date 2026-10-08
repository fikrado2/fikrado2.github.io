import { createFileRoute } from "@tanstack/react-router";

import {
  isSameOrigin,
  isResponse,
  json,
  parsePostInput,
  readJson,
  requireAdmin,
} from "../server/news-api";
import { deletePost, getPost, updatePost } from "../server/news-storage";

/**
 * GET    /api/news/$postId -> read one post (public for published posts)
 * PUT    /api/news/$postId -> update (admin)
 * DELETE /api/news/$postId -> delete (admin)
 */
export const Route = createFileRoute("/api/news_/$postId")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const post = await getPost(String(params.postId));
        if (post === null) {
          return json({ error: "Post not found." }, { status: 404 });
        }
        // Unpublished posts stay hidden from anonymous callers.
        if (!post.published) {
          const admin = requireAdmin();
          if (isResponse(admin)) return admin;
        }
        return json({ post });
      },

      PUT: async ({ request, params }) => {
        const admin = requireAdmin();
        if (isResponse(admin)) return admin;

        if (!isSameOrigin(request)) {
          return json({ error: "Cross-origin request rejected." }, { status: 403 });
        }

        const id = String(params.postId);
        const existing = await getPost(id);
        if (existing === null) {
          return json({ error: "Post not found." }, { status: 404 });
        }

        const body = await readJson(request);
        if (body === null) {
          return json({ error: "Expected a JSON body." }, { status: 400 });
        }

        const input = parsePostInput(body, {
          excerpt: existing.excerpt,
          content: existing.content,
          imageUrl: existing.imageUrl,
          publishedAt: existing.publishedAt,
          published: existing.published,
        });
        if (input === null) {
          return json({ error: "A post title is required." }, { status: 400 });
        }

        const post = await updatePost(id, input);
        if (post === null) {
          return json({ error: "Post not found." }, { status: 404 });
        }
        return json({ post });
      },

      DELETE: async ({ request, params }) => {
        const admin = requireAdmin();
        if (isResponse(admin)) return admin;

        if (!isSameOrigin(request)) {
          return json({ error: "Cross-origin request rejected." }, { status: 403 });
        }

        const removed = await deletePost(String(params.postId));
        if (!removed) {
          return json({ error: "Post not found." }, { status: 404 });
        }
        return json({ ok: true });
      },
    },
  },
});
