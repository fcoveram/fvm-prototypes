/**
 * The style registry.
 *
 * One entry per style the Typography panel can carry a value for. This single
 * list drives BOTH surfaces of the prototype, so they can never disagree:
 *
 *   - the ToolsPanel — `tool` is the ToolsPanelItem label, `isDefaultTool`
 *     whether it is visible before the user shows anything;
 *   - the "Style origins" menu — `label` is how the style reads there, and
 *     `inheritedFrom` names the Global Styles section it resolves to.
 *
 * One deliberate asymmetry encodes a product condition: `textIndent` through
 * `fitText` have `inheritedFrom: null`. Nothing in Global Styles sets them, so
 * they have no origin until the user sets one locally. Setting one puts it
 * under "On this block"; resetting it drops it out of the menu entirely,
 * because an unset style has no origin at all.
 *
 * Note: every entry now carries a `tool`. Both groups of the origins menu are
 * filtered to the tools currently visible in the panel, so a style with no
 * control could never appear — an earlier `linkColor` entry (origin "Site
 * colors", no control in this panel) was removed for exactly that reason.
 *
 * `inheritedValue` is what each control shows at rest and what a reset restores,
 * so the origin change is visible in the panel and not just in the menu.
 *
 * Every inherited style resolves to "Styles" — the Styles section as a whole,
 * rather than the particular element or palette inside it that an earlier pass
 * named ("Site typography", "H2 element"). `inheritedFrom` stays a per-style
 * field rather than becoming a constant, so a future pass can name sections
 * again without reshaping the registry.
 *
 * Figma: nodes 796:52032 (no block styles) and 796:52033 (with block styles).
 */

export const STYLES = [
	{
		key: 'textColor',
		label: 'Text color',
		tool: 'Color',
		isDefaultTool: true,
		inheritedFrom: 'Styles',
		inheritedValue: '#3858e9',
	},
	{
		key: 'fontFamily',
		label: 'Font family',
		tool: 'Font',
		isDefaultTool: false,
		inheritedFrom: 'Styles',
		inheritedValue: 'Manrope',
	},
	{
		key: 'fontSize',
		label: 'Font size',
		tool: 'Size',
		isDefaultTool: true,
		inheritedFrom: 'Styles',
		inheritedValue: '20px',
	},
	{
		key: 'fontWeight',
		label: 'Font weight',
		// The panel labels this control "Appearance" — it sets font weight and
		// font style together, the way core's typography panel does.
		tool: 'Appearance',
		isDefaultTool: false,
		inheritedFrom: 'Styles',
		inheritedValue: 'default',
	},
	{
		key: 'lineHeight',
		label: 'Line height',
		tool: 'Line height',
		isDefaultTool: false,
		inheritedFrom: 'Styles',
		inheritedValue: '1.2',
	},
	{
		key: 'letterSpacing',
		label: 'Letter spacing',
		tool: 'Letter spacing',
		isDefaultTool: false,
		inheritedFrom: 'Styles',
		inheritedValue: '0px',
	},
	{
		key: 'textIndent',
		label: 'Line indent',
		tool: 'Line indent',
		isDefaultTool: false,
		inheritedFrom: null,
		inheritedValue: '0px',
	},
	{
		key: 'textColumns',
		label: 'Columns',
		tool: 'Columns',
		isDefaultTool: false,
		inheritedFrom: null,
		inheritedValue: 1,
	},
	{
		key: 'textDecoration',
		label: 'Decoration',
		tool: 'Decoration',
		isDefaultTool: false,
		inheritedFrom: null,
		inheritedValue: 'none',
	},
	{
		key: 'writingMode',
		label: 'Orientation',
		tool: 'Orientation',
		isDefaultTool: false,
		inheritedFrom: null,
		inheritedValue: 'horizontal-tb',
	},
	{
		key: 'textTransform',
		label: 'Letter case',
		tool: 'Letter case',
		isDefaultTool: false,
		inheritedFrom: null,
		inheritedValue: 'none',
	},
	{
		key: 'dropCap',
		label: 'Drop cap',
		tool: 'Drop cap',
		isDefaultTool: false,
		inheritedFrom: null,
		inheritedValue: false,
	},
	{
		key: 'fitText',
		label: 'Fit text',
		tool: 'Fit text',
		isDefaultTool: false,
		inheritedFrom: null,
		inheritedValue: false,
	},
];

/** Lookup by style key, for the handful of places that need one entry. */
export const STYLE_BY_KEY = Object.fromEntries(
	STYLES.map( ( style ) => [ style.key, style ] )
);

/**
 * Tool labels visible before the user shows anything, in panel order.
 *
 * These are not a guess. For a Heading block, the block inspector builds the
 * Typography panel's `defaultControls` by merging the block's
 * `typography.__experimentalDefaultControls` (`{ fontSize: true }`) with
 * `textColor` taken from `color.__experimentalDefaultControls.text` — so Color
 * and Size are the only two tools shown by default, and everything else waits
 * behind the panel's ⋮ menu.
 */
export const DEFAULT_TOOLS = STYLES.filter(
	( style ) => style.isDefaultTool
).map( ( style ) => style.tool );

/** Every tool the panel can show, in the order the design lays them out. */
export const ALL_TOOLS = STYLES.filter( ( style ) => style.tool ).map(
	( style ) => style.tool
);

/**
 * Font size presets.
 *
 * Five or fewer sizes make `FontSizePicker` render its toggle group plus the
 * "Set custom size" button — the segmented row and slider icon the design shows.
 *
 * No `name` on purpose. `FontSizePicker` labels the toggles from a hardcoded
 * `T_SHIRT_ABBREVIATIONS` list by position — always S, M, L, XL, XXL — and
 * falls back to the matching `T_SHIRT_NAMES` for each toggle's accessible name
 * only when a size has no `name` of its own. Supplying our own names would put
 * "Extra small" on a button reading "S". (The design draws the row as
 * XS/S/M/L/XL; the real component cannot relabel those, so the component wins —
 * see WPDS-COMPONENTS.md.)
 */
export const FONT_SIZES = [
	{ slug: 'small', size: '14px' },
	{ slug: 'medium', size: '16px' },
	{ slug: 'large', size: '20px' },
	{ slug: 'x-large', size: '28px' },
	{ slug: 'xx-large', size: '36px' },
];

/** Font families offered by the Font control. */
export const FONT_FAMILIES = [
	{ label: 'Manrope', value: 'Manrope' },
	{ label: 'Inter', value: 'Inter' },
	{ label: 'Cardo', value: 'Cardo' },
	{ label: 'System Sans-serif', value: 'system-ui' },
];

/** Appearance presets, mirroring the weight/style pairs core offers. */
export const APPEARANCES = [
	{ label: 'Default', value: 'default' },
	{ label: 'Thin', value: '100' },
	{ label: 'Light', value: '300' },
	{ label: 'Regular', value: '400' },
	{ label: 'Medium', value: '500' },
	{ label: 'Semi Bold', value: '600' },
	{ label: 'Bold', value: '700' },
	{ label: 'Black', value: '900' },
];

/** The site palette the Color control picks from. */
export const COLOR_PALETTE = [
	{ name: 'Base', slug: 'base', color: '#ffffff' },
	{ name: 'Contrast', slug: 'contrast', color: '#111111' },
	{ name: 'Accent 1', slug: 'accent-1', color: '#3858e9' },
	{ name: 'Accent 2', slug: 'accent-2', color: '#d0a080' },
	{ name: 'Accent 3', slug: 'accent-3', color: '#4a7a6a' },
];
