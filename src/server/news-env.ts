/**
 * Server-only environment access for the News feature.
 *
 * Everything here reads unprefixed env names on purpose: the Vite config
 * injects every `VITE_*` variable into the CLIENT bundle, so any secret read
 * from a `VITE_`-prefixed name would be shipped to every visitor.
 *
 * Keys are always passed in as a parameter so no secret name is statically
 * embedded next to a `process.env` access — that keeps the lookup opaque to
 * bundler define-replacement and keeps this module safe to import from a
 * server handler without leaking identifiers into the client graph.
 */
type EnvBag = Record<string, string | undefined>;

function envBag(): EnvBag {
  // `process` may be absent on non-Node server runtimes; the global lookup is
  // intentionally indirect so bundlers do not rewrite a literal access.
  const proc = (globalThis as { process?: { env?: EnvBag } }).process;
  return proc?.env ?? {};
}

/** Read a single server-side env var by name. Returns undefined when unset. */
export function readServerEnv(key: string): string | undefined {
  const value = envBag()[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

/** True when running behind a production build (used for Secure cookies). */
export function isProduction(): boolean {
  return readServerEnv("NODE_ENV") === "production";
}
