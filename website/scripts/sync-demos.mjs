// Copy ../assets/demos into public/ so skill pages can show them. Run before dev and build.
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
const from = new URL("../../assets/demos/", import.meta.url);
const to = new URL("../public/assets/demos/", import.meta.url);
rmSync(to, { recursive: true, force: true });
if (existsSync(from)) {
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true });
}
