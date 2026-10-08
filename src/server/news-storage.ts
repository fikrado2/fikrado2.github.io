/**
 * Nitro-storage backed repository for News posts and like tracking.
 *
 * Storage layout (all under the `news` mount):
 *   posts            -> NewsPost[]           all posts, published or not
 *   likes:<postId>   -> string[]             hashed visitor ids that liked it
 *
 * Like counts: `NewsPost.likes` holds the *real* like count. Seed posts also
 * carry `demoBaseline` (a clearly-labelled demo number) and
 * `demoLikeCount: true`, so the UI can render "1,412 (incl. 1,200 demo)"
 * instead of passing generated numbers off as real engagement.
 */
import { createHash } from "node:crypto";
import { useStorage } from "nitro/storage";

import { NEWS_SEED_POSTS } from "./news-seed";

export type NewsPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  publishedAt: string;
  published: boolean;
  likes: number;
  demoLikeCount: boolean;
  demoBaseline: number;
};

const POSTS_KEY = "posts";

type NewsStorage = {
  getItem<T>(key: string): Promise<T | null>;
  setItem<T>(key: string, value: T): Promise<void>;
};

/**
 * The nitro `news` mount. Named `newsStore` rather than `store` because
 * nitro's accessor is literally called `useStorage`, which trips the React
 * hooks lint rule outside a component.
 */
function newsStore(): NewsStorage {
  // `useStorage` is memoised internally, so this is cheap per call.
  // eslint-disable-next-line react-hooks/rules-of-hooks -- nitro's accessor, not a React hook.
  return useStorage("news") as unknown as NewsStorage;
}

function isPost(value: unknown): value is NewsPost {
  if (!value || typeof value !== "object") return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.id === "string" &&
    typeof p.title === "string" &&
    typeof p.published === "boolean" &&
    typeof p.likes === "number"
  );
}

function normalizePost(post: NewsPost): NewsPost {
  return {
    id: post.id,
    title: post.title,
    excerpt: typeof post.excerpt === "string" ? post.excerpt : "",
    content: typeof post.content === "string" ? post.content : "",
    imageUrl: typeof post.imageUrl === "string" ? post.imageUrl : "",
    publishedAt:
      typeof post.publishedAt === "string" ? post.publishedAt : new Date(0).toISOString(),
    published: post.published === true,
    likes: Number.isFinite(post.likes) ? Math.max(0, Math.trunc(post.likes)) : 0,
    demoLikeCount: post.demoLikeCount === true,
    demoBaseline:
      Number.isFinite(post.demoBaseline) && post.demoBaseline > 0
        ? Math.trunc(post.demoBaseline)
        : 0,
  };
}

/**
 * Read all posts, seeding the store on first access.
 * Seed writes are best-effort: if storage is read-only the seed data is
 * still returned so the page renders.
 */
export async function listAllPosts(): Promise<NewsPost[]> {
  const storage = newsStore();
  let posts = await storage.getItem<NewsPost[]>(POSTS_KEY);

  if (!Array.isArray(posts) || posts.length === 0) {
    posts = NEWS_SEED_POSTS.map(normalizePost);
    try {
      await storage.setItem(POSTS_KEY, posts);
    } catch {
      // Read-only storage: keep serving the seed in memory.
    }
    return [...posts];
  }

  return posts.filter(isPost).map(normalizePost);
}

async function persist(posts: NewsPost[]): Promise<void> {
  await newsStore().setItem(POSTS_KEY, posts);
}

/** Published posts only, newest first. */
export async function listPublishedPosts(): Promise<NewsPost[]> {
  const posts = await listAllPosts();
  return posts
    .filter((p) => p.published)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

export async function getPost(id: string): Promise<NewsPost | null> {
  const posts = await listAllPosts();
  return posts.find((p) => p.id === id) ?? null;
}

export async function createPost(
  input: Omit<NewsPost, "id" | "likes" | "demoLikeCount" | "demoBaseline">,
): Promise<NewsPost> {
  const posts = await listAllPosts();

  // Generate the id here rather than in the handler: it is storage's
  // responsibility, and a URL-safe slug-plus-suffix keeps ids readable in
  // the admin UI while staying collision-resistant.
  const base =
    input.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "post";
  let id = base;
  let suffix = 2;
  while (posts.some((p) => p.id === id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }

  const post: NewsPost = normalizePost({
    ...input,
    id,
    likes: 0,
    demoLikeCount: false,
    demoBaseline: 0,
  });
  await persist([...posts, post]);
  return post;
}

export async function updatePost(
  id: string,
  patch: Partial<Omit<NewsPost, "id" | "likes" | "demoLikeCount" | "demoBaseline">>,
): Promise<NewsPost | null> {
  const posts = await listAllPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const existing = posts[index]!;
  const next = normalizePost({
    ...existing,
    ...patch,
    id: existing.id,
    likes: existing.likes,
    demoLikeCount: existing.demoLikeCount,
    demoBaseline: existing.demoBaseline,
  });
  posts[index] = next;
  await persist(posts);
  return next;
}

export async function deletePost(id: string): Promise<boolean> {
  const posts = await listAllPosts();
  const remaining = posts.filter((p) => p.id !== id);
  if (remaining.length === posts.length) return false;
  await persist(remaining);
  try {
    await newsStore().removeItem(`likes:${id}`);
  } catch {
    // Non-fatal: leftover like ids for a deleted post are inert.
  }
  return true;
}

/* ------------------------------- likes -------------------------------- */

/**
 * Hash a visitor id before storing it, so the stored values reveal nothing
 * about the signed cookie value even if the store is inspected.
 */
export function hashVisitorId(visitorId: string, postId: string): string {
  return createHash("sha256").update(`${postId}::${visitorId}`, "utf8").digest("hex");
}

async function readLikedVisitors(postId: string): Promise<string[]> {
  const ids = await newsStore().getItem<string[]>(`likes:${postId}`);
  return Array.isArray(ids) ? ids.filter((id): id is string => typeof id === "string") : [];
}

/**
 * Record a like if this visitor has not already liked the post.
 *
 * Returns the authoritative count plus whether this call incremented it.
 * Repeat likes from the same visitor are idempotent.
 */
export async function likePost(
  postId: string,
  visitorHash: string,
): Promise<{ likes: number; incremented: boolean }> {
  const posts = await listAllPosts();
  const index = posts.findIndex((p) => p.id === postId);
  if (index === -1) return { likes: 0, incremented: false };

  const visited = await readLikedVisitors(postId);
  if (visited.includes(visitorHash)) {
    return { likes: posts[index]!.likes, incremented: false };
  }

  const post = posts[index]!;
  const next: NewsPost = { ...post, likes: post.likes + 1 };
  posts[index] = next;
  await persist(posts);
  await newsStore().setItem(`likes:${postId}`, [...visited, visitorHash]);

  return { likes: next.likes, incremented: true };
}
