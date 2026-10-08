<p align="center">
  <img src="public/logo.jpg" alt="FIKRADO Security logo" width="140" />
</p>

<p align="center">
  <a href="https://github.com/fikrado2/fikrado2.github.io/actions/workflows/deploy.yml">
    <img src="https://github.com/fikrado2/fikrado2.github.io/actions/workflows/deploy.yml/badge.svg" alt="Deploy to GitHub Pages" />
  </a>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TanStack_Start-SSR-FF415C?style=flat-square&logo=tanstack&logoColor=white" alt="TanStack Start" />
  <img src="https://img.shields.io/badge/TanStack_Router-1.170-FF415C?style=flat-square&logo=tanstack&logoColor=white" alt="TanStack Router" />
  <img src="https://img.shields.io/badge/Vite-8.1-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Nitro-3-000000?style=flat-square&logo=nitro&logoColor=white" alt="Nitro" />
  <img src="https://img.shields.io/badge/Vitest-4.1-6E9F06?style=flat-square&logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/Node-22-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node 22" />
</p>

# FIKRADO Security — website

The official site for **FIKRADO Security**: a Somali company focused on internet
security and technology education. The public site is a server-rendered React
application covering the company profile, its services, courses, published
books, videos, a contact channel wired to the company CRM, and a **News**
section for announcements and programme updates.

Live site: <https://fikrado2.github.io>

---

## Tech stack

| Layer | Technology |
| --- | --- |
| UI | React 19 |
| Framework | TanStack Start (SSR, file-based routes) |
| Routing | TanStack Router (type-safe, generated route tree) |
| Build | Vite 8 |
| Language | TypeScript 5.8 + JSX |
| Styling | Tailwind CSS 4 |
| Server | Nitro 3 (request handlers + storage) |
| Tests | Vitest + Testing Library |
| Icons / motion | lucide-react, Framer Motion |
| 3D | Three.js via React Three Fiber |
| Tooling | ESLint, Prettier |

Shared Vite/TanStack/Nitro configuration comes from
`@lovable.dev/vite-tanstack-config`, which is why the app config in
`vite.config.ts` stays small.

## Features

- **Home / About** — company profile and story.
- **Services** — security and technology services offered.
- **Courses** — cyber-security and technology training programmes.
- **Books** — published technical titles.
- **Videos** — video content.
- **Contact** — the company contact form.
- **News** — published company news with likes and admin-only posting.
- **Multi-language UI** — English plus Somali and Amharic translations, with a
  first-visit language prompt and a language switcher in the navbar.

## News page

The News section is a self-contained feature; it does not change the layout or
behaviour of the other pages.

### Reading news (public)

Visitors can open `/news`, browse published posts, and open a post at
`/news/<postId>`. Each post shows a title, featured image (when set), excerpt,
publication date and body, plus a **like** button with a live count.

The News nav entry is translated alongside the other navbar links
("Warbixin" in Somali).

### Publishing news (admin-only)

A **Login** button on the News pages opens the admin sign-in dialog. Only a
signed-in administrator sees **Create post**, **Edit post** and **Delete post**.
The admin can set a title, featured image URL, excerpt, content, publication
date, and published/unpublished status. The public list shows published posts
only.

### How authentication is secured

- The password is **never** in client code. It is read from an unprefixed
  server environment variable, `ADMIN_PASSWORD`, so it cannot be picked up by
  the `VITE_*` vars that the build inlines into the browser bundle.
- Login is rejected unless `ADMIN_PASSWORD` is set — there is no default
  password, so the admin area is closed until an operator configures one.
- Credentials are compared with `crypto.timingSafeEqual`, and the endpoint
  returns **one** generic message ("Invalid username or password.") for both a
  bad username and a bad password, so it does not disclose which field was
  wrong.
- On success the server issues an **HttpOnly, SameSite=Strict** HMAC-SHA256
  signed session cookie. The token is never readable by JavaScript. Sessions
  last 8 hours.
- The signing key is `ADMIN_SESSION_SECRET` when set, otherwise derived from
  `ADMIN_PASSWORD` (so rotating the password invalidates existing sessions).
- The submitted password is never logged, echoed, or stored.
- Every write endpoint (`POST`/`PUT`/`PATCH`/`DELETE`) re-checks the session
  server-side and rejects cross-origin requests. Hiding the admin buttons is
  only a UI affordance — the server check is the actual gate.
- Login and logout are verified in a real browser: wrong password is rejected
  without a session, the correct password yields a session, and logout clears
  it.

### How posts and likes are stored

Posts and like records are kept in **Nitro storage** under the `news` mount
(`posts` for the post list, `likes:<postId>` for per-post like records). This
reuses the server runtime the app already ships with, so there is no extra
database or external service to run.

- New posts start at `likes: 0`.
- A like is recorded only once per visitor per post. The server stores a
  **SHA-256 hash** of a signed HttpOnly visitor id rather than the id itself,
  so the stored values reveal nothing about the cookie, and repeat likes are
  idempotent.
- **Demo data:** the three seeded posts ship with clearly-labelled demo counts
  in the 1,000–2,000 range. They are stored separately from real likes
  (`demoBaseline` / `demoLikeCount`) and the UI badges every seeded number
  **DEMO DATA**, so generated numbers are never presented as real engagement.

### Configuration

Copy the example file and set the admin password before using the News admin
area:

```sh
cp .env.example .env
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `ADMIN_PASSWORD` | yes | Admin password. No default; login stays closed when unset. |
| `ADMIN_USERNAME` | no | Admin username. Defaults to `fikrado`. |
| `ADMIN_SESSION_SECRET` | no | HMAC key for the session cookie. Derived from `ADMIN_PASSWORD` when unset. |
| `PUBLIC_APP_ORIGIN` | no | Extra allow-listed origin for admin write requests. |

`.env` is gitignored and the real values must never be committed. See
`.env.example` for placeholders.

> **Note:** only non-`VITE_` variables belong in `.env`. Anything prefixed
> `VITE_` is inlined into the public browser bundle.

## Contact form and CRM

The contact page embeds the **EngageBay** CRM form. It is the live channel used
to collect enquiries, and it is intentionally left exactly as it was:

- Same CRM, same account, same form id, same fields, same validation, and the
  same submission path.
- No new form, no migration, no extra fields collected.

The only change was a guard that stops the page from crashing (see below).

## The Contact page crash fix

The contact page used to render a blank page and never load the form.

**Root cause.** The page's init code created `window.EhAPI` as an empty object
and then called `window.EhAPI.set_account(...)` immediately, synchronously.
EngageBay only defines `set_account` / `execute` once its own vendor bundle
(`bundle.min.js`) has executed, which had not happened yet. The call therefore
threw `TypeError: window.EhAPI.set_account is not a function` inside a React
commit phase. With no error boundary above it, React tore down the whole tree,
so the page went blank — and because the throw happened *before* the code that
injects the CRM script and creates the form, **the CRM form was never created
at all**.

**Fix.** `src/pages/Contact.jsx` now calls `set_account` and `execute` through
optional calls (`?.`), and sets the account again inside `createForm`, which is
the first point where the vendor bundle is guaranteed to have run. The form id,
target, fields and CRM integration are unchanged — only the crash is gone.

Verified in a browser: `/contact` renders, `window.EhAPI` exposes `set_account`,
and the full EngageBay chain loads (`ehform.js`, `bundle.min.js`,
`leadgrabbers`, `embed-form`, form client bundle) with no page errors.

## Development

Requires Node.js 22 (the version used by the deploy workflow).

```sh
git clone https://github.com/fikrado2/fikrado2.github.io
cd fikrado2.github.io
npm ci
cp .env.example .env   # then set ADMIN_PASSWORD
npm run dev
```

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run test` | Run the Vitest suite |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

## Deployment

`.github/workflows/deploy.yml` builds the app and publishes it to **GitHub
Pages** on every push to `main`.

> **Important — hosting constraint.** This app is server-rendered (TanStack
> Start on Nitro), and the News feature needs a server for admin auth and
> persistent likes. The production build therefore targets Nitro's
> **`cloudflare-module`** preset and emits `.output/public` plus a server
> bundle — there is no static `dist/` directory. GitHub Pages can only serve
> static files, so it cannot host the News admin API or the server-rendered
> routes as-is. See "Known limitation" below.

## Known limitation

The News admin area and likes require a runtime that can execute the Nitro
server (the current build is set up for Cloudflare Workers). Serving the site
from GitHub Pages alone would mean dropping SSR and the News API, which is a
deployment decision rather than a code change. This is tracked separately.

## Attribution

Originally generated with [Lovable](https://lovable.dev) and kept in sync with
that repository.