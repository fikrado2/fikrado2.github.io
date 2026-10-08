// Client for the News admin API.
//
// Authentication is entirely server-side: the browser never holds the password.
// Logging in POSTs the credentials to /api/news/session once; the server
// verifies them against ADMIN_PASSWORD (a server-only env var) and replies
// with an HttpOnly session cookie. Every later request is authenticated by
// that cookie, so the credential is never stored in JS, sessionStorage, or
// localStorage and cannot be read from the bundle or devtools.

import type { NewsPost } from "./types";

export type NewsLikeState = {
  demo: boolean;
};

export type AuthState = {
  authenticated: boolean;
  username?: string;
};

const BASE = "/api/news";

export const LOGIN_FAILED_MESSAGE = "Access rejected by FIKRADO Security.";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE}${path}`, {
    credentials: "same-origin",
    // Let the browser send the session cookie.
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    let message = `Request failed (${response.status}).`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body?.error) message = body.error;
    } catch {
      /* keep the default */
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

/** Current admin session state (drives whether admin controls are shown). */
export async function readSession(): Promise<AuthState> {
  try {
    return await request<AuthState>("/session");
  } catch {
    return { authenticated: false };
  }
}

/**
 * Verifies username + password against the server. Throws with the server's
 * rejection message on failure. The password is sent once over the request and
 * never retained.
 */
export async function signIn(username: string, password: string): Promise<AuthState> {
  return request<AuthState>("/session", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function signOut(): Promise<void> {
  await request<AuthState>("/session", { method: "DELETE" });
}

/** All posts, including unpublished ones (admin only). */
export async function fetchPosts(): Promise<NewsPost[]> {
  const data = await request<{ posts: NewsPost[] }>("");
  return Array.isArray(data.posts) ? data.posts : [];
}

export async function createPost(post: {
  title: string;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  publishedAt?: string;
  published?: boolean;
}): Promise<NewsPost> {
  const data = await request<{ post: NewsPost }>("", {
    method: "POST",
    body: JSON.stringify(post),
  });
  return data.post;
}

export async function updatePost(
  id: string,
  post: {
    title: string;
    excerpt?: string;
    content: string;
    imageUrl?: string;
    publishedAt?: string;
    published?: boolean;
  },
): Promise<NewsPost> {
  const data = await request<{ post: NewsPost }>(`/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(post),
  });
  return data.post;
}

export async function deletePost(id: string): Promise<void> {
  await request(`/${encodeURIComponent(id)}`, { method: "DELETE" });
}

/**
 * Records a like. The server de-duplicates per visitor cookie, so repeated
 * clicks cannot inflate the count.
 */
export async function likePost(id: string): Promise<{ likes: number; liked: boolean }> {
  return request<{ likes: number; liked: boolean }>(
    `/${encodeURIComponent(id)}/like`,
    { method: "POST" },
  );
}