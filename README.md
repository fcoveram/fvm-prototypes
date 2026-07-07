# fvm prototypes

Standalone UI prototypes — each a self-contained Vite + React app in its own folder, built and deployed together as one Vercel project and served at **`https://prototypes.fvm.house/<name>/`**.

## Prototypes
- [editor-header-breadcrumb](https://prototypes.fvm.house/editor-header-breadcrumb/) — a breadcrumb-style document bar for the WordPress block editor.
- [media-tab-inserter](https://prototypes.fvm.house/media-tab-inserter/) — a redesigned Media tab for the block editor's inserter sidebar.
- [responsive-dashboard-widget](https://prototypes.fvm.house/responsive-dashboard-widget/) — a WordPress dashboard widget that adapts its layout and content across five size tiers as it's resized on a grid.

## Add a prototype
Every prototype explores an idea for **WordPress itself — Core or Gutenberg** — built from the **WordPress Design System** so it looks and behaves like WordPress. Prototypes are ideas to discuss and iterate on with contributors, **not code meant to ship into WordPress as-is**.

> **The `wordpress-design-system` MCP is the crucial entry point to the WordPress Design System.** Whenever you touch the Design System or the components that live in it, go through this MCP first — it's the authoritative source for which components and tokens exist and how to use them. Query it (`get_components`, `get_component_details`, `get_design_tokens`) instead of relying on memory.
>
> **MCP vs. the `wpds` skill — they don't overlap.** The `wordpress-design-system` MCP is the **data source** (the "what"): the authoritative facts about which components/props/tokens exist. The `wpds` skill is the **working method** (the "how"): the rules for building WPDS UI, which itself calls into the MCP for the facts. For *what exists and its exact API*, the MCP is the source of truth; for *how to build*, follow the `wpds` skill. Use both — one is never a substitute for the other.

1. Create a folder `<name>/` with a Vite app — set `base: './'` in its `vite.config.js`, and add an `.npmrc` with `legacy-peer-deps=true`.
2. Build the UI from `@wordpress/components` and its design tokens (resolved via the `wordpress-design-system` MCP); avoid custom UI styling.
3. Add a `WPDS-COMPONENTS.md` documenting which WordPress Design System components the prototype references (from the brief or the Figma designs).
4. Push to `main`. Vercel runs `build.sh`, which builds each prototype into `dist/<name>/` and serves it at `prototypes.fvm.house/<name>/`.

Run one locally: `cd <name> && npm install && npm run dev`. Full process in `CLAUDE.md`.
