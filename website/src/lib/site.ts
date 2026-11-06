/** Public URL of the deployed site (no trailing slash). Set SITE_URL at build time. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://cracked-skills.vercel.app").replace(/\/$/, "");
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
/** Prefix a public asset path with the deploy base path. */
export const asset = (p: string) => `${BASE}${p.startsWith("/") ? p : `/${p}`}`;
