# WPDS components referenced — Inherited Styles Inspector

Which WordPress Design System components this prototype is built from, and why.
Source: the user's brief, plus Figma "Inherited Styles" node `796-52456`
("POC. button in toolsPanel") — frames `796:3362` (ToolsPanel with iconButton),
`796:52032` (Styles origin menu, no block styles) and `796:52033` (Styles origin
menu, with block styles). Flyout placement follows a reference screenshot of the
current editor supplied with the brief.

Verified through the `wordpress-design-system` MCP (`get_components`,
`get_component_details`, `get_design_tokens`), with component APIs and token
values confirmed against the installed packages.

**Stack:** `@wordpress/components` 43, `@wordpress/ui` 0.25, `@wordpress/theme` 3,
`@wordpress/icons` 19, `@wordpress/primitives` 5. This prototype is deliberately
ahead of its siblings, which pin components 32.6 / ui 0.12 / theme 0.11 — see the
first note below.

## Menus

Both header menus are the new `Menu` from **`@wordpress/ui`**, built to the
composition its documentation states: `Menu.Root` wraps one `Menu.Trigger` and
one `Menu.Popup`; `Menu.Popup` receives placement through its `positioner` prop
rather than nesting `Menu.Portal`/`Menu.Positioner` by hand; and every item's
children are exactly one `Menu.ItemLabel`, optionally followed by
`Menu.ItemDescription`.

| Component | Package | Used for | Source |
| --- | --- | --- | --- |
| `Menu.Root` | `@wordpress/ui` | Both menus, controlled via `open`/`onOpenChange` so only one is ever open. | User brief |
| `Menu.Trigger` | `@wordpress/ui` | Renders *as* each header `Button` through `render`, so the existing control becomes the menu's button. | Figma: "IconButton" (796:8669, 796:8025) |
| `Menu.Popup` | `@wordpress/ui` | The menu surface; takes `positioner` for the flyout placement. | Figma: "Popover / Surface" |
| `Menu.Positioner` | `@wordpress/ui` | `side: 'left'`, `align: 'start'`, `sideOffset: 16` — and `anchor` set to the panel card. | Reference screenshot |
| `Menu.Group` / `Menu.GroupLabel` | `@wordpress/ui` | The "Typography" tools group, and "Block styles" / "Inherited styles". | Figma: ".Menu.Group", ".Menu.GroupLabel" |
| `Menu.CheckboxItem` | `@wordpress/ui` | The ⋮ menu's show/hide rows (`closeOnClick={false}`, `onCheckedChange`). Default tools are checked and disabled. | User brief |
| `Menu.ItemLabel` | `@wordpress/ui` | Each checkbox item's label — the documented required child. | Menu docs |
| `Menu.Separator` | `@wordpress/ui` | Between the origins menu's two groups, only when both render. | Figma: ".Menu.Separator" (796:52366) |

## Panel and header

| Component | Package | Used for | Source |
| --- | --- | --- | --- |
| `ToolsPanel` (`__experimentalToolsPanel`) | `@wordpress/components` | The Typography panel body. Rendered with **no `label`**, which makes its own header return `null` so `PanelHeader` can replace it. | Figma: "ToolsPanel with iconButton" |
| `ToolsPanelItem` (`__experimentalToolsPanelItem`) | `@wordpress/components` | One per control: registration, `hasValue`/`onDeselect`, grid placement. | Figma: same frame |
| `Heading` (`__experimentalHeading`) | `@wordpress/components` | The panel title "Typography". | Figma: "_ToolsPanel/Header" (796:3638) |
| `Stack` | `@wordpress/ui` | The header row, the header buttons, and each origins-menu row. Gaps come from its `gap` token scale. | Figma: same frames |
| `Text` | `@wordpress/ui` | The menu title, each row's style name, and the Global Styles section beneath it. | Figma: "Label", "Description text" |
| `Button` | `@wordpress/components` | Both 24px header triggers (it takes `icon` + `label` directly). | Figma: "IconButton" |
| `Button` | `@wordpress/ui` | The single action in each menu row — Edit, Reset, Reset all — as `variant="minimal" tone="brand" size="compact"`. | User brief + Figma: "Button" |

## Typography controls

| Component | Package | Used for | Source |
| --- | --- | --- | --- |
| `ColorIndicator` | `@wordpress/components` | The swatch on the Color row. | Figma: "ColorIndicator" (796:50458) |
| `ItemGroup` / `Item` (`__experimental*`) | `@wordpress/components` | The bordered Color row that opens the palette. | Figma: "Color" (796:50457) |
| `Dropdown` | `@wordpress/components` | Anchors the palette to that row. | Figma: same |
| `ColorPalette` | `@wordpress/components` | The site palette inside it. | User brief |
| `SelectControl` | `@wordpress/components` | Font family, and Appearance. | Figma: "Font" (796:3370), "Appearance" (796:3379) |
| `FontSizePicker` | `@wordpress/components` | The font size row, with its own "Set custom size" toggle. | Figma: "FontSizePicker" (796:50694) |
| `NumberControl` (`__experimental*`) | `@wordpress/components` | Line height and Columns (`spinControls="custom"`). | Figma: 796:3381, 796:3385 |
| `UnitControl` (`__experimental*`) | `@wordpress/components` | Letter spacing and Line indent. | Figma: 796:3382, 796:3383 |
| `RangeControl` | `@wordpress/components` | The slider beside Line indent. | Figma: 796:3383 |
| `ToggleGroupControl` + `ToggleGroupControlOptionIcon` (`__experimental*`) | `@wordpress/components` | Decoration, Orientation, Letter case. | Figma: 796:3386–796:3388 |
| `ToggleControl` | `@wordpress/components` | Drop cap and Fit text. | Figma: 796:3389, 796:3390 |

## Icons

| Icon | Package | Used for |
| --- | --- | --- |
| `moreVertical` | `@wordpress/icons` | The ⋮ tools menu trigger. |
| `reset`, `formatUnderline`, `formatStrikethrough` | `@wordpress/icons` | Decoration options. |
| `textHorizontal`, `textVertical` | `@wordpress/icons` | Orientation options. |
| `reset`, `formatUppercase`, `formatLowercase`, `formatCapitalize` | `@wordpress/icons` | Letter case options. |
| `SVG` / `Path` | `@wordpress/primitives` | The diamond — see the gaps below. |

## Design tokens

Token names use the `@wordpress/theme` v3 grammar
(`--wpds-color-<property>-<target>-<tone>`), each checked against the installed
token file. The 16px flyout gap is `--wpds-dimension-gap-lg`, read off the
document at call time because `Menu.Positioner` takes `sideOffset` as a number
rather than a CSS length.

`get_variable_defs` on the design's menu frame (`796:52033`) confirms it is
built from these same tokens, and the implementation now matches each one
measured in the browser:

| Design variable | Value | Where it lands |
| --- | --- | --- |
| `wpds-color/foreground/interactive/brand` | `#3858e9` | The Edit / Reset / Reset all label — what `variant="minimal" tone="brand"` resolves to, so no override is needed |
| `wpds-color/background/interactive/brand-weak` | transparent | Those buttons' resting background — likewise from `minimal` |
| `wpds-dimension/size/md` | 32 | Their height — `size="compact"` |
| `wpds-dimension/surface-width/xs` | 240 | The menu's width; the design's "240px" is this token, not a magic number |
| `Body/md` (13px, 400) | — | Each row's style name — `Text variant="body-md"` |
| `Body/sm` (12px, 400) | — | The origin beneath it — `Text variant="body-sm"` |
| `wpds-color/foreground/content/neutral-weak` | `#707070` | That origin's colour |

The one hardcoded value is the stage's 120px padding: the dimension scale stops
at `--wpds-dimension-padding-3xl`, well short of it, and it is prototype framing
rather than something the design system has an opinion about.

## Notes — where WPDS did not cover the design

- **The `@wordpress/components` `Menu` is deprecated.** Its own README says so
  and points to `Menu` from `@wordpress/ui`, which is what the design-system
  Storybook documents. That component is public from `@wordpress/ui` 0.25, which
  requires `@wordpress/theme@^3`, `icons@^19` and `primitives@^5` — hence the
  stack bump. The upside is that the private-APIs unlock is gone entirely, and
  with it the `dedupe`/`optimizeDeps` workaround the sibling prototypes need.

- **`Menu` lays its popup out as a named-line grid**, and `Menu.Group`
  re-establishes the same tracks inside itself:

  ```
  [item-padding-start] 8px [selection-start] … [prefix-start] …
  [content-start] 1fr [content-end] 8px [item-padding-end]
  ```

  `Menu.Item` and `Menu.GroupLabel` place themselves across those lines. Any
  other child gets `grid-column: auto`, lands in the 8px padding track and
  collapses to a sliver. Every hand-rendered child here names its track
  (`content-start / content-end`). Worth knowing for anyone putting non-`Menu`
  content inside a `Menu.Popup`.

- **Menu rows are not `Menu.Item`s.** The brief asks for inherited rows with no
  hover state where only the Edit control behaves as a button. A `Menu.Item`
  *is* the interactive element — it takes the hover highlight and cannot contain
  a button without nesting one button inside another. So each row is a `Stack`
  of `Text` with a single WPDS `Button` at its end. The trade-off is that rows
  are reached with Tab rather than the arrow keys. **A real implementation would
  want `Menu` to support a non-interactive row, or an item with a trailing
  action.**

- **`ToolsPanel`'s header cannot be reused with the reset items removed.** There
  is no prop for it, and it cannot be driven from outside either:
  `ToolsPanelContext` publishes `menuItems` but not `toggleItem`, which
  `useToolsPanel` hands straight to the header it renders. So the panel renders
  with no `label` and tool visibility is owned by the prototype. **A real
  implementation would want a header slot on `ToolsPanel`, or `toggleItem` on
  its context.**

- **No diamond icon exists** in `@wordpress/icons` (checked v12 and v19;
  `swatch` and `styles` are the nearest and neither is a rotated square). The one
  in `src/components/DiamondIcon.jsx` is drawn from `@wordpress/primitives` in
  the library's 24×24 viewBox so it still flows through the real `Icon`
  pipeline. **If this idea moves forward, the glyph needs adding upstream.**

- **`Text` has no `body-xs` variant and no `tone` prop.** `body-sm` is the
  smallest body size; muted colour comes from a token on the element. Note also
  that `heading-sm` is the 11px UPPERCASE label style that `Menu.GroupLabel`
  already uses — relevant if a sentence-case title is ever reintroduced, where
  `heading-md` is the right step up.

- **Two `Button`s, from two packages, on purpose.** The row actions are
  `@wordpress/ui`'s Button because `minimal` is a variant only it has
  (`@wordpress/components` offers `primary`/`secondary`/`tertiary`/`link`), and
  its `minimal` + `brand` tokens are exactly the ones the design uses. The two
  header triggers stay on `@wordpress/components`' Button, which takes `icon`
  and `label` directly.

- **`FontSizePicker` cannot be relabelled.** The design shows `XS S M L XL`, but
  the component labels its toggles from a hardcoded positional
  `T_SHIRT_ABBREVIATIONS` — always `S M L XL XXL`. The component wins; the
  presets carry no `name` so each toggle's accessible name falls back to the
  matching `T_SHIRT_NAMES` entry and cannot contradict its visible label.

- **`Menu.Popup` sizes itself to `--wpds-dimension-surface-width-sm` (320px)**
  clamped by `--available-width`, so it is both wider than the design's 240px and
  liable to collapse when there is little room beside the panel. The origins
  menu sets an explicit width.

- **Layout-only CSS.** `src/styles/inspector.css` holds the stage, the panel
  card, the grid track placements above, and the menu width. No component is
  restyled.
