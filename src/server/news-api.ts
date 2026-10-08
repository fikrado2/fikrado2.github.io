/**
 * Shared request helpers for the News API route handlers.
 *
 * Every handler in `src/routes/api.news*.tsx` returns a plain `Response`.
 * These helpers keep the JSON shape, status codes and error messages
 * consistent, and make sure no request-derived secret is ever echoed back.
 *
 * This module lives under `src/server/`, which the project's TanStack Start
 * `importProtection` config marks as server-only, so it cannot be pulled into
 * the client bundle.
 */
import { getRequestHeaders } from "@tanstack/react-start/server";

import { verifySession } from "./news-auth";
import { isProduction, readServerEnv } from "./news-env";

const JSON_HEADERS: Record<string, string> = {
  "content-type": "application/json; charset=utf-8",
};

export function json(data: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), { ...init, headers: JSON_HEADERS });
}

/** Read a request header via the h3-backed accessor, falling back to Request. */
export function headerValue(request: Request, name: string): string | undefined {
  const key = name.toLowerCase();
  try {
    const fromContext = getRequestHeaders()[key];
    if (typeof fromContext === "string" && fromContext.length > 0) return fromContext;
  } catch {
    // No request context (e.g. unit test) — fall through to the Request.
  }
  return request.headers.get(key) ?? undefined;
}

/**
 * Same-origin check for state-changing requests.
 *
 * The session cookie is SameSite=Strict, which already stops a browser sending
 * it cross-site, but an explicit Origin check closes the gap for non-browser
 * clients and gives defence in depth.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = headerValue(request, "origin");
  if (!origin) return true; // Same-origin navigations and CLI clients omit Origin.

  const host = headerValue(request, "host");
  if (!host) return false;

  try {
    const parsedHost = new URL(origin).host;
    if (parsedHost === host) return true;
    const configured = readServerEnv("PUBLIC_APP_ORIGIN");
    return (
      typeof configured === "string" &&
      configured.length > 0 &&
      new URL(configured).host === parsedHost
    );
  } catch {
    return false;
  }
}

/** Generic, non-leaking 401. Never includes anything submitted by the caller. */
export function unauthorized(message = "Authentication required."): Response {
  return json({ error: message }, { status: 401 });
}

/** Same generic message for a wrong username and for a wrong password. */
export const LOGIN_FAILED_MESSAGE = "Invalid username or password.";

/**
 * Require a valid admin session. Returns the admin username, or a 401 Response
 * to return directly. Every write handler must call this before doing anything.
 */
export function requireAdmin(): string | Response {
  const username = verifySession();
  if (username === null) return unauthorized();
  return username;
}

/** Narrow a `requireAdmin()` result. */
export function isResponse(value: string | Response): value is Response {
  return value instanceof Response;
}

/** Parse a JSON body defensively; returns null on anything unexpected. */
export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

export type { PostInput } from "./news-post-input";
export { parsePostInput } from "./news-post-input";

/** `isProduction` re-exported so handlers do not need a second import. */
export const secureCookies = isProduction;
