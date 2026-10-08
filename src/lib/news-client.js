/**
 * Browser-side helpers for the News feature.
 *
 * Nothing here reads secrets: every request is authenticated purely by the
 * HttpOnly session cookie the browser attaches automatically.
 */

const JSON_HEADERS = { "content-type": "application/json" };

async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    ...options,
    headers: { ...(options.body ? JSON_HEADERS : {}), ...(options.headers || {}) },
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      (payload && typeof payload.error === "string" && payload.error) ||
      `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return payload;
}

export function fetchNewsPosts() {
  return request("/api/news").then((data) => (Array.isArray(data?.posts) ? data.posts : []));
}

export function fetchNewsPost(postId) {
  return request(`/api/news/${encodeURIComponent(postId)}`).then((data) => data?.post ?? null);
}

export function fetchSession() {
  return request("/api/news/session").then((data) => ({
    authenticated: data?.authenticated === true,
    username: typeof data?.username === "string" ? data.username : null,
  }));
}

export function login(username, password) {
  // The password is sent once, over the same-origin request, and never stored.
  return request("/api/news/session", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  }).then((data) => ({
    authenticated: data?.authenticated === true,
    username: data?.username ?? null,
  }));
}

export function logout() {
  return request("/api/news/session", { method: "DELETE" }).then(() => ({ authenticated: false }));
}

export function likeNewsPost(postId) {
  return request(`/api/news/${encodeURIComponent(postId)}/like`, { method: "POST" });
}

export function createNewsPost(input) {
  return request("/api/news", { method: "POST", body: JSON.stringify(input) }).then(
    (data) => data?.post ?? null,
  );
}

export function updateNewsPost(postId, input) {
  return request(`/api/news/${encodeURIComponent(postId)}`, {
    method: "PUT",
    body: JSON.stringify(input),
  }).then((data) => data?.post ?? null);
}

export function deleteNewsPost(postId) {
  return request(`/api/news/${encodeURIComponent(postId)}`, { method: "DELETE" });
}
