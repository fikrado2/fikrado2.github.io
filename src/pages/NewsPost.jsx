import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, CalendarDays, Loader2, RefreshCw } from "lucide-react";

// The router passes `params` to a route component directly. Taking it as a
// prop keeps this page free of router-scope lookups (`useParams` needs a
// `from` route id, which would couple the page to its own route file).
import { Link } from "../compat/react-router-dom.jsx";
import PageHero from "../components/PageHero.jsx";
import LikeButton from "../components/news/LikeButton.jsx";
import NewsAdminBar from "../components/news/NewsAdminBar.jsx";
import { DemoLikeBadge, PostImage, focusRing, formatDate } from "../components/news/news-parts.jsx";
import { useNewsAdmin } from "../lib/use-news-admin.js";
import { deleteNewsPost, fetchNewsPost, updateNewsPost } from "../lib/news-client.js";

function renderParagraphs(content) {
  return String(content ?? "")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0)
    .map((block, index) => (
      <p key={`${block.slice(0, 24)}-${index}`} className="text-[0.98rem] leading-relaxed">
        {block.split(/\n/).map((line, lineIndex, lines) => (
          <span key={`${line.slice(0, 16)}-${lineIndex}`}>
            {line}
            {lineIndex < lines.length - 1 ? <br /> : null}
          </span>
        ))}
      </p>
    ));
}

export default function NewsPost({ postId = "" }) {

  const [post, setPost] = useState(null);
  const [state, setState] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const admin = useNewsAdmin();

  const load = useCallback(async () => {
    if (!postId) return;
    setState("loading");
    setError("");
    try {
      const result = await fetchNewsPost(postId);
      if (result === null) {
        setError("That post could not be found.");
        setState("error");
        return;
      }
      setPost(result);
      setState("ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load this post.");
      setState("error");
    }
  }, [postId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleUpdate = useCallback(
    async ({ post: target, input }) => {
      await updateNewsPost(target.id, input);
      setNotice("Post updated.");
      await load();
    },
    [load],
  );

  const handleDelete = useCallback(
    async (target) => {
      // eslint-disable-next-line no-alert
      if (!window.confirm(`Delete “${target.title}”? This cannot be undone.`)) return;
      await deleteNewsPost(target.id);
      window.location.assign("/news");
    },
    [],
  );

  return (
    <>
      <PageHero
        eyebrow="News"
        title={'Read the <span class="grad-text">full story</span>'}
        subtitle="Published posts from FIKRADO Security."
      />

      <section className="section pt-12" aria-labelledby="news-post-title">
        <div className="container">
          <div className="mb-8">
            <Link
              to="/news"
              className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-[color:var(--yellow)] ${focusRing}`}
              style={{ color: "var(--sky)" }}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Back to all news
            </Link>
          </div>

          {state === "loading" ? (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center" role="status" aria-live="polite">
              <Loader2 size={30} className="animate-spin" aria-hidden="true" style={{ color: "var(--yellow)" }} />
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Loading this post…
              </p>
            </div>
          ) : null}

          {state === "error" ? (
            <div className="glass-card mx-auto flex max-w-lg flex-col items-center gap-4 p-10 text-center" role="alert">
              <AlertTriangle size={30} aria-hidden="true" style={{ color: "var(--red)" }} />
              <h2 className="text-lg font-bold">This post is not available</h2>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                {error}
              </p>
              <button type="button" className={`btn btn-ghost ${focusRing}`} onClick={() => load()}>
                <RefreshCw size={16} aria-hidden="true" />
                Try again
              </button>
            </div>
          ) : null}

          {state === "ready" && post ? (
            <motion.article
              className="glass-card mx-auto max-w-3xl overflow-hidden"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="h-56 w-full overflow-hidden sm:h-72">
                <PostImage src={post.imageUrl} alt={`Featured image for ${post.title}`} />
              </div>

              <div className="flex flex-col gap-6 p-6 sm:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 text-sm" style={{ color: "var(--muted)" }}>
                    <CalendarDays size={15} aria-hidden="true" />
                    <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  </span>
                  <DemoLikeBadge
                    demoLikeCount={post.demoLikeCount}
                    demoBaseline={post.demoBaseline}
                    likes={post.likes}
                  />
                </div>

                <h1 id="news-post-title" className="text-2xl font-bold leading-tight sm:text-3xl">
                  {post.title}
                </h1>

                <p className="text-base italic" style={{ color: "var(--muted)" }}>
                  {post.excerpt}
                </p>

                <div className="flex flex-col gap-5" style={{ color: "var(--text)" }}>
                  {renderParagraphs(post.content)}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
                  <LikeButton
                    postId={post.id}
                    likes={post.likes}
                    demoLikeCount={post.demoLikeCount}
                    demoBaseline={post.demoBaseline}
                    size="lg"
                  />
                  {admin.isAdmin ? (
                    <NewsAdminBar admin={admin} post={post} onEdit={handleUpdate} onDelete={handleDelete} />
                  ) : null}
                </div>
              </div>
            </motion.article>
          ) : null}

          <p role="status" aria-live="polite" className="mx-auto mt-6 min-h-5 max-w-3xl text-sm" style={{ color: "var(--mint)" }}>
            {notice}
          </p>
        </div>
      </section>
    </>
  );
}