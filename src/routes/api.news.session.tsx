import { createFileRoute } from "@tanstack/react-router";

import {
  clearSessionCookie,
  isAuthConfigured,
  issueSessionCookie,
  verifyCredentials,
  verifySession,
} from "../server/news-auth";
import { isSameOrigin, json, LOGIN_FAILED_MESSAGE, readJson } from "../server/news-api";

/**
 * GET    /api/news/session -> is the current request an authenticated admin?
 * POST   /api/news/session -> log in (username + password)
 * DELETE /api/news/session -> log out (clears the session cookie)
 */
export const Route = createFileRoute("/api/news/session")({
  server: {
    handlers: {
      GET: () => {
        const username = verifySession();
        return json(
          username === null
            ? { authenticated: false }
            : { authenticated: true, username, configured: isAuthConfigured() },
        );
      },

      POST: async ({ request }) => {
        if (!isSameOrigin(request)) {
          return json({ error: "Cross-origin request rejected." }, { status: 403 });
        }

        const body = await readJson(request);
        if (body === null) {
          return json({ error: "Expected a JSON body." }, { status: 400 });
        }

        // One boolean for both fields, one message for both failure modes:
        // nothing here reveals which part was wrong, and the submitted
        // password is never logged, echoed, or stored.
        const ok = verifyCredentials(body.username, body.password);
        if (!ok) {
          return json({ error: LOGIN_FAILED_MESSAGE }, { status: 401 });
        }

        issueSessionCookie(String(body.username));
        return json({ authenticated: true, username: String(body.username) });
      },

      DELETE: () => {
        clearSessionCookie();
        return json({ authenticated: false });
      },
    },
  },
});
