# cracked website

The docs site for [cracked](https://github.com/nishant-Tiwari24/cracked), built with Next.js (App Router), TypeScript and Tailwind CSS, and exported as static HTML.

Every skill page is generated at build time from the skill's own `SKILL.md` in `../skills`, so the site can never drift from the skills.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static export to ./out
BASE_PATH=/cracked npm run build   # for GitHub Pages
```

## Deploy

Production lives on Vercel's free Hobby plan at https://cracked-skills.vercel.app. The site is built locally and uploaded as static files, so it needs no CI minutes:

```bash
scripts/deploy-site.sh          # from the repo root
```

The first run needs `npx vercel login` once. `.github/workflows/pages.yml` is kept for GitHub Pages as an alternative host.
