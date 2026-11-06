import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { Marked, type Tokens } from "marked";

export const REPO = "nishant-Tiwari24/cracked";
export const REPO_URL = `https://github.com/${REPO}`;
const ROOT = path.join(process.cwd(), "..");
const SKILLS_DIR = path.join(ROOT, "skills");

export type Group = { id: string; title: string; blurb: string; skills: string[] };

// Sidebar order mirrors how a candidate moves: set up, practise, get shortlisted, decide.
export const GROUPS: Group[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    blurb: "Set up once. Every other skill reads your profile and journal.",
    skills: ["setup-cracked", "cracked-profile", "company-intel"],
  },
  {
    id: "interview-rounds",
    title: "Interview Rounds",
    blurb: "Practice that feels like the real round: DSA, OA, core subjects, design, HR and your own project.",
    skills: ["mock-interview", "oa-sim", "pattern-coach", "core-viva", "system-design-mock", "hr-round", "defend-my-project"],
  },
  {
    id: "getting-shortlisted",
    title: "Getting Shortlisted",
    blurb: "Resume, GitHub, projects and outreach, judged the way recruiters judge them.",
    skills: ["roast-my-resume", "resume-blueprint", "jd-match", "github-glowup", "make-it-hireable", "referral-dm"],
  },
  {
    id: "strategy",
    title: "Strategy",
    blurb: "Plan the weeks, learn from rejections, read the offer properly.",
    skills: ["prep-plan", "rejection-review", "offer-decode"],
  },
];

export type Heading = { id: string; text: string };

export type Skill = {
  name: string;
  bucket: string;
  group: Group;
  index: number; // 1-based position across all skills
  total: number;
  title: string; // display name from Codex metadata
  tagline: string;
  description: string;
  whenToUse: string | null;
  userInvoked: boolean;
  html: string;
  headings: Heading[];
  minutes: number;
  updated: string;
  sourceUrl: string;
  rawUrl: string;
  raw: string;
};

function frontmatter(text: string) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  const fm: Record<string, string> = {};
  if (m) {
    for (const line of m[1].split("\n")) {
      const kv = line.match(/^([a-zA-Z-]+):\s*(.*)$/);
      if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
    }
  }
  return { fm, body: m ? text.slice(m[0].length) : text };
}

function yamlField(file: string, key: string) {
  if (!fs.existsSync(file)) return "";
  const m = fs.readFileSync(file, "utf8").match(new RegExp(`${key}:\\s*"(.*)"`));
  return m ? m[1] : "";
}

function lastUpdated(rel: string) {
  try {
    const d = execFileSync("git", ["log", "-1", "--format=%cs", "--", rel], { cwd: ROOT }).toString().trim();
    if (d) return d;
  } catch {}
  return new Date().toISOString().slice(0, 10);
}

export const slugify = (s: string) =>
  s.toLowerCase().replace(/<[^>]+>/g, "").replace(/[`*_]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function render(markdown: string, skillRel: string) {
  const headings: Heading[] = [];
  const used = new Map<string, number>();
  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      heading({ tokens, depth }: Tokens.Heading) {
        const text = this.parser.parseInline(tokens);
        const plain = text.replace(/<[^>]+>/g, "");
        let id = slugify(plain);
        const n = used.get(id) ?? 0;
        used.set(id, n + 1);
        if (n) id = `${id}-${n}`;
        if (depth === 2) headings.push({ id, text: plain });
        const level = Math.min(depth + 0, 4);
        return `<h${level} id="${id}"><a href="#${id}">${text}</a></h${level}>`;
      },
      link({ href, tokens }: Tokens.Link) {
        const text = this.parser.parseInline(tokens);
        let url = href;
        if (!/^[a-z]+:|^#/i.test(href)) url = `${REPO_URL}/blob/main/${skillRel}/${href}`;
        const ext = /^https?:/.test(url) ? ' rel="noopener" target="_blank"' : "";
        return `<a href="${url}"${ext}>${text}</a>`;
      },
    },
  });
  // The page renders its own title, so drop the skill's H1.
  const html = marked.parse(markdown.replace(/^\s*#\s+.*\n/, "")) as string;
  return { html, headings };
}

/** Descriptions are written for the model ("when the user wants…"); pages speak to the reader. */
function toReader(s: string) {
  return s
    .replace(/\bthe (?:user|candidate)'s\b/gi, "your")
    .replace(/\bthe (?:user|candidate) (is)\b/gi, "you are")
    .replace(/\bthe (?:user|candidate) (has)\b/gi, "you have")
    .replace(/\bthe (?:user|candidate) (\w+?)s\b/gi, "you $1")
    .replace(/\bthe (?:user|candidate)\b/gi, "you")
    .replace(/\b(asks|says|wants|mentions|pastes|names|needs|got|gets)\b/g, (w) => ({ asks: "ask", says: "say", wants: "want", mentions: "mention", pastes: "paste", names: "name", needs: "need", got: "got", gets: "get" })[w]!);
}

let cache: Skill[] | null = null;

export function getSkills(): Skill[] {
  if (cache) return cache;
  const order = GROUPS.flatMap((g) => g.skills);
  const found = new Map<string, { bucket: string; dir: string }>();
  for (const bucket of fs.readdirSync(SKILLS_DIR)) {
    const bdir = path.join(SKILLS_DIR, bucket);
    if (!fs.statSync(bdir).isDirectory()) continue;
    for (const name of fs.readdirSync(bdir)) {
      if (fs.existsSync(path.join(bdir, name, "SKILL.md"))) found.set(name, { bucket, dir: path.join(bdir, name) });
    }
  }
  const names = order.filter((n) => found.has(n));
  cache = names.map((name, i) => {
    const { bucket, dir } = found.get(name)!;
    const raw = fs.readFileSync(path.join(dir, "SKILL.md"), "utf8");
    const { fm, body } = frontmatter(raw);
    const rel = `skills/${bucket}/${name}`;
    const description = fm.description ?? "";
    const when = description.match(/Use when (.*)$/i);
    const { html, headings } = render(body, rel);
    const words = body.split(/\s+/).length;
    return {
      name,
      bucket,
      group: GROUPS.find((g) => g.skills.includes(name))!,
      index: i + 1,
      total: names.length,
      title: yamlField(path.join(dir, "agents", "openai.yaml"), "display_name") || name,
      tagline: yamlField(path.join(dir, "agents", "openai.yaml"), "short_description"),
      description: when ? description.slice(0, when.index).trim() : description,
      whenToUse: when ? `Use it when ${toReader(when[1]).replace(/\.$/, "")}.` : null,
      userInvoked: fm["disable-model-invocation"] === "true",
      html,
      headings,
      minutes: Math.max(2, Math.round(words / 220)),
      updated: lastUpdated(rel),
      sourceUrl: `${REPO_URL}/tree/main/${rel}`,
      rawUrl: `https://raw.githubusercontent.com/${REPO}/main/${rel}/SKILL.md`,
      raw,
    } satisfies Skill;
  });
  return cache;
}

export function getSkill(name: string) {
  return getSkills().find((s) => s.name === name) ?? null;
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}
