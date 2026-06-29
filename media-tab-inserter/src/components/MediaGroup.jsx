import MediaThumb from './MediaThumb.jsx';

/*
 * A grid of thumbnails, optionally preceded by an uppercase group label
 * ("IMAGES" / "AUDIO"). Rendered with no label for the flat "From the web"
 * panel, which shows a single ungrouped grid. `onUnpin` / `itemMenu` are passed
 * straight through to each tile.
 */
export default function MediaGroup( { label, items, onUnpin, itemMenu } ) {
	if ( ! items.length ) {
		return null;
	}

	return (
		<div className="media-group">
			{ label && <h3 className="media-group__label">{ label }</h3> }
			<div className="media-grid">
				{ items.map( ( item ) => (
					<MediaThumb
						key={ item.id }
						item={ item }
						onUnpin={ onUnpin }
						menu={ itemMenu }
					/>
				) ) }
			</div>
		</div>
	);
}
