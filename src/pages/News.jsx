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
  createPost as apiCreatePost,
  deletePost as apiDeletePost,
  fetchPosts,
  likePost,
  readSession,
  signIn,
  signOut,
  updatePost as apiUpdatePost,
} from "../lib/news/session";

const isStaticPages = import.meta.env.VITE_STATIC_PAGES === "true";
const EMPTY_POSTS = [];
const EMPTY_LIKES = { counts: {}, demo: false };
function newId() {
  return `post-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatDate(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function News() {
  const [posts, setPosts] = useState(EMPTY_POSTS);
  const [status, setStatus] = useState(isStaticPages ? "unavailable" : "loading");
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState("");
  const errorRef = useRef(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError("");
    try {
      const loaded = await fetchPosts();
      setPosts(Array.isArray(loaded) ? loaded : EMPTY_POSTS);
      setStatus("ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load news.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (!isStaticPages) {
      readSession().then((s) => setIsAdmin(Boolean(s?.authenticated)));
    }
  }, []);

  useEffect(() => {
    if (!isStaticPages) void load();
  }, [load]);

  useEffect(() => {
    if (error) errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [error]);

  const adminView = isAdmin;

  // Visitors only ever see published posts. The admin also sees drafts, so a
  // post can be created and then published instead of being invisible until it
  // is already live.
  const visible = useMemo(
    () =>
      posts
        .filter((post) => (adminView ? true : Boolean(post?.published)))
        .sort((a, b) => String(b.publishedAt ?? "").localeCompare(String(a.publishedAt ?? ""))),
    [posts, adminView],
  );

  const active = useMemo(
    () => visible.find((post) => post.id === openId) ?? null,
    [visible, openId],
  );

  function flashMessage(message) {
    setFlash(message);
    window.setTimeout(() => setFlash(""), 3000);
  }

  async function handleLike(post) {
    try {
      const result = await likePost(post.id);
      setPosts((current) =>
        current.map((p) => (p.id === post.id ? { ...p, likes: result.likes } : p)),
      );
    } catch {
      /* keep the current count; the server rejected the like */
    }
  }

  async function savePost() {
    if (!editing) return;
    setSaving(true);
    try {
      const payload = {
        title: editing.title,
        excerpt: editing.excerpt ?? "",
        content: editing.content,
        imageUrl: editing.imageUrl ?? "",
        publishedAt: editing.publishedAt,
        published: Boolean(editing.published),
      };
      const exists = posts.some((p) => p.id === editing.id);
      const saved = exists ? await apiUpdatePost(editing.id, payload) : await apiCreatePost(payload);
      setPosts((current) =>
        exists ? current.map((p) => (p.id === saved.id ? saved : p)) : [...current, saved],
      );
      setEditing(null);
      flashMessage("Saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  async function removePost(post) {
    setSaving(true);
    try {
      await apiDeletePost(post.id);
      setPosts((current) => current.filter((p) => p.id !== post.id));
      if (openId === post.id) setOpenId(null);
      flashMessage("Post deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
    } catch {
      /* cookie already gone */
    }
    setIsAdmin(false);
    setEditing(null);
    flashMessage("Signed out.");
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
                {isStaticPages
                  ? "Updates are unavailable on this static site."
                  : `${visible.length} ${visible.length === 1 ? "post" : "posts"}`}
              </span>
              {posts.some((p) => p.demoLikeCount) ? (
                  <span className="news-demo-tag">Demo like counts</span>
                ) : null}
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
                      excerpt: "",
                      imageUrl: "",
                      content: "",
                      publishedAt: new Date().toISOString().slice(0, 10),
                      published: false,
                    })
                  }
                >
                  <Plus size={15} aria-hidden="true" />
                  Create Post
                </button>
                <button type="button" className="btn btn-ghost news-btn-sm" onClick={() => void handleSignOut()}>
                  <LogOut size={15} aria-hidden="true" />
                  Logout
                </button>
              </div>
            ) : isStaticPages ? null : (
              <NewsLogin
                onSignedIn={async () => {
                  setIsAdmin(true);
                  await load();
                  flashMessage("Signed in.");
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

          {status === "unavailable" ? (
            <div className="news-state glass-card" role="status">
              <Newspaper size={22} aria-hidden="true" />
              <p>
                News posts, likes, and administration require a server and are not available on GitHub
                Pages.
              </p>
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
                    {post.imageUrl ? (
                      <img src={post.imageUrl} alt="" loading="lazy" />
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
                      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
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
                        className="news-like"
                        onClick={() => void handleLike(post)}
                        
                        
                        aria-label={`Like ${post.title}`}
                      >
                        <Heart
                          size={15}
                          
                          aria-hidden="true"
                        />
                        <span>{(post.likes ?? 0).toLocaleString()}</span>
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
                    className="news-like"
                    onClick={() => void handleLike(active)}
                    
                    
                  >
                    <Heart
                      size={16}
                      
                      aria-hidden="true"
                    />
                    <span>{(active.likes ?? 0).toLocaleString()}</span>
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
                  value={editing.imageUrl}
                  onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })}
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
                  value={(editing.publishedAt ?? "").slice(0, 10)}
                  onChange={(e) => setEditing({ ...editing, publishedAt: e.target.value })}
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
                    await savePost();
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
                Posts are stored server-side. Your password is never sent again after sign-in.
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
  const [password, setPassword] = useState("");
  const [reveal, setReveal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signIn(username, password);
      // Cleared immediately: the password is never kept in component state
      // after the server has issued the session cookie.
      setPassword("");
      await onSignedIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Access rejected by FIKRADO Security.");
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
          aria-label="Admin password"
          type={reveal ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
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
