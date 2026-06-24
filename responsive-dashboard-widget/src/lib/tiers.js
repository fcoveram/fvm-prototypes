// Grid geometry. The dashboard grid is 12 columns x 6 rows of 100px cells with 8px
// gaps -> 1288px wide x 640px tall (the spec's "650" resolves to 640 for exact 6-row
// snapping). A widget is anchored top-left and spans whole cells.
export const CELL = 100; // px per grid cell
export const GAP = 8; // px gap between cells
export const COLS = 12;
export const ROWS = 6;

export const GRID_W = COLS * CELL + ( COLS - 1 ) * GAP; // 1288
export const GRID_H = ROWS * CELL + ( ROWS - 1 ) * GAP; // 640

// Pixel size of an element spanning `span` cells (cells + the gaps between them).
export function spanToPx( span ) {
	return span * CELL + ( span - 1 ) * GAP;
}

// Nearest whole cell-span for a pixel size, clamped to [minSpan, maxSpan].
// Inverse of spanToPx: px ~= span * (CELL + GAP) - GAP.
export function pxToSpan( px, maxSpan, minSpan = 1 ) {
	const raw = ( px + GAP ) / ( CELL + GAP );
	return Math.min( Math.max( Math.round( raw ), minSpan ), maxSpan );
}

// Per-tier behavior. Tier is determined by COLUMN span only — the spec's column ranges
// (1-2 / 3-4 / 5-7 / 8-10 / 11-12) partition 1..12 with no overlap, and the summary
// table keys the tier off columns. Row span is passed to content as size context.
//   controls: 'minimal' = one content control + settings; 'full' = all + settings.
//   footer:   'fill' = button fills width; 'fit' = button fits its label, right-aligned.
export const TIERS = {
	micro: { key: 'micro', label: 'Micro', controls: 'minimal', footer: 'fill' },
	small: { key: 'small', label: 'Small', controls: 'minimal', footer: 'fill' },
	medium: { key: 'medium', label: 'Medium', controls: 'full', footer: 'fit' },
	large: { key: 'large', label: 'Large', controls: 'full', footer: 'fit' },
	full: { key: 'full', label: 'Full', controls: 'full', footer: 'fit' },
};

export function tierFromCols( cols ) {
	if ( cols <= 2 ) return TIERS.micro;
	if ( cols <= 4 ) return TIERS.small;
	if ( cols <= 7 ) return TIERS.medium;
	if ( cols <= 10 ) return TIERS.large;
	return TIERS.full;
}
