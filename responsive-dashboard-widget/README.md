# Responsive Dashboard Widget

A prototype exploring how a WordPress core dashboard widget adapts its layout and content
across five size tiers — Micro → Small → Medium → Large → Full — as it's resized on a
12-column grid. Drag the widget's bottom-right handle and watch the header controls, footer
button, and content density respond to the tier. Interaction only — all data is dumb.

**Live demo:** https://prototypes.fvm.house/responsive-dashboard-widget/

## How it was made

A standalone Vite + React app built from the WordPress Design System — no custom UI styling
beyond layout and the grid stage.

- **`@wordpress/components`** — `Card`/`CardHeader`/`CardBody`/`CardFooter` for the widget
  shell, `Button` for the footer action and the header icon buttons, `SelectControl` for the
  header content controls, and the private `Menu` (Ariakit, via `privateApis`) for the filter
  button's two-section radio menu at the small sizes.
- **`@wordpress/ui`** — `Button` for the variant toggle (`ControlsBar`); the toggle is
  currently hidden and the size indicator sits in its place.
- **`@wordpress/icons`** — the `more-vertical` settings icon.
- **`@wordpress/theme`** — design-token CSS variables.

Per size, the content adapts from a single total (Micro) → a country list (Small) → list +
change (Medium) → list + bar graph (Large) → list + bars + a vector world map (Full). The
country list fills its height; the header controls collapse to a filter icon button (opening
a radio menu) at the smallest sizes.

The tier is a function of the widget's **column** span (1–2 Micro, 3–4 Small, 5–7 Medium,
8–10 Large, 11–12 Full); the **row** span feeds the content's vertical size context.

Run locally with `npm install && npm run dev`.
