import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { REPO, REPO_URL } from "@/lib/skills";
import { CopyIconButton, CopyPageButton, ShareButton, Toc } from "./client";
import { btn, monoLabel } from "./shell";

export function MetaLine({ index, total, parts }: { index?: number; total?: number; parts: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 font-mono text-[12px] text-fg-muted">
      {index !== undefined && total !== undefined && (
        <span className="rounded border border-line-strong bg-white/[0.03] px-1.5 py-px text-foreground tabular-nums">
          {String(index).padStart(2, "0")}/{total}
        </span>
      )}
      {parts.map((p, i) => (
        <span key={p} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden="true" className="text-faint">/</span>}
          {p}
        </span>
      ))}
    </div>
  );
}

export function PageHeader({ meta, icon, title, subtitle, actions }: {
  meta: React.ReactNode;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  actions: React.ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-line px-5 pb-8 pt-10 md:px-10">
      {/* soft brand glow behind the title */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-32 size-[420px] rounded-full bg-[radial-gradient(closest-side,#c6ff3d14,transparent)]" />
      <div className="relative">
        {meta}
        <h1 className="mt-4 flex items-center gap-3.5 font-display text-[clamp(1.4rem,1rem+1.4vw,2.1rem)] font-semibold leading-[1.15] tracking-[-0.06em]">
          {icon}
          <span>{title}</span>
        </h1>
        <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-fg-muted">{subtitle}</p>
        {actions}
      </div>
    </header>
  );
}

export function AuthorRow({ copyText, shareTitle, next }: { copyText: string; shareTitle: string; next?: { href: string; label?: string } }) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <a href="https://github.com/nishant-Tiwari24" className="flex items-center gap-2 text-[13px] font-medium text-foreground">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://github.com/nishant-Tiwari24.png?size=64" alt="" width={24} height={24} className="rounded-full ring-1 ring-white/15" />
          Nishant Tiwari
        </a>
        <span className="h-4 w-px bg-line-strong" aria-hidden="true" />
        <a href={REPO_URL} className={`${btn.base} ${btn.ghost} h-7 px-2`}>
          <Star className="size-3.5" /> Star
        </a>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <CopyPageButton text={copyText} />
        <ShareButton title={shareTitle} />
        {next && (
          <Link href={next.href} className={`${btn.base} ${btn.secondary}`}>
            {next.label ?? "Next"} <ArrowRight className="size-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}

export function InstallBlock({ label = "Install this skill", command, then, source }: { label?: string; command: string; then: React.ReactNode; source: { href: string; label: string } }) {
  return (
    <section className="border-b border-line px-5 py-7 md:px-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className={`${monoLabel} text-fg-muted`}>{label}</p>
        <a href={source.href} className="font-mono text-[12px] text-fg-muted hover:text-primary">
          {source.label}
        </a>
      </div>
      <div className="group mt-2.5 flex items-center gap-2.5 rounded-lg border border-line-strong bg-card py-1.5 pl-3.5 pr-1.5 transition-colors hover:border-accent-line">
        <span className="font-mono text-[13px] text-primary">$</span>
        <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[13px] text-foreground">{command}</code>
        <CopyIconButton text={command} />
      </div>
      <p className="mt-2.5 text-[13px] text-fg-muted">{then}</p>
    </section>
  );
}

export function ContentWithToc({ toc, fits, children }: { toc: { id: string; text: string }[]; fits?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 px-5 py-9 md:px-10">
        <div className="max-w-[720px]">{children}</div>
      </article>
      <aside className="hidden w-[232px] shrink-0 border-l border-line xl:block">
        <div className="sticky top-14 px-5 py-9">
          <p className={`${monoLabel} mb-2.5 text-faint`}>On this page</p>
          <Toc items={toc} />
          {fits && <div className="mt-6 border-t border-line pt-5">{fits}</div>}
        </div>
      </aside>
    </div>
  );
}

export const installAll = `npx skills@latest add ${REPO}`;
