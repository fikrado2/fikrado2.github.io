// Admin session handling for the News page.
//
// Why this does not use a password stored in the repo:
//
// The site is published as a static bundle to GitHub Pages, so there is no
// server process that could hold a secret. Any password embedded in the
// frontend bundle is readable by every visitor, which would make the "admin"
// area no more protected than a hidden div.
//
// Instead the admin signs in with their GitHub identity. The `password` field
// collects a GitHub fine-grained personal access token, which is:
//   - never written to this repository, never bundled, and never persisted
//     beyond the browser tab (sessionStorage),
//   - verified server-side by GitHub's own API on every login,
//   - authorized by GitHub itself, so a token without write access to this
//     repo cannot create, edit, or delete posts.
//
// `ADMIN_PASSWORD` therefore stays an operator-side secret (GitHub token /
// Actions secret) and never reaches the client.

import type { NewsStoreFile } from "./types";

const SESSION_KEY = "fikrado.news.session";
const ADMIN_USERNAME = "fikrado";

const OWNER = "fikrado2";
const REPO = "fikrado2.github.io";
const BRANCH = "main";
const API = "https://api.github.com";

const NEWS_DIR = "public/news";
const POSTS_FILE = `${NEWS_DIR}/posts.json`;
const LIKES_FILE = `${NEWS_DIR}/likes.json`;

export type NewsSession = {
  username: string;
  token: string;
};

export type VerifiedIdentity = {
  login: string;
  token: string;
};

/** Local file served by the static host; no credentials required. */
function publicUrl(file: NewsStoreFile) {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/$/, "")}/news/${file}.json`;
}

/** Raw file straight from the repo, so admin edits appear without a redeploy. */
function rawUrl(file: NewsStoreFile) {
  return `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${file === "posts" ? POSTS_FILE : LIKES_FILE}`;
}

export function isAdminUsername(value: string) {
  return value.trim().toLowerCase() === ADMIN_USERNAME;
}

export function readSession(): NewsSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as NewsSession;
    if (!parsed?.username || !parsed?.token) return null;
    if (!isAdminUsername(parsed.username)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeSession(session: NewsSession | null) {
  if (typeof window === "undefined") return;
  try {
    if (session) {
      window.sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ username: session.username, token: session.token }),
      );
    } else {
      window.sessionStorage.removeItem(SESSION_KEY);
    }
  } catch {
    /* storage unavailable (private mode) — session simply stays in memory */
  }
}

export function clearSession() {
  writeSession(null);
}

/**
 * Verifies the credentials against GitHub. Returns the confirmed identity or
 * throws. The token is never logged, never stored in the repo, and only kept
 * for the lifetime of the tab.
 */
export async function signIn(username: string, token: string): Promise<VerifiedIdentity> {
  if (!isAdminUsername(username)) {
    throw new Error("Unknown username.");
  }
  const trimmed = token.trim();
  if (!trimmed) {
    throw new Error("Enter your access token.");
  }

  const response = await fetch(`${API}/user`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${trimmed}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (response.status === 401) {
    throw new Error("Access rejected by FIKRADO Security.");
  }
  if (!response.ok) {
    throw new Error(`GitHub sign-in failed (${response.status}).`);
  }

  const profile = (await response.json()) as { login?: string };
  if (!profile.login || profile.login.toLowerCase() !== ADMIN_USERNAME) {
    throw new Error(
      `This token belongs to "${profile.login ?? "another account"}", not ${ADMIN_USERNAME}.`,
    );
  }

  const session: NewsSession = { username: ADMIN_USERNAME, token: trimmed };
  writeSession(session);
  return { login: profile.login, token: trimmed };
}

/** Confirms the stored token still works and still owns this repository. */
export async function hasWriteAccess(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API}/repos/${OWNER}/${REPO}`, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    if (!response.ok) return false;
    const repo = (await response.json()) as { permissions?: { push?: boolean } };
    return repo.permissions?.push === true;
  } catch {
    return false;
  }
}

async function readJson<T>(url: string, token?: string): Promise<T> {
  const response = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Could not load news data (${response.status}).`);
  return (await response.json()) as T;
}

/**
 * Reads a news file.
 *
 * The repo copy is preferred so a post published by the admin appears for
 * visitors straight away rather than only after the next Pages rebuild. The
 * copy bundled with the deployed site is the fallback, which keeps the page
 * working if raw.githubusercontent.com is unreachable or blocked.
 */
export async function readNewsFile<T>(file: NewsStoreFile, token?: string): Promise<T> {
  const sources = [rawUrl(file), publicUrl(file)];
  let lastError: unknown;
  for (const url of sources) {
    try {
      return await readJson<T>(url, token);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Could not load news data.");
}

type ContentResponse = { sha: string; content: string; encoding: string };

/** Writes a news file back to the repository through the Contents API. */
export async function writeNewsFile(
  file: NewsStoreFile,
  value: unknown,
  token: string,
  message: string,
): Promise<void> {
  const path = file === "posts" ? POSTS_FILE : LIKES_FILE;
  const apiUrl = `${API}/repos/${OWNER}/${REPO}/contents/${path}`;
  const authHeaders = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };

  // The file must exist already; we update rather than create so we never
  // clobber an unrelated path.
  let sha: string | undefined;
  const current = await fetch(`${apiUrl}?ref=${BRANCH}`, { headers: authHeaders });
  if (current.ok) {
    sha = ((await current.json()) as ContentResponse).sha;
  } else if (current.status !== 404) {
    throw new Error(`Could not open ${path} (${current.status}).`);
  } else {
    throw new Error(`${path} is missing from the repository.`);
  }

  const body = JSON.stringify(value, null, 2);
  const encoded = btoa(String.fromCharCode(...new TextEncoder().encode(body)));

  const response = await fetch(apiUrl, {
    method: "PUT",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: encoded,
      branch: BRANCH,
      sha,
    }),
  });

  if (!response.ok) {
    throw new Error(`Could not save ${path} (${response.status}).`);
  }
}

/** Appends a like event to the shared like ledger. */
export async function recordLike(
  state: { counts: Record<string, number> },
  postId: string,
  token?: string,
): Promise<void> {
  const next = {
    ...state,
    counts: { ...state.counts, [postId]: (state.counts[postId] ?? 0) + 1 },
  };
  if (!token) return; // anonymous visitors keep their like on this device
  await writeNewsFile("likes", next, token, `news: like on ${postId}`);
}
