# Media Tab Inserter Concept

A concept prototype for the WordPress/Gutenberg editor's left **inserter sidebar** — a
redesigned **Media** tab that organizes media into three collapsible panels: **Pinned**,
**Media Library**, and **From the web** (Openverse). It proposes the interaction model; it
doesn't implement real media, search, or block insertion.

**Live demo:** https://prototypes.fvm.house/media-tab-inserter-concept/

## What it explores

The inserter is shown on its own — a fixed-height panel centered on a soft gray stage. The
Media tab is an **exclusive accordion**: opening one panel collapses the others, and the open
panel's body fills the height while the collapsed panels are pushed to the top/bottom. Only
the open panel's content scrolls.

- **Pinned** — media pinned to the document, grouped into **Images** and **Audio** (open and
  filtered to images by default). Hover/focus a tile for an **unpin** button; an "Add from
  Media Library" button opens a popover standing in for the (not-built) modal library.
- **Media Library** — the same grouped layout over the whole library. Each image has a
  **more menu** (⋮) with **"Pin image"**, which adds it to Pinned while keeping it in the
  library.
- **From the web** — an Openverse-style single grid showing one media type at a time (images
  by default). Each image's more menu offers **"Add to Media Library"**.
- **Filter menus** — the settings/sliders button beside each search filters the grouped
  panels by All / Images / Audio, and the web panel by Images / Audio.

The layout follows a Figma wireframe; the hover unpin treatment follows Gutenberg PR
[#79217](https://github.com/WordPress/gutenberg/pull/79217).

## How it was made

A standalone Vite + React app built from the WordPress Design System — no custom UI library:

- **`@wordpress/components`** — `Panel`/`PanelBody` (the accordion), `SearchControl`,
  `DropdownMenu` + `MenuItemsChoice` (the filter menus), `Dropdown` + `MenuItem` (the per-image
  more menu), and `Button`.
- **`@wordpress/ui`** — `IconButton` (minimal/neutral/small) for the unpin and ⋮ actions.
- **`@wordpress/icons`** — `settings` (the sliders filter glyph), `closeSmall`, `moreVertical`,
  `close`, `audio`.
- **`@wordpress/theme`** design tokens (`--wpds-*`) for color and spacing.
- Each panel's images render their own bundled sample photo (cropped square); audio uses
  tinted icon tiles.

Run locally with `npm install && npm run dev`.
