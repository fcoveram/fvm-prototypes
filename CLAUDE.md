# Prototypes — playbook (for AI assistants)

This folder (`~/Code/Prototypes/`) **is a monorepo**: one Git repo
(`fcoveram/fvm-prototypes`), one Vercel project, serving every prototype at
**`https://prototypes.fvm.house/<name>/`**. Each prototype is a self-contained
Vite + React app in its own subfolder.

## Hosting model
- Prototypes are hosted on **Vercel** (one project for the whole monorepo).
  **Nothing is stored on the WordPress/Pressable site.**
- `prototypes.fvm.house` is a **subdomain pointed at Vercel** via a DNS CNAME
  (routing only — no files on Pressable).
- Vercel runs `build.sh`, which builds each prototype into `dist/<name>/` and
  serves `dist/`, so each prototype lives at `prototypes.fvm.house/<name>/`.
- **Auto-deploys on push to `main`**; pull requests get Vercel preview URLs.
- No deploy workflow, no SSH keys, no rsync — Vercel handles deployment.

## Add a new prototype
1. Create `~/Code/Prototypes/<name>/` containing a self-contained Vite + React app.
2. Set **`base: './'`** in its `vite.config.js` (relative asset paths so it works
   under the `/<name>/` subpath).
3. Add an **`.npmrc`** with `legacy-peer-deps=true` (the `@wordpress/*` packages
   declare React 19 peers; prototypes pin React 18, so `npm ci` fails without it).
4. Ensure its `package-lock.json` is in sync (`npm install`), or the Vercel
   build's `npm ci` fails with `EUSAGE`.
5. Commit + push to `main`. `build.sh` auto-discovers any top-level folder with a
   `package.json` + a `vite.config.*`, builds it, and Vercel serves it at
   `prototypes.fvm.house/<name>/`.

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

## Verify a deploy
After a push, check the Vercel deployment, then:
`curl -sIL https://prototypes.fvm.house/<name>/` → `HTTP 200`; the page `<title>`
and `./assets/*.js|css` should return 200.

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
