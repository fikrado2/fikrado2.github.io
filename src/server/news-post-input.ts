/**
 * Validated post payload parsing for the News API.
 * Split out from `news-api.ts` so the string/date rules are readable on their own.
 */
export type PostInput = {
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  publishedAt: string;
  published: boolean;
};

const TITLE_MAX = 200;
const EXCERPT_MAX = 400;
const CONTENT_MAX = 20000;
const IMAGE_URL_MAX = 1000;
const DATE_MAX = 40;

function str(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.slice(0, maxLength) : "";
}

/**
 * Build a normalized `PostInput` from a request body.
 * Returns null when the required `title` is missing.
 * Omitted fields fall back to `existing` (used by PUT for partial updates).
 */
export function parsePostInput(
  body: Record<string, unknown>,
  existing?: Partial<PostInput>,
): PostInput | null {
  const title = str(body.title, TITLE_MAX).trim();
  if (title.length === 0) return null;

  const content =
    body.content !== undefined ? str(body.content, CONTENT_MAX).trim() : (existing?.content ?? "");
  const excerpt =
    body.excerpt !== undefined ? str(body.excerpt, EXCERPT_MAX).trim() : (existing?.excerpt ?? "");
  const imageUrl =
    body.imageUrl !== undefined
      ? str(body.imageUrl, IMAGE_URL_MAX).trim()
      : (existing?.imageUrl ?? "");
  const rawDate =
    body.publishedAt !== undefined
      ? str(body.publishedAt, DATE_MAX).trim()
      : (existing?.publishedAt ?? "");
  const publishedAt = Number.isFinite(Date.parse(rawDate))
    ? new Date(rawDate).toISOString()
    : new Date().toISOString();
  const published =
    body.published !== undefined ? body.published === true : (existing?.published ?? true);

  return {
    title,
    excerpt: excerpt.length > 0 ? excerpt : content.slice(0, EXCERPT_MAX),
    content,
    imageUrl,
    publishedAt,
    published,
  };
}
