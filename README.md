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

No backend service, database, or external API is used by the site itself.

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

`/news` is a self-contained feature added for publishing company announcements
and security write-ups. Visitors can read published posts and like them; only
the administrator can create, edit, or delete posts.

### Storage

News is stored in this repository as JSON, under `public/news/`:

| File | Contents |
| --- | --- |
| `public/news/posts.json` | All posts. Each has `id`, `title`, `image`, `content`, `date`, and `published`. |
| `public/news/likes.json` | Shared like counts per post, plus a `demo` flag. |

Reads are public — the page fetches `posts.json` and `likes.json` directly.
Only posts with `published: true` are shown to visitors.

### Admin sign-in

The site is deployed as a **static bundle** (GitHub Pages), so there is no
server process that could hold a secret. A password checked in the browser
would be readable in the shipped JavaScript, which would not protect anything.

Instead the admin signs in with their **GitHub identity**:

- **Username** must be `fikrado`.
- **Password** is a GitHub **fine-grained personal access token**, entered at
  login and verified by GitHub's own API on every sign-in.

Create a token at
<https://github.com/settings/personal-access-tokens/new> with
**Contents: Read and write** limited to this repository.

The token is:

- never committed to this repository and never bundled into the frontend;
- held only in `sessionStorage` for the lifetime of the browser tab;
- never logged, never returned by the News endpoints, and never displayed;
- authorized by GitHub, so a token without write access to this repo cannot
  create, edit, or delete posts.

Signing out clears the session and removes the admin controls.

See [`.env.example`](.env.example) for the placeholder environment values. The
real credential stays outside the repository — `.env` files are gitignored.

### Likes

Like counts are real: they come from the shared `likes.json` ledger and each
visitor's own likes are recorded against their browser, so one person cannot
inflate a count by repeatedly clicking (the button disables once liked).
Because there is no anonymous write endpoint, a signed-out visitor's like is
counted on their own device; a signed-in admin's likes are also written to the
shared ledger.

The seeded counts in `likes.json` are **demo figures** and the file is marked
`"demo": true`, which the UI surfaces as a **"Demo like counts"** badge so they
are not presented as genuine engagement. Set `"demo": false` once real traffic
has replaced them.

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

Pushes to `main` run [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which installs dependencies, runs the production build, and publishes to
GitHub Pages.

> **Note:** `package-lock.json` in this repository is currently out of sync
> with `package.json`, so the `npm ci` step fails and deploys are skipped. Until
> it is regenerated, deploys will not run. `bun.lock` is the maintained
> lockfile and installs cleanly.

---

<div align="center">
  <sub>© FIKRADO Security — Hargeisa, Somaliland &amp; Jijiga, Ethiopia</sub>
</div>