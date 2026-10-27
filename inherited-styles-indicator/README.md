# Inherited Styles Indicator

A WordPress plugin that marks every style control in the block editor with a diamond while
its value is inherited — from Styles, from the block type's styles, or from a parent block —
so you can see at a glance what you've set and what you've been given.

**Live demo:** https://prototypes.fvm.house/inherited-styles-indicator/

## How it was made

A real plugin, run in [WordPress Playground](https://playground.wordpress.net) — no build
step, no dependencies.

- **`plugin/`** — the plugin itself; turns on core's experimental Styles inheritance UI and
  draws the diamonds.
- **`blueprint.json`** — the Playground recipe: theme, plugin, demo content.
- **`seed.php`** — the demo post the blueprint lands you on.

Build the whole monorepo with `./build.sh` from the repo root. Playground can only load the
blueprint from a public URL, so the launch button works on the live demo, not locally.
