# FIKRADO Security

A 3D animated multi-page website for FIKRADO Security — a non-profit specializing in cybersecurity and technology courses. Built with **React 19 + Vite + React Router + React Three Fiber + Framer Motion**.

## Features

- **Multi-page site**: Home, About, Services, Courses, Books, Videos, Contact
- **3D on every page**: React Three Fiber scenes with rotating wireframe objects, orbit rings, stars, and particle rain — each page has its own 3D layout
- **Hacker theme**: animated cyber grid background, matrix rain particles, dark neon styling
- **Language detection**: automatically detects the visitor's language (English, Somali, Amharic) via `navigator.language`, with a manual EN/SO/AM switcher in the navbar
- **Yellow + light-blue gradient** branding
- Fully responsive with a mobile menu

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # outputs to dist/
```

## Deploy to GitHub Pages

1. Push this repo to GitHub (repo name **must** be `FIKRADO-Security` for the base path to work, or update `base` in `vite.config.js` and `homepage` in `package.json`).
2. Go to **Settings → Pages** and set Source to **GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) builds and deploys on every push to `main`.

The site will be live at `https://<your-username>.github.io/FIKRADO-Security/`.

## Project structure

- `src/pages/` — Home, About, Services, Courses, Books, Videos, Contact
- `src/components/` — Layout, Navbar, Footer, PageHero, Scene3D
- `src/i18n/` — translations (EN/SO/AM) + LanguageContext
- `public/logo.jpg` — company logo