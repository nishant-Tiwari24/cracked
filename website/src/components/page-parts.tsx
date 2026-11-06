import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { REPO, REPO_URL } from "@/lib/skills";
import { CopyIconButton, CopyPageButton, ShareButton, Toc } from "./client";
import { monoLabel } from "./shell";

export function MetaLine({ index, total, parts }: { index?: number; total?: number; parts: string[] }) {
  return (
    <div className={`${monoLabel} flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] text-fg-muted`}>
      {index !== undefined && total !== undefined && (
        <span className="rounded-[6px] border border-line-strong px-2 py-0.5 text-foreground tabular-nums">
          {String(index).padStart(2, "0")} / {total}
        </span>
      )}
      {parts.map((p, i) => (
        <span key={p} className="flex items-center gap-3">
          {i > 0 && <span aria-hidden="true" className="text-faint">·</span>}
          {p}
        </span>
      ))}
    </div>
  );
}

export function AuthorRow({ copyText, shareTitle, next }: { copyText: string; shareTitle: string; next?: { href: string; label?: string } }) {
  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <a href="https://github.com/nishant-Tiwari24" className="flex items-center gap-3 text-[17px] text-foreground">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://github.com/nishant-Tiwari24.png?size=80" alt="" width={40} height={40} className="rounded-full border border-line-strong" />
          Nishant Tiwari
        </a>
        <a
          href={REPO_URL}
          className="inline-flex h-10 items-center rounded-[9px] border border-line-strong px-4 text-[15px] font-medium text-foreground transition hover:bg-hover"
        >
          Star
        </a>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <CopyPageButton text={copyText} />
        <ShareButton title={shareTitle} />
        {next && (
          <Link
            href={next.href}
            className="inline-flex h-10 items-center gap-2 rounded-[9px] border border-line-strong px-4 text-[15px] font-medium text-foreground transition hover:bg-hover"
          >
            {next.label ?? "Next page"} <ArrowRight className="size-4" />
          </Link>
        )}
      </div>
    </div>
  );
}

export function InstallBlock({ label = "Install this skill", command, then, source }: { label?: string; command: string; then: React.ReactNode; source: { href: string; label: string } }) {
  return (
    <section className="border-b border-line px-6 py-12 md:px-14">
      <p className={`${monoLabel} mb-4 text-[14px] text-body`}>{label}</p>
      <div className="flex items-center gap-3 rounded-[9px] border border-line bg-card py-3 pl-5 pr-3">
        <span className="font-mono text-[15px] text-faint">$</span>
        <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[15px] text-foreground">{command}</code>
        <CopyIconButton text={command} />
      </div>
      <p className="mt-5 text-[17px] text-fg-muted">{then}</p>
      <div className="mt-8 border-t border-line pt-8">
        <p className={`${monoLabel} mb-2 text-[14px] text-body`}>Source</p>
        <a href={source.href} className="text-[17px] text-gold hover:underline">{source.label}</a>
      </div>
    </section>
  );
}

export function ContentWithToc({
  toc,
  fits,
  children,
}: {
  toc: { id: string; text: string }[];
  fits?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 px-6 py-14 md:px-14">
        <div className="max-w-[760px]">{children}</div>
      </article>
      <aside className="hidden w-[300px] shrink-0 border-l border-line xl:block">
        <div className="sticky top-[86px] px-7 py-10">
          <p className={`${monoLabel} mb-4 text-[14px] text-body`}>On this page</p>
          <Toc items={toc} />
          {fits && <div className="mt-8 border-t border-line pt-8">{fits}</div>}
        </div>
      </aside>
    </div>
  );
}

export const installAll = `npx skills@latest add ${REPO}`;
