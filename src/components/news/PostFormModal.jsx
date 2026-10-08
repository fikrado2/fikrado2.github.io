import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";

import NewsModal from "./NewsModal.jsx";
import { Field, fieldClass, focusRing } from "./news-parts.jsx";

/**
 * Render an ISO timestamp as the `YYYY-MM-DDTHH:mm` string a
 * `<input type="datetime-local">` requires, in the visitor's local timezone.
 *
 * `Date.parse` returns a millisecond NUMBER, not a Date, so the value has to be
 * wrapped before any Date method is called on it.
 */
function toDateTimeLocal(iso) {
  const timestamp = Date.parse(iso);
  if (!Number.isFinite(timestamp)) return "";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function emptyDraft() {
  return { title: "", excerpt: "", content: "", imageUrl: "", publishedAt: toDateTimeLocal(new Date().toISOString()), published: true };
}

function draftFromPost(post) {
  if (!post) return emptyDraft();
  return {
    title: post.title ?? "",
    excerpt: post.excerpt ?? "",
    content: post.content ?? "",
    imageUrl: post.imageUrl ?? "",
    publishedAt: toDateTimeLocal(post.publishedAt ?? new Date().toISOString()),
    published: post.published === true,
  };
}

/**
 * Create / edit dialog for a news post. Covers title, excerpt, image URL,
 * content, publication date and the published / unpublished status.
 */
export default function PostFormModal({ open, mode, post, onClose, onSubmit }) {
  const [draft, setDraft] = useState(() => draftFromPost(post));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(draftFromPost(post));
      setError("");
    }
  }, [open, post]);

  const update = (field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    if (draft.title.trim().length === 0) {
      setError("A title is required.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await onSubmit({
        title: draft.title,
        excerpt: draft.excerpt,
        content: draft.content,
        imageUrl: draft.imageUrl,
        publishedAt: draft.publishedAt ? new Date(draft.publishedAt).toISOString() : new Date().toISOString(),
        published: draft.published,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the post.");
    } finally {
      setSubmitting(false);
    }
  };

  const heading = mode === "edit" ? "Edit post" : "Create post";

  return (
    <NewsModal open={open} title={heading} onClose={onClose} labelledBy="news-post-form-title">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <Field id="news-post-title" label="Title">
          <input
            id="news-post-title"
            name="title"
            type="text"
            className={fieldClass}
            value={draft.title}
            onChange={update("title")}
            autoComplete="off"
            required
            disabled={submitting}
          />
        </Field>

        <Field id="news-post-image" label="Featured image URL">
          <input
            id="news-post-image"
            name="imageUrl"
            type="url"
            inputMode="url"
            className={fieldClass}
            value={draft.imageUrl}
            onChange={update("imageUrl")}
            placeholder="https://example.com/cover.jpg (optional)"
            autoComplete="off"
            disabled={submitting}
          />
        </Field>

        <Field id="news-post-excerpt" label="Excerpt">
          <textarea
            id="news-post-excerpt"
            name="excerpt"
            className={`${fieldClass} min-h-[80px] resize-y`}
            value={draft.excerpt}
            onChange={update("excerpt")}
            placeholder="Short summary shown on the card (optional)"
            disabled={submitting}
          />
        </Field>

        <Field id="news-post-content" label="Content">
          <textarea
            id="news-post-content"
            name="content"
            className={`${fieldClass} min-h-[180px] resize-y`}
            value={draft.content}
            onChange={update("content")}
            placeholder="Full post body"
            disabled={submitting}
          />
        </Field>

        <Field id="news-post-date" label="Publication date">
          <input
            id="news-post-date"
            name="publishedAt"
            type="datetime-local"
            className={fieldClass}
            value={toDateTimeLocal(draft.publishedAt)}
            onChange={update("publishedAt")}
            disabled={submitting}
          />
        </Field>

        <div className="flex items-center gap-3">
          <input
            id="news-post-published"
            name="published"
            type="checkbox"
            checked={draft.published}
            onChange={update("published")}
            disabled={submitting}
            className={`h-4 w-4 accent-[color:var(--yellow-deep)] ${focusRing}`}
          />
          <label htmlFor="news-post-published" className="text-sm">
            Published (visible on the public news page)
          </label>
        </div>

        <p role="alert" aria-live="assertive" className="min-h-5 text-sm" style={{ color: "var(--red)" }}>
          {error}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className={`btn btn-primary ${focusRing}`} disabled={submitting}>
            {submitting ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : (
              <Save size={16} aria-hidden="true" />
            )}
            {submitting ? "Saving…" : mode === "edit" ? "Save changes" : "Publish post"}
          </button>
          <button type="button" className={`btn btn-ghost ${focusRing}`} onClick={onClose} disabled={submitting}>
            Cancel
          </button>
        </div>
      </form>
    </NewsModal>
  );
}