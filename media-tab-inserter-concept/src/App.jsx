import { useState } from 'react';
import { Button } from '@wordpress/components';
import { plus, undo, redo, listView } from '@wordpress/icons';
import InserterSidebar from './components/InserterSidebar.jsx';

/*
 * Deliberately minimal editor chrome — a header strip and an empty canvas — so
 * the inserter reads as the editor's left sidebar. The chrome is non-functional;
 * the toggle and the inserter's close (✕) button open/close the sidebar to show
 * it in context. The inserter itself is the subject of this prototype.
 */
export default function App() {
	const [ inserterOpen, setInserterOpen ] = useState( true );

	return (
		<div className="editor">
			<header className="editor__header">
				<div className="editor__header-group">
					<Button
						className="editor__inserter-toggle"
						icon={ plus }
						label="Toggle block inserter"
						isPressed={ inserterOpen }
						onClick={ () => setInserterOpen( ( open ) => ! open ) }
						__next40pxDefaultSize
					/>
					<Button icon={ undo } label="Undo" disabled __next40pxDefaultSize />
					<Button icon={ redo } label="Redo" disabled __next40pxDefaultSize />
					<Button
						icon={ listView }
						label="List View"
						disabled
						__next40pxDefaultSize
					/>
				</div>
				<div className="editor__header-group">
					<Button variant="tertiary" disabled __next40pxDefaultSize>
						Save draft
					</Button>
					<Button variant="primary" disabled __next40pxDefaultSize>
						Publish
					</Button>
				</div>
			</header>

			<div className="editor__body">
				{ inserterOpen && (
					<InserterSidebar onClose={ () => setInserterOpen( false ) } />
				) }
				<main className="editor__canvas">
					<div className="editor__page" aria-hidden="true">
						<div className="editor__line editor__line--title" />
						<div className="editor__line" />
						<div className="editor__line" />
						<div className="editor__line editor__line--short" />
					</div>
				</main>
			</div>
		</div>
	);
}
