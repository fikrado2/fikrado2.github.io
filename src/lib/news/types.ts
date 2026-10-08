// Shapes returned by the News API (see src/server/*).
//
// Storage and authentication are server-side: the browser never sees the
// password, and posts/likes live in the server's storage mount rather than in
// files committed to the repository.

export type NewsPost = {
  id: string;
  title: string;
  /** Short summary shown on the card. */
  excerpt: string;
  content: string;
  /** Absolute URL or a site-relative path such as "/logo.jpg". */
  imageUrl: string;
  /** ISO date used for sorting and display. */
  publishedAt: string;
  published: boolean;
  /** Real like count. */
  likes: number;
  /**
   * True while `likes` includes seeded demo numbers rather than only genuine
   * visitor likes. Surfaced in the UI so demo figures are never presented as
   * real engagement.
   */
  demoLikeCount: boolean;
  /** The demo portion of `likes`, so the UI can show "1,412 (incl. 1,200 demo)". */
  demoBaseline: number;
};