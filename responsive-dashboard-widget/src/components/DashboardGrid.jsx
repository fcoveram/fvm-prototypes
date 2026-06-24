import { useCallback, useRef, useState } from 'react';
import Widget from './Widget.jsx';
import {
	COLS,
	ROWS,
	GRID_W,
	GRID_H,
	spanToPx,
	pxToSpan,
	tierFromCols,
} from '../lib/tiers.js';

// Smallest the widget can shrink to. 1x1 (100px) is too small to render the widget
// chrome legibly; 2 columns still lands in the Micro tier (1-2 cols), so the floor
// keeps every tier reachable while staying readable.
const MIN_COLS = 2;
const MIN_ROWS = 2;

export default function DashboardGrid( { span, onResize } ) {
	const gridRef = useRef( null );
	const [ resizing, setResizing ] = useState( false );
	const tier = tierFromCols( span.cols );

	// Drag the bottom-right handle: map the pointer's position within the grid to a
	// snapped column/row span. The grid rect is captured once on press (it doesn't move
	// during a drag), and window listeners keep tracking even if the pointer leaves it.
	const startResize = useCallback(
		( event ) => {
			event.preventDefault();
			const grid = gridRef.current;
			if ( ! grid ) return;
			const rect = grid.getBoundingClientRect();

			const onMove = ( e ) => {
				onResize( {
					cols: pxToSpan( e.clientX - rect.left, COLS, MIN_COLS ),
					rows: pxToSpan( e.clientY - rect.top, ROWS, MIN_ROWS ),
				} );
			};
			const onUp = () => {
				setResizing( false );
				window.removeEventListener( 'pointermove', onMove );
				window.removeEventListener( 'pointerup', onUp );
			};

			setResizing( true );
			window.addEventListener( 'pointermove', onMove );
			window.addEventListener( 'pointerup', onUp );
		},
		[ onResize ]
	);

	const tiles = Array.from( { length: COLS * ROWS }, ( _, i ) => (
		<div className="grid__tile" key={ i } />
	) );

	return (
		<div className="grid-wrap">
			{ /* Size indicator — sits where the (now-hidden) variant toggle used to be. */ }
			<p className="grid__caption">
				<span className="grid__tier">{ tier.label }</span>
				<span className="grid__dims">
					{ span.cols } × { span.rows } cells
				</span>
			</p>
			<div
				ref={ gridRef }
				className={ `grid${ resizing ? ' is-resizing' : '' }` }
				style={ { width: GRID_W, height: GRID_H } }
			>
				{ tiles }
				<div
					className="widget-slot"
					style={ {
						width: spanToPx( span.cols ),
						height: spanToPx( span.rows ),
					} }
				>
					<Widget tier={ tier } />
					<button
						type="button"
						className="resize-handle"
						onPointerDown={ startResize }
						title="Drag to resize"
						aria-label={ `Resize widget — currently ${ span.cols } by ${ span.rows } cells, ${ tier.label } tier` }
					/>
				</div>
			</div>
		</div>
	);
}
