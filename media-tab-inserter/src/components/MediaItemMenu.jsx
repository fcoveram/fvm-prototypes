import { Dropdown, MenuGroup, MenuItem } from '@wordpress/components';
import { IconButton } from '@wordpress/ui';
import { moreVertical } from '@wordpress/icons';

/*
 * The per-image "more" menu shown on Media Library and From the web tiles. The
 * trigger is a @wordpress/ui IconButton (moreVertical); the menu has a single
 * action — "Pin image" in the library, "Add to Media Library" on the web. Built
 * with the lower-level `Dropdown` so the toggle can be the @wordpress/ui button
 * (the higher-level DropdownMenu renders its own toggle).
 */
export default function MediaItemMenu( { item, actionLabel, onAction } ) {
	return (
		<Dropdown
			className="media-thumb__menu"
			popoverProps={ { placement: 'bottom-end' } }
			renderToggle={ ( { isOpen, onToggle } ) => (
				<IconButton
					icon={ moreVertical }
					label={ `Options for ${ item.name }` }
					variant="minimal"
					tone="neutral"
					size="small"
					aria-expanded={ isOpen }
					onClick={ ( event ) => {
						event.stopPropagation();
						onToggle();
					} }
				/>
			) }
			renderContent={ ( { onClose } ) => (
				<MenuGroup>
					<MenuItem
						onClick={ () => {
							onAction();
							onClose();
						} }
					>
						{ actionLabel }
					</MenuItem>
				</MenuGroup>
			) }
		/>
	);
}
