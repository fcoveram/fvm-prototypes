import { Icon } from '@wordpress/components';
import { IconButton } from '@wordpress/ui';
import { closeSmall, audio as audioIcon } from '@wordpress/icons';
import photo from '../assets/photo.jpg';
import MediaItemMenu from './MediaItemMenu.jsx';

/*
 * A single media tile. Images all render the same bundled sample photo, cropped
 * square; audio renders a tinted tile with an audio glyph + name.
 *
 * The top-right action (revealed on hover/focus) is either:
 *   - an unpin IconButton  (Pinned tiles, via `onUnpin`), or
 *   - a "more" menu         (Media Library / From the web image tiles, via `menu`).
 * Audio tiles in the library/web have no menu — the actions are image-specific.
 */
export default function MediaThumb( { item, onUnpin, menu } ) {
	const isAudio = item.type === 'audio';
	const showUnpin = Boolean( onUnpin );
	const showMenu = Boolean( menu ) && item.type === 'image';

	return (
		<div className={ `media-thumb media-thumb--${ item.type }` } title={ item.name }>
			{ isAudio ? (
				<div
					className="media-thumb__audio"
					style={ { '--thumb-hue': item.hue } }
					role="img"
					aria-label={ `Audio: ${ item.name }` }
				>
					<Icon
						className="media-thumb__audio-icon"
						icon={ audioIcon }
						size={ 32 }
					/>
					<span className="media-thumb__audio-name">{ item.name }</span>
				</div>
			) : (
				<img
					className="media-thumb__image"
					src={ photo }
					alt={ item.name }
					loading="lazy"
					draggable="false"
				/>
			) }

			{ ( showUnpin || showMenu ) && (
				<div className="media-thumb__action">
					{ showUnpin ? (
						<IconButton
							icon={ closeSmall }
							label={ `Unpin ${ item.name }` }
							variant="minimal"
							tone="neutral"
							size="small"
							onClick={ ( event ) => {
								event.stopPropagation();
								onUnpin( item.id );
							} }
						/>
					) : (
						<MediaItemMenu
							item={ item }
							actionLabel={ menu.actionLabel }
							onAction={ () => menu.onAction( item ) }
						/>
					) }
				</div>
			) }
		</div>
	);
}
