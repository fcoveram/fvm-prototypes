/**
 * StylesTab
 *
 * The block inspector's Styles tab, holding every piece of state the prototype
 * has. Three pieces, and the rest is derived:
 *
 *   local        { styleKey: value } for styles the user has changed. Empty at
 *                load, so the origins menu opens in the design's "no block
 *                styles" state and every style sits under "Inherited".
 *   visibleTools which tools the panel is showing — Color and Size at load,
 *                the two the block editor really does show by default for a
 *                Heading block.
 *
 * "Edit" opens the browser's own message box rather than rendering anything in
 * the panel.
 *
 * Product condition 8 — "when a style changes and is set on the block, its
 * origin is no longer from global styles" — needs no code: a style is "on this
 * block" exactly when its key is in `local`, so changing a control moves it and
 * resetting moves it back.
 *
 * A style with neither a local value nor an inherited one has no origin at all,
 * so it is absent from the menu. That is why `Letter case` only appears once
 * you set it, and disappears again on reset.
 */

import { useMemo, useRef, useState } from 'react';

import PanelHeader from './PanelHeader.jsx';
import TypographyPanel from './TypographyPanel.jsx';
import { DEFAULT_TOOLS, STYLES } from '../data/styles.js';

export default function StylesTab() {
	// Both header menus fly out clear of the whole card, so they anchor to it
	// rather than to their triggers.
	const panelRef = useRef( null );
	const [ local, setLocal ] = useState( {} );
	const [ visibleTools, setVisibleTools ] = useState( DEFAULT_TOOLS );

	const isSetLocally = ( key ) =>
		Object.prototype.hasOwnProperty.call( local, key );

	// What each control shows: the local value when there is one, the inherited
	// value otherwise.
	const values = useMemo( () => {
		const resolved = {};
		for ( const style of STYLES ) {
			resolved[ style.key ] = Object.prototype.hasOwnProperty.call(
				local,
				style.key
			)
				? local[ style.key ]
				: style.inheritedValue;
		}
		return resolved;
	}, [ local ] );

	// Both groups list only styles whose control is currently visible in the
	// panel, so hiding a tool takes its style out of the menu as well.
	const isVisible = ( style ) => visibleTools.includes( style.tool );

	const localStyles = STYLES.filter(
		( style ) =>
			isVisible( style ) &&
			Object.prototype.hasOwnProperty.call( local, style.key )
	);
	const inheritedStyles = STYLES.filter(
		( style ) =>
			isVisible( style ) &&
			! Object.prototype.hasOwnProperty.call( local, style.key ) &&
			style.inheritedFrom
	);

	const setStyle = ( key, value ) =>
		setLocal( ( previous ) => ( { ...previous, [ key ]: value } ) );

	const resetStyle = ( key ) =>
		setLocal( ( previous ) => {
			const next = { ...previous };
			delete next[ key ];
			return next;
		} );

	const resetAll = () => setLocal( {} );

	// Hiding a tool keeps its value; it just stops being listed, because both
	// menu groups are filtered to the visible tools.
	const toggleTool = ( tool ) =>
		setVisibleTools( ( previous ) =>
			previous.includes( tool )
				? previous.filter( ( item ) => item !== tool )
				: [ ...previous, tool ]
		);

	return (
		<div className="inspector-panel" ref={ panelRef }>
			<PanelHeader
				anchor={ panelRef }
				localStyles={ localStyles }
				inheritedStyles={ inheritedStyles }
				visibleTools={ visibleTools }
				onReset={ resetStyle }
				onResetAll={ resetAll }
				onEdit={ ( style ) =>
					// Deliberately the browser's own dialog rather than a
					// `Notice` in the panel: it stands in for leaving the
					// inspector for Styles, and it keeps the panel's vertical
					// position fixed. Every inherited style now resolves to
					// Styles as a whole, so there is no section to name.
					// eslint-disable-next-line no-alert
					window.alert( `This would open ${ style.inheritedFrom }.` )
				}
				onToggleTool={ toggleTool }
			/>
			<TypographyPanel
				values={ values }
				isSetLocally={ isSetLocally }
				visibleTools={ visibleTools }
				onSetStyle={ setStyle }
				onResetStyle={ resetStyle }
				onResetAll={ resetAll }
			/>
		</div>
	);
}
