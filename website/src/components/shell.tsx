import Link from "next/link";
import { ArrowRight, BookOpen, ChevronRight, FlaskConical, LayoutGrid, ScrollText, Tag } from "lucide-react";
import { GROUPS, REPO_URL, getSkills } from "@/lib/skills";
import { BrandMark, GitHubMark } from "./icons";
import { StarCount } from "./client";

export const monoLabel = "font-mono text-[11px] uppercase tracking-[0.08em]";

/** Shared button styles: compact, modern, consistent everywhere. */
export const btn = {
  base: "inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-3 text-[13px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
  primary: "bg-primary text-primary-foreground hover:bg-[var(--accent-fill-hover)] shadow-[0_0_0_1px_#c6ff3d,0_6px_20px_-8px_#c6ff3d80]",
  secondary: "border border-line-strong bg-white/[0.03] text-foreground hover:bg-white/[0.07] hover:border-white/20",
  ghost: "text-fg-muted hover:text-foreground hover:bg-white/[0.05]",
};

function Announcement() {
  return (
    <div className="flex h-9 items-center justify-center gap-2.5 overflow-hidden border-b border-line px-4 text-[13px]">
      <span className="rounded border border-accent-line bg-accent-wash px-1.5 py-px font-mono text-[10px] font-medium text-primary">v1.0</span>
      <a href={`${REPO_URL}/releases/tag/v1.0.0`} className="group inline-flex min-w-0 items-center gap-1.5 text-body hover:text-foreground">
        <span className="truncate">cracked v1.0 is out: 19 skills, 470+ companies, free and open source</span>
        <ArrowRight className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-background/80 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5">
          <BrandMark size={26} />
          <span className="text-[15px] font-semibold tracking-[-0.02em]">cracked</span>
        </Link>
        <nav className="hidden items-center gap-1 sm:flex">
          <Link href="/#the-skills" className={`${btn.base} ${btn.ghost}`}>Skills</Link>
          <Link href="/#companies" className={`${btn.base} ${btn.ghost}`}>Companies</Link>
          <a href={`${REPO_URL}/releases`} className={`${btn.base} ${btn.ghost}`}>Changelog</a>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <a href={REPO_URL} className={`${btn.base} ${btn.secondary} hidden md:inline-flex`}>
          <GitHubMark className="size-3.5" /> GitHub <StarCount />
        </a>
        <a href={`${REPO_URL}#installation-30-second-setup`} className={`${btn.base} ${btn.primary}`}>
          Install
        </a>
      </div>
    </header>
  );
}

function SideLabel({ children }: { children: React.ReactNode }) {
  return <p className={`${monoLabel} mb-1.5 px-2 text-faint`}>{children}</p>;
}

const row = "flex items-center gap-2 rounded-md px-2 py-1.5 text-[13.5px] transition-colors";
const rowIdle = "text-fg-muted hover:bg-white/[0.04] hover:text-foreground";

function Sidebar({ current }: { current?: string }) {
  const skills = getSkills();
  const byName = Object.fromEntries(skills.map((s) => [s.name, s]));
  const currentGroup = skills.find((s) => s.name === current)?.group.id ?? "getting-started";
  return (
    <aside className="hidden w-[260px] shrink-0 border-r border-line lg:block">
      <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto px-3 py-6">
        <SideLabel>Explore</SideLabel>
        <ul className="space-y-px">
          <li>
            <Link href="/" className={`${row} ${!current ? "bg-white/[0.06] text-foreground" : rowIdle}`}>
              <LayoutGrid className="size-3.5" /> Overview
            </Link>
          </li>
          <li className={`${row} text-foreground`}>
            <BookOpen className="size-3.5" /> Skills
          </li>
          <li>
            <ul className="ml-[15px] space-y-px border-l border-line pl-2">
              {GROUPS.map((g, gi) => (
                <li key={g.id}>
                  <details open={g.id === currentGroup} className="group/g">
                    <summary className={`${row} ${rowIdle} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}>
                      <span className="w-3 font-mono text-[11px] text-faint">{gi + 1}</span>
                      {g.title}
                      <ChevronRight className="ml-auto size-3.5 text-faint transition-transform group-open/g:rotate-90" />
                    </summary>
                    <ul className="space-y-px pb-1">
                      {g.skills.filter((n) => byName[n]).map((n, si) => {
                        const on = current === n;
                        return (
                          <li key={n}>
                            <Link
                              href={`/skills/${n}/`}
                              aria-current={on ? "page" : undefined}
                              className={`${row} relative pl-7 font-mono text-[12.5px] ${on ? "bg-white/[0.06] text-foreground" : rowIdle}`}
                            >
                              {on && <span className="absolute bottom-1.5 left-0 top-1.5 w-0.5 rounded-full bg-primary" />}
                              <span className="text-faint">{gi + 1}.{si + 1}</span>
                              <span className="truncate">/{n}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                </li>
              ))}
            </ul>
          </li>
        </ul>

        <div className="mt-6">
          <SideLabel>Resources</SideLabel>
          <ul className="space-y-px">
            <li><a className={`${row} ${rowIdle}`} href={REPO_URL}><GitHubMark className="size-3.5" /> Source code</a></li>
            <li><a className={`${row} ${rowIdle}`} href={`${REPO_URL}/tree/main/evals`}><FlaskConical className="size-3.5" /> Evals and results</a></li>
            <li><a className={`${row} ${rowIdle}`} href={`${REPO_URL}/blob/main/CHANGELOG.md`}><Tag className="size-3.5" /> Changelog</a></li>
            <li><a className={`${row} ${rowIdle}`} href={`${REPO_URL}/blob/main/CONTRIBUTING.md`}><ScrollText className="size-3.5" /> Contributing</a></li>
          </ul>
        </div>
      </div>
    </aside>
  );
}

export function Shell({ current, children }: { current?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-frame">
      <div className="mx-auto max-w-[1440px] border-x border-line bg-background">
        <Announcement />
        <Header />
        <div className="flex">
          <Sidebar current={current} />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-6 py-5 text-[13px] text-fg-muted">
          <div className="flex items-center gap-2.5">
            <BrandMark size={18} />
            <p>MIT licensed. Built by <a className="text-foreground hover:underline" href="https://github.com/nishant-Tiwari24">Nishant Tiwari</a>.</p>
          </div>
          <p className="flex gap-4">
            <a className="hover:text-foreground" href={REPO_URL}>Source</a>
            <a className="hover:text-foreground" href={`${REPO_URL}/releases`}>Releases</a>
            <a className="hover:text-foreground" href={`${REPO_URL}/issues`}>Report an issue</a>
          </p>
        </footer>
      </div>
    </div>
  );
}
