/**
 * Inherited styles indicator: let editor.js decide which default controls show.
 *
 * Block supports list "default controls" that ToolsPanels always show, even
 * without a value. We record each block's original list, then empty it, which
 * makes every style control optional. editor.js shows core's default controls
 * that have a value (set on the block or inherited) and leaves empty ones in
 * the panel's ⋮ menu. Runs right after wp-blocks loads, before any block type
 * is registered.
 */

// Original default controls per block type, read by editor.js.
window.inheritedStylesIndicatorDefaults = {};
// Every known default-control key, set to false: some panels (Dimensions)
// fall back to their own defaults when a key is missing.
const INHERITED_STYLES_NO_DEFAULTS = Object.fromEntries(
	[
		'text', 'textColor', 'background', 'gradients', 'link', 'heading', 'button', 'caption',
		'fontFamily', 'fontSize', 'fontAppearance', 'lineHeight', 'letterSpacing', 'textIndent',
		'textColumns', 'textDecoration', 'writingMode', 'textTransform', 'textAlign',
		'padding', 'margin', 'blockGap', 'minHeight', 'minWidth', 'height', 'width', 'aspectRatio',
		'contentSize', 'wideSize', 'childLayout',
		'color', 'radius', 'style', 'shadow', 'backgroundImage', 'backgroundSize',
	].map( ( key ) => [ key, false ] )
);

wp.hooks.addFilter(
	'blocks.registerBlockType',
	'inherited-styles/no-default-controls',
	( settings, name ) => {
		if ( ! settings.supports ) {
			return settings;
		}
		const supports = { ...settings.supports };
		// Later calls for the same block pass partial settings; keep the first.
		window.inheritedStylesIndicatorDefaults[ name ] ??= {
			color: supports.color?.__experimentalDefaultControls,
			typography: supports.typography?.__experimentalDefaultControls,
			spacing: supports.spacing?.__experimentalDefaultControls,
			dimensions: supports.dimensions?.__experimentalDefaultControls,
			background: supports.background?.__experimentalDefaultControls,
			border:
				supports.__experimentalBorder?.__experimentalDefaultControls ??
				supports.border?.__experimentalDefaultControls,
			shadow: supports.shadow?.__experimentalDefaultControls,
		};
		[ 'color', 'typography', 'spacing', 'dimensions', 'background', 'shadow', 'border', '__experimentalBorder' ].forEach(
			( key ) => {
				if ( supports[ key ] && typeof supports[ key ] === 'object' ) {
					supports[ key ] = {
						...supports[ key ],
						__experimentalDefaultControls: INHERITED_STYLES_NO_DEFAULTS,
					};
				}
			}
		);
		return { ...settings, supports };
	}
);
