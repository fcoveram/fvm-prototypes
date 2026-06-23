import { useMemo, useState } from 'react';
import { SearchControl, Button } from '@wordpress/components';
import FilterMenu from './FilterMenu.jsx';
import MediaGroup from './MediaGroup.jsx';

// Menu 1 (Pinned + Media Library): All / Images / Audio.
const GROUPED_CHOICES = [
	{ label: 'All', value: 'all' },
	{ label: 'Images', value: 'images' },
	{ label: 'Audio', value: 'audio' },
];

// Menu 2 (From the web / Openverse): one type at a time, no "All", images first.
const WEB_CHOICES = [
	{ label: 'Images', value: 'images' },
	{ label: 'Audio', value: 'audio' },
];

function matchesSearch( item, query ) {
	return item.name.toLowerCase().includes( query.trim().toLowerCase() );
}

/*
 * The body shared by every accordion section: a fixed search row (SearchControl
 * + FilterMenu) above a scrollable results region. The panel body fills the
 * available height; only the results region scrolls.
 *
 *  - variant="grouped" (Pinned, Media Library): split into IMAGES / AUDIO groups.
 *  - variant="flat" (From the web): one ungrouped grid of the selected type.
 *
 * `onUnpin` (Pinned) enables the unpin button on each tile. `itemMenu` (Media
 * Library / web) enables the per-image "more" menu. `onAddFromLibrary` (Pinned)
 * renders the bottom "Add from Media Library" button.
 */
export default function MediaBrowser( {
	items,
	variant,
	defaultFilter,
	onUnpin,
	itemMenu,
	onAddFromLibrary,
	searchPlaceholder = 'Search',
} ) {
	const isFlat = variant === 'flat';
	const choices = isFlat ? WEB_CHOICES : GROUPED_CHOICES;
	const [ search, setSearch ] = useState( '' );
	const [ filter, setFilter ] = useState( defaultFilter ?? choices[ 0 ].value );

	const filtered = useMemo(
		() => items.filter( ( item ) => matchesSearch( item, search ) ),
		[ items, search ]
	);
	const images = filtered.filter( ( item ) => item.type === 'image' );
	const audio = filtered.filter( ( item ) => item.type === 'audio' );

	const showImages = isFlat ? filter === 'images' : filter !== 'audio';
	const showAudio = isFlat ? filter === 'audio' : filter !== 'images';
	const hasResults =
		( showImages && images.length ) || ( showAudio && audio.length );

	return (
		<div className="media-browser">
			<div className="media-browser__search">
				<SearchControl
					className="media-browser__search-input"
					value={ search }
					onChange={ setSearch }
					label={ searchPlaceholder }
					placeholder={ searchPlaceholder }
					size="compact"
					hideLabelFromVision
				/>
				<FilterMenu
					choices={ choices }
					value={ filter }
					onChange={ setFilter }
				/>
			</div>

			<div className="media-browser__results">
				{ isFlat ? (
					<MediaGroup
						items={ showImages ? images : audio }
						itemMenu={ itemMenu }
					/>
				) : (
					<>
						{ showImages && (
							<MediaGroup
								label="Images"
								items={ images }
								onUnpin={ onUnpin }
								itemMenu={ itemMenu }
							/>
						) }
						{ showAudio && (
							<MediaGroup
								label="Audio"
								items={ audio }
								onUnpin={ onUnpin }
								itemMenu={ itemMenu }
							/>
						) }
					</>
				) }

				{ ! hasResults && (
					<p className="media-browser__empty">
						{ search.trim()
							? `No media matches “${ search.trim() }”.`
							: onAddFromLibrary
							? 'Nothing pinned yet. Pin media from the library to keep it handy here.'
							: 'No media to show.' }
					</p>
				) }
			</div>

			{ onAddFromLibrary && (
				<Button
					className="media-browser__add"
					variant="secondary"
					onClick={ onAddFromLibrary }
					__next40pxDefaultSize
				>
					Add from Media Library
				</Button>
			) }
		</div>
	);
}
