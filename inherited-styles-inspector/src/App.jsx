import StylesTab from './components/StylesTab.jsx';

/*
 * The prototype shows just the block inspector's Styles tab — a single
 * Typography ToolsPanel — centered on a soft gray stage. No editor canvas, no
 * sidebar chrome, no tab bar: the proof of concept is the panel header's new
 * "style origins" button and the menu behind it.
 */
export default function App() {
	return (
		<div className="stage">
			<StylesTab />
		</div>
	);
}
