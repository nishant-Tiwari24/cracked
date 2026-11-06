#!/usr/bin/env python3
"""Generate an animated terminal SVG of a real cracked mock interview (abridged).
Usage: scripts/make-demo-svg.py assets/demo.svg [--static]
Edit `script` below to change the replay; keep it to real session output."""
import sys, html

OUT = sys.argv[1]; STATIC = "--static" in sys.argv
W, PAD, LH, FS = 880, 28, 21, 13.5
LIME, FG, DIM, MUTED, BG = "#c6ff3d", "#f4f3f1", "#6f736c", "#a7aba3", "#0b0b0b"

# (kind, text, seconds-on-screen-before-next). kinds: cmd (typed), you (typed), ai, sys, blank, card
script = [
    ("cmd", "claude", 0.4),
    ("you", "mock interview for Google, medium, Python", 0.6),
    ("sys", "✓ profile loaded   ✓ Google: 6-month reported questions fetched", 0.9),
    ("ai",  "Find a Free Slot. Given busy meetings, working hours and a", 0),
    ("ai",  "duration, return the earliest start time, or -1.", 0),
    ("ai",  "What would you like to clarify before your approach?", 1.6),
    ("you", "Can intervals overlap or touch? Is busy sorted? Plan: sort, walk the gaps.", 0.6),
    ("ai",  "Both happen; it isn't sorted. Approach is fine. Code it.", 1.3),
    ("you", "Done. One pass, returns -1 if no gap fits.", 0.6),
    ("ai",  "Before I comment, trace it on busy=[[9,10]], hours 9–17, duration 1.", 1.6),
    ("you", "...returns -1, but 10–17 is free. Missed the gap after the last meeting. Fixed.", 0.6),
    ("sys", "▶ ran 9 edge cases + 20,000 randomised inputs vs brute force: 0 mismatches", 1.1),
    ("blank", "", 0),
    ("card", "Verdict: Lean Hire  (7/10)", 0),
    ("bar", ("Problem Solving", 8), 0),
    ("bar", ("Correctness & Testing", 6), 0),
    ("bar", ("Communication", 8), 0),
    ("bar", ("Complexity Analysis", 7), 0),
    ("card2", "Fix next: you said \"done\" before testing. Trace two edge cases out loud.", 4.5),
]

TYPE_CPS = 38  # typing speed, chars/sec
times, t = [], 0.6
for kind, text, hold in script:
    dur = (len(text) / TYPE_CPS) if kind in ("cmd", "you") else 0.12
    times.append((t, dur))
    t += dur + hold
TOTAL = t + 1.0  # loop length

H = 56 + PAD + LH * len(script) + 34
el, css = [], []

def kf(name, start, dur, prop_from, prop_to, prop):
    a = start / TOTAL * 100; b = (start + max(dur, 0.01)) / TOTAL * 100
    css.append(f"@keyframes {name}{{0%,{a:.3f}%{{{prop}:{prop_from}}}{b:.3f}%,97%{{{prop}:{prop_to}}}100%{{{prop}:{prop_from}}}}}")

y = 56 + PAD
for i, ((kind, text, _), (start, dur)) in enumerate(zip(script, times)):
    cls = f"l{i}"
    if kind == "blank":
        y += LH; continue
    if kind in ("cmd", "you"):
        prompt = "$ " if kind == "cmd" else "› "
        body = f'<tspan fill="{LIME}">{prompt}</tspan><tspan fill="{FG if kind=="cmd" else LIME}">{html.escape(text)}</tspan>'
        w = 8.1 * (len(text) + 2) + 4
        el.append(f'<clipPath id="c{i}"><rect class="{cls}w" x="{PAD}" y="{y-15}" height="{LH}" width="{0 if not STATIC else w}"/></clipPath>')
        el.append(f'<text x="{PAD}" y="{y}" clip-path="url(#c{i})">{body}</text>')
        if not STATIC: kf(f"k{i}", start, dur, "0", f"{w:.0f}px", "width"); css.append(f".{cls}w{{animation:k{i} {TOTAL:.2f}s linear infinite}}")
    else:
        if kind == "ai":
            body = f'<tspan fill="{DIM}">cracked  </tspan><tspan fill="{FG}">{html.escape(text)}</tspan>' if (i == 0 or script[i-1][0] != "ai") else f'<tspan fill="{DIM}">         </tspan><tspan fill="{FG}">{html.escape(text)}</tspan>'
        elif kind == "sys":
            body = f'<tspan fill="{MUTED}">{html.escape(text)}</tspan>'
        elif kind == "card":
            body = f'<tspan fill="{LIME}" font-weight="700">{html.escape(text)}</tspan>'
        elif kind == "card2":
            body = f'<tspan fill="{MUTED}">{html.escape(text)}</tspan>'
        elif kind == "bar":
            name, n = text
            body = f'<tspan fill="{FG}">{html.escape(name.ljust(23))}</tspan><tspan fill="{LIME}">{"█"*n}</tspan><tspan fill="#2a2d30">{"█"*(10-n)}</tspan><tspan fill="{FG}">  {n}</tspan>'
        el.append(f'<text class="{cls}" x="{PAD}" y="{y}">{body}</text>')
        if not STATIC: kf(f"k{i}", start, 0.15, "0", "1", "opacity"); css.append(f".{cls}{{opacity:0;animation:k{i} {TOTAL:.2f}s ease-out infinite}}")
    y += LH

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-label="A cracked mock interview in the terminal: the interviewer asks a Google problem, hands back a failing input instead of the answer, runs 20,000 randomised tests, and ends with a Lean Hire 7/10 scorecard.">
<title>cracked: a real mock interview, replayed</title>
<style>
text{{font-family:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;font-size:{FS}px;white-space:pre}}
{"".join(css)}
@media (prefers-reduced-motion:reduce){{*{{animation:none!important;opacity:1!important}}rect[class$="w"]{{width:880px}}}}
</style>
<rect width="{W}" height="{H}" rx="14" fill="{BG}"/>
<rect x="0.5" y="0.5" width="{W-1}" height="{H-1}" rx="13.5" fill="none" stroke="#ffffff1f"/>
<path d="M0.5 44.5H{W-0.5}" stroke="#ffffff14"/>
<circle cx="26" cy="22" r="6" fill="#ff5f57"/><circle cx="46" cy="22" r="6" fill="#febc2e"/><circle cx="66" cy="22" r="6" fill="#28c840"/>
<text x="{W/2}" y="27" text-anchor="middle" fill="{DIM}" style="font-size:12px">cracked · /mock-interview</text>
{chr(10).join(el)}
</svg>'''
open(OUT, "w").write(svg)
print(f"{OUT}: {len(svg)//1024} KB, loop {TOTAL:.1f}s, {W}x{H}")
