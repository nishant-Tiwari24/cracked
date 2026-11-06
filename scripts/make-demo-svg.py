#!/usr/bin/env python3
"""Generate animated terminal demos (SVG) for the README and website.

    scripts/make-demo-svg.py                 # write every demo to assets/demos/
    scripts/make-demo-svg.py mock-interview  # just one
    scripts/make-demo-svg.py --static        # also write *-static.svg (all lines visible)

Each demo is a list of (kind, text, hold_seconds). Kinds:
  cmd  typed shell command     you   typed candidate message
  ai   interviewer/agent line  sys   tool/system line (dim)
  ok   success line (green)    warn  warning line (amber)   err  problem line (red)
  card highlighted heading     bar   ("Label", score/10)     note  dim footnote
  row  plain aligned text      blank empty line
Keep demos honest: "example" sessions must follow what the skill actually does.
"""
import html
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "assets", "demos")

W, PAD, LH, FS, CHAR_W = 900, 28, 21, 13.5, 8.1
C = {
    "lime": "#c6ff3d", "fg": "#f4f3f1", "dim": "#6f736c", "muted": "#a7aba3",
    "bg": "#0b0b0b", "green": "#58da98", "amber": "#ffc85c", "red": "#fd736d", "track": "#2a2d30",
}
TYPE_CPS = 40

DEMOS = {
    # Example session: follows /mock-interview's rules (counterexample instead of "wrong",
    # hint ladder, executed tests, follow-up, rubric scorecard).
    "mock-interview": ("cracked · /mock-interview · example session", [
        ("cmd", "claude", 0.3),
        ("you", "mock interview for Amazon, medium DP, Python, 45 min", 0.5),
        ("sys", "✓ profile loaded   ✓ Amazon: reported questions, last 6 months   ⏱ clock started", 0.9),
        ("ai", "Minimum Coins. Given coin values and an amount, return the fewest coins that", 0),
        ("ai", "make the amount, or -1. Example: coins=[1,2,5], amount=11 → 3. What would you clarify?", 1.4),
        ("you", "Unlimited coins of each value? Can amount be 0? I'd go greedy: largest coin first.", 0.5),
        ("ai", "Yes and yes. Before you code it, run greedy on coins=[1,3,4], amount=6.", 1.4),
        ("you", "4+1+1 = 3 coins... but 3+3 = 2. Greedy fails. So dp[a] = min(dp[a-c] + 1) over coins.", 0.5),
        ("ai", "Good. Complexity?", 0.7),
        ("you", "O(amount × coins) time, O(amount) space. Coding it bottom-up.", 0.7),
        ("ok", "▶ 12 edge cases + 20,000 random inputs vs brute force: 0 mismatches", 0.9),
        ("ai", "Follow-up: count the number of ways instead of the fewest coins?", 0.7),
        ("you", "Loop coins outside, amounts inside, so each combination is counted once.", 1.0),
        ("blank", "", 0),
        ("card", "Verdict: Hire  (8/10)                               time 31m · hints 0", 0),
        ("bar", ("Problem Solving", 9), 0),
        ("bar", ("Correctness & Testing", 8), 0),
        ("bar", ("Communication", 8), 0),
        ("bar", ("Complexity Analysis", 9), 0),
        ("note", "Fix next: you proposed greedy without testing it. Try a counterexample first.", 4.5),
    ]),
    # Example session: follows /oa-sim (company-first, files, hidden tests, cutoff verdict).
    "oa-sim": ("cracked · /oa-sim · example session", [
        ("cmd", "claude", 0.3),
        ("you", "OA simulation for Google, 2 coding questions, 70 minutes, C++", 0.5),
        ("sys", "✓ Google brief loaded   ✓ 2 problems picked from reported questions", 0.6),
        ("sys", "✓ hidden tests generated: 14 per problem, expected outputs from an executed reference", 0.6),
        ("ai", "Your test is in ~/.cracked/oa/2026-11-06-1910/  ·  deadline 20:20  ·  say submit when done", 1.6),
        ("you", "submit", 0.6),
        ("sys", "compiling q1.cpp q2.cpp … running hidden tests (2 s limit each)", 0.8),
        ("row", "  Q1  Interval Merge Scheduler      14/14 AC                      100", 0.3),
        ("row", "  Q2  Grid Paths With Obstacles      9/14  (3 WA, 2 TLE)            64", 0.6),
        ("warn", "  Q2: all TLE cases have n = 10^5. Your memo is keyed by a string; use a 2D array.", 0.6),
        ("warn", "  Q2: all WA cases start on an obstacle. Return 0 before the DP.", 0.8),
        ("blank", "", 0),
        ("card", "Cutoff: Borderline  (82/100)                          time 63m of 70m", 0),
        ("bar", ("Correctness", 8), 0),
        ("bar", ("Efficiency", 6), 0),
        ("bar", ("Edge Cases", 6), 0),
        ("bar", ("Time Management", 8), 0),
        ("note", "Fix next: check the largest constraint before coding. It told you O(n²) wouldn't pass.", 4.5),
    ]),
    # Example session on the deliberately weak resume used in the evals.
    "roast-my-resume": ("cracked · /roast-my-resume · example on the eval test resume", [
        ("cmd", "claude", 0.3),
        ("you", "roast my resume ~/Downloads/resume.pdf, I'm targeting SDE-1 at product companies", 0.5),
        ("sys", "Judging as: 2026 CS grad · India · product companies · against top 20% of applicants", 1.0),
        ("card", "ATS score: 68/100", 0),
        ("row", "  parses 25/25 · headings 15/15 · contact 8/10 · dates 10/10 · format 5/15 · keywords 5/25", 1.0),
        ("err", "  \"Responsible for backend of e-commerce website\"", 0.2),
        ("ai", "  → Responsible for what? Say what you built and what changed because of it.", 0),
        ("ok", "  → Built order and payment APIs in Node.js + MongoDB with Razorpay, handling [N] orders/day", 1.3),
        ("err", "  \"Made a Netflix clone using React\"", 0.2),
        ("ai", "  → Every second resume has this. Cut it, or say what you added that Netflix didn't.", 1.2),
        ("err", "  Skills: C, C++, Java, Python, JS … MS Office, Teamwork", 0.2),
        ("ai", "  → 20 skills, zero proof. Keep the 6 you can defend in an interview.", 1.2),
        ("blank", "", 0),
        ("card", "Verdict: Borderline for SDE-1                               0 metrics invented", 0),
        ("row", "  1. add numbers to ShopKart   2. cut the clones   3. lead with LeetCode 250+", 0),
        ("note", "  Placeholders like [N] need your real numbers. I'll ask for each one.", 4.5),
    ]),
    # Example session: follows /github-glowup (audit, secret check, styles, permission).
    "github-glowup": ("cracked · /github-glowup · example session", [
        ("cmd", "claude", 0.3),
        ("you", "glow up my GitHub, I'm applying for backend roles", 0.5),
        ("sys", "✓ read profile, 34 repos, pinned items, READMEs, contribution graph", 1.0),
        ("ai", "In 10 seconds a recruiter sees: no bio, 4 pinned forks, and READMEs with no demo.", 1.2),
        ("err", "  ✗ shopkart/.env is committed and contains RAZORPAY_KEY_SECRET", 0.2),
        ("err", "    Rotate that key now, then purge it from history. This is the #1 fix.", 1.2),
        ("warn", "  ! 4 of 6 pinned repos are forks or tutorial clones", 0.3),
        ("warn", "  ! 0 of 6 pinned repos have a screenshot or live link", 1.0),
        ("ai", "Drafted: a new bio, a pin plan, README rewrites for shopkart and ratelimiter-go,", 0),
        ("ai", "and a profile README in your choice of 4 styles:", 0.6),
        ("ok", "  A · ASCII terminal   B · recruiter-first   C · minimal   D · story-led", 1.2),
        ("you", "use style A and apply the bio", 0.6),
        ("sys", "✓ bio updated   ✓ profile README pushed to rahulv-dev/rahulv-dev", 0.8),
        ("blank", "", 0),
        ("card", "GitHub: 4/10 → 8/10", 0),
        ("bar", ("First Impression", 8), 0),
        ("bar", ("Pinned Work", 7), 0),
        ("bar", ("Hygiene & Security", 9), 0),
        ("note", "Pinning has no API. Next: Profile → Customize your pins → shopkart, ratelimiter-go.", 4.5),
    ]),
    # Real output from skills/core/company-intel/scripts/questions.py (Nov 2026 data).
    "company-intel": ("cracked · /company-intel · real data", [
        ("cmd", "claude", 0.3),
        ("you", "what is Amazon asking right now?", 0.5),
        ("sys", "$ questions.py topics Amazon --window 3m", 0.4),
        ("row", "  Amazon · last 3 months · 443 questions · Medium 249 · Easy 128 · Hard 66", 0.3),
        ("row", "  Top topics: Array 247 · String 99 · Hash Table 95 · Sorting 75", 1.0),
        ("sys", "$ questions.py get Amazon --window 30d --difficulty medium,hard --limit 5", 0.4),
        ("row", "   1  Medium  Maximum Coins From K Consecutive Bags            freq 100", 0.15),
        ("row", "   2  Medium  Longest Substring Without Repeating Characters   freq  90", 0.15),
        ("row", "   3  Hard    Trapping Rain Water                              freq  79", 0.15),
        ("row", "   4  Medium  Number of Islands                                freq  79", 0.15),
        ("row", "   5  Medium  Lowest Common Ancestor of a Binary Tree          freq  76", 1.0),
        ("note", "  source: community-reported (leetcode-company-wise-problems), never \"leaked\"", 0.8),
        ("blank", "", 0),
        ("ai", "Brief saved to ~/.cracked/companies/amazon.md. Every skill now uses it.", 0.6),
        ("ok", "  try: mock interview for Amazon · /oa-sim Amazon · /hr-round Amazon", 4.5),
    ]),
}


def build(name, title, script, static=False):
    times, t = [], 0.6
    for kind, text, hold in script:
        dur = (len(text) / TYPE_CPS) if kind in ("cmd", "you") else 0.12
        times.append((t, dur))
        t += dur + hold
    total = t + 1.0
    H = 56 + PAD + LH * len(script) + 30
    el, css = [], []

    def kf(i, start, dur, frm, to, prop):
        a = start / total * 100
        b = (start + max(dur, 0.01)) / total * 100
        css.append(f"@keyframes k{i}{{0%,{a:.3f}%{{{prop}:{frm}}}{b:.3f}%,97%{{{prop}:{to}}}100%{{{prop}:{frm}}}}}")

    y = 56 + PAD
    prev_kind = None
    for i, ((kind, text, _), (start, dur)) in enumerate(zip(script, times)):
        if kind == "blank":
            y += LH
            prev_kind = kind
            continue
        if kind in ("cmd", "you"):
            assert len(text) <= 98, f"{name}: line too long ({len(text)}): {text}"
            prompt = "$ " if kind == "cmd" else "› "
            col = C["fg"] if kind == "cmd" else C["lime"]
            body = f'<tspan fill="{C["lime"]}">{prompt}</tspan><tspan fill="{col}">{html.escape(text)}</tspan>'
            w = CHAR_W * (len(text) + 2) + 6
            el.append(f'<clipPath id="c{i}"><rect class="w{i}" x="{PAD}" y="{y - 15}" height="{LH}" width="{w if static else 0:.0f}"/></clipPath>')
            el.append(f'<text x="{PAD}" y="{y}" clip-path="url(#c{i})">{body}</text>')
            if not static:
                kf(i, start, dur, "0", f"{w:.0f}px", "width")
                css.append(f".w{i}{{animation:k{i} {total:.2f}s linear infinite}}")
        else:
            if kind == "bar":
                label, n = text
                body = (f'<tspan fill="{C["fg"]}">{html.escape(label.ljust(24))}</tspan>'
                        f'<tspan fill="{C["lime"]}">{"█" * n}</tspan><tspan fill="{C["track"]}">{"█" * (10 - n)}</tspan>'
                        f'<tspan fill="{C["fg"]}">  {n}</tspan>')
            else:
                assert len(text) <= 100, f"{name}: line too long ({len(text)}): {text}"
                t_ = html.escape(text)
                if kind == "ai":
                    lead = "cracked  " if prev_kind != "ai" else "         "
                    if text.startswith("  "):
                        lead = ""
                    body = f'<tspan fill="{C["dim"]}">{lead}</tspan><tspan fill="{C["fg"]}">{t_}</tspan>'
                else:
                    color = {"sys": C["muted"], "ok": C["green"], "warn": C["amber"], "err": C["red"],
                             "card": C["lime"], "note": C["muted"], "row": C["fg"]}[kind]
                    weight = ' font-weight="700"' if kind == "card" else ""
                    body = f'<tspan fill="{color}"{weight}>{t_}</tspan>'
            el.append(f'<text class="l{i}" x="{PAD}" y="{y}">{body}</text>')
            if not static:
                kf(i, start, 0.15, "0", "1", "opacity")
                css.append(f".l{i}{{opacity:0;animation:k{i} {total:.2f}s ease-out infinite}}")
        y += LH
        prev_kind = kind

    label = html.escape(title)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-label="{label}">
<title>{label}</title>
<style>
text{{font-family:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;font-size:{FS}px;white-space:pre}}
{"".join(css)}
@media (prefers-reduced-motion:reduce){{*{{animation:none!important;opacity:1!important}}clipPath rect{{width:{W}px}}}}
</style>
<rect width="{W}" height="{H}" rx="14" fill="{C["bg"]}"/>
<rect x="0.5" y="0.5" width="{W - 1}" height="{H - 1}" rx="13.5" fill="none" stroke="#ffffff1f"/>
<path d="M0.5 44.5H{W - 0.5}" stroke="#ffffff14"/>
<circle cx="26" cy="22" r="6" fill="#ff5f57"/><circle cx="46" cy="22" r="6" fill="#febc2e"/><circle cx="66" cy="22" r="6" fill="#28c840"/>
<text x="{W / 2}" y="27" text-anchor="middle" fill="{C["dim"]}" style="font-size:12px">{label}</text>
{chr(10).join(el)}
</svg>'''
    return svg, total, H


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    static = "--static" in sys.argv
    os.makedirs(OUT_DIR, exist_ok=True)
    for name in args or DEMOS:
        title, script = DEMOS[name]
        svg, total, h = build(name, title, script)
        path = os.path.join(OUT_DIR, f"{name}.svg")
        open(path, "w").write(svg)
        print(f"{os.path.relpath(path, ROOT)}  {len(svg) // 1024} KB  loop {total:.1f}s  {W}x{h}")
        if static:
            s, _, _ = build(name, title, script, static=True)
            open(os.path.join(OUT_DIR, f"{name}-static.svg"), "w").write(s)


if __name__ == "__main__":
    main()
