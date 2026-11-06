import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { asset } from "@/lib/site";
import { REPO, formatDate, getSkill, getSkills } from "@/lib/skills";
import { Shell, monoLabel } from "@/components/shell";
import { SkillTile } from "@/components/icons";
import { AuthorRow, ContentWithToc, InstallBlock, MetaLine, PageHeader } from "@/components/page-parts";

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
    ...(skill.demos.length ? [{ id: "see-it-in-action", text: "See it in action" }] : []),
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
      <PageHeader
        meta={<MetaLine index={skill.index} total={skill.total} parts={[skill.group.title, `${skill.minutes} min read`, `Updated ${formatDate(skill.updated)}`]} />}
        icon={<SkillTile name={skill.name} size={44} />}
        title={`/${skill.name}`}
        subtitle={`${skill.tagline}.`}
        actions={<AuthorRow copyText={skill.raw} shareTitle={`The /${skill.name} skill | cracked`} next={next ? { href: `/skills/${next.name}/`, label: `/${next.name}` } : undefined} />}
      />

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
              <p className={`${monoLabel} mb-2.5 text-faint`}>Where this fits</p>
              <p className="flex items-center gap-2 text-[12.5px] font-medium text-foreground">
                <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_#c6ff3d]" /> {skill.group.title}
              </p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-fg-muted">{skill.group.blurb}</p>
            </>
          )
        }
      >
        <div className="prose-ah">
          <h2 id="what-it-does" className="!mt-0">What it does</h2>
          <p>
            <span className="chip">/{skill.name}</span>: {skill.description}
          </p>
          {skill.demos.length > 0 && (
            <>
              <h2 id="see-it-in-action">See it in action</h2>
              {skill.demos.map((d) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={d} src={asset(d)} alt={`Animated example of /${skill.name}`} className="w-full rounded-[14px]" />
              ))}
            </>
          )}
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
