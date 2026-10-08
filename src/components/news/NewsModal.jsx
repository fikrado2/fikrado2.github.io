import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

/**
 * Shared modal shell for the News admin dialogs.
 *
 * Accessibility: rendered as a labelled `dialog`, Escape closes it, focus
 * moves to the first control on open and returns to the trigger on close, and
 * a visible backdrop button closes it too.
 */
export default function NewsModal({ open, title, onClose, children, labelledBy = "news-modal-title" }) {
  const panelRef = useRef(null);
  const restoreFocusRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    restoreFocusRef.current = document.activeElement;
    const panel = panelRef.current;
    const focusable = panel?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable?.focus?.();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      const restore = restoreFocusRef.current;
      if (restore && typeof restore.focus === "function") restore.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-black/70 backdrop-blur-sm"
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="glass-card relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6 sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 id={labelledBy} className="text-xl font-bold sm:text-2xl">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full border border-white/10 p-2 text-[color:var(--muted)] transition hover:border-[color:var(--yellow)] hover:text-[color:var(--yellow)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--yellow)]"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}