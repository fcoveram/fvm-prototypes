/**
 * DiamondIcon
 *
 * The glyph for the new "style origins" header button.
 *
 * `@wordpress/icons` has no diamond — not in v12, and not in the latest v19
 * either — so this one icon is drawn rather than reused. It is built from the
 * `SVG`/`Path` primitives in `@wordpress/primitives`, the same package the icon
 * library itself is built on, in the library's 24×24 viewBox, so it still flows
 * through the real `Icon` pipeline when handed to `Button`'s `icon` prop and
 * inherits size and `currentColor` like every other WordPress icon.
 */

import { Path, SVG } from '@wordpress/primitives';

const diamond = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path
			d="M12 4.5 19.5 12 12 19.5 4.5 12 12 4.5Z"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinejoin="round"
		/>
	</SVG>
);

export default diamond;
