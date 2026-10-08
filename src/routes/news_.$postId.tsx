import { createFileRoute, useParams } from "@tanstack/react-router";
import NewsPost from "../pages/NewsPost.jsx";

export const Route = createFileRoute("/news_/$postId")({
  head: ({ params }) => ({
    meta: [
      {
        title: `News post ${params.postId} | FIKRADO Security`,
      },
      {
        name: "description",
        content: "A published news post from FIKRADO Security.",
      },
    ],
  }),
  // The page itself is a plain component that takes `postId` as a prop.
  // Resolving the param here keeps router-scope lookups out of the page.
  component: NewsPostRoute,
});

function NewsPostRoute() {
  // `strict: false` reads the params of the closest matched route. It is used
  // instead of `Route.useParams()` because the bundler rewrites this file's
  // `component` into a lazily imported chunk: that split chunk re-exports this
  // component but keeps referring to the *pre-update* `Route` object, whose
  // `useParams()` is never bound to the live router and therefore always
  // resolves to `{}` — the page rendered but never received a postId.
  const { postId } = useParams({ strict: false });
  return <NewsPost postId={postId} />;
}
