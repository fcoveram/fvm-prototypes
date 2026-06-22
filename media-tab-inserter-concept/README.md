# Media Tab Inserter Concept

A concept prototype for the WordPress/Gutenberg editor's left **inserter sidebar** — a
redesigned **Media** tab that organizes media into three collapsible panels: **Pinned**,
**Media Library**, and **From the web** (Openverse). It proposes the interaction model; it
doesn't implement real media, search, or block insertion.

**Live demo:** https://prototypes.fvm.house/media-tab-inserter-concept/

## What it explores

- **One accordion, three panels.** The Media tab is an exclusive accordion — opening Pinned,
  Media Library, or From the web collapses the others.
- **Pinned** — quick access to media pinned to the document, grouped into **Images** and
  **Audio**. Hover (or keyboard-focus) a tile to reveal an unpin (✕) button; an "Add from
  Media Library" button jumps to the library panel.
- **Media Library** — the same grouped layout across the whole library.
- **From the web** — a single Openverse-style grid that shows one media type at a time
  (images by default).
- **Filter menus** — the settings button beside each search filters the grouped panels by
  All / Images / Audio, and the web panel by Images / Audio.

The layout follows a Figma wireframe; the hover-to-unpin interaction follows Gutenberg PR
[#79217](https://github.com/WordPress/gutenberg/pull/79217).

## How it was made

A standalone Vite + React app built from the WordPress Design System — no custom UI library:

- **`@wordpress/components`** — the controls: `Panel`/`PanelBody` (the accordion),
  `SearchControl`, `DropdownMenu` + `MenuItemsChoice` (the radio filter menus), and `Button`.
- **`@wordpress/icons`** — `settings` (the sliders filter glyph), `close`/`closeSmall`,
  `audio`, `plus`, and the editor-header icons.
- **`@wordpress/theme`** design tokens (`--wpds-*`) for color and spacing.
- Media thumbnails are self-contained, deterministic gradient/icon placeholders (no network).

Run locally with `npm install && npm run dev`.
