import { useState } from "react";
import { LogIn, LogOut, Pencil, Plus, Trash2, Loader2 } from "lucide-react";

import LoginModal from "./LoginModal.jsx";
import PostFormModal from "./PostFormModal.jsx";
import { focusRing } from "./news-parts.jsx";

/**
 * Admin control surface for the News pages.
 *
 * Nothing admin-only renders until `admin.isAdmin` is true, which comes from a
 * server check of the HttpOnly session cookie. Hiding the buttons is only a UX
 * affordance — the session check inside every write handler is the real gate.
 *
 * `post` is the single post this bar acts on (null on the list page, where only
 * Create/Logout apply). `onCreate`, `onEdit` and `onDelete` receive the form
 * input / post and are responsible for refreshing the page afterwards.
 */
export default function NewsAdminBar({ admin, post = null, onCreate, onEdit, onDelete }) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [busy, setBusy] = useState(false);

  if (admin.isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
        <Loader2 size={15} className="animate-spin" aria-hidden="true" />
        Checking admin session…
      </div>
    );
  }

  if (!admin.isAdmin) {
    return (
      <>
        <button
          type="button"
          className={`btn btn-ghost !py-2.5 ${focusRing}`}
          onClick={() => setLoginOpen(true)}
        >
          <LogIn size={16} aria-hidden="true" />
          Login
        </button>
        <LoginModal
          open={loginOpen}
          onClose={() => setLoginOpen(false)}
          onAuthenticated={(session) => {
            admin.markAdmin(session);
            setLoginOpen(false);
          }}
        />
      </>
    );
  }

  const openCreate = () => {
    setFormMode("create");
    setFormOpen(true);
  };

  const openEdit = () => {
    if (!post) return;
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!post || !onDelete) return;
    // No confirmation dialog here: every `onDelete` handler already asks the
    // admin to confirm. Confirming in both places showed two dialogs for a
    // single click and made the second one cancel the delete.
    setBusy(true);
    try {
      await onDelete(post);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <span
          className="rounded-full border px-3 py-1.5 text-xs font-semibold"
          style={{
            borderColor: "rgba(52,211,153,0.4)",
            color: "var(--mint)",
            background: "rgba(52,211,153,0.08)",
          }}
        >
          Admin
        </span>

        <button type="button" className={`btn btn-primary !py-2.5 ${focusRing}`} onClick={openCreate}>
          <Plus size={16} aria-hidden="true" />
          Create post
        </button>

        {post ? (
          <button
            type="button"
            className={`btn btn-ghost !py-2.5 ${focusRing}`}
            onClick={openEdit}
          >
            <Pencil size={16} aria-hidden="true" />
            Edit post
          </button>
        ) : null}

        {post ? (
          <button
            type="button"
            className={`btn btn-ghost !py-2.5 ${focusRing}`}
            onClick={handleDelete}
            disabled={busy}
          >
            {busy ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : (
              <Trash2 size={16} aria-hidden="true" />
            )}
            Delete post
          </button>
        ) : null}

        <button
          type="button"
          className={`btn btn-ghost !py-2.5 ${focusRing}`}
          onClick={() => admin.logout()}
          disabled={busy}
        >
          <LogOut size={16} aria-hidden="true" />
          Logout
        </button>
      </div>

      <PostFormModal
        open={formOpen}
        mode={formMode}
        post={formMode === "edit" ? post : null}
        onClose={() => setFormOpen(false)}
        onSubmit={async (input) => {
          if (formMode === "edit") {
            if (!onEdit) return;
            await onEdit({ post, input });
          } else {
            if (!onCreate) return;
            await onCreate({ input });
          }
          setFormOpen(false);
        }}
      />
    </>
  );
}