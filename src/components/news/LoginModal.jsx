import { useEffect, useRef, useState } from "react";
import { Loader2, LogIn } from "lucide-react";

import NewsModal from "./NewsModal.jsx";
import { Field, fieldClass, focusRing } from "./news-parts.jsx";
import { login } from "../../lib/news-client.js";

/**
 * Admin login dialog.
 *
 * The password field is `type="password"` with an appropriate
 * `autoComplete`, is never logged, and is cleared from state as soon as the
 * request completes. Errors are shown verbatim from the server, which returns
 * one generic message for both a bad username and a bad password.
 */
export default function LoginModal({ open, onClose, onAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (open) {
      setError("");
      setPassword("");
    }
  }, [open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    setError("");
    setSubmitting(true);
    try {
      const result = await login(username, password);
      if (!mounted.current) return;
      setPassword("");
      onAuthenticated(result);
    } catch (err) {
      if (!mounted.current) return;
      setPassword("");
      setError(err instanceof Error ? err.message : "Sign in failed. Please try again.");
    } finally {
      if (mounted.current) setSubmitting(false);
    }
  };

  return (
    <NewsModal open={open} title="Admin sign in" onClose={onClose} labelledBy="news-login-title">
      <p className="mb-6 text-sm" style={{ color: "var(--muted)" }}>
        Sign in to create, edit and delete news posts. Credentials are verified on the server and are never
        stored in the browser.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <Field id="news-admin-username" label="Username">
          <input
            id="news-admin-username"
            name="username"
            type="text"
            className={fieldClass}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
            disabled={submitting}
          />
        </Field>

        <Field id="news-admin-password" label="Password">
          <input
            id="news-admin-password"
            name="password"
            type="password"
            className={fieldClass}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            disabled={submitting}
          />
        </Field>

        <p role="alert" aria-live="assertive" className="min-h-5 text-sm" style={{ color: "var(--red)" }}>
          {error}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className={`btn btn-primary ${focusRing}`} disabled={submitting}>
            {submitting ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : (
              <LogIn size={16} aria-hidden="true" />
            )}
            {submitting ? "Signing in…" : "Sign in"}
          </button>
          <button type="button" className={`btn btn-ghost ${focusRing}`} onClick={onClose} disabled={submitting}>
            Cancel
          </button>
        </div>
      </form>
    </NewsModal>
  );
}