import { useState } from 'react';
import { Panel, PanelBody } from '@wordpress/components';
import MediaBrowser from './MediaBrowser.jsx';
import {
	pinned as initialPinned,
	library as initialLibrary,
	web,
} from '../data/media.js';

/*
 * The Media tab: an exclusive accordion (only one section open at a time) built
 * from a controlled Panel + PanelBody. The open panel's body fills the available
 * height; collapsed panels are pushed to the top/bottom (see inserter.css).
 *
 * Pinned and Media Library are stateful so the per-image actions can move items
 * between panels:
 *   - "Pin image" (library)        → adds the image to Pinned (kept in library).
 *   - "Add to Media Library" (web) → adds the image to Media Library.
 *   - Unpin (pinned)               → removes the image from Pinned.
 */
export default function MediaTab() {
	const [ openSection, setOpenSection ] = useState( 'pinned' );
	const [ pinnedItems, setPinnedItems ] = useState( initialPinned );
	const [ libraryItems, setLibraryItems ] = useState( initialLibrary );

	const addUnique = ( setItems ) => ( item ) =>
		setItems( ( items ) =>
			items.some( ( existing ) => existing.id === item.id )
				? items
				: [ ...items, item ]
		);

	const handleUnpin = ( id ) =>
		setPinnedItems( ( items ) => items.filter( ( item ) => item.id !== id ) );
	const handlePin = addUnique( setPinnedItems );
	const handleAddToLibrary = addUnique( setLibraryItems );

	const toggleSection = ( id ) => ( next ) =>
		setOpenSection( next ? id : null );

	return (
		<Panel className="media-accordion">
			<PanelBody
				title="Pinned"
				opened={ openSection === 'pinned' }
				onToggle={ toggleSection( 'pinned' ) }
				scrollAfterOpen={ false }
			>
				<MediaBrowser
					items={ pinnedItems }
					variant="grouped"
					defaultFilter="images"
					onUnpin={ handleUnpin }
					onAddFromLibrary={ () => setOpenSection( 'library' ) }
					searchPlaceholder="Search pinned media"
				/>
			</PanelBody>

			<PanelBody
				title="Media Library"
				opened={ openSection === 'library' }
				onToggle={ toggleSection( 'library' ) }
				scrollAfterOpen={ false }
			>
				<MediaBrowser
					items={ libraryItems }
					variant="grouped"
					itemMenu={ { actionLabel: 'Pin image', onAction: handlePin } }
					searchPlaceholder="Search the media library"
				/>
			</PanelBody>

			<PanelBody
				title="From the web"
				opened={ openSection === 'web' }
				onToggle={ toggleSection( 'web' ) }
				scrollAfterOpen={ false }
			>
				<MediaBrowser
					items={ web }
					variant="flat"
					itemMenu={ {
						actionLabel: 'Add to Media Library',
						onAction: handleAddToLibrary,
					} }
					searchPlaceholder="Search the web"
				/>
			</PanelBody>
		</Panel>
	);
}
