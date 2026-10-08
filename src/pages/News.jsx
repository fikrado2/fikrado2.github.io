import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  Edit3,
  Eye,
  EyeOff,
  Heart,
  Loader2,
  Lock,
  LogOut,
  Newspaper,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
} from "lucide-react";

import PageHero from "../components/PageHero.jsx";
import {
  readNewsFile,
  clearSession,
  hasWriteAccess,
  readSession,
  recordLike,
  signIn,
  writeNewsFile,
} from "../lib/news/session";

const EMPTY_POSTS = [];
const EMPTY_LIKES = { counts: {}, demo: false };
const LOCAL_LIKED = "fikrado.news.liked";

function newId() {
  return `post-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function readLocalLiked() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_LIKED) || "[]");
  } catch {
    return [];
  }
}

function writeLocalLiked(ids) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_LIKED, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

function formatDate(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function News() {
  const [posts, setPosts] = useState(EMPTY_POSTS);
  const [likes, setLikes] = useState(EMPTY_LIKES);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);
  const [session, setSession] = useState(null);
  const [canWrite, setCanWrite] = useState(false);
  const [liked, setLiked] = useState(() => readLocalLiked());
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState("");
  const errorRef = useRef(null);

  const token = session?.token;

  const load = useCallback(async () => {
    setStatus("loading");
    setError("");
    try {
      const [loadedPosts, loadedLikes] = await Promise.all([
        readNewsFile("posts", token),
        readNewsFile("likes", token),
      ]);
      setPosts(Array.isArray(loadedPosts) ? loadedPosts : EMPTY_POSTS);
      setLikes(loadedLikes && typeof loadedLikes === "object" ? loadedLikes : EMPTY_LIKES);
      setStatus("ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load news.");
      setStatus("error");
    }
  }, [token]);

  useEffect(() => {
    const existing = readSession();
    setSession(existing);
    if (existing) {
      hasWriteAccess(existing.token).then(setCanWrite);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (error) errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [error]);

  const adminView = Boolean(session && canWrite);

  // Visitors only ever see published posts. The admin also sees drafts, so a
  // post can be created and then published instead of being invisible until it
  // is already live.
  const visible = useMemo(
    () =>
      posts
        .filter((post) => (adminView ? true : Boolean(post?.published)))
        .sort((a, b) => String(b.date ?? "").localeCompare(String(a.date ?? ""))),
    [posts, adminView],
  );

  const active = useMemo(
    () => visible.find((post) => post.id === openId) ?? null,
    [visible, openId],
  );

  async function refreshSession() {
    const existing = readSession();
    if (!existing) return;
    const writable = await hasWriteAccess(existing.token);
    setCanWrite(writable);
    if (!writable) {
      clearSession();
      setSession(null);
    }
  }

  async function persist(nextPosts, message) {
    setSaving(true);
    try {
      await writeNewsFile("posts", nextPosts, token, message);
      setPosts(nextPosts);
      setFlash("Saved to the repository.");
      window.setTimeout(() => setFlash(""), 3000);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleLike(post) {
    if (liked.includes(post.id)) return;
    const nextLiked = [...liked, post.id];
    setLiked(nextLiked);
    writeLocalLiked(nextLiked);

    // Show the visitor's own like immediately, then try to fold it into the
    // shared counter. Without a signed-in session the like stays on this
    // device, which keeps it real rather than inventing shared numbers.
    setLikes((current) => ({
      ...current,
      counts: { ...current.counts, [post.id]: (current.counts[post.id] ?? 0) + 1 },
    }));

    try {
      await recordLike(likes, post.id, token);
    } catch {
      /* keep the local like; shared sync is best-effort */
    }
  }

  function logout() {
    clearSession();
    setSession(null);
    setCanWrite(false);
    setEditing(null);
    setFlash("Signed out.");
    window.setTimeout(() => setFlash(""), 3000);
  }

  async function removePost(post) {
    if (typeof window === "undefined") return;
    const next = posts.filter((item) => item.id !== post.id);
    if (await persist(next, `news: delete ${post.id}`)) {
      if (openId === post.id) setOpenId(null);
      setEditing(null);
    }
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
                {visible.length} {visible.length === 1 ? "post" : "posts"}
              </span>
              {likes.demo ? <span className="news-demo-tag">Demo like counts</span> : null}
            </div>

            {adminView ? (
              <div className="news-admin-actions">
                <button
                  type="button"
                  className="btn btn-ghost news-btn-sm"
                  onClick={() =>
                    setEditing({
                      id: newId(),
                      title: "",
                      image: "",
                      content: "",
                      date: new Date().toISOString().slice(0, 10),
                      published: false,
                    })
                  }
                >
                  <Plus size={15} aria-hidden="true" />
                  Create Post
                </button>
                <button type="button" className="btn btn-ghost news-btn-sm" onClick={logout}>
                  <LogOut size={15} aria-hidden="true" />
                  Logout
                </button>
              </div>
            ) : (
              <NewsLogin
                onSignedIn={async (identity) => {
                  setSession({ username: identity.login, token: identity.token });
                  await refreshSession();
                  setFlash("Signed in.");
                  window.setTimeout(() => setFlash(""), 3000);
                }}
              />
            )}
          </div>

          {flash ? (
            <p className="news-flash" role="status">
              {flash}
            </p>
          ) : null}

          {status === "loading" ? (
            <div className="news-state glass-card" role="status">
              <Loader2 size={22} className="news-spin" aria-hidden="true" />
              <p>Loading news…</p>
            </div>
          ) : null}

          {status === "error" ? (
            <div className="news-state news-state-error glass-card" ref={errorRef} role="alert">
              <AlertTriangle size={22} aria-hidden="true" />
              <p>{error}</p>
              <button
                type="button"
                className="btn btn-ghost news-btn-sm"
                onClick={() => void load()}
              >
                <RefreshCw size={15} aria-hidden="true" />
                Try again
              </button>
            </div>
          ) : null}

          {status === "ready" && visible.length === 0 ? (
            <div className="news-state glass-card">
              <Newspaper size={22} aria-hidden="true" />
              <p>No posts published yet. Check back soon.</p>
            </div>
          ) : null}

          {status === "ready" && visible.length > 0 ? (
            <div className="news-grid">
              {visible.map((post, i) => (
                <motion.article
                  className="news-card glass-card"
                  key={post.id}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                >
                  <div className="news-card-media">
                    {post.image ? (
                      <img src={post.image} alt="" loading="lazy" />
                    ) : (
                      <div className="news-card-media-fallback" aria-hidden="true">
                        <Newspaper size={26} />
                      </div>
                    )}
                  </div>
                  <div className="news-card-body">
                    {adminView && !post.published ? (
                      <span className="news-draft-badge">Draft</span>
                    ) : null}
                    <span className="news-card-date">
                      <CalendarDays size={13} aria-hidden="true" />
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                    </span>
                    <h3>{post.title}</h3>
                    {post.excerpt ? <p className="news-card-excerpt">{post.excerpt}</p> : null}
                    <div className="news-card-actions">
                      <button
                        type="button"
                        className="btn btn-ghost news-btn-sm"
                        onClick={() => setOpenId(post.id)}
                      >
                        Read more
                      </button>
                      <button
                        type="button"
                        className={`news-like${liked.includes(post.id) ? " liked" : ""}`}
                        onClick={() => void handleLike(post)}
                        disabled={liked.includes(post.id)}
                        aria-pressed={liked.includes(post.id)}
                        aria-label={`Like ${post.title}`}
                      >
                        <Heart
                          size={15}
                          fill={liked.includes(post.id) ? "currentColor" : "none"}
                          aria-hidden="true"
                        />
                        <span>{(likes.counts?.[post.id] ?? 0).toLocaleString()}</span>
                      </button>
                    </div>
                    {adminView ? (
                      <div className="news-card-admin">
                        <button
                          type="button"
                          className="news-link-btn"
                          onClick={() => setEditing({ ...post })}
                        >
                          <Edit3 size={14} aria-hidden="true" /> Edit
                        </button>
                        <button
                          type="button"
                          className="news-link-btn news-link-danger"
                          onClick={() => void removePost(post)}
                        >
                          <Trash2 size={14} aria-hidden="true" /> Delete
                        </button>
                      </div>
                    ) : null}
                  </div>
                </motion.article>
              ))}
            </div>
          ) : null}
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
              {active.image ? <img className="news-modal-media" src={active.image} alt="" /> : null}
              <div className="news-modal-body">
                <span className="news-card-date">
                  <CalendarDays size={13} aria-hidden="true" />
                  <time dateTime={active.date}>{formatDate(active.date)}</time>
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
                    className={`news-like${liked.includes(active.id) ? " liked" : ""}`}
                    onClick={() => void handleLike(active)}
                    disabled={liked.includes(active.id)}
                    aria-pressed={liked.includes(active.id)}
                  >
                    <Heart
                      size={16}
                      fill={liked.includes(active.id) ? "currentColor" : "none"}
                      aria-hidden="true"
                    />
                    <span>{(likes.counts?.[active.id] ?? 0).toLocaleString()}</span>
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

      <AnimatePresence>
        {editing ? (
          <motion.div
            className="news-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setEditing(null)}
          >
            <motion.div
              className="news-editor glass-card"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              role="dialog"
              aria-modal="true"
              aria-label={
                editing.id && posts.some((p) => p.id === editing.id) ? "Edit post" : "Create post"
              }
              onClick={(event) => event.stopPropagation()}
            >
              <h3>{posts.some((p) => p.id === editing.id) ? "Edit post" : "Create post"}</h3>

              <label className="news-field">
                <span>Title</span>
                <input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="Post title"
                />
              </label>

              <label className="news-field">
                <span>Featured image URL</span>
                <input
                  value={editing.image}
                  onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                  placeholder="/logo.jpg or https://…"
                />
              </label>

              <label className="news-field">
                <span>Content</span>
                <textarea
                  rows={7}
                  value={editing.content}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  placeholder="Write the post. Leave a blank line between paragraphs."
                />
              </label>

              <label className="news-field">
                <span>Publication date</span>
                <input
                  type="date"
                  value={editing.date}
                  onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                />
              </label>

              <label className="news-switch">
                <input
                  type="checkbox"
                  checked={Boolean(editing.published)}
                  onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                />
                <span>
                  {editing.published ? "Published — visible to visitors" : "Unpublished — hidden"}
                </span>
              </label>

              <div className="news-editor-actions">
                <button
                  type="button"
                  className="btn btn-primary news-btn-sm"
                  disabled={saving || !editing.title.trim()}
                  onClick={async () => {
                    const next = posts.some((p) => p.id === editing.id)
                      ? posts.map((p) => (p.id === editing.id ? { ...editing } : p))
                      : [...posts, { ...editing }];
                    if (await persist(next, `news: save ${editing.id}`)) setEditing(null);
                  }}
                >
                  {saving ? (
                    <Loader2 size={15} className="news-spin" aria-hidden="true" />
                  ) : (
                    <Save size={15} aria-hidden="true" />
                  )}
                  Save post
                </button>
                <button
                  type="button"
                  className="btn btn-ghost news-btn-sm"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </button>
              </div>
              <p className="news-editor-note">
                Saving writes <code>public/news/posts.json</code> on <code>main</code> through the
                GitHub API.
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function NewsLogin({ onSignedIn }) {
  const [username, setUsername] = useState("fikrado");
  const [token, setToken] = useState("");
  const [reveal, setReveal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const identity = await signIn(username, token);
      setToken("");
      await onSignedIn(identity);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="news-login" onSubmit={submit}>
      <span className="news-login-label">
        <Lock size={14} aria-hidden="true" />
        Admin
      </span>
      <input
        aria-label="Admin username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoComplete="username"
      />
      <div className="news-login-secret">
        <input
          aria-label="Admin access token"
          type={reveal ? "text" : "password"}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Access token"
          autoComplete="current-password"
        />
        <button
          type="button"
          onClick={() => setReveal((v) => !v)}
          aria-label={reveal ? "Hide access token" : "Show access token"}
        >
          {reveal ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
        </button>
      </div>
      <button type="submit" className="btn btn-primary news-btn-sm" disabled={busy}>
        {busy ? (
          <Loader2 size={15} className="news-spin" aria-hidden="true" />
        ) : (
          <Lock size={15} aria-hidden="true" />
        )}
        Login
      </button>
      {error ? (
        <p className="news-login-error" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
