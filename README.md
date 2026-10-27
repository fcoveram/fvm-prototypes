# fvm prototypes

Standalone UI prototypes — each a self-contained Vite + React app in its own folder, built and deployed together as one Vercel project and served at **`https://prototypes.fvm.house/<name>/`**.

## Prototypes
- [editor-header-breadcrumb](https://prototypes.fvm.house/editor-header-breadcrumb/) — a breadcrumb-style document bar for the WordPress block editor.
- [inherited-styles-indicator](https://prototypes.fvm.house/inherited-styles-indicator/) — a plugin that marks each style control with a diamond while its value is inherited, running in WordPress Playground.
- [inherited-styles-inspector](https://prototypes.fvm.house/inherited-styles-inspector/) — a style origins menu for the block editor's inspector, showing which styles are inherited from Styles and which are set on the block.
- [media-tab-inserter](https://prototypes.fvm.house/media-tab-inserter/) — a redesigned Media tab for the block editor's inserter sidebar.
- [new-left-sidebar](https://prototypes.fvm.house/new-left-sidebar/) — a Site Editor-inspired navigation replacing the wp-admin sidebar, running in WordPress Playground.
- [responsive-dashboard-widget](https://prototypes.fvm.house/responsive-dashboard-widget/) — a WordPress dashboard widget that adapts its layout and content across five size tiers as it's resized on a grid.

## Add a prototype
Every prototype explores an idea for **WordPress itself — Core or Gutenberg** — built from the **WordPress Design System** so it looks and behaves like WordPress. Prototypes are ideas to discuss and iterate on with contributors, **not code meant to ship into WordPress as-is**.

> **The `wordpress-design-system` MCP is the crucial entry point to the WordPress Design System.** Whenever you touch the Design System or the components that live in it, go through this MCP first — it's the authoritative source for which components and tokens exist and how to use them. Query it (`get_components`, `get_component_details`, `get_design_tokens`) instead of relying on memory.
>
> **MCP vs. the `wpds` skill — they don't overlap.** The `wordpress-design-system` MCP is the **data source** (the "what"): the authoritative facts about which components/props/tokens exist. The `wpds` skill is the **working method** (the "how"): the rules for building WPDS UI, which itself calls into the MCP for the facts. For *what exists and its exact API*, the MCP is the source of truth; for *how to build*, follow the `wpds` skill. Use both — one is never a substitute for the other.

There are two kinds, and `build.sh` tells them apart by what's in the folder:

**app** — a Vite + React mock, the default.

1. Create a folder `<name>/` with a Vite app — set `base: './'` in its `vite.config.js`, and add an `.npmrc` with `legacy-peer-deps=true`.
2. Build the UI from `@wordpress/components` and its design tokens (resolved via the `wordpress-design-system` MCP); avoid custom UI styling.
3. Add a `WPDS-COMPONENTS.md` documenting which WordPress Design System components the prototype references (from the brief or the Figma designs).

**playground** — a real plugin running in [WordPress Playground](https://playground.wordpress.net), for ideas that only read true inside real WordPress.

1. Create a folder `<name>/` with the plugin source in `plugin/`.
2. Add a `blueprint.json` with a `meta` block and the `__PLUGIN_ZIP_URL__` placeholder; put any demo-content PHP in `seed.php` and reference it with `__SEED_PHP__`.
3. Optionally add an `index.html` launch page — otherwise the shared `playground-template.html` is used.

Either way: push to `main`, and Vercel runs `build.sh`, which builds each prototype into `dist/<name>/` and serves it at `prototypes.fvm.house/<name>/`. Everything is on Vercel — no GitHub Pages, no per-prototype projects. The bare root redirects to [fvm.house/prototypes](https://fvm.house/prototypes/), which is the index.

Run an app locally: `cd <name> && npm install && npm run dev`. Build everything: `./build.sh`. Full process in `CLAUDE.md`.
