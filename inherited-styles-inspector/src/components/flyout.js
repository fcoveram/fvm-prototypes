/**
 * Shared placement for both header menus.
 *
 * Both open as flyouts beside the inspector rather than below their trigger, so
 * the panel they describe stays visible next to them (per the reference
 * screenshot in the brief): on the side facing the canvas, aligned to the
 * panel's top edge, 16px clear of it.
 *
 * The anchor is the PANEL, not the trigger. `Menu.Positioner` anchors to the
 * trigger by default, and since both triggers sit at the panel's top-right,
 * `side: 'left'` would open the menu on top of the panel it describes. Passing
 * the panel element as `anchor` is what puts the gap outside the card.
 *
 * The gap is the design system's own `--wpds-dimension-gap-lg`, which resolves
 * to 16px in `@wordpress/theme` v3. `Menu.Positioner` takes `sideOffset` as a
 * number rather than a CSS length, so the token is read off the document at
 * call time instead of being hardcoded — if the token's value changes, the gap
 * follows it.
 */

const GAP_TOKEN = '--wpds-dimension-gap-lg';
const GAP_FALLBACK = 16;

function gapToken() {
	if ( typeof window === 'undefined' ) {
		return GAP_FALLBACK;
	}
	const value = window
		.getComputedStyle( document.documentElement )
		.getPropertyValue( GAP_TOKEN );
	return parseFloat( value ) || GAP_FALLBACK;
}

/**
 * Positioning props for a `Menu.Positioner`.
 *
 * @param anchor Ref to the panel the menu should clear.
 */
export function flyoutProps( anchor ) {
	return {
		anchor,
		side: 'left',
		align: 'start',
		sideOffset: gapToken(),
	};
}
