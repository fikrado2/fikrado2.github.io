// Shared shapes for the News feature.
//
// The site is deployed as a static bundle (GitHub Pages), so there is no
// server runtime to hold a database or a secret. The repository itself is the
// datastore: posts and likes live in JSON files under `public/news/`, which
// are written through the GitHub Contents API by the signed-in admin and read
// publicly by every visitor.

export type NewsPost = {
  id: string;
  title: string;
  /** Absolute URL, or a site-relative path such as "/logo.jpg". */
  image: string;
  /** Plain-text or simple markdown-ish body. */
  content: string;
  /** ISO date (YYYY-MM-DD) used for sorting and display. */
  date: string;
  published: boolean;
  /** Optional short summary used on the card. */
  excerpt?: string;
};

export type NewsLikeState = {
  /** postId -> like count. */
  counts: Record<string, number>;
  /**
   * True while the counts in `counts` are seeded demo numbers rather than a
   * tally of real visitors. Surfaced in the UI so demo figures are never
   * presented as genuine engagement.
   */
  demo: boolean;
};

export type NewsStoreFile = "posts" | "likes";
