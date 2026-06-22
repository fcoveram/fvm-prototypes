import { useState } from 'react';
import { Panel, PanelBody } from '@wordpress/components';
import MediaBrowser from './MediaBrowser.jsx';
import { pinned as initialPinned, library, web } from '../data/media.js';

/*
 * The Media tab: an exclusive accordion (only one section open at a time) built
 * from a controlled Panel + PanelBody. PanelBody draws each header's title and
 * the down/up chevron itself; passing a defined boolean `opened` keeps all three
 * fully controlled so opening one closes the others.
 */
export default function MediaTab() {
	const [ openSection, setOpenSection ] = useState( 'pinned' );
	const [ pinnedItems, setPinnedItems ] = useState( initialPinned );

	const handleUnpin = ( id ) =>
		setPinnedItems( ( items ) => items.filter( ( item ) => item.id !== id ) );

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
					items={ library }
					variant="grouped"
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
					searchPlaceholder="Search the web"
				/>
			</PanelBody>
		</Panel>
	);
}
