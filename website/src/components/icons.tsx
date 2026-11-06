import { createElement } from "react";
import { asset } from "@/lib/site";
import {
  Brain, Building2, ClipboardCheck, FileSearch, FileText, Flame, FolderGit2, GitBranch,
  Handshake, IdCard, LayoutTemplate, Map as MapIcon, MessagesSquare, Mic, Network, Rocket, Settings2, Swords, Timer, Wallet,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  "setup-cracked": Settings2,
  "cracked-profile": IdCard,
  "company-intel": Building2,
  "mock-interview": Mic,
  "oa-sim": Timer,
  "pattern-coach": Brain,
  "core-viva": MessagesSquare,
  "system-design-mock": Network,
  "hr-round": Handshake,
  "defend-my-project": Swords,
  "roast-my-resume": Flame,
  "resume-blueprint": LayoutTemplate,
  "jd-match": FileSearch,
  "github-glowup": FolderGit2,
  "make-it-hireable": Rocket,
  "referral-dm": FileText,
  "prep-plan": MapIcon,
  "rejection-review": ClipboardCheck,
  "offer-decode": Wallet,
};

export const iconFor = (name: string) => ICONS[name] ?? GitBranch;

/** The cracked logo, unchanged: lime bolt on a dark rounded tile. */
export function BrandMark({ size = 28 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={asset("/assets/icon.png")} alt="" width={size} height={size} style={{ borderRadius: size * 0.22 }} className="shrink-0 ring-1 ring-white/10" />
  );
}

/** Skill icon in the logo's style: dark tile, lime glyph. */
export function SkillTile({ name, size = 48 }: { name: string; size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-grid shrink-0 place-items-center ring-1 ring-white/10"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.24,
        background: "linear-gradient(180deg, #1a1c1f 0%, #0c0c0e 100%)",
        boxShadow: "inset 0 1px 0 #ffffff14, 0 8px 24px -10px #c6ff3d40",
      }}
    >
      {createElement(iconFor(name), { style: { width: size * 0.48, height: size * 0.48 }, strokeWidth: 2.2, color: "#c6ff3d" })}
    </span>
  );
}

export function GitHubMark({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
    </svg>
  );
}
