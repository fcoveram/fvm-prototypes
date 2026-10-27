/**
 * Inherited styles indicator.
 *
 * Shows a diamond next to block inspector control labels while the value
 * comes from Styles, the block's own styles in Styles → Blocks, or a parent
 * block, and hides it once the block sets its own value. Controls display the
 * inherited value (including a parent block's). Core's default controls show
 * only when they have a value; empty ones stay in the panel's ⋮ menu.
 * Prototype shortcut: works on the rendered DOM and React state of the core
 * ToolsPanels instead of patching core components.
 */
( function () {
	const { select, subscribe } = wp.data;

	const LABEL_CLASS = 'inherited-styles-has-diamond';
	const DIAMOND_CLASS = 'inherited-styles-diamond';

	const has = ( value ) => {
		if ( value === undefined || value === null || value === '' ) {
			return false;
		}
		if ( typeof value === 'object' ) {
			return Object.values( value ).some( has );
		}
		return true;
	};

	// Block attributes store presets as slugs; Styles stores `var:preset|…` refs.
	const preset = ( type, slug ) => `var:preset|${ type }|${ slug }`;
	const textColor = ( a, s ) => ( {
		color: { text: a.textColor ? preset( 'color', a.textColor ) : s.color?.text },
	} );
	const typography = ( prop ) => ( a, s ) => ( { typography: { [ prop ]: s.typography?.[ prop ] } } );

	/*
	 * Controls per inspector panel, keyed by the panel's class name prefix
	 * (`typography-block-support-panel`, …) and the control's label.
	 * `get` returns the block's own value. `inherits` marks CSS properties
	 * that flow from a parent block down to its children (and from Styles'
	 * root); `root` marks the few others that Styles' root applies to blocks.
	 * `patch` turns a parent's value into Styles format, so the child's
	 * control can show it. `menuLabel` is the ToolsPanel ⋮ menu name, when it
	 * differs from the label shown on the control.
	 */
	const CONTROLS = {
		typography: {
			Color: { get: ( a, s ) => a.textColor || s.color?.text, inherits: true, patch: textColor },
			Font: {
				get: ( a, s ) => a.fontFamily || s.typography?.fontFamily,
				inherits: true,
				patch: ( a, s ) => ( {
					typography: {
						fontFamily: a.fontFamily
							? preset( 'font-family', a.fontFamily )
							: s.typography?.fontFamily,
					},
				} ),
			},
			'Font size': {
				menuLabel: 'Size',
				get: ( a, s ) => a.fontSize || s.typography?.fontSize,
				inherits: true,
				patch: ( a, s ) => ( {
					typography: {
						fontSize: a.fontSize ? preset( 'font-size', a.fontSize ) : s.typography?.fontSize,
					},
				} ),
			},
			Appearance: {
				get: ( a, s ) => s.typography?.fontStyle || s.typography?.fontWeight,
				inherits: true,
				patch: ( a, s ) => ( {
					typography: { fontStyle: s.typography?.fontStyle, fontWeight: s.typography?.fontWeight },
				} ),
			},
			'Line height': { get: ( a, s ) => s.typography?.lineHeight, inherits: true, patch: typography( 'lineHeight' ) },
			'Letter spacing': {
				get: ( a, s ) => s.typography?.letterSpacing,
				inherits: true,
				patch: typography( 'letterSpacing' ),
			},
			'Line indent': { get: ( a, s ) => s.typography?.textIndent, inherits: true, patch: typography( 'textIndent' ) },
			Columns: { get: ( a, s ) => s.typography?.textColumns },
			Decoration: { get: ( a, s ) => s.typography?.textDecoration },
			Orientation: { get: ( a, s ) => s.typography?.writingMode, inherits: true, patch: typography( 'writingMode' ) },
			'Letter case': {
				get: ( a, s ) => s.typography?.textTransform,
				inherits: true,
				patch: typography( 'textTransform' ),
			},
			'Text alignment': { get: ( a, s ) => s.typography?.textAlign, inherits: true, patch: typography( 'textAlign' ) },
		},
		color: {
			Text: { get: ( a, s ) => a.textColor || s.color?.text, inherits: true, patch: textColor },
			Background: { get: ( a, s ) => a.backgroundColor || s.color?.background },
			Gradient: { get: ( a, s ) => a.gradient || s.color?.gradient },
			Link: { get: ( a, s ) => s.elements?.link?.color, inherits: true },
		},
		background: {
			'Background image': { get: ( a, s ) => s.background?.backgroundImage },
			Image: { get: ( a, s ) => s.background?.backgroundImage },
			Color: { get: ( a, s ) => a.backgroundColor || s.color?.background },
			Gradient: { get: ( a, s ) => a.gradient || s.color?.gradient },
		},
		elements: {
			Link: { get: ( a, s ) => s.elements?.link?.color, inherits: true },
			Heading: { get: ( a, s ) => s.elements?.heading?.color, inherits: true },
			Button: { get: ( a, s ) => s.elements?.button?.color },
			Caption: { get: ( a, s ) => s.elements?.caption?.color, inherits: true },
		},
		dimensions: {
			Padding: { get: ( a, s ) => s.spacing?.padding },
			Margin: { get: ( a, s ) => s.spacing?.margin },
			// Styles' root block spacing applies to every block layout.
			'Block spacing': { get: ( a, s ) => s.spacing?.blockGap, root: true },
			'Minimum height': { get: ( a, s ) => s.dimensions?.minHeight },
			Height: { get: ( a, s ) => s.dimensions?.height },
			Width: { get: ( a, s ) => s.dimensions?.width },
			'Aspect ratio': { get: ( a, s ) => s.dimensions?.aspectRatio },
		},
		border: {
			Border: {
				get: ( a, s ) => {
					const { radius, ...border } = s.border || {};
					return a.borderColor || border;
				},
			},
			Radius: { get: ( a, s ) => s.border?.radius },
			Shadow: { get: ( a, s ) => s.shadow },
		},
	};


	const { createElement: el, createRoot } = wp.element;
	const { Icon, Tooltip } = wp.components;
	const { SVG, Path } = wp.primitives;

	// Figma "diamond-13-sb" (assets/diamond.svg), centred in a 16×16 box.
	const diamondIcon = el(
		SVG,
		{ xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16' },
		el( Path, {
			d: 'M9.75245 4.75245L5.69526 0.695262C5.43491 0.434913 5.0128 0.434912 4.75245 0.695262L0.695262 4.75245C0.434913 5.0128 0.434912 5.43491 0.695262 5.69526L4.75245 9.75245C5.0128 10.0128 5.43491 10.0128 5.69526 9.75245L9.75245 5.69526C10.0128 5.43491 10.0128 5.0128 9.75245 4.75245Z',
			fill: 'none',
			stroke: 'currentColor',
			transform: 'translate(2.776 2.776)',
		} )
	);

	/** The selected block type's own styles in the user's Styles (Styles → Blocks). */
	function userBlockStyles( blockName ) {
		const core = select( 'core' );
		const id = core.__experimentalGetCurrentGlobalStylesId?.();
		const blocks = id ? core.getEditedEntityRecord( 'root', 'globalStyles', id )?.styles?.blocks : null;
		return blocks?.[ blockName ] || {};
	}

	/** Deep-merges `patch` into `target` (new objects; undefined values are skipped). */
	function merge( target, patch ) {
		const out = { ...( target || {} ) };
		Object.entries( patch ).forEach( ( [ key, value ] ) => {
			if ( value === undefined ) {
				return;
			}
			out[ key ] =
				value && typeof value === 'object' && ! Array.isArray( value )
					? merge( out[ key ], value )
					: value;
		} );
		return out;
	}

	/*
	 * Prototype shortcut: core's experimental inheritance UI reads the Styles
	 * data (theme + user, merged) from a private block-editor setting. We read
	 * it to find values from Styles, and hand the inspector a copy where the
	 * selected block type's styles include inherited parent values, so the
	 * child's controls can show them. The canvas and saved Styles are untouched.
	 */
	let stylesKey;
	let originalStyles;
	let patchedStyles;
	let patchSignature;
	let registry;
	wp.data.use( ( r ) => {
		registry = r;
		return {};
	} );

	function getStylesKey() {
		stylesKey =
			stylesKey ||
			Object.getOwnPropertySymbols( select( 'core/block-editor' ).getSettings() ).find(
				( key ) => key.description === 'globalStylesDataKey'
			);
		return stylesKey;
	}

	/** The merged Styles data, without our parent-value patch. */
	function getStylesData() {
		const key = getStylesKey();
		const current = key ? select( 'core/block-editor' ).getSettings()[ key ] : undefined;
		if ( current !== patchedStyles || ! patchedStyles ) {
			// First run, or the editor replaced the data (e.g. Styles changed).
			originalStyles = current;
			patchedStyles = undefined;
			patchSignature = undefined;
		}
		return originalStyles || {};
	}

	// The public `updateSettings` drops private (symbol) keys, so send the
	// same action straight to the block editor's store.
	function setStylesData( value ) {
		registry.stores[ 'core/block-editor' ].store.dispatch( {
			type: 'UPDATE_SETTINGS',
			settings: { [ stylesKey ]: value },
		} );
	}

	function applyParentValues( blockName, parentStyles ) {
		getStylesData();
		if ( ! stylesKey || ! registry?.stores?.[ 'core/block-editor' ]?.store ) {
			return;
		}
		const signature = has( parentStyles ) ? JSON.stringify( [ blockName, parentStyles ] ) : '';
		if ( signature === ( patchSignature || '' ) ) {
			return;
		}
		patchSignature = signature;
		if ( ! signature ) {
			patchedStyles = undefined;
			setStylesData( originalStyles );
			return;
		}
		const blocks = originalStyles?.blocks || {};
		patchedStyles = {
			...originalStyles,
			blocks: { ...blocks, [ blockName ]: merge( blocks[ blockName ], parentStyles ) },
		};
		setStylesData( patchedStyles );
	}

	/** Element styles in Styles that target this block's own tag directly. */
	function elementLayers( blockName, attrs, styles ) {
		const elements = styles.elements || {};
		if ( blockName === 'core/heading' ) {
			return [ elements.heading, elements[ `h${ attrs.level || 2 }` ] ].filter( Boolean );
		}
		if ( blockName === 'core/button' ) {
			return [ elements.button ].filter( Boolean );
		}
		return [];
	}

	/**
	 * For the selected block, returns:
	 * - `state`: { 'panel:Label': { local } | { text } | { none } } per control.
	 * - `parentStyles`: the parent block values those controls inherit, in
	 *   Styles format, so the controls can display them.
	 * Source order follows the CSS cascade. A rule in Styles that targets the
	 * block itself (its block styles or its element, e.g. h3) beats anything
	 * inherited; a parent block beats Styles' root.
	 */
	function computeState() {
		const editor = select( 'core/block-editor' );
		const clientId = editor.getSelectedBlockClientId();
		const result = { state: {}, blockName: null, parentStyles: {} };
		if ( ! clientId ) {
			return result;
		}
		const attrs = editor.getBlockAttributes( clientId ) || {};
		const blockName = editor.getBlockName( clientId );
		const styles = getStylesData();
		const userStyles = userBlockStyles( blockName );
		const directStyles = [ styles.blocks?.[ blockName ], ...elementLayers( blockName, attrs, styles ) ].filter(
			Boolean
		);
		const blockLabel = `${ wp.blocks.getBlockType( blockName )?.title || blockName } block`;
		// Nearest first, each with the styles of its block style variation.
		const parents = editor.getBlockParents( clientId, true ).map( ( id ) => {
			const parentAttrs = editor.getBlockAttributes( id ) || {};
			const variation = ( parentAttrs.className || '' ).match( /\bis-style-([\w-]+)/ )?.[ 1 ];
			return {
				attrs: parentAttrs,
				variation: variation && styles.blocks?.[ editor.getBlockName( id ) ]?.variations?.[ variation ],
			};
		} );
		result.blockName = blockName;

		Object.entries( CONTROLS ).forEach( ( [ panel, controls ] ) => {
			Object.entries( controls ).forEach( ( [ label, control ] ) => {
				const key = `${ panel }:${ label }`;
				const from = ( layer ) => has( control.get( {}, layer ) );
				if ( has( control.get( attrs, attrs.style || {} ) ) ) {
					result.state[ key ] = { local: true };
					return;
				}
				let source = null;
				if ( from( userStyles ) ) {
					source = blockLabel;
				} else if ( directStyles.some( from ) ) {
					source = 'Styles element';
				} else if ( control.inherits ) {
					// Nearest parent that sets it, on the block itself or through
					// its block style (e.g. Twenty Twenty-Five's section styles).
					for ( const parent of parents ) {
						let patch = null;
						if ( has( control.get( parent.attrs, parent.attrs.style || {} ) ) ) {
							patch = control.patch?.( parent.attrs, parent.attrs.style || {} ) || {};
						} else if ( parent.variation && from( parent.variation ) ) {
							patch = control.patch?.( {}, parent.variation ) || {};
						}
						if ( patch ) {
							source = 'parent block';
							result.parentStyles = merge( result.parentStyles, patch );
							break;
						}
					}
				}
				if ( ! source && ( control.inherits || control.root ) && from( styles ) ) {
					source = 'Styles element';
				}
				result.state[ key ] = source ? { text: `Style from ${ source }` } : { none: true };
			} );
		} );
		return result;
	}

	/*
	 * Show core's default controls only when they have a value; empty ones,
	 * and every non-default control, stay in the panel's ⋮ menu (core still
	 * shows any control the block sets itself). Prototype shortcut: we reach
	 * the ToolsPanel's React context through the DOM and use the same
	 * `flagItemCustomization` its ⋮ menu relies on. Controls shown here can
	 * still be hidden from the menu, and we respect that.
	 */
	const TYPOGRAPHY_KEYS = {
		Font: 'fontFamily',
		'Font size': 'fontSize',
		Appearance: 'fontAppearance',
		'Line height': 'lineHeight',
		'Letter spacing': 'letterSpacing',
		'Line indent': 'textIndent',
		Columns: 'textColumns',
		Decoration: 'textDecoration',
		Orientation: 'writingMode',
		'Letter case': 'textTransform',
		'Text alignment': 'textAlign',
	};
	const DIMENSIONS_KEYS = {
		Padding: 'padding',
		Margin: 'margin',
		'Block spacing': 'blockGap',
		'Minimum height': 'minHeight',
		Height: 'height',
		Width: 'width',
		'Aspect ratio': 'aspectRatio',
	};

	/** Whether core would show this control by default (see supports.js). */
	function isCoreDefault( blockName, panel, label ) {
		const d = window.inheritedStylesIndicatorDefaults?.[ blockName ] || {};
		switch ( panel ) {
			case 'typography':
				return !! ( label === 'Color' ? d.color?.text : d.typography?.[ TYPOGRAPHY_KEYS[ label ] ] );
			case 'background':
				if ( label === 'Color' ) {
					return !! d.color?.background;
				}
				if ( label === 'Gradient' ) {
					return !! ( d.background?.gradient ?? d.color?.background );
				}
				return !! d.background?.backgroundImage;
			case 'color':
				return !! d.color?.[ { Text: 'text', Background: 'background', Gradient: 'gradients', Link: 'link' }[ label ] ];
			case 'elements':
				// Core falls back to showing every element color by default.
				return d.color === undefined || !! d.color[ label.toLowerCase() ];
			case 'dimensions': {
				const merged = { minHeight: false, minWidth: false, ...d.dimensions, ...d.spacing };
				return merged[ DIMENSIONS_KEYS[ label ] ] ?? true;
			}
			case 'border': {
				const merged = { ...d.border, ...d.shadow };
				return !! ( label === 'Border' ? merged.color || merged.width : merged[ label.toLowerCase() ] );
			}
		}
		return false;
	}

	function getPanelContext( panelEl ) {
		const header = panelEl.querySelector( '.components-tools-panel-header' ) || panelEl;
		const fiberKey = Object.keys( header ).find( ( k ) => k.startsWith( '__reactFiber$' ) );
		for ( let fiber = header[ fiberKey ]; fiber; fiber = fiber.return ) {
			const value = fiber.memoizedProps?.value;
			if ( value?.flagItemCustomization && value?.menuItems ) {
				return value;
			}
		}
		return null;
	}

	// Per mounted ToolsPanel: labels we showed, labels the user hid, and
	// changes we asked for that React hasn't rendered yet.
	const panelStates = new WeakMap();

	function syncVisibility( panelEl, panel, state, blockName ) {
		const context = getPanelContext( panelEl );
		const optional = context?.menuItems?.optional;
		if ( ! optional ) {
			return;
		}
		let mine = panelStates.get( context.flagItemCustomization );
		if ( ! mine ) {
			mine = { shown: new Set(), userHidden: new Set(), pending: new Map() };
			panelStates.set( context.flagItemCustomization, mine );
		}
		Object.entries( CONTROLS[ panel ] ).forEach( ( [ label, control ] ) => {
			const menuLabel = control.menuLabel && control.menuLabel in optional ? control.menuLabel : label;
			if ( ! ( menuLabel in optional ) ) {
				return;
			}
			const isShown = !! optional[ menuLabel ];
			if ( mine.pending.has( menuLabel ) ) {
				if ( mine.pending.get( menuLabel ) !== isShown ) {
					return; // Still rendering our last change.
				}
				mine.pending.delete( menuLabel );
			}
			const entry = state[ `${ panel }:${ label }` ];
			// Show a core default control only while it has a value.
			const shouldShow = entry && ! entry.none && isCoreDefault( blockName, panel, label );
			if ( mine.shown.has( menuLabel ) && ! isShown ) {
				// We showed it and the user hid it from the ⋮ menu.
				mine.shown.delete( menuLabel );
				mine.userHidden.add( menuLabel );
				return;
			}
			if ( shouldShow && ! isShown && ! mine.userHidden.has( menuLabel ) ) {
				mine.shown.add( menuLabel );
				mine.pending.set( menuLabel, true );
				context.flagItemCustomization( true, menuLabel, 'optional' );
			} else if ( ! shouldShow && isShown && mine.shown.has( menuLabel ) ) {
				mine.shown.delete( menuLabel );
				mine.pending.set( menuLabel, false );
				context.flagItemCustomization( false, menuLabel, 'optional' );
			}
		} );
	}

	const normalise = ( text ) => ( text || '' ).replace( /\s+/g, ' ' ).trim().toLowerCase();

	/** Finds the element that holds the control's visible label text. */
	function findLabelElement( item, label ) {
		const wanted = normalise( label );
		const candidates = item.querySelectorAll(
			'.block-editor-panel-color-gradient-settings__color-name, label, legend, ' +
				'.components-base-control__label, .components-input-control__label, ' +
				'h2, h3, span, div'
		);
		for ( const candidate of candidates ) {
			if ( normalise( candidate.textContent ) === wanted && ! candidate.closest( '.components-popover' ) ) {
				// Use the innermost element holding just the label text.
				let inner = candidate;
				let child;
				while (
					( child = [ ...inner.children ].find(
						( c ) => normalise( c.textContent ) === wanted
					) )
				) {
					inner = child;
				}
				return inner;
			}
		}
		return null;
	}

	function panelKey( panelEl ) {
		const match = panelEl.className.match( /\b(\w+)-block-support-panel\b/ );
		return match ? match[ 1 ] : null;
	}

	// Diamond containers we rendered into: span → { root, text }.
	const diamonds = new Map();

	function renderDiamond( labelEl, text ) {
		let span = labelEl.querySelector( `:scope > .${ DIAMOND_CLASS }` );
		if ( ! span || ! diamonds.has( span ) ) {
			span?.remove();
			span = document.createElement( 'span' );
			span.className = DIAMOND_CLASS;
			labelEl.appendChild( span );
			diamonds.set( span, { root: createRoot( span ), text: null } );
		}
		labelEl.classList.add( LABEL_CLASS );
		const entry = diamonds.get( span );
		if ( entry.text !== text ) {
			entry.text = text;
			entry.root.render(
				el(
					Tooltip,
					{ text },
					el(
						'span',
						{ className: `${ DIAMOND_CLASS }__icon`, role: 'img', 'aria-label': text },
						el( Icon, { icon: diamondIcon, size: 16 } )
					)
				)
			);
		}
		return span;
	}

	function applyInspector() {
		const inspector = document.querySelector( '.block-editor-block-inspector' );
		const { state, blockName, parentStyles } = computeState();
		applyParentValues( blockName, parentStyles );
		const keep = new Set();

		inspector?.querySelectorAll( '.components-tools-panel' ).forEach( ( panelEl ) => {
			const panel = panelKey( panelEl );
			const controls = panel && CONTROLS[ panel ];
			if ( ! controls ) {
				return;
			}
			syncVisibility( panelEl, panel, state, blockName );
			panelEl.querySelectorAll( '.components-tools-panel-item' ).forEach( ( item ) => {
				for ( const label of Object.keys( controls ) ) {
					const labelEl = findLabelElement( item, label );
					if ( ! labelEl ) {
						continue;
					}
					const text = state[ `${ panel }:${ label }` ]?.text;
					if ( text ) {
						keep.add( renderDiamond( labelEl, text ) );
					}
					break;
				}
			} );
		} );

		// Remove diamonds for styles now set locally, or whose control is gone.
		diamonds.forEach( ( { root }, span ) => {
			if ( keep.has( span ) && span.isConnected ) {
				return;
			}
			root.unmount();
			span.parentElement?.classList.remove( LABEL_CLASS );
			span.remove();
			diamonds.delete( span );
		} );
	}

	function apply() {
		applyInspector();
	}

	let scheduled = false;
	function schedule() {
		if ( scheduled ) {
			return;
		}
		scheduled = true;
		// A timer rather than requestAnimationFrame, which background tabs pause.
		window.setTimeout( () => {
			scheduled = false;
			try {
				apply();
			} catch ( e ) {
				// eslint-disable-next-line no-console
				console.warn( 'Inherited styles indicator:', e );
			}
		}, 30 );
	}

	wp.domReady( () => {
		// Re-check when blocks or Styles change (edits, resets, selection)...
		subscribe( schedule );
		// ...and when React re-renders the inspector or rewrites class names.
		new window.MutationObserver( ( mutations ) => {
			const ours = mutations.every(
				( m ) =>
					m.target.closest?.( `.${ DIAMOND_CLASS }` ) ||
					( m.type === 'attributes' && m.target.classList.contains( LABEL_CLASS ) )
			);
			if ( ! ours ) {
				schedule();
			}
		} ).observe( document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: [ 'class' ],
		} );
	} );
} )();
