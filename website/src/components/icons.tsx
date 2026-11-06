import {
  Brain, Building2, ClipboardCheck, FileSearch, FileText, Flame, FolderGit2, GitBranch,
  Handshake, IdCard, Zap, LayoutTemplate, Map as MapIcon, MessagesSquare, Mic, Network, Rocket, Settings2, Swords, Timer, Wallet,
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

/** The cracked mark in the site palette. */
export function BrandMark({ size = 36 }: { size?: number }) {
  return <SkillTileInner Icon={Zap} size={size} />;
}

/** App-icon style tile: warm gold gradient with a dark glyph. */
export function SkillTile({ name, size = 64 }: { name: string; size?: number }) {
  return <SkillTileInner Icon={iconFor(name)} size={size} />;
}

function SkillTileInner({ Icon, size }: { Icon: LucideIcon; size: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-grid shrink-0 place-items-center"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.24,
        background: "linear-gradient(145deg, #ffe08a 0%, #f5c451 38%, #e08a2c 100%)",
        boxShadow: "inset 0 1px 0 #fff6, inset 0 -2px 6px #0003, 0 6px 18px -6px #f5c45155",
      }}
    >
      <Icon style={{ width: size * 0.5, height: size * 0.5 }} strokeWidth={2.4} color="#191510" />
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
