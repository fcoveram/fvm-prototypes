import InserterSidebar from './components/InserterSidebar.jsx';

/*
 * The prototype shows just the inserter sidebar, centered on a soft gray stage —
 * a fixed-height (600px) floating panel, no surrounding editor chrome.
 */
export default function App() {
	return (
		<div className="stage">
			<InserterSidebar />
		</div>
	);
}
