<h1 align="center">🚀 Open Source Launchpad</h1>

<p align="center">Your first pull request starts here.<br>
Plain HTML and CSS. No build step, no framework, no <code>npm install</code>.</p>

<p align="center">
  <img src="https://img.shields.io/badge/Hacktoberfest-2026-FF8AE2" alt="Hacktoberfest 2026">
  <img src="https://img.shields.io/badge/good%20first%20issues-30-7057FF" alt="30 good first issues">
  <img src="https://img.shields.io/badge/setup-none%20required-1F883D" alt="No setup required">
  <img src="https://img.shields.io/badge/license-MIT-lightgrey" alt="MIT">
</p>

---

## What this is

A small website that teaches people how to make their first open source
contribution — and is itself the project they practise on.

Three pages of content, one contributor wall, and about thirty issues sized for
someone who has never opened a pull request before.

## Run it locally

```bash
git clone https://github.com/github-community-gitam/open-source-launchpad.git
cd open-source-launchpad
python3 -m http.server 8000
```

Open <http://localhost:8000>. That is the entire setup.

> **Why a server instead of double-clicking `index.html`?** Every page works
> either way *except* the contributor wall, which reads a JSON file. Browsers
> block reading local files from a `file://` page for security, so the wall
> would show an error. The one command above avoids that.

Any static server works — `npx serve`, VS Code Live Server, whatever you like.

---

## 🎃 Contributing

**This repository exists so you can make your first pull request.**

### The gentlest possible start: add yourself to the wall

1. Copy `contributors/_TEMPLATE.json` to `contributors/your-username.json`
2. Fill in your name
3. Open a pull request

Ten minutes, and you will have done every step of a real contribution: fork,
clone, branch, commit, push, PR. Full instructions on the
[contributor wall page](wall.html).

### Then pick a real issue

1. Browse [issues labelled `good first issue`](../../issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
2. Comment **`/claim`** — a bot assigns it to you within seconds
3. Read [CONTRIBUTING.md](CONTRIBUTING.md)
4. Open a PR with `Closes #<issue number>`

Every issue names the exact file to open, what "done" looks like, and how to
check your work. If one does not, that is our mistake — tell us.

---

## Project layout

```
open-source-launchpad/
├── index.html            # the landing page
├── git-basics.html       # fork → clone → branch → commit → push → PR
├── pr-checklist.html     # run through this before opening a PR
├── wall.html             # the contributor wall
├── 404.html
├── css/
│   ├── theme.css         # all colours and spacing live here, as variables
│   ├── base.css          # element defaults and resets
│   ├── layout.css        # header, nav, footer, grid, print styles
│   └── components.css    # cards, buttons, callouts, the wall
├── js/
│   ├── theme-toggle.js   # light/dark, remembered per browser
│   ├── copy-code.js      # copy buttons on code blocks
│   └── wall.js           # loads and filters the contributor wall
├── contributors/
│   ├── _TEMPLATE.json    # copy this
│   ├── index.json        # generated — do not edit
│   └── <username>.json   # one file per person
└── scripts/
    └── build_contributors.py   # rebuilds index.json
```

### One file per contributor, on purpose

Each person adds `contributors/<their-handle>.json`. Because nobody shares a
file, **eighty people can add themselves during a two-hour event without a
single merge conflict.** A GitHub Action rebuilds `contributors/index.json`
after each merge.

This is a real technique, not a teaching exercise — the same pattern shows up in
changelog folders and infrastructure configs anywhere a large team edits one
project.

---

## Editing the site

**Changing a colour?** Edit `css/theme.css`. Every colour in the project is a
variable defined there, and there is a dark-theme value right below the light
one. Change both.

**Adding a page?** Copy the `<head>`, header, and footer from an existing page,
add your page to the nav in all five files, and add `aria-current="page"` to its
own nav link.

**Adding a component?** It goes in `css/components.css`, and it uses the
variables from `theme.css` rather than hard-coded colours.

---

## What CI checks

Every pull request runs four checks. All of them tell you how to fix what they
found:

| Check | Looks for |
|---|---|
| **contributor files** | Invalid JSON, a filename that does not match the handle, an over-long quote |
| **HTML** | Unclosed tags, malformed markup |
| **accessibility** | Images with no `alt`, a missing `lang`, `<title>`, or viewport tag |
| **internal links** | An `href` or `src` pointing at a file that does not exist |

Check the first one yourself before pushing:

```bash
python3 scripts/build_contributors.py --check
```

---

## Events

Maintained by **OS & DevX**, GITHUB Community GITAM.

| Date | Event |
|---|---|
| Mon, Oct 5 | Hacktoberfest Kickoff & Live PR Lab |
| Mon, Oct 12 | PR Debug Clinic #1 — bring a broken branch |
| Wed, Oct 21 | PR Debug Clinic #2 |

Also worth a look: **[terminal-arcade](https://github.com/github-community-gitam/terminal-arcade)**,
our Python mini-games project, if you would rather write Python than HTML.

## License

[MIT](LICENSE)
