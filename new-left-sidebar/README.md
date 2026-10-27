# New Left Sidebar

A WordPress plugin that replaces the wp-admin sidebar with a Site Editor-inspired
navigation: a dark fixed sidebar, content grouped into a Design folder, and Settings as its
own drilldown.

**Live demo:** https://prototypes.fvm.house/new-left-sidebar/

## How it was made

A real plugin, run in [WordPress Playground](https://playground.wordpress.net) — a single
PHP drop-in with one CSS and one JS file, no build step and no database writes.

- **`plugin/`** — the plugin itself; icons are inline SVG data URIs from `@wordpress/icons`.
- **`blueprint.json`** — the Playground recipe: theme, plugin, landing on wp-admin.

Build the whole monorepo with `./build.sh` from the repo root. Playground can only load the
blueprint from a public URL, so the launch button works on the live demo, not locally.
