import { useEffect, useState } from "react";

/** Shared presentational pieces for the News pages. */

export const DEMO_BADGE_LABEL = "Demo data";

/** Tailwind-visible focus ring, reused on every interactive News control. */
export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--sky)]";

export function formatDate(isoString) {
  const parsed = Date.parse(isoString);
  if (!Number.isFinite(parsed)) return "";
  return new Date(parsed).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Always show the demo provenance when a post carries a seeded like count.
 * `realLikes` is `likes - demoBaseline`, so the reader can see exactly which
 * part of the displayed number is generated rather than real engagement.
 */
export function DemoLikeBadge({ demoLikeCount, demoBaseline, likes }) {
  if (!demoLikeCount || demoBaseline <= 0) return null;
  const total = typeof likes === "number" ? likes : 0;
  const realLikes = Math.max(0, total - demoBaseline);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wider ${focusRing}`}
      style={{
        borderColor: "rgba(253,224,71,0.35)",
        color: "var(--yellow)",
        background: "rgba(253,224,71,0.08)",
      }}
      title={`${total.toLocaleString()} total = ${demoBaseline.toLocaleString()} seeded demo likes + ${realLikes.toLocaleString()} real like${
        realLikes === 1 ? "" : "s"
      }.`}
    >
      {DEMO_BADGE_LABEL}
    </span>
  );
}

/**
 * Featured image with a graceful fallback when a post has no image URL or the
 * image fails to load, so a broken URL never shows a torn-image icon.
 */
export function PostImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{
          background:
            "linear-gradient(140deg, rgba(253,224,71,0.14) 0%, rgba(125,211,252,0.14) 60%, rgba(10,15,26,0.6) 100%)",
        }}
        role="img"
        aria-label={alt ? `${alt} (no image available)` : "No image available"}
      >
        <svg
          viewBox="0 0 48 48"
          aria-hidden="true"
          className="h-10 w-10 opacity-60"
          style={{ color: "var(--sky)" }}
        >
          <path
            fill="currentColor"
            d="M8 12a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V12Zm4 20h24l-7.5-10-5.5 7-3.5-4.5L12 32Zm6.5-13a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
          />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

/** Consistent input styling for the admin login and post forms. */
export const fieldClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[0.95rem] text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus:border-[rgba(253,224,71,0.4)] focus:bg-white/[0.06] focus:outline-none";

export const labelClass =
  "label mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]";

export function Field({ id, label, error, children }) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs" style={{ color: "var(--red)" }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}