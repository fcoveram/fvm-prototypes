import { useMemo, useState } from 'react';
import { SearchControl, Button } from '@wordpress/components';
import { plus } from '@wordpress/icons';
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
 * The body shared by every accordion section: a search row (SearchControl +
 * FilterMenu) above the content.
 *
 *  - variant="grouped" (Pinned, Media Library): content is split into IMAGES and
 *    AUDIO groups; the filter shows both, or narrows to one.
 *  - variant="flat" (From the web): a single ungrouped grid showing the one
 *    selected type (images by default).
 *
 * `onUnpin` (Pinned only) enables the hover/focus unpin button on each tile.
 * `onAddFromLibrary` (Pinned only) renders the "Add from Media Library" button.
 */
export default function MediaBrowser( {
	items,
	variant,
	onUnpin,
	onAddFromLibrary,
	searchPlaceholder = 'Search',
} ) {
	const isFlat = variant === 'flat';
	const choices = isFlat ? WEB_CHOICES : GROUPED_CHOICES;
	const [ search, setSearch ] = useState( '' );
	const [ filter, setFilter ] = useState( choices[ 0 ].value );

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

			{ isFlat ? (
				<MediaGroup items={ showImages ? images : audio } />
			) : (
				<>
					{ showImages && (
						<MediaGroup
							label="Images"
							items={ images }
							onUnpin={ onUnpin }
						/>
					) }
					{ showAudio && (
						<MediaGroup
							label="Audio"
							items={ audio }
							onUnpin={ onUnpin }
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

			{ onAddFromLibrary && (
				<Button
					className="media-browser__add"
					variant="secondary"
					icon={ plus }
					onClick={ onAddFromLibrary }
					__next40pxDefaultSize
				>
					Add from Media Library
				</Button>
			) }
		</div>
	);
}
