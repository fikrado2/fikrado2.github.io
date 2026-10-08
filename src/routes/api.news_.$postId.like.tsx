import { createFileRoute } from "@tanstack/react-router";

import { ensureVisitorId } from "../server/news-auth";
import { isSameOrigin, json } from "../server/news-api";
import { getPost, hashVisitorId, likePost } from "../server/news-storage";

/**
 * POST /api/news/$postId/like -> record one like per visitor (public).
 *
 * Spam resistance: a signed HttpOnly `news_visitor` cookie is issued when
 * absent, only its hash is stored, and a repeat like from the same visitor
 * returns the existing count without incrementing.
 */
export const Route = createFileRoute("/api/news_/$postId/like")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        if (!isSameOrigin(request)) {
          return json({ error: "Cross-origin request rejected." }, { status: 403 });
        }

        const postId = String(params.postId);
        const post = await getPost(postId);
        if (post === null) {
          return json({ error: "Post not found." }, { status: 404 });
        }
        if (!post.published) {
          return json({ error: "Post not found." }, { status: 404 });
        }

        // Issues the cookie when missing, so the first like has an identity.
        const visitorId = ensureVisitorId();
        const result = await likePost(postId, hashVisitorId(visitorId, postId));

        return json({
          likes: result.likes,
          incremented: result.incremented,
          demoLikeCount: post.demoLikeCount,
          demoBaseline: post.demoBaseline,
        });
      },
    },
  },
});
