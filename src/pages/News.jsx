import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CalendarDays, Loader2, Newspaper, Pencil, RefreshCw, Trash2 } from "lucide-react";

import { Link } from "../compat/react-router-dom.jsx";
import PageHero from "../components/PageHero.jsx";
import LikeButton from "../components/news/LikeButton.jsx";
import NewsAdminBar from "../components/news/NewsAdminBar.jsx";
import PostFormModal from "../components/news/PostFormModal.jsx";
import { DemoLikeBadge, PostImage, focusRing, formatDate } from "../components/news/news-parts.jsx";
import { useNewsAdmin } from "../lib/use-news-admin.js";
import { createNewsPost, deleteNewsPost, fetchNewsPosts, updateNewsPost } from "../lib/news-client.js";

/** Post card used by the news list grid. */
function NewsCard({ post, index, isAdmin, onEdit, onDelete }) {
  return (
    <motion.article
      className="glass-card flex h-full flex-col overflow-hidden"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.07, 0.28) }}
    >
      <div className="h-44 w-full overflow-hidden">
        <PostImage src={post.imageUrl} alt={`Featured image for ${post.title}`} />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--muted)" }}>
            <CalendarDays size={14} aria-hidden="true" />
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </span>
          <DemoLikeBadge
            demoLikeCount={post.demoLikeCount}
            demoBaseline={post.demoBaseline}
            likes={post.likes}
          />
        </div>

        <h3 className="text-lg font-bold leading-snug">
          <Link
            to="/news/$postId"
            params={{ postId: post.id }}
            className={`transition-colors hover:text-[color:var(--yellow)] ${focusRing}`}
          >
            {post.title}
          </Link>
        </h3>

        <p className="flex-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          {post.excerpt}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <LikeButton
            postId={post.id}
            likes={post.likes}
            demoLikeCount={post.demoLikeCount}
            demoBaseline={post.demoBaseline}
          />
          <Link
            to="/news/$postId"
            params={{ postId: post.id }}
            className={`text-sm font-semibold transition-colors hover:text-[color:var(--yellow)] ${focusRing}`}
            style={{ color: "var(--sky)" }}
          >
            Read more →
          </Link>
        </div>

        {isAdmin ? (
          <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
            <button
              type="button"
              className={`btn btn-ghost !px-4 !py-2 text-xs ${focusRing}`}
              onClick={() => onEdit(post)}
              aria-label={`Edit ${post.title}`}
            >
              <Pencil size={14} aria-hidden="true" />
              Edit
            </button>
            <button
              type="button"
              className={`btn btn-ghost !px-4 !py-2 text-xs ${focusRing}`}
              onClick={() => onDelete(post)}
              aria-label={`Delete ${post.title}`}
            >
              <Trash2 size={14} aria-hidden="true" />
              Delete
            </button>
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}

export default function News() {
  const [posts, setPosts] = useState([]);
  const [state, setState] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState(null);
  const admin = useNewsAdmin();

  const load = useCallback(async () => {
    setState("loading");
    setError("");
    try {
      const list = await fetchNewsPosts();
      setPosts(list);
      setState("ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load news posts.");
      setState("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleCreate = useCallback(
    async ({ input }) => {
      await createNewsPost(input);
      setNotice(input.published ? "Post published." : "Draft saved as unpublished.");
      await load();
    },
    [load],
  );

  const handleUpdate = useCallback(
    async ({ post, input }) => {
      await updateNewsPost(post.id, input);
      setNotice("Post updated.");
      await load();
    },
    [load],
  );

  const handleDelete = useCallback(
    async (post) => {
      // eslint-disable-next-line no-alert
      if (!window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return;
      await deleteNewsPost(post.id);
      setNotice("Post deleted.");
      await load();
    },
    [load],
  );

  return (
    <>
      <PageHero
        eyebrow="News &amp; updates"
        title={'Company <span class="grad-text">news</span>'}
        subtitle="Announcements, programme updates and publishing news from FIKRADO Security. Published posts only — sign in as an admin to add more."
      />

      <section className="section" aria-labelledby="news-list-title">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Latest posts</span>
            <h2 id="news-list-title">Everything we have published so far</h2>
          </div>

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              {state === "ready"
                ? `${posts.length} published post${posts.length === 1 ? "" : "s"}`
                : "Loading posts…"}
            </p>
            <NewsAdminBar admin={admin} onCreate={handleCreate} />
          </div>

          <p role="status" aria-live="polite" className="mb-6 min-h-5 text-sm" style={{ color: "var(--mint)" }}>
            {notice}
          </p>

          {state === "loading" ? (
            <div
              className="flex flex-col items-center justify-center gap-4 py-20 text-center"
              role="status"
              aria-live="polite"
            >
              <Loader2 size={30} className="animate-spin" aria-hidden="true" style={{ color: "var(--yellow)" }} />
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Loading the latest news…
              </p>
            </div>
          ) : null}

          {state === "error" ? (
            <div className="glass-card mx-auto flex max-w-lg flex-col items-center gap-4 p-10 text-center" role="alert">
              <AlertTriangle size={30} aria-hidden="true" style={{ color: "var(--red)" }} />
              <h3 className="text-lg font-bold">We could not load the news</h3>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                {error}
              </p>
              <button type="button" className={`btn btn-ghost ${focusRing}`} onClick={() => load()}>
                <RefreshCw size={16} aria-hidden="true" />
                Try again
              </button>
            </div>
          ) : null}

          {state === "ready" && posts.length === 0 ? (
            <div className="glass-card mx-auto flex max-w-lg flex-col items-center gap-4 p-10 text-center">
              <div
                className="icon-box"
                style={{ borderColor: "rgba(125,211,252,0.3)", color: "var(--sky)" }}
                aria-hidden="true"
              >
                <Newspaper size={24} />
              </div>
              <h3 className="text-lg font-bold">No published posts yet</h3>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Nothing has been published here so far. Sign in as an admin to write the first post.
              </p>
            </div>
          ) : null}

          {state === "ready" && posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <NewsCard
                  key={post.id}
                  post={post}
                  index={index}
                  isAdmin={admin.isAdmin}
                  onEdit={setEditing}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : null}

          {editing ? (
            <EditPostDialog post={editing} onClose={() => setEditing(null)} onSubmit={handleUpdate} />
          ) : null}
        </div>
      </section>
    </>
  );
}

/** Inline edit dialog for an existing card, reusing the shared post form. */
function EditPostDialog({ post, onClose, onSubmit }) {
  return (
    <PostFormModal
      open
      mode="edit"
      post={post}
      onClose={onClose}
      onSubmit={async (input) => {
        await onSubmit({ post, input });
        onClose();
      }}
    />
  );
}