import { useCallback, useState } from "react";
import { Heart, Loader2 } from "lucide-react";

import { likeNewsPost } from "../../lib/news-client.js";
import { DemoLikeBadge, focusRing } from "./news-parts.jsx";

/**
 * Like button with a live, server-authoritative count.
 *
 * The server decides whether the like counts: a repeat like from the same
 * visitor returns the unchanged count, and the response is what we display.
 */
export default function LikeButton({ postId, likes, demoLikeCount, demoBaseline, size = "md" }) {
  const [count, setCount] = useState(() => (typeof likes === "number" ? likes : 0));
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  const handleClick = useCallback(async () => {
    if (pending) return;
    setPending(true);
    setMessage("");
    try {
      const result = await likeNewsPost(postId);
      if (typeof result?.likes === "number") setCount(result.likes);
      setMessage(
        result?.incremented
          ? "Thanks — your like was recorded."
          : "You already liked this post.",
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not record your like.");
    } finally {
      setPending(false);
    }
  }, [pending, postId]);

  const dimension = size === "lg" ? "h-12 px-6 text-base" : "h-10 px-4 text-sm";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-label={`Like this post. ${count} like${count === 1 ? "" : "s"} so far.`}
        className={`btn ${dimension} ${focusRing}`}
        style={{
          border: "1px solid rgba(248,113,113,0.35)",
          background: "rgba(248,113,113,0.1)",
          color: "var(--text)",
        }}
      >
        {pending ? (
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        ) : (
          <Heart size={16} aria-hidden="true" style={{ color: "var(--red)" }} />
        )}
        <span>{count.toLocaleString()}</span>
      </button>

      <DemoLikeBadge demoLikeCount={demoLikeCount} demoBaseline={demoBaseline} likes={count} />

      <span role="status" aria-live="polite" className="text-xs" style={{ color: "var(--muted)" }}>
        {message}
      </span>
    </div>
  );
}