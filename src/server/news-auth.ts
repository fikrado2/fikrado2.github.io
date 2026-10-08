/**
 * Server-side admin auth for the News feature.
 *
 * Design notes:
 * - Credentials come from unprefixed server env vars only (`ADMIN_USERNAME`,
 *   `ADMIN_PASSWORD`). Never `VITE_*` — those land in the client bundle.
 * - The password is compared with `crypto.timingSafeEqual` on equal-length
 *   buffers. Length is guarded first so we never hand mismatched buffers to
 *   timingSafeEqual (which throws), and so an obvious wrong-length guess
 *   cannot be used as an oracle beyond "length differs".
 * - The session cookie holds an HMAC-SHA256 signed token of
 *   `username|expiryMs`. The signing key is `ADMIN_SESSION_SECRET` when set,
 *   otherwise derived deterministically from `ADMIN_PASSWORD` so an operator
 *   only has to set one secret. The payload never contains the password.
 * - Nothing here logs or echoes the submitted password.
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";

import { isProduction, readServerEnv } from "./news-env";

export const SESSION_COOKIE = "fikrado_admin";
export const VISITOR_COOKIE = "news_visitor";

/** Sessions last 8 hours. */
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
/** Visitor identity cookie lasts a year — it only gates duplicate likes. */
const VISITOR_TTL_SECONDS = 60 * 60 * 24 * 365;

function base64url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64url(input: string): Buffer {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(padded, "base64");
}

/** Admin username. Defaults to `fikrado`; the password has no default. */
export function adminUsername(): string {
  return readServerEnv("ADMIN_USERNAME") ?? "fikrado";
}

/** Admin password, or undefined when the operator has not configured one. */
export function adminPassword(): string | undefined {
  return readServerEnv("ADMIN_PASSWORD");
}

/** True when the server has enough config to accept a login at all. */
export function isAuthConfigured(): boolean {
  return typeof adminPassword() === "string" && adminPassword()!.length > 0;
}

/**
 * HMAC key for session tokens.
 * - `ADMIN_SESSION_SECRET` when provided (recommended: survives a password change).
 * - Otherwise derived from `ADMIN_PASSWORD` so a single required env var works.
 */
function sessionKey(): Buffer {
  const explicit = readServerEnv("ADMIN_SESSION_SECRET");
  if (explicit && explicit.length > 0) return Buffer.from(explicit, "utf8");
  const password = adminPassword();
  if (!password) {
    // No secret available: refuse to sign rather than sign with a guessable key.
    throw new Error("ADMIN_PASSWORD or ADMIN_SESSION_SECRET must be set");
  }
  return createHmac("sha256", password).update("fikrado:news:session-key").digest();
}

/** Length-safe, timing-safe string comparison. */
export function secureEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) {
    // Still burn a comparison so a length mismatch is not measurably faster
    // than a same-length mismatch on a wrong value.
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

function sign(payload: string): string {
  return base64url(createHmac("sha256", sessionKey()).update(payload).digest());
}

function cookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    path: "/",
    secure: isProduction(),
    maxAge: maxAgeSeconds,
  };
}

export function issueSessionCookie(username: string): void {
  const expiryMs = Date.now() + SESSION_TTL_MS;
  const payload = `${username}|${expiryMs}`;
  const token = `${base64url(payload)}.${sign(payload)}`;
  setCookie(SESSION_COOKIE, token, cookieOptions(SESSION_TTL_MS / 1000));
}

export function clearSessionCookie(): void {
  deleteCookie(SESSION_COOKIE, cookieOptions(0));
}

/**
 * Verify the session cookie. Returns the admin username when valid, else null.
 * Checks the HMAC signature before trusting the payload, then the expiry.
 */
export function verifySession(): string | null {
  const token = getCookie(SESSION_COOKIE);
  if (!token) return null;

  const dot = token.indexOf(".");
  if (dot <= 0) return null;

  const payload = fromBase64url(token.slice(0, dot)).toString("utf8");
  const providedSig = token.slice(dot + 1);

  let expectedSig: string;
  try {
    expectedSig = sign(payload);
  } catch {
    return null;
  }

  // Compare signatures, not the payload: an invalid signature means the
  // payload is untrusted and must be discarded without inspection.
  const sigBuf = Buffer.from(providedSig, "utf8");
  const expBuf = Buffer.from(expectedSig, "utf8");
  if (sigBuf.length !== expBuf.length) return null;
  if (!timingSafeEqual(sigBuf, expBuf)) return null;

  const sep = payload.indexOf("|");
  if (sep <= 0) return null;

  const username = payload.slice(0, sep);
  const expiryMs = Number.parseInt(payload.slice(sep + 1), 10);
  if (!Number.isFinite(expiryMs) || expiryMs <= Date.now()) return null;
  if (!secureEquals(username, adminUsername())) return null;

  return username;
}

/** True when the current request carries a valid admin session. */
export function isAdmin(): boolean {
  return verifySession() !== null;
}

/**
 * Validate submitted credentials. Returns true/false only — the caller must
 * respond with one generic message for both cases so the endpoint never
 * reveals whether the username or the password was wrong.
 */
export function verifyCredentials(username: unknown, password: unknown): boolean {
  if (typeof username !== "string" || typeof password !== "string") return false;
  if (!isAuthConfigured()) return false;

  const expectedUser = adminUsername();
  const expectedPass = adminPassword() ?? "";

  // Compare both fields unconditionally so response time does not reveal
  // which field was wrong.
  const userOk = secureEquals(username, expectedUser);
  const passOk = secureEquals(password, expectedPass);
  return userOk && passOk;
}

/**
 * Return the existing signed visitor id, or mint a new one and set the cookie.
 * The cookie is HttpOnly + SameSite=Strict so a visitor cannot forge or read it.
 */
export function ensureVisitorId(): string {
  const existing = getCookie(VISITOR_COOKIE);
  if (existing) {
    const ok = /^v1\.[A-Za-z0-9_-]{16,}$/.test(existing);
    if (ok) return existing;
  }

  const id = `v1.${base64url(
    createHmac("sha256", process.hrtime.bigint().toString() + Math.random())
      .update("fikrado:news:visitor")
      .digest(),
  )}`;
  setCookie(VISITOR_COOKIE, id, cookieOptions(VISITOR_TTL_SECONDS));
  return id;
}
