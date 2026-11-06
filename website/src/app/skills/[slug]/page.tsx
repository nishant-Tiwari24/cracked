import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { REPO, formatDate, getSkill, getSkills } from "@/lib/skills";
import { Shell, monoLabel } from "@/components/shell";
import { SkillTile } from "@/components/icons";
import { AuthorRow, ContentWithToc, InstallBlock, MetaLine } from "@/components/page-parts";

export function generateStaticParams() {
  return getSkills().map((s) => ({ slug: s.name }));
}

export async function generateMetadata({ params }: PageProps<"/skills/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = getSkill(slug);
  if (!s) return {};
  const title = `The /${s.name} skill`;
  return {
    title,
    description: `${s.tagline}. ${s.description}`.slice(0, 300),
    alternates: { canonical: `skills/${s.name}/` },
    openGraph: { title: `${title} | cracked`, description: s.tagline, url: `skills/${s.name}/` },
  };
}

export default async function SkillPage({ params }: PageProps<"/skills/[slug]">) {
  const { slug } = await params;
  const skill = getSkill(slug);
  if (!skill) notFound();
  const all = getSkills();
  const next = all[skill.index] ?? null;
  const siblings = skill.group.skills.filter((n) => n !== skill.name && all.some((s) => s.name === n));
  const groupNo = all.indexOf(skill) >= 0 ? skill.group : null;

  const toc = [
    { id: "what-it-does", text: "What it does" },
    ...(skill.whenToUse ? [{ id: "when-to-reach-for-it", text: "When to reach for it" }] : []),
    { id: "the-skill-in-full", text: "The skill, in full" },
    ...skill.headings,
    { id: "install-the-skill", text: "Install the skill" },
    ...(siblings.length ? [{ id: "related-skills", text: "Related skills" }] : []),
  ];

  const command = `npx skills@latest add ${REPO} --skill=${skill.name}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `The /${skill.name} skill`,
    description: skill.tagline,
    dateModified: skill.updated,
    author: { "@type": "Person", name: "Nishant Tiwari", url: "https://github.com/nishant-Tiwari24" },
  };

  return (
    <Shell current={skill.name}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="border-b border-line px-6 pb-16 pt-16 md:px-14">
        <MetaLine
          index={skill.index}
          total={skill.total}
          parts={["cracked skills", `${skill.minutes} min read`, `Updated ${formatDate(skill.updated)}`]}
        />
        <h1 className="mt-6 flex items-center gap-6 text-[clamp(2.2rem,1.4rem+2.6vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
          <SkillTile name={skill.name} size={66} />
          <span>The /{skill.name} Skill</span>
        </h1>
        <p className="mt-6 max-w-[60ch] text-[clamp(1.15rem,1rem+0.5vw,1.5rem)] text-fg-muted">{skill.tagline}.</p>
        <AuthorRow
          copyText={skill.raw}
          shareTitle={`The /${skill.name} skill | cracked`}
          next={next ? { href: `/skills/${next.name}/` } : undefined}
        />
      </header>

      <InstallBlock
        command={command}
        then={
          <>
            Then {skill.userInvoked ? "type" : "type or just describe it to"} <span className="chip">/{skill.name}</span> in your coding agent.
          </>
        }
        source={{ href: skill.sourceUrl, label: `${REPO}/skills/${skill.bucket}/${skill.name}` }}
      />

      <ContentWithToc
        toc={toc}
        fits={
          groupNo && (
            <>
              <p className={`${monoLabel} mb-4 text-[14px] text-body`}>Where this fits</p>
              <p className={`${monoLabel} flex items-center gap-2 text-[14px] text-gold`}>
                <span className="size-2 rounded-full bg-gold" /> {skill.group.title}
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-fg-muted">{skill.group.blurb}</p>
            </>
          )
        }
      >
        <div className="prose-ah">
          <h2 id="what-it-does" className="!mt-0">What it does</h2>
          <p>
            <span className="chip">/{skill.name}</span>: {skill.description}
          </p>
          {skill.whenToUse && (
            <>
              <h2 id="when-to-reach-for-it">When to reach for it</h2>
              <p>{skill.whenToUse}</p>
            </>
          )}
          <h2 id="the-skill-in-full">The skill, in full</h2>
          <p>This is the exact <span className="chip">SKILL.md</span> your agent follows. It&apos;s plain Markdown, so you can read it, fork it and make it yours.</p>
          <div dangerouslySetInnerHTML={{ __html: skill.html }} />
          <h2 id="install-the-skill">Install the skill</h2>
          <p>Install it on its own, or install the whole pack (recommended, because skills share the profile and journal):</p>
          <pre><code>{`${command}\n\n# or everything:\nclaude plugin marketplace add ${REPO}\nclaude plugin install cracked@cracked`}</code></pre>
          {siblings.length > 0 && (
            <>
              <h2 id="related-skills">Related skills</h2>
              <ul>
                {siblings.map((n) => {
                  const s = all.find((x) => x.name === n)!;
                  return (
                    <li key={n}>
                      <Link href={`/skills/${n}/`}>/{n}</Link>: {s.tagline}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </ContentWithToc>
    </Shell>
  );
}
