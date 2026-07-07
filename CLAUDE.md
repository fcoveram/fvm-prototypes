# Prototypes — playbook (for AI assistants)

This folder (`~/Code/Prototypes/`) **is a monorepo**: one Git repo
(`fcoveram/fvm-prototypes`), one Vercel project, serving every prototype at
**`https://prototypes.fvm.house/<name>/`**. Each prototype is a self-contained
Vite + React app in its own subfolder.

## What these prototypes are for (read before building)
These three principles define every prototype here — hold to them when creating a new one:

1. **Purpose: experiment with or improve WordPress.** Every prototype explores an idea for
   **WordPress itself — either Core WordPress or Gutenberg.** If it isn't about improving one
   of those, it doesn't belong here.
2. **Build with the WordPress system, not around it.** Reuse as much of the real WordPress
   platform as possible so the prototype looks and behaves like WordPress. In practice that is
   mostly the **WordPress Design System** — build the UI from `@wordpress/components` and its
   design tokens, and **avoid custom UI styling** or bespoke components where a WordPress one
   exists.

   > **CRITICAL — the `wordpress-design-system` MCP is your entry point to the Design System.**
   > Any time this work touches the WordPress Design System or the components that live in it,
   > you **must** go through the `wordpress-design-system` MCP first. It is the single
   > authoritative source for understanding the Design System and how to use it correctly:
   > `get_components` to map a request to canonical component names, `get_component_details`
   > for props/usage, and `get_design_tokens` for the `--wpds-*` tokens. **Never rely on
   > memory or guesswork** about which components or tokens exist — query the MCP and treat its
   > output as the source of truth. Skipping this step means the prototype will not read as
   > real WordPress, so it is not optional.

   **The `wordpress-design-system` MCP vs. the `wpds` skill — don't conflate them.** They
   answer *different* questions and are both used, so they never contradict:
   - **`wordpress-design-system` MCP = the data source (the "what").** It returns authoritative
     facts about what actually exists in the Design System — canonical component names, props,
     usage notes, and `--wpds-*` tokens — via `get_components`, `get_component_details`, and
     `get_design_tokens`. It holds no opinion about how you build; it just returns ground truth.
   - **`wpds` skill = the working method (the "how").** It governs *how* to build WPDS UI —
     when to engage, the rules (use the MCP for docs, don't web-search for WPDS facts, read
     reference docs first), the default stack, boundaries, and expected output. It does **not**
     contain the component/token data itself; its own first rule is to call into the MCP for it.
   - **Precedence, so they never conflict:** for *what exists and its exact API*, the MCP is the
     single source of truth. For *how to build and behave*, follow the `wpds` skill. Never treat
     the skill as a substitute for querying the MCP, and never treat the MCP as a substitute for
     the skill's build rules — you use the skill's method **and** the MCP's facts together.
3. **These are ideas to discuss, not shippable code.** A prototype is **not meant to be
   implemented into WordPress as-is.** It exists to make a product/UX idea tangible so it can
   be discussed and iterated on with contributors. Optimize for communicating the idea, not
   for production-readiness.

## Working on a prototype — local-first (read this first)
**Default to local-only. Never deploy without the user's explicit request.** Vercel
auto-deploys on every push to `main`, so any commit pushed to the repo is a public deploy —
treat *pushing* as *publishing*.

- Build and iterate **only on the user's machine**: edit files, run `npm run dev` /
  `npm run build`, verify locally. Do **not** commit, push, open PRs, or merge while
  iterating.
- **Do not ask whether to deploy.** When a round of changes is done, keep everything local
  and stay quiet about publishing — no prompts, no "want me to deploy?" suggestions. Just
  report what changed and keep working locally.
- **Wait for the user to explicitly ask to go public** (e.g. "deploy this", "make it
  public", "ship it", "go public"). Only that request triggers the *Deploy* workflow below;
  until then, everything stays local and the public version is untouched.

## Hosting model
- Prototypes are hosted on **Vercel** (one project for the whole monorepo).
  **Nothing is stored on the WordPress/Pressable site.**
- `prototypes.fvm.house` is a **subdomain pointed at Vercel** via a DNS CNAME
  (routing only — no files on Pressable).
- Vercel runs `build.sh`, which builds each prototype into `dist/<name>/` and
  serves `dist/`, so each prototype lives at `prototypes.fvm.house/<name>/`.
- **Auto-deploys on push to `main`** (so pushing = publishing — only push once the user
  approves; see *Working on a prototype*); pull requests get Vercel preview URLs.
- No deploy workflow, no SSH keys, no rsync — Vercel handles deployment.

## Add a new prototype
1. Create `~/Code/Prototypes/<name>/` containing a self-contained Vite + React app.
2. Set **`base: './'`** in its `vite.config.js` (relative asset paths so it works
   under the `/<name>/` subpath).
3. Add an **`.npmrc`** with `legacy-peer-deps=true` (the `@wordpress/*` packages
   declare React 19 peers; prototypes pin React 18, so `npm ci` fails without it).
4. Ensure its `package-lock.json` is in sync (`npm install`), or the Vercel
   build's `npm ci` fails with `EUSAGE`.
5. Build the UI from the **WordPress Design System** (`@wordpress/components` + design
   tokens), reusing real WordPress components rather than styling your own (see *What these
   prototypes are for*). **Before you pick components or tokens, query the
   `wordpress-design-system` MCP** — it is the crucial, non-negotiable entry point for knowing
   what the Design System actually offers (see the callout under *What these prototypes are
   for*).
6. Add a **`WPDS-COMPONENTS.md`** to the prototype folder documenting which WordPress Design
   System components it references (see *WPDS component reference doc*). **New prototypes only** —
   this is required for every prototype you create from now on.
7. Keep iterating locally. `build.sh` auto-discovers any top-level folder with a
   `package.json` + a `vite.config.*`. It goes live at `prototypes.fvm.house/<name>/` only
   once the user approves a deploy (see *Deploy*) and a push to `main` triggers the build.

## Keep each prototype minimal
Just the app — **no scattered design notes, no loose Figma links, no implementation
write-ups**. The one intentional exception is the `WPDS-COMPONENTS.md` reference doc
(see below), which is required for new prototypes.
A prototype folder is typically: `src/`, `index.html`, `package.json`,
`package-lock.json`, `vite.config.js`, `.npmrc`, `WPDS-COMPONENTS.md` (new prototypes),
and a short `README.md` in this shape:

```markdown
# <Prototype Title>

<One or two sentences: what the prototype explores.>

**Live demo:** https://prototypes.fvm.house/<name>/

## How it was made

<One line on the stack, e.g. "A standalone Vite + React app built from the
WordPress Design System — no custom UI styling.">

- **`@wordpress/...`** — <what it provides>
- ...a few brief bullets, only as needed

Run locally with `npm install && npm run dev`.
```

## WPDS component reference doc (`WPDS-COMPONENTS.md`)
Every **new** prototype must include a `WPDS-COMPONENTS.md` in its folder. Its job is to help
a developer understand **which WordPress Design System components the prototype references** —
so they can trace the prototype back to real WordPress building blocks. (This is separate from
the user-facing `README.md`; the README stays a short overview, this doc is the component map.)

Build the list from what actually grounds the prototype:
- **The user's instructions** — the components/patterns they name or ask for.
- **Any Figma designs provided** — inspect the design and map each element to the WordPress
  Design System component it corresponds to.
- **The `wordpress-design-system` MCP** — this is the crucial step for getting the mapping
  right. Run `get_components` / `get_component_details` through the MCP to resolve every
  generic name (button, dropdown, card) to its canonical WPDS component and confirm the
  package and props before you record it here. Do not document a component you have not
  verified against the MCP.

For each referenced component, capture:
- **Component name** — e.g. `Button`, `ToolbarButton`, `Popover`, `Card`, `SlotFill`.
- **The `@wordpress/*` package** it comes from (usually `@wordpress/components`).
- **How it's used in this prototype** — one line on the role it plays.
- **Source** — whether it came from the user's instructions or a specific Figma node/design.

Suggested shape:

```markdown
# WPDS components referenced — <Prototype Title>

Which WordPress Design System components this prototype is built from, and why.
Source: <the user's brief / Figma file link or node>.

| Component | Package | Used for | Source |
| --- | --- | --- | --- |
| `Button` | `@wordpress/components` | Primary action in the header | Figma: "Header / CTA" |
| `Popover` | `@wordpress/components` | Anchored menu on the breadcrumb | User brief |

## Notes
- <Anything a component doesn't cover: gaps, custom bits, or where WPDS fell short.>
```

## Deploy (only when the user asks to go public)
Run these **only when the user explicitly asks to publish** (e.g. "go public", "deploy
this", "ship it"):
1. Branch off `main` — never commit straight to `main`:
   `git -C ~/Code/Prototypes checkout -b <branch>`. Always scope git with
   `git -C ~/Code/Prototypes …`; `~` itself is an accidental empty git repo.
2. Ensure `package-lock.json` is in sync (`npm install`) and `npm run build` is clean.
3. **If this is a new prototype going public for the first time**, add it to the root
   `README.md` **Prototypes** list — one bullet,
   `[<name>](https://prototypes.fvm.house/<name>/) — <one-line description>` — in the same
   commit, so the repo landing page lists every live prototype.
4. Commit (end the message with the `Co-Authored-By` trailer), push, open a PR.
5. Wait for the Vercel build check to pass, then merge to `main` (squash). The push to
   `main` is what publishes — Vercel rebuilds the monorepo and redeploys.
6. Verify live: `curl -sIL https://prototypes.fvm.house/<name>/` → `HTTP 200`; the page
   `<title>` and `./assets/*.js|css` return 200. (PR **preview** URLs are auth-gated and
   return 401 to anonymous requests — verify on the public production domain instead.)

**Keep PRs and issues self-contained to this repo.** Their titles and bodies must **not
mention other repositories or link to anything outside `fcoveram/fvm-prototypes`** — no
links to other GitHub repos, no Figma / Flickr / external URLs. Describe each change purely
in terms of this repo. (This overrides the default PR-body attribution: **omit** the
"Generated with Claude Code" link from PR/issue bodies. The `Co-Authored-By` commit trailer
is fine — it's not a link.)

## Setup (one-time — done & live)
- **Repo** `fcoveram/fvm-prototypes` = this folder. Keep all git scoped here with
  `git -C ~/Code/Prototypes …`. ⚠️ `~` itself is an accidental empty git repo —
  never run git against it.
- **Vercel:** one project builds the monorepo (`buildCommand: npm run build`,
  `outputDirectory: dist`, Node 22); HTTPS is auto-provisioned.
- **DNS (Namecheap):** fvm.house's DNS lives in Namecheap → Advanced DNS. The
  subdomain is a single CNAME record — Host `prototypes`, Value `cname.vercel-dns.com`.
  Already in place; new prototypes are just paths under it and need no DNS changes.

## Gotchas
- Every prototype needs `base: './'`, an in-sync `package-lock.json`, and the
  `.npmrc` `legacy-peer-deps=true`.
- Caching is automatic on Vercel — hashed JS/CSS are immutable and each deploy
  serves a fresh `index.html`; **no manual cache purge** needed.
- An earlier approach copied builds onto Pressable (`/htdocs/prototype/…`); it is
  **fully retired** — do not store prototype files on Pressable.
- `prototypes.fvm.house/` (root, no `<name>`) has no landing page yet — intentionally
  blank for now.
