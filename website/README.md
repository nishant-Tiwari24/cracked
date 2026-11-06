# cracked website

The docs site for [cracked](https://github.com/nishant-Tiwari24/cracked), built with Next.js (App Router), TypeScript and Tailwind CSS, and exported as static HTML.

Every skill page is generated at build time from the skill's own `SKILL.md` in `../skills`, so the site can never drift from the skills.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static export to ./out
BASE_PATH=/cracked npm run build   # for GitHub Pages
```

Deployment: `.github/workflows/pages.yml` builds and publishes to GitHub Pages on every push to `main` that touches `website/` or `skills/`.
