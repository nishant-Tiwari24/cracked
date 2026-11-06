import Link from "next/link";
import { ArrowRight, BookOpen, ChevronDown, ChevronRight, FlaskConical, LayoutGrid, ScrollText, Tag } from "lucide-react";
import { GROUPS, REPO_URL, getSkills } from "@/lib/skills";
import { BrandMark, GitHubMark } from "./icons";
import { StarCount } from "./client";

const mono = "font-mono text-[13px] tracking-[0.01em]";

function Announcement() {
  return (
    <div className="flex h-12 items-center justify-center gap-3 overflow-hidden border-b border-line px-4 text-[15px]">
      <span className={`${mono} rounded-[5px] border border-accent-line bg-accent-wash px-2 py-0.5 text-[11px] text-gold`}>v1.0</span>
      <a href={`${REPO_URL}/releases/tag/v1.0.0`} className="inline-flex min-w-0 items-center gap-2 text-foreground hover:underline">
        <span className="truncate">cracked v1.0 is out: 19 skills, 470+ companies, free and open source.</span>
        <ArrowRight className="size-4 shrink-0" />
      </a>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-[86px] items-center justify-between border-b border-line bg-background/90 px-6 backdrop-blur md:px-8">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-3">
          <BrandMark size={36} />
          <span className="text-[21px] font-bold tracking-[-0.02em]">cracked</span>
        </Link>
        <nav className="hidden items-center gap-6 text-[17px] text-fg-muted sm:flex">
          <Link href="/#skills" className="hover:text-foreground">Skills</Link>
          <Link href="/#companies" className="hover:text-foreground">Companies</Link>
        </nav>
      </div>
      <div className="flex items-center gap-6 text-[17px] text-fg-muted">
        <a href={`${REPO_URL}/releases`} className="hidden hover:text-foreground md:inline">Changelog</a>
        <a href={REPO_URL} className="hidden items-center gap-2 hover:text-foreground md:inline-flex">
          <GitHubMark /> GitHub
        </a>
        <a
          href={REPO_URL}
          className="inline-flex h-10 items-center gap-2 rounded-[9px] bg-gold px-5 text-[16px] font-semibold text-primary-foreground transition hover:bg-gold-hover"
        >
          Star on GitHub <StarCount />
        </a>
      </div>
    </header>
  );
}

function SideLabel({ children }: { children: React.ReactNode }) {
  return <p className={`${mono} mb-3 px-3 text-label`}>{children}</p>;
}

const rowBase = "flex items-center gap-3 rounded-[8px] px-3 py-2 text-[17px] transition";

function Sidebar({ current }: { current?: string }) {
  const skills = getSkills();
  const byName = Object.fromEntries(skills.map((s) => [s.name, s]));
  const currentGroup = skills.find((s) => s.name === current)?.group.id ?? "getting-started";
  return (
    <aside className="hidden w-[366px] shrink-0 border-r border-line lg:block">
      <div className="sticky top-[86px] max-h-[calc(100vh-86px)] overflow-y-auto px-6 py-10">
        <SideLabel>Explore</SideLabel>
        <ul className="space-y-0.5">
          <li>
            <Link href="/" className={`${rowBase} ${!current ? "text-foreground" : "text-body hover:bg-hover hover:text-foreground"}`}>
              <LayoutGrid className="size-[18px]" /> Overview
            </Link>
          </li>
          <li>
            <details open className="group/skills">
              <summary className={`${rowBase} cursor-pointer list-none text-foreground hover:bg-hover [&::-webkit-details-marker]:hidden`}>
                <BookOpen className="size-[18px]" /> Skills
                <ChevronDown className="ml-auto size-4 text-fg-muted transition group-open/skills:rotate-0 [details:not([open])>&]:-rotate-90" />
              </summary>
              <ul className="mt-1 space-y-0.5 pl-4">
                {GROUPS.map((g, gi) => (
                  <li key={g.id}>
                    <details open={g.id === currentGroup} className="group/g">
                      <summary className={`${rowBase} cursor-pointer list-none text-body hover:bg-hover hover:text-foreground [&::-webkit-details-marker]:hidden`}>
                        <span className={`${mono} w-4 text-faint`}>{gi + 1}</span>
                        {g.title}
                        <ChevronRight className="ml-auto size-4 text-fg-muted transition group-open/g:rotate-90" />
                      </summary>
                      <ul className="mt-0.5 space-y-0.5">
                        {g.skills.filter((n) => byName[n]).map((n, si) => (
                          <li key={n}>
                            <Link
                              href={`/skills/${n}/`}
                              aria-current={current === n ? "page" : undefined}
                              className={`${rowBase} py-[9px] pl-9 text-[16px] ${
                                current === n ? "bg-hover text-foreground" : "text-body hover:bg-hover hover:text-foreground"
                              }`}
                            >
                              <span className={`${mono} text-faint`}>{gi + 1}.{si + 1}</span>
                              <span className="truncate">/{n}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                ))}
              </ul>
            </details>
          </li>
          <li>
            <a href={REPO_URL} className={`${rowBase} text-body hover:bg-hover hover:text-foreground`}>
              <GitHubMark className="size-[18px]" /> Open source
            </a>
          </li>
        </ul>

        <div className="mt-10">
          <SideLabel>Resources</SideLabel>
          <ul className="space-y-0.5">
            <li><a className={`${rowBase} text-body hover:bg-hover hover:text-foreground`} href={`${REPO_URL}/tree/main/evals`}><FlaskConical className="size-[18px]" /> Evals and results</a></li>
            <li><a className={`${rowBase} text-body hover:bg-hover hover:text-foreground`} href={`${REPO_URL}/blob/main/CHANGELOG.md`}><Tag className="size-[18px]" /> Changelog</a></li>
            <li><a className={`${rowBase} text-body hover:bg-hover hover:text-foreground`} href={`${REPO_URL}/blob/main/CONTRIBUTING.md`}><ScrollText className="size-[18px]" /> Contributing</a></li>
          </ul>
        </div>
      </div>
    </aside>
  );
}

export function Shell({ current, children }: { current?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-frame">
      <div className="mx-auto max-w-[1680px] border-x border-line bg-background">
        <Announcement />
        <Header />
        <div className="flex">
          <Sidebar current={current} />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-8 py-8 text-[15px] text-fg-muted">
          <p>cracked is MIT licensed. Built by <a className="text-foreground hover:underline" href="https://github.com/nishant-Tiwari24">Nishant Tiwari</a>.</p>
          <p className="flex gap-6">
            <a className="hover:text-foreground" href={REPO_URL}>Source</a>
            <a className="hover:text-foreground" href={`${REPO_URL}/releases`}>Releases</a>
            <a className="hover:text-foreground" href={`${REPO_URL}/issues`}>Report an issue</a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export const monoLabel = mono;
