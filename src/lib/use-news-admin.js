import { useCallback, useEffect, useState } from "react";

import { fetchSession, logout as logoutRequest } from "../lib/news-client.js";

/**
 * Tracks the admin session for the News pages.
 *
 * Authentication lives entirely in the HttpOnly session cookie: the browser
 * never sees the token, and this hook only records whether the server says the
 * request is authenticated. No credential is ever held in component state
 * beyond the login dialog's own password input, which is cleared on submit.
 */
export function useNewsAdmin() {
  const [status, setStatus] = useState("loading"); // loading | anonymous | admin
  const [username, setUsername] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const session = await fetchSession();
      setStatus(session.authenticated ? "admin" : "anonymous");
      setUsername(session.username);
      return session.authenticated;
    } catch {
      setStatus("anonymous");
      setUsername(null);
      return false;
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const result = await refresh();
      if (!active) return;
      void result;
    })();
    return () => {
      active = false;
    };
  }, [refresh]);

  const markAdmin = useCallback((session) => {
    setStatus(session?.authenticated ? "admin" : "anonymous");
    setUsername(session?.username ?? null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setStatus("anonymous");
      setUsername(null);
    }
  }, []);

  return {
    isLoading: status === "loading",
    isAdmin: status === "admin",
    username,
    refresh,
    markAdmin,
    logout,
  };
}
