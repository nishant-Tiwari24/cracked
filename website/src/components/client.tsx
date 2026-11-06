"use client";

import { useEffect, useState } from "react";
import { Check, ClipboardCopy, Copy, Share2 } from "lucide-react";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Square icon button used inside the install box. */
export function CopyIconButton({ text, label = "Copy command" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label={done ? "Copied" : label}
      onClick={async () => {
        if (await copyText(text)) {
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        }
      }}
      className="grid size-9 shrink-0 place-items-center rounded-md border border-line-strong bg-hover text-body transition hover:text-foreground"
    >
      {done ? <Check className="size-4 text-yes" /> : <Copy className="size-4" />}
    </button>
  );
}

const pill =
  "inline-flex h-10 items-center gap-2 rounded-[9px] border border-line-strong px-4 text-[15px] font-medium text-foreground transition hover:bg-hover";

/** "Copy page": copies the skill's raw SKILL.md so it can be pasted into any agent. */
export function CopyPageButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={pill}
      onClick={async () => {
        if (await copyText(text)) {
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        }
      }}
    >
      {done ? <Check className="size-4 text-yes" /> : <ClipboardCopy className="size-4" />}
      {done ? "Copied" : "Copy page"}
    </button>
  );
}

export function ShareButton({ title }: { title: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={pill}
      onClick={async () => {
        const url = window.location.href;
        if (navigator.share) {
          try {
            await navigator.share({ title, url });
            return;
          } catch {
            /* fall through to copy */
          }
        }
        if (await copyText(url)) {
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        }
      }}
    >
      {done ? <Check className="size-4 text-yes" /> : <Share2 className="size-4" />}
      {done ? "Link copied" : "Share"}
    </button>
  );
}

/** Live GitHub star count; hidden until the API answers (private repos return 404). */
export function StarCount() {
  const [stars, setStars] = useState<number | null>(null);
  useEffect(() => {
    fetch("https://api.github.com/repos/nishant-Tiwari24/cracked")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => typeof d?.stargazers_count === "number" && setStars(d.stargazers_count))
      .catch(() => {});
  }, []);
  if (stars === null) return null;
  return (
    <span className="tabular-nums opacity-80">
      {Intl.NumberFormat("en", { notation: "compact" }).format(stars)}
    </span>
  );
}

/** Highlights the "On this page" entry for the section in view. */
export function Toc({ items }: { items: { id: string; text: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-90px 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);
  return (
    <ul className="border-l border-line">
      {items.map((i) => (
        <li key={i.id}>
          <a
            href={`#${i.id}`}
            className={`-ml-px block border-l py-[7px] pl-4 text-[15px] transition ${
              active === i.id ? "border-gold text-foreground" : "border-transparent text-fg-muted hover:text-foreground"
            }`}
          >
            {i.text}
          </a>
        </li>
      ))}
    </ul>
  );
}
