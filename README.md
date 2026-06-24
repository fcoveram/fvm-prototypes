# fvm prototypes

Standalone UI prototypes — each a self-contained Vite + React app in its own folder, built and deployed together as one Vercel project and served at **`https://prototypes.fvm.house/<name>/`**.

## Prototypes
- [editor-header-breadcrumb](https://prototypes.fvm.house/editor-header-breadcrumb/) — a breadcrumb-style document bar for the WordPress block editor.
- [media-tab-inserter-concept](https://prototypes.fvm.house/media-tab-inserter-concept/) — a redesigned Media tab for the block editor's inserter sidebar.
- [responsive-dashboard-widget](https://prototypes.fvm.house/responsive-dashboard-widget/) — a WordPress dashboard widget that adapts its layout and content across five size tiers as it's resized on a grid.

## Add a prototype
1. Create a folder `<name>/` with a Vite app — set `base: './'` in its `vite.config.js`, and add an `.npmrc` with `legacy-peer-deps=true`.
2. Push to `main`. Vercel runs `build.sh`, which builds each prototype into `dist/<name>/` and serves it at `prototypes.fvm.house/<name>/`.

Run one locally: `cd <name> && npm install && npm run dev`. Full process in `CLAUDE.md`.
