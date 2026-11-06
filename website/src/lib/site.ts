export const SITE_URL = "https://nishant-tiwari24.github.io/cracked";
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
/** Prefix a public asset path with the deploy base path. */
export const asset = (p: string) => `${BASE}${p.startsWith("/") ? p : `/${p}`}`;
