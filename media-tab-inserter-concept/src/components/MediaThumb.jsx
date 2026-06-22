import { Button, Icon } from '@wordpress/components';
import { closeSmall, audio as audioIcon } from '@wordpress/icons';

/*
 * Builds an abstract, deterministic gradient "photo" from an item's hue. Layered
 * radial + linear stops give each tile a bit of depth so the grid reads as media
 * rather than flat swatches — while staying fully self-contained (no network).
 */
function imageBackground( hue ) {
	const accent = ( hue + 38 ) % 360;
	return (
		`radial-gradient(120% 120% at 18% 12%, hsl(${ hue } 88% 74% / 0.95), transparent 55%), ` +
		`linear-gradient(135deg, hsl(${ hue } 66% 55%), hsl(${ accent } 60% 40%))`
	);
}

export default function MediaThumb( { item, onUnpin } ) {
	const isAudio = item.type === 'audio';

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
				<div
					className="media-thumb__image"
					style={ { backgroundImage: imageBackground( item.hue ) } }
					role="img"
					aria-label={ item.name }
				/>
			) }

			{ onUnpin && (
				<Button
					className="media-thumb__unpin"
					icon={ closeSmall }
					label={ `Unpin ${ item.name }` }
					size="compact"
					variant="tertiary"
					onClick={ ( event ) => {
						event.stopPropagation();
						onUnpin( item.id );
					} }
				/>
			) }
		</div>
	);
}
