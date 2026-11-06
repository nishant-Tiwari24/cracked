import Link from "next/link";
import { createElement } from "react";
import { ArrowRight } from "lucide-react";
import { GROUPS, REPO, REPO_URL, formatDate, getSkills } from "@/lib/skills";
import { Shell, monoLabel } from "@/components/shell";
import { BrandMark, iconFor } from "@/components/icons";
import { AuthorRow, ContentWithToc, InstallBlock, MetaLine, PageHeader, installAll } from "@/components/page-parts";
import { CompanySearch } from "@/components/company-search";
import { asset } from "@/lib/site";

const scorecard = `cracked · /mock-interview · 2026-11-06
Find a Free Slot (medium)

Verdict: Lean Hire  (7/10)

Problem Solving        ████████░░  8
Correctness & Testing  ██████░░░░  6
Communication          ████████░░  8
Complexity Analysis    ███████░░░  7

Strongest: Asked about touching intervals before coding.
Fix next:  You said "done" before testing. Trace two edge cases out loud first.`;

const evals = [
  ["OA with hidden tests", "0.00"],
  ["Mock interview, no spoilers", "0.25"],
  ["Google questions from real data", "0.33"],
  ["Resume vs job description", "0.40"],
  ["Resume roast, no invented metrics", "0.50"],
  ["Project cross-examination", "0.50"],
  ["SQL executed and graded", "0.80"],
];

export default function Home() {
  const skills = getSkills();
  const byName = Object.fromEntries(skills.map((s) => [s.name, s]));
  const updated = skills.map((s) => s.updated).sort().at(-1)!;
  const toc = [
    { id: "what-it-is", text: "What it is" },
    { id: "see-it", text: "See it in action" },
    { id: "the-skills", text: "The skills" },
    { id: "companies", text: "Company mode" },
    { id: "scorecards", text: "Scorecards and the journal" },
    { id: "tested", text: "Tested like software" },
    { id: "faq", text: "Common questions" },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "cracked",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS, Linux, Windows",
    description: "Agent skills for tech placements and coding interviews.",
    softwareVersion: "1.0.0",
    license: "https://opensource.org/licenses/MIT",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    downloadUrl: REPO_URL,
    author: { "@type": "Person", name: "Nishant Tiwari", url: "https://github.com/nishant-Tiwari24" },
  };

  return (
    <Shell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader
        meta={<MetaLine parts={["v1.0.0", `${skills.length} skills`, "MIT", `Updated ${formatDate(updated)}`]} />}
        icon={<BrandMark size={44} />}
        title="Skills for getting hired"
        subtitle="Agent skills that turn your coding agent into an interviewer, a coach and a career team, for tech placements and coding interviews."
        actions={<AuthorRow copyText={installAll} shareTitle="cracked: skills for getting hired" next={{ href: "/skills/setup-cracked/", label: "Get started" }} />}
      />

      <InstallBlock
        label="Install the skills"
        command={installAll}
        then={<>Then type <span className="chip">/setup-cracked</span> in your coding agent. Claude Code users can also run <span className="chip">claude plugin install cracked@cracked</span> after adding the marketplace.</>}
        source={{ href: REPO_URL, label: REPO }}
      />

      <ContentWithToc
        toc={toc}
        fits={
          <>
            <p className={`${monoLabel} mb-2.5 text-faint`}>Works with</p>
            <ul className="space-y-1.5 text-[12.5px] text-fg-muted">
              {["Claude Code", "Codex", "Cursor", "GitHub Copilot", "Gemini CLI", "OpenCode, Windsurf, Amp"].map((a) => (
                <li key={a} className="flex items-center gap-2"><span className="size-1 rounded-full bg-primary" />{a}</li>
              ))}
            </ul>
          </>
        }
      >
        <div className="prose-ah">
          <h2 id="what-it-is" className="!mt-0">What it is</h2>
          <p>
            Interview prep usually means a list of 450 problems. A list doesn&apos;t interview you, doesn&apos;t tell you why you&apos;d be rejected, and has no idea which company you&apos;re walking into on Monday.
          </p>
          <p>
            <span className="chip">cracked</span> is {skills.length} small, composable skills that do those things. They run your code instead of guessing about it, use the questions your target company actually asks, and never invent a single fact about you. Everything you do is logged to a local journal, so the next session starts from your real weak spots.
          </p>

          <h2 id="see-it">See it in action</h2>
          <p>A real <span className="chip">/mock-interview</span> session, replayed. The interviewer never says where the bug is. It hands back one failing input, then tests the fix against 20,000 random cases.</p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/assets/demo.svg")} alt="A real cracked mock interview replayed in a terminal, ending with a Lean Hire 7/10 scorecard." width={880} height={517} className="mt-4 w-full rounded-[14px]" />
        <div className="prose-ah">
          <h2 id="the-skills">The skills</h2>
          <p>Type a command, or just describe what you want (&quot;roast my resume&quot;) and your agent picks the right skill.</p>
        </div>

        <div className="mt-5 space-y-7">
          {GROUPS.map((g, gi) => (
            <section key={g.id} aria-labelledby={`g-${g.id}`}>
              <div className="mb-1 flex items-baseline gap-2">
                <span className="font-mono text-[11px] text-faint">0{gi + 1}</span>
                <h3 id={`g-${g.id}`} className="text-[15px] font-semibold tracking-[-0.015em]">{g.title}</h3>
              </div>
              <p className="mb-2.5 text-[13px] text-fg-muted">{g.blurb}</p>
              <ul className="overflow-hidden rounded-lg border border-line bg-white/[0.015]">
                {g.skills.filter((n) => byName[n]).map((n) => {
                  const s = byName[n];
                  return (
                    <li key={n} className="border-b border-line last:border-b-0">
                      <Link href={`/skills/${n}/`} className="group flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-white/[0.04]">
                        <span className="grid size-7 shrink-0 place-items-center rounded-md bg-white/[0.04] text-primary ring-1 ring-white/10 transition group-hover:ring-accent-line">
                          {createElement(iconFor(n), { className: "size-3.5" })}
                        </span>
                        <span className="w-[164px] shrink-0 truncate font-mono text-[12.5px] text-foreground">/{n}</span>
                        <span className="min-w-0 flex-1 truncate text-[13px] text-fg-muted">{s.tagline}</span>
                        <ArrowRight className="size-3.5 shrink-0 text-faint opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <div className="prose-ah">
          <h2 id="companies">Company mode</h2>
          <p>
            Name a company anywhere (&quot;Flipkart OA&quot;, &quot;HR round for Amazon&quot;) and every skill adapts: its most frequently reported LeetCode questions, its rounds and OA format, its published values, its resume bar. Here is the live data, the same data <span className="chip">/mock-interview</span> and <span className="chip">/oa-sim</span> use.
          </p>
        </div>
        <div className="mt-4"><CompanySearch /></div>
        <p className="mt-2.5 text-[12px] text-fg-muted">
          Data: <a className="text-primary hover:underline" href="https://github.com/liquidslr/leetcode-company-wise-problems">leetcode-company-wise-problems</a>, community-reported and labelled that way, never &quot;leaked&quot;.
        </p>

        <div className="prose-ah">
          <h2 id="scorecards">Scorecards and the journal</h2>
          <p>Every practice session ends with a scorecard you can paste anywhere. It&apos;s logged to <span className="chip">~/.cracked/journal.md</span> with tagged weak spots, which <span className="chip">/prep-plan</span> and <span className="chip">/rejection-review</span> read to decide what you do next.</p>
          <pre><code>{scorecard}</code></pre>

          <h2 id="tested">Tested like software</h2>
          <p>Twelve realistic requests, run with and without cracked on the same model. Graders check that code really ran, that OA files exist, and that no metric was invented. 12 of 12 pass with cracked.</p>
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-line">
          <table className="w-full text-left text-[13px]">
            <thead className="border-b border-line bg-white/[0.02] font-mono text-[11px] uppercase tracking-[0.06em] text-faint">
              <tr><th className="px-3.5 py-2 font-normal">Case</th><th className="px-3.5 py-2 font-normal">Without</th><th className="px-3.5 py-2 font-normal">With cracked</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {evals.map(([c, w]) => (
                <tr key={c}><td className="px-3.5 py-2 text-body">{c}</td><td className="px-3.5 py-2 font-mono text-faint">{w}</td><td className="px-3.5 py-2 font-mono text-primary">1.00</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="prose-ah">
          <h2 id="faq">Common questions</h2>
          <h3>Is this cheating?</h3>
          <p>No. It&apos;s practice. cracked declines to help during a live assessment and offers a debrief afterwards instead.</p>
          <h3>Does it work outside India?</h3>
          <p>Yes. Interview, resume and design skills are market-neutral. <span className="chip">/offer-decode</span> has detailed India CTC rules and general logic for other countries.</p>
          <h3>Where does my data go?</h3>
          <p>Nowhere. It&apos;s plain Markdown in <span className="chip">~/.cracked/</span> on your machine. No account, no server, no tracking.</p>
          <h3>Which agent should I use?</h3>
          <p>Any agent with shell access gets the full experience, because mock interviews, OAs and SQL questions execute code. Voice mode uses Claude Code&apos;s <span className="chip">/voice</span>.</p>
        </div>
      </ContentWithToc>
    </Shell>
  );
}
