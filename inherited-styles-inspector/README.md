# Inherited Styles Inspector

A proof of concept for the block editor's Styles tab: a menu that shows where
every style on the selected block comes from — Global Styles or the block
itself — and lets you reset the local ones or jump to the Global Styles section
the inherited ones resolve to.

**Live demo:** https://prototypes.fvm.house/inherited-styles-inspector/

## What it explores

Today a control in the Styles tab shows you a *value* but never its *source*.
Font size on an H2 might come from the H2 element in Global Styles, from the
Heading element, or be set on this block — and the inspector looks identical in
all three cases. Reset is just as opaque: it lives inside the ToolsPanel's ⋮
menu, mixed in with show/hide, with nothing to say what a reset returns you to.

This prototype adds a second header button to the Typography ToolsPanel — a
diamond — that opens a **style origins** menu beside the inspector, in two
groups:

- **Block styles** — styles set locally, each with a `Reset`, plus a
  `Reset all` on the group's own label row.
- **Inherited styles** — styles coming from Styles, each with an `Edit` that
  would take you there.

Three behaviours are worth trying:

1. **Change any control** and its style moves from *Inherited* to *On this
   block*; reset it and it moves back, with the inherited value restored.
2. **Show a tool from the ⋮ menu** and its style joins the origins menu. The
   menu inventories what the inspector is showing, whatever each style's
   origin, so hiding a tool again takes its style back out — the value itself
   is kept, not reset.
3. **`Edit` on an inherited style** opens the browser's own message box.

The ⋮ menu, meanwhile, now does one job: show and hide tools. Every reset
affordance has moved into the origins menu, where the origin a reset returns
to is actually visible.

Both menus fly out to the side of the inspector, 16px clear of it, so the panel
they describe stays visible. Only one is ever open. The inspector itself is
pinned to the top of the stage, so showing a tool grows the panel downwards
instead of shifting the header under your pointer.

The panel opens with just **Color** and **Size**, which is what the block editor
really shows by default for a Heading block. Everything else is behind ⋮.

### Related work in Gutenberg

Trunk already has an experimental take on the same problem at the *per-control*
level — `block-editor/src/components/global-styles/inheritance/`, behind the
`gutenberg-global-styles-inheritance-ui` experiment: a dotted underline on
inherited labels and a blue dot that resets a local override. This is the
panel-level alternative: one menu that inventories every style at once,
including the ones no control is showing.

Nothing here persists a value. The controls are live so the panel feels real,
but their only consequence is moving a style's origin.

## How it was made

A standalone Vite + React app built from the WordPress Design System — the
controls, menus and panel are real `@wordpress/components`, with no custom UI
components. See [WPDS-COMPONENTS.md](WPDS-COMPONENTS.md) for the full map.

- **`@wordpress/ui`** — the new `Menu` behind both header buttons, plus `Stack`
  and `Text` for the menu rows.
- **`@wordpress/components`** — `ToolsPanel`/`ToolsPanelItem` for the panel, the
  full set of typography controls, and `Button`.
- **`@wordpress/icons`** — the ⋮ trigger and the decoration/orientation/letter
  case glyphs.
- **`@wordpress/primitives`** — the one icon the library does not have: the
  diamond on the style-origins button.
- **`@wordpress/theme`** — the `--wpds-*` design tokens, including the 16px
  flyout gap.

This prototype runs a newer stack than its siblings (components 43, ui 0.25,
theme 3), because the `Menu` the design is drawn from is public only in
`@wordpress/ui` 0.25 — the `@wordpress/components` one is deprecated. The upside
is no private-API unlock and no Vite workaround for it.

Run locally with `npm install && npm run dev`.
