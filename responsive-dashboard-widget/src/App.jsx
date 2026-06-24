import { useState } from 'react';
import DashboardGrid from './components/DashboardGrid.jsx';

/*
 * The prototype is a soft #FCFCFC stage holding the dashboard grid. The widget loads at
 * its default size (Medium, 6x4) in the grid's top-left corner and is resized by dragging
 * its handle. The size indicator (tier name + cell count) sits above the grid.
 *
 * The variant toggle (ControlsBar) is hidden for now — its size indicator takes that spot.
 */
export default function App() {
	// The widget's span in grid cells. Default: Medium tier, 6 columns x 4 rows.
	const [ span, setSpan ] = useState( { cols: 6, rows: 4 } );

	return (
		<div className="stage">
			<div className="stage__inner">
				<DashboardGrid span={ span } onResize={ setSpan } />
			</div>
		</div>
	);
}
