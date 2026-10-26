import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CalendarDays, Heart, Newspaper, X, Sparkles } from "lucide-react";

import PageHero from "../components/PageHero.jsx";
import { getPosts, readLocalLikes, toggleLocalLike } from "../lib/news/posts";

function formatDate(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function News() {
  const posts = useMemo(() => getPosts(), []);
  const [openId, setOpenId] = useState(null);
  const [liked, setLiked] = useState({});
  const [animatingPostId, setAnimatingPostId] = useState(null);

  // Read after hydration so the prerendered markup matches on first paint
  useEffect(() => {
    setLiked(readLocalLikes());
  }, []);

  // Close the reader with Escape, matching the usual dialog convention.
  useEffect(() => {
    if (!openId) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openId]);

  const active = useMemo(() => posts.find((post) => post.id === openId) ?? null, [posts, openId]);

  /**
   * The number shown on the heart. Visitor's own likes are added in real-time
   * and persist in localStorage across sessions.
   */
  const likeCount = (post) => (post.likes ?? 0) + (liked[post.id] ? 1 : 0);

  function handleLike(e, post) {
    if (e && e.stopPropagation) e.stopPropagation();
    setAnimatingPostId(post.id);
    setTimeout(() => setAnimatingPostId(null), 600);
    setLiked((current) => toggleLocalLike(current, post.id));
  }

  return (
    <>
      <PageHero
        eyebrow="Latest Updates"
        title="News"
        subtitle="Announcements, course updates, and security write-ups from FIKRADO Security."
      />

      <section className="section" style={{ paddingTop: 30 }}>
        <div className="container">
          <div className="news-toolbar">
            <div className="news-toolbar-meta">
              <Newspaper size={16} aria-hidden="true" />
              <span>
                {posts.length} {posts.length === 1 ? "post" : "posts"}
              </span>
              <span className="news-community-tag">
                <Heart size={12} className="inline-block" fill="#f87171" color="#f87171" />
                Community Feed
              </span>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="news-state glass-card">
              <Newspaper size={22} aria-hidden="true" />
              <p>No posts published yet. Check back soon.</p>
            </div>
          ) : (
            <div className="news-grid">
              {posts.map((post, i) => (
                <motion.article
                  className="news-card glass-card cursor-pointer"
                  key={post.id}
                  onClick={() => setOpenId(post.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setOpenId(post.id);
                    }
                  }}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                >
                  <div className="news-card-media">
                    {post.imageUrl ? (
                      <img src={post.imageUrl} alt={post.title} loading="lazy" />
                    ) : (
                      <div className="news-card-media-fallback" aria-hidden="true">
                        <Newspaper size={26} />
                      </div>
                    )}
                  </div>
                  <div className="news-card-body">
                    <span className="news-card-date">
                      <CalendarDays size={13} aria-hidden="true" />
                      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                    </span>
                    <h3>{post.title}</h3>
                    {post.excerpt ? <p className="news-card-excerpt">{post.excerpt}</p> : null}
                    <div className="news-card-actions">
                      <button
                        type="button"
                        className="btn btn-ghost news-btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenId(post.id);
                        }}
                      >
                        Read more
                      </button>
                      <button
                        type="button"
                        className={`news-like${liked[post.id] ? " liked" : ""}${
                          animatingPostId === post.id ? " like-pop" : ""
                        }`}
                        onClick={(e) => handleLike(e, post)}
                        aria-pressed={Boolean(liked[post.id])}
                        aria-label={`Like ${post.title}`}
                      >
                        <Heart
                          size={15}
                          aria-hidden="true"
                          fill={liked[post.id] ? "#f87171" : "none"}
                          color={liked[post.id] ? "#f87171" : "currentColor"}
                          className={`heart-icon ${animatingPostId === post.id ? "scale-125" : ""}`}
                        />
                        <span>{likeCount(post).toLocaleString()}</span>
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {active ? (
          <motion.div
            className="news-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpenId(null)}
          >
            <motion.article
              className="news-modal glass-card"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              role="dialog"
              aria-modal="true"
              aria-label={active.title}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="news-modal-close"
                onClick={() => setOpenId(null)}
                aria-label="Close post"
              >
                <X size={20} />
              </button>
              {active.imageUrl ? (
                <div className="news-modal-media-wrap">
                  <img className="news-modal-media" src={active.imageUrl} alt={active.title} />
                </div>
              ) : null}
              <div className="news-modal-body">
                <span className="news-card-date">
                  <CalendarDays size={13} aria-hidden="true" />
                  <time dateTime={active.publishedAt}>{formatDate(active.publishedAt)}</time>
                </span>
                <h2>{active.title}</h2>
                <div className="news-modal-content">
                  {String(active.content ?? "")
                    .split(/\n{2,}/)
                    .map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                </div>
                <div className="news-modal-actions">
                  <button
                    type="button"
                    className={`news-like${liked[active.id] ? " liked" : ""}${
                      animatingPostId === active.id ? " like-pop" : ""
                    }`}
                    onClick={(e) => handleLike(e, active)}
                    aria-pressed={Boolean(liked[active.id])}
                    aria-label={`Like ${active.title}`}
                  >
                    <Heart
                      size={16}
                      aria-hidden="true"
                      fill={liked[active.id] ? "#f87171" : "none"}
                      color={liked[active.id] ? "#f87171" : "currentColor"}
                    />
                    <span>{likeCount(active).toLocaleString()}</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost news-btn-sm"
                    onClick={() => setOpenId(null)}
                  >
                    <ArrowLeft size={15} aria-hidden="true" />
                    Back to news
                  </button>
                </div>
              </div>
            </motion.article>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}