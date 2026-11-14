# Modern profile README styles

Default to **Style E (neofetch portrait)**. Use one of A–D only when the candidate doesn't want their photo on a public page, or asks for another look. Pick the style that fits their personality and target role, then fill it with **real** content only. All styles render on GitHub with no external services, except for optional, clearly marked widgets.

Before choosing, check the [`examples/`](examples/) folder next to this file: curated real-world READMEs live there as references. Match their quality bar. Never copy someone else's README wholesale; adapt the structure.

## The house layout (default for every glow-up)

Every `github-glowup` README uses this layout unless the user asks for something else. Two code blocks, in this order, nothing else on the page:

````markdown
```yaml
<braille portrait, padded with U+2800 rows>  │ <handle>@github ──────────────────────────────
<portrait row>                               │ . OS: ................................ <os>
<portrait row>                               │ . Uptime: ...... <account age, from gh api>
<portrait row>                               │ . Host: ................ <company / project>
<portrait row>                               │ . Kernel: ............................ <role>
<portrait row>                               │ . Languages.Programming: ........ <top 5>
<portrait row>                               │ . Hackathons: ........... <N wins (tracks)>
<portrait row>                               │ - Contact ────────────────────────────────
<portrait row>                               │ . <site>: ........................ <link>
<portrait row>                               │ - GitHub Stats ───────────────────────────
<portrait row>                               │ . Repos: <n> · Stars: <n> · Followers: <n>
```

```
~/hackathons  (<N> wins)
├── <event>                     <track>  <result> · <prize>
├── <event>                     <track>  <result> · <prize>
└── <event>                     <track>  <result> · <prize>
```
````

- The portrait is Style E below. No photo → a figlet banner of their name in the left column.
- The tree lists **every** win or achievement they have, one line each, columns aligned (pad names so a space always separates the columns). Rename the heading to `~/achievements` if most entries aren't hackathons.
- No projects section, no LeetCode or stat sections, no widgets, badges, tables or link lists: the pinned repos carry the projects.
- Every value is real (their profile, repos, existing README, or what they told you). Lines ≤ 90 columns.
- When the user removes or adds a section, keep the portrait rows intact: change only the right column, and move remaining facts up rather than deleting portrait rows.

## Style A: ASCII terminal (developer-core)

Best for backend, systems and infra people. The ASCII banner is the hero.

Generate the banner; never hand-type block letters:
- `figlet -f "ANSI Shadow" "<name>"` if figlet is installed (also try the `slant`, `standard` and `small` fonts)
- otherwise `npx figlet -f "ANSI Shadow" "<name>"` (ask before running npx)
- otherwise `python3 -c "import pyfiglet; print(pyfiglet.figlet_format('<name>', font='ansi_shadow'))"` if pyfiglet is installed
- if none of these work, use Style C instead. Broken ASCII art is worse than none.

Keep the banner ≤ 80 columns wide (check the longest line) so it doesn't wrap on mobile. Use a short name or handle if needed.

````markdown
```
<figlet output here>
```

```yaml
whoami:   <Name> · <role> · <city/remote>
building: <current project, one line, link>
stack:    [<lang>, <lang>, <db>, <infra>]
learning: <one thing>
contact:  <email> · linkedin.com/in/<x>
```

### ~/projects
```
├── <project-1>   <one-line pitch>  · <stack>  · <metric or "live">
├── <project-2>   <one-line pitch>  · <stack>
└── <project-3>   <one-line pitch>  · <stack>
```
```bash
$ cat now.txt
<what you're working on or looking for: "Open to SDE-1 roles from <month year>">
```
````

## Style B: Clean recruiter-first

Best for most students and freshers. Scannable in 10 seconds.

```markdown
## Hi, I'm <Name> 👋
<Role> · <college / company> · <year>. I build <what you build> with <main stack>.

**Currently:** <building / interning at / looking for>

### Featured projects
| Project | What it does | Stack |
|---|---|---|
| [<name>](<link>) | <one line + one metric> | <stack> |
| [<name>](<link>) | … | … |

### Highlights
- <contest rating / hackathon win / merged OSS PR / internship>
- <…>

**Reach me:** <email> · [LinkedIn](<url>) · [Portfolio](<url>)
```

## Style C: Minimal one-liner + pinned work

Best when the pinned repos are strong. Let them speak.

```markdown
### <Name>: <role> who <one specific thing>.
<One sentence: what you're building now + link.> Reach me at <email>.
```

## Style D: Story-led (startups / product roles)

```markdown
## <Name>
I like shipping things people use. <Project> has <N real users>; <Project 2> <real outcome>.

**What I'm good at:** <3 concrete skills tied to projects>
**What I'm looking for:** <role, stack, remote/city>
**Recently:** <a learning or writing link>
```

## Style E: neofetch portrait (photo → ASCII), the default

The most memorable style: the candidate's photo rendered as braille ASCII on the left, `neofetch`-style facts on the right. See [examples/neofetch-dave1725.md](examples/neofetch-dave1725.md).

Make the portrait from their real photo (ask first, since it's their face on a public page):

1. Get the photo: their GitHub avatar (`curl -sL "https://avatars.githubusercontent.com/u/<id>?s=400" -o photo.jpg`) or a file they give you.
2. Cut out the background for a clean silhouette. On macOS, use the bundled `scripts/cutout.swift` (Apple Vision, on-device): `swift scripts/cutout.swift photo.jpg cut.png`. Elsewhere, skip this step; a plain background works best.
3. **Frame the head first.** If the face is less than about a third of the photo's height (a waist-up or full-body shot), crop to head and shoulders before the cutout, or the portrait won't read as a face: `python3 -c "from PIL import Image; im=Image.open('photo.png'); w,h=im.size; im.crop((int(w*.2),0,int(w*.8),int(h*.65))).save('crop.png')"` (adjust the box to the face), then cut out `crop.png`.
4. Convert: `python3 scripts/image-to-ascii.py cut.png --width 34` (braille, the default) or `--mode ascii`. Use `--invert` for light themes and `--contrast 1.4`–`1.5` (optionally `--threshold 0.45`) if the face is flat. Render two variants and look at both; if neither reads as a face, adjust the crop and rerun before showing it.
5. **Gather real stats** for the facts column (never estimate):
   - Account age ("Uptime"): from `gh api users/<u> --jq .created_at`, as years, months and days.
   - Repos and followers: `gh api users/<u> --jq '.public_repos, .followers'`.
   - Total stars on original repos: `gh api "users/<u>/repos?per_page=100" --paginate --jq '.[] | select(.fork==false) | .stargazers_count' | paste -sd+ - | bc`.
   - Languages: the primary languages of their own repos, top 5.
6. **Assemble**: pad the portrait with blank braille rows (`U+2800`) so it has as many rows as the facts column, give every fact the same width with dot leaders, and keep the whole line ≤ 90 columns. A ```` ```yaml ```` fence (as dave1725 uses) colours the keys on GitHub; ```` ```text ```` keeps it plain. Put the rest of the README (projects, achievements, hackathon tables) below the block.

Layout: one ```` ```text ```` block (keeps alignment), portrait on the left, a `│` gutter, then facts:

````markdown
```text
<portrait line 1>  │ <handle>@github ─────────────────────────────
<portrait line 2>  │ . Host: ..................... <company or college>
<portrait line 3>  │ . Kernel: ..................... <role / year>
<portrait line 4>  │ . Location: ....................... <city>
<portrait line 5>  │ . Languages: ............. <top 3 from their repos>
<portrait line 6>  │ . Projects: ......... <2 real repos, one line each>
<portrait line 7>  │ - Contact ───────────────────────────────────
<portrait line 8>  │ . Website: ......................... <url>
```
````

Rules: every value is real (from their profile, repos, or what they tell you); dot leaders pad each line to the same width; at most ~90 columns total so it doesn't wrap; don't publish an email unless they ask.

## Widgets (optional, use sparingly)

Stat cards (`github-readme-stats`), streak counters, trophy grids and typing SVGs depend on third-party services that rate-limit and break. At most **one** widget. Never stack five stat cards. Recruiters read text, not graphs. Skip widgets entirely for Style A and C.

## Universal rules

- Under ~40 lines of rendered content. Above the fold: who, what, best work, contact.
- Every project mentioned must link to a real repo or live demo.
- No visitor counters, no "my skills" icon walls with 30 logos, no autoplay GIF banners heavier than 1 MB.
- Real facts only. A metric with no source becomes `[N]` and a question for the user.
