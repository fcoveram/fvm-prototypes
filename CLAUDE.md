# Prototypes — playbook (for AI assistants)

This folder (`~/Code/Prototypes/`) **is a monorepo**: one Git repo
(`fcoveram/fvm-prototypes`), one Vercel project, serving every prototype at
**`https://prototypes.fvm.house/<name>/`**. Each prototype is a self-contained
Vite + React app in its own subfolder.

## Working on a prototype — local-first (read this first)
**Default to local-only. Never deploy without the user's explicit go-ahead.** Vercel
auto-deploys on every push to `main`, so any commit pushed to the repo is a public deploy —
treat *pushing* as *publishing*.

- Build and iterate **only on the user's machine**: edit files, run `npm run dev` /
  `npm run build`, verify locally. Do **not** commit, push, open PRs, or merge while
  iterating.
- **When you finish a round of changes, end the turn by asking whether to deploy** — a short
  suggestion like "Want me to deploy this, or keep iterating locally?" Default to local.
- Deploy **only** on an explicit yes. If the user says no (or hasn't answered), leave
  everything local and keep working — never touch the public version.

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
5. Keep iterating locally. `build.sh` auto-discovers any top-level folder with a
   `package.json` + a `vite.config.*`. It goes live at `prototypes.fvm.house/<name>/` only
   once the user approves a deploy (see *Deploy*) and a push to `main` triggers the build.

## Keep each prototype minimal
Just the app — **no design notes, no Figma links, no implementation write-ups**.
A prototype folder is typically: `src/`, `index.html`, `package.json`,
`package-lock.json`, `vite.config.js`, `.npmrc`, and a short `README.md` in this
shape:

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

## Deploy (only after the user approves)
Run these **only once the user has said yes** to deploying:
1. Ensure `package-lock.json` is in sync (`npm install`) and `npm run build` is clean.
2. Branch off `main` — never commit straight to `main`:
   `git -C ~/Code/Prototypes checkout -b <branch>`. Always scope git with
   `git -C ~/Code/Prototypes …`; `~` itself is an accidental empty git repo.
3. Commit (end the message with the `Co-Authored-By` trailer), push, open a PR.
4. Wait for the Vercel build check to pass, then merge to `main` (squash). The push to
   `main` is what publishes — Vercel rebuilds the monorepo and redeploys.
5. Verify live: `curl -sIL https://prototypes.fvm.house/<name>/` → `HTTP 200`; the page
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
