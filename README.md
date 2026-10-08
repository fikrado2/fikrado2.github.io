<div align="center">
  <img src="public/logo.jpg" alt="FIKRADO Security logo" width="150" height="150" />
  <h1>FIKRADO Security — Website</h1>
  <p><strong>Cybersecurity services and technology education for the Horn of Africa.</strong></p>
</div>

<div align="center">

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TanStack Start](https://img.shields.io/badge/TanStack_Start-1.168-FF4154?style=flat-square&logo=tanstack&logoColor=white)](https://tanstack.com/start)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-14-0055FF?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![three.js](https://img.shields.io/badge/three.js-r186-000000?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org)

[![Deploy to GitHub Pages](https://github.com/fikrado2/fikrado2.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/fikrado2/fikrado2.github.io/actions/workflows/deploy.yml)
[![Live site](https://img.shields.io/badge/Live-fikrado2.github.io-2EA44F?style=flat-square)](https://fikrado2.github.io)
[![Last commit](https://img.shields.io/github/last-commit/fikrado2/fikrado2.github.io?style=flat-square)](https://github.com/fikrado2/fikrado2.github.io/commits/main)
[![Repo size](https://img.shields.io/github/repo-size/fikrado2/fikrado2.github.io?style=flat-square)](https://github.com/fikrado2/fikrado2.github.io)

</div>

---

## About

Website for **FIKRADO Security**, a 50% non-profit company specializing in
cybersecurity services and affordable technology courses, with offices in
Hargeisa (Somaliland) and Jijiga (Ethiopia).

- **Live site:** <https://fikrado2.github.io>
- **Repository:** <https://github.com/fikrado2/fikrado2.github.io>
- **Contact:** fikrado1@gmail.com · +252 63 4048063 · +251 98 4858498

### Social

| Platform | Link |
| --- | --- |
| GitHub | <https://github.com/fikrado-orgnasation/> |
| LinkedIn | <https://www.linkedin.com/company/fikrado> |
| YouTube | <https://www.youtube.com/@fikrad0> |

## Owner

**Yahye Abdirahman** — [@fikrado2](https://github.com/fikrado2) · [fikrado1@gmail.com](mailto:fikrado1@gmail.com)

All code in this repository is written and maintained by Yahye Abdirahman.

## Contributors

| Contributor | Role |
| --- | --- |
| [@fikrado2](https://github.com/fikrado2) — Yahye Abdirahman | Project owner and developer |
| [OpenCode](https://opencode.ai) | AI coding assistant used for the News page, the Contact crash fix, and this documentation |
| [Claude Code](https://claude.com/claude-code) | AI coding assistant |

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | TanStack Start 1.168 (SSR + file-based routing) |
| UI | React 19 |
| Language | TypeScript 5.8 (`.tsx` routes and libs) with JSX page components |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 + a hand-written `src/styles.css` design system |
| Animation | Framer Motion 14 |
| 3D background | three.js + `@react-three/fiber` + `@react-three/drei` |
| Icons | lucide-react |
| i18n | Custom `LanguageContext` (English, Somali, Amharic) |
| Linting | ESLint 9 + Prettier |
| Tests | Vitest 4 |
| Server / hosting | Nitro on Cloudflare Workers (`wrangler`) |

The only backend is the News API (`/api/news/*`), served by the same
TanStack Start app. It stores posts and likes in Cloudflare KV and holds
the admin password as a server-side environment secret.

## Features

- **Home** — service overview, trust badges, statistics, featured content.
- **Services** — penetration testing, network defense, incident response, and more.
- **Courses** — cybersecurity, Linux, networking, ethical hacking, and AI courses.
- **Books** — downloadable technology books.
- **Videos** — embedded YouTube tutorial library.
- **About** — mission, values, team, and offices.
- **Contact** — contact details plus an **EngageBay CRM** web form (see below).
- **News** *(new)* — see below.
- **Multilingual** — English, Somali, and Amharic with automatic detection.
- **Accessibility & SEO** — semantic markup, meta/JSON-LD tags, sitemap, and reduced-motion support.

## News page

`/news` publishes company announcements and security write-ups. Visitors read
published posts and like them; only the administrator can create, edit, or
delete posts.

### Admin sign-in

Authentication is **server-side**. The password is compared against the
`ADMIN_PASSWORD` environment variable with a timing-safe comparison, and a
successful login returns an **HttpOnly** session cookie. The password itself
is never sent to the browser, never bundled into the JavaScript, and never
written to disk by the app.

- **Username:** `fikrado` (from `ADMIN_USERNAME`)
- **Password:** the value of `ADMIN_PASSWORD`

Failed logins return a single generic message — "Access rejected by FIKRADO
Security." — so the response never reveals whether the username or the password
was wrong. Write endpoints also require a same-origin request.

### Storage

Posts and likes are held server-side, not in this repository:

| Endpoint | Purpose |
| --- | --- |
| `GET /api/news` | Published posts (public) |
| `POST /api/news` | Create a post (admin session) |
| `GET/PATCH/DELETE /api/news/:id` | Read / update / delete one post |
| `POST /api/news/:id/like` | Record a like |
| `GET/POST/DELETE /api/news/session` | Check / create / clear the admin session |

On Cloudflare Workers the data lives in a **KV namespace** (binding `NEWS`,
declared in `wrangler.jsonc`). Locally there is no KV binding, so nitro falls
back to in-memory storage and posts reset when the dev server stops.

### Likes

Likes are real and server-recorded. The server stores a hashed visitor
identifier per post, so the same visitor cannot inflate a count by clicking
again — a repeat like returns `incremented: false`.

The seeded posts carry **demo** like counts. Those are flagged with
`demoLikeCount`/`demoBaseline` and the UI shows a **"Demo like counts"** badge,
so generated numbers are never presented as genuine engagement.

## Contact / CRM integration

The Contact page embeds the existing **EngageBay CRM** form (form id
`6207068009398272`) via their `ehform.js` script into the
`#eh_form_6207068009398272` container. Submissions are handled entirely by
EngageBay — the fields, submission method, and data format are unchanged and
are not proxied through this site.

The page also themes the CRM iframe to match the site and removes duplicate
iframes, but it does not alter the form itself.

## Development

Requires **Node.js 22+** or **Bun**.

```sh
git clone https://github.com/fikrado2/fikrado2.github.io.git
cd fikrado2.github.io

# With Bun (bun.lock is the maintained lockfile)
bun install
bun run dev

# Or with npm
npm install
npm run dev
```

The dev server runs on <http://localhost:8080>.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (SSR bundle + static assets) |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint + Prettier check |
| `npm run format` | Format the repository with Prettier |
| `npm test` | Run the Vitest suite |

### Project layout

| Path | Purpose |
| --- | --- |
| `src/routes/` | File-based routes (`__root.tsx` is the app shell) |
| `src/pages/` | Page components rendered by the routes |
| `src/components/` | Shared UI, including the `ui/` primitives |
| `src/i18n/` | Language context and translations |
| `src/lib/news/` | News storage and admin session logic |
| `src/styles.css` | Global design system |
| `public/` | Static assets, including `public/news/` |

`src/routeTree.gen.ts` is generated by TanStack Router — do not edit it by hand.

## Deployment

This is a **server-rendered** app (TanStack Start + Nitro), so it needs a host
that can run a server. GitHub Pages cannot host it: Pages only serves static
files, and this app renders pages per request.

Deploy to **Cloudflare Workers**, which the build already targets:

```sh
npm ci
npm run build

# One-time: create the KV namespace used for posts and likes
npx wrangler kv namespace create NEWS
# then paste the returned id into wrangler.jsonc

# One-time: store the admin password as an encrypted secret
npx wrangler secret put ADMIN_USERNAME   # fikrado
npx wrangler secret put ADMIN_PASSWORD   # your real password
# optional, keeps sessions valid across a password change
npx wrangler secret put ADMIN_SESSION_SECRET

npx wrangler deploy
```

The password is set with `wrangler secret put`, so it is stored encrypted by
Cloudflare and is never present in the repository or the deployed bundle.

### GitHub Actions

The existing `.github/workflows/deploy.yml` targets GitHub Pages and its
`npm ci` lockfile problem has been fixed, but the Pages upload step cannot
work for this app. Replace it with a Cloudflare Pages/Workers deployment, or
delete it and deploy with `wrangler` as above.

---

<div align="center">
  <sub>© FIKRADO Security — Hargeisa, Somaliland &amp; Jijiga, Ethiopia</sub>
</div>